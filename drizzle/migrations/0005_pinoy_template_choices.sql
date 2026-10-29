ALTER TABLE public.video_payments DROP CONSTRAINT IF EXISTS video_payments_template_check;
ALTER TABLE public.video_payments ADD CONSTRAINT video_payments_template_check CHECK (template IN ('parol','snow','bokeh','globe','fire','simbang','crafting','caroling'));
CREATE OR REPLACE FUNCTION public.guard_audit_budget() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE spent numeric; account_spent numeric; cap numeric; hour_count integer; today_utc timestamptz:=date_trunc('day',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
BEGIN
 PERFORM pg_advisory_xact_lock(724202610);
 IF auth.uid() IS NULL OR NEW.user_id<>auth.uid() OR NOT public.ensure_magicph_owner_role() OR NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Owner administrator access required'; END IF;
 IF NEW.duration NOT IN (5,10) OR NEW.template NOT IN ('parol','snow','bokeh','globe','fire','simbang','crafting','caroling') THEN RAISE EXCEPTION 'Invalid test choices'; END IF;
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