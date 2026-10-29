ALTER TABLE public.fal_test_runs ADD COLUMN template text NOT NULL DEFAULT 'snow';
ALTER TABLE public.fal_test_runs ADD COLUMN cost_usd numeric NOT NULL DEFAULT 0;
UPDATE public.fal_test_runs SET cost_usd=CASE WHEN duration=5 THEN 0.35 ELSE 0.70 END;
CREATE OR REPLACE FUNCTION public.ensure_magicph_owner_role() RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 IF auth.uid() IS NULL OR NOT EXISTS (SELECT 1 FROM auth.users u JOIN auth.identities i ON i.user_id=u.id AND i.provider='google' WHERE u.id=auth.uid() AND lower(u.email)='orangawareph@gmail.com' AND u.email_confirmed_at IS NOT NULL) THEN RETURN false; END IF;
 INSERT INTO public.user_roles(user_id,role) VALUES(auth.uid(),'admin') ON CONFLICT(user_id,role) DO NOTHING;
 RETURN true;
END $$;
REVOKE ALL ON FUNCTION public.ensure_magicph_owner_role() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.ensure_magicph_owner_role() TO authenticated;
CREATE OR REPLACE FUNCTION public.guard_audit_budget() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE spent numeric; account_spent numeric; cap numeric; hour_count integer; today_utc timestamptz:=date_trunc('day',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
BEGIN
 PERFORM pg_advisory_xact_lock(724202610);
 IF auth.uid() IS NULL OR NEW.user_id<>auth.uid() OR NOT public.ensure_magicph_owner_role() OR NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Owner administrator access required'; END IF;
 IF NEW.duration NOT IN (5,10) OR NEW.template NOT IN ('parol','snow','bokeh','globe','fire') THEN RAISE EXCEPTION 'Invalid test choices'; END IF;
 NEW.started_at:=now(); NEW.cost_usd:=CASE WHEN NEW.duration=5 THEN 0.35 ELSE 0.70 END;
 SELECT (SELECT count(*) FROM public.fal_test_runs WHERE user_id=NEW.user_id AND started_at>now()-interval '1 hour')+(SELECT count(*) FROM public.video_payments WHERE user_id=NEW.user_id AND started_at>now()-interval '1 hour') INTO hour_count;
 IF hour_count>=3 THEN RAISE EXCEPTION 'Limit reached: 3 videos/hour max. Try again later.'; END IF;
 SELECT COALESCE(sum(cost_usd),0) INTO account_spent FROM public.fal_test_runs WHERE user_id=NEW.user_id AND started_at>=today_utc;
 account_spent:=account_spent+(SELECT COALESCE(sum(cost_usd),0) FROM public.video_payments WHERE user_id=NEW.user_id AND started_at>=today_utc);
 IF account_spent+NEW.cost_usd>10 THEN RAISE EXCEPTION 'Account daily limit reached: $10 maximum (UTC).'; END IF;
 SELECT COALESCE(sum(cost_usd),0) INTO spent FROM public.video_payments WHERE started_at>=today_utc;
 spent:=spent+(SELECT COALESCE(sum(cost_usd),0) FROM public.fal_test_runs WHERE started_at>=today_utc);
 SELECT COALESCE((SELECT daily_limit FROM public.video_launch_settings WHERE id=true),10) INTO cap;
 IF spent+NEW.cost_usd>cap THEN RAISE EXCEPTION 'Shared daily generation budget reached'; END IF;
 RETURN NEW;
END $$;
CREATE OR REPLACE FUNCTION public.claim_video_payment(p_id uuid) RETURNS public.video_payments LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE r public.video_payments; spent numeric; cap numeric; account_spent numeric; today_utc timestamptz:=date_trunc('day',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in before generating'; END IF;
 PERFORM pg_advisory_xact_lock(724202610);
 SELECT * INTO r FROM public.video_payments WHERE id=p_id AND user_id=auth.uid() FOR UPDATE;
 IF r.id IS NULL OR r.status<>'approved' THEN RAISE EXCEPTION 'Please pay first — an approved, unused video credit is required'; END IF;
 IF (SELECT count(*) FROM public.video_payments WHERE user_id=auth.uid() AND started_at>now()-interval '1 hour')+(SELECT count(*) FROM public.fal_test_runs WHERE user_id=auth.uid() AND started_at>now()-interval '1 hour')>=3 THEN RAISE EXCEPTION 'Too many generations — max 3 per hour. Try later.'; END IF;
 SELECT COALESCE(sum(cost_usd),0) INTO account_spent FROM public.video_payments WHERE user_id=auth.uid() AND started_at>=today_utc;
 account_spent:=account_spent+(SELECT COALESCE(sum(cost_usd),0) FROM public.fal_test_runs WHERE user_id=auth.uid() AND started_at>=today_utc);
 IF account_spent+(CASE WHEN r.duration=5 THEN 0.35 ELSE 0.70 END)>10 THEN RAISE EXCEPTION 'Account daily generation limit reached'; END IF;
 SELECT COALESCE(sum(cost_usd),0) INTO spent FROM public.video_payments WHERE started_at>=today_utc;
 spent:=spent+(SELECT COALESCE(sum(cost_usd),0) FROM public.fal_test_runs WHERE started_at>=today_utc);
 SELECT COALESCE((SELECT daily_limit FROM public.video_launch_settings WHERE id=true),10) INTO cap;
 IF spent+(CASE WHEN r.duration=5 THEN 0.35 ELSE 0.70 END)>cap THEN RAISE EXCEPTION 'Daily generation limit reached. Please try tomorrow.'; END IF;
 UPDATE public.video_payments SET status='SUBMITTING',started_at=now(),cost_usd=CASE WHEN duration=5 THEN 0.35 ELSE 0.70 END WHERE id=p_id RETURNING * INTO r;
 RETURN r;
END $$;
CREATE OR REPLACE FUNCTION public.protect_test_reservation() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
BEGIN
 IF NEW.user_id IS DISTINCT FROM OLD.user_id OR NEW.started_at IS DISTINCT FROM OLD.started_at OR NEW.duration IS DISTINCT FROM OLD.duration OR NEW.cost_usd IS DISTINCT FROM OLD.cost_usd OR NEW.template IS DISTINCT FROM OLD.template THEN RAISE EXCEPTION 'Test reservation cannot be changed'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER protect_test_reservation BEFORE UPDATE ON public.fal_test_runs FOR EACH ROW EXECUTE FUNCTION public.protect_test_reservation();
REVOKE UPDATE ON public.fal_test_runs FROM authenticated;
GRANT UPDATE(request_id,status,video_url,error,finished_at) ON public.fal_test_runs TO authenticated;