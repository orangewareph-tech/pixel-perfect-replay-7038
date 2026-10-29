CREATE TABLE public.video_payments (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, email text NOT NULL,
 duration integer NOT NULL CHECK (duration IN (5,10)), music text NOT NULL CHECK (music IN ('no-music','pasko-sa-nayon','christmas-in-our-hearts','ang-pasko-ay-sumapit','jingle-bells-pinoy')),
 template text NOT NULL CHECK (template IN ('parol','snow','bokeh','globe','fire')),
 amount integer NOT NULL, currency text NOT NULL DEFAULT 'PHP', provider text NOT NULL DEFAULT 'manual' CHECK (provider IN ('manual','paymongo')),
 status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','SUBMITTING','IN_QUEUE','IN_PROGRESS','COMPLETED','FAILED')),
 receipt text, provider_session text UNIQUE, request_id text UNIQUE, video_url text, error text,
 created_at timestamptz NOT NULL DEFAULT now(), approved_at timestamptz, approved_by uuid, started_at timestamptz, finished_at timestamptz,
 cost_usd numeric(8,2) NOT NULL DEFAULT 0
);
GRANT SELECT ON public.video_payments TO authenticated;
GRANT ALL ON public.video_payments TO service_role;
ALTER TABLE public.video_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY read_own_or_admin_payments ON public.video_payments FOR SELECT TO authenticated USING (user_id=auth.uid() OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id=auth.uid() AND role='admin'));
CREATE TABLE public.video_launch_settings (
 id boolean PRIMARY KEY DEFAULT true CHECK (id), daily_limit numeric(8,2) NOT NULL DEFAULT 10 CHECK (daily_limit > 0 AND daily_limit <= 100),
 recipient text NOT NULL DEFAULT 'Jorjan G. Lanaja', phone text NOT NULL DEFAULT '09752765499', qr_url text
);
GRANT SELECT ON public.video_launch_settings TO authenticated;
GRANT ALL ON public.video_launch_settings TO service_role;
ALTER TABLE public.video_launch_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY read_launch_settings ON public.video_launch_settings FOR SELECT TO authenticated USING (true);
CREATE FUNCTION public.create_video_payment(p_duration integer,p_music text,p_template text,p_provider text,p_receipt text DEFAULT NULL) RETURNS public.video_payments LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE r public.video_payments; e text;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in before payment'; END IF;
 SELECT email INTO e FROM auth.users WHERE id=auth.uid();
 IF e IS NULL THEN RAISE EXCEPTION 'A verified account email is required'; END IF;
 IF p_provider='manual' AND (p_receipt IS NULL OR length(p_receipt)>2800000 OR p_receipt !~ '^data:image/(jpeg|png);base64,') THEN RAISE EXCEPTION 'Upload a JPG or PNG receipt, max 2MB'; END IF;
 IF (SELECT count(*) FROM public.video_payments WHERE user_id=auth.uid() AND status='pending')>=5 THEN RAISE EXCEPTION 'Review your pending payments before submitting more'; END IF;
 INSERT INTO public.video_payments(user_id,email,duration,music,template,provider,receipt,amount) VALUES(auth.uid(),e,p_duration,p_music,p_template,p_provider,p_receipt,(CASE WHEN p_duration=5 THEN 149 ELSE 299 END)+(CASE WHEN p_music='no-music' THEN 0 ELSE 20 END)) RETURNING * INTO r;
 RETURN r;
END $$;
REVOKE ALL ON FUNCTION public.create_video_payment(integer,text,text,text,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.create_video_payment(integer,text,text,text,text) TO authenticated;
CREATE FUNCTION public.review_video_payment(p_id uuid,p_approve boolean) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=auth.uid() AND role='admin') THEN RAISE EXCEPTION 'Administrator access required'; END IF;
 UPDATE public.video_payments SET status=CASE WHEN p_approve THEN 'approved' ELSE 'rejected' END, approved_at=now(),approved_by=auth.uid() WHERE id=p_id AND status='pending' AND provider='manual';
 IF NOT FOUND THEN RAISE EXCEPTION 'Payment already reviewed or not manual'; END IF;
END $$;
REVOKE ALL ON FUNCTION public.review_video_payment(uuid,boolean) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.review_video_payment(uuid,boolean) TO authenticated;
CREATE FUNCTION public.claim_video_payment(p_id uuid) RETURNS public.video_payments LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE r public.video_payments; spent numeric; cap numeric;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in before generating'; END IF;
 PERFORM pg_advisory_xact_lock(724202610);
 SELECT * INTO r FROM public.video_payments WHERE id=p_id AND user_id=auth.uid() FOR UPDATE;
 IF r.id IS NULL OR r.status<>'approved' THEN RAISE EXCEPTION 'Please pay first — an approved, unused video credit is required'; END IF;
 IF (SELECT count(*) FROM public.video_payments WHERE user_id=auth.uid() AND started_at>now()-interval '1 hour')>=3 THEN RAISE EXCEPTION 'Too many generations — max 3 per hour. Try later.'; END IF;
 SELECT COALESCE(sum(cost_usd),0) INTO spent FROM public.video_payments WHERE started_at>=date_trunc('day',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
 spent:=spent+(SELECT COALESCE(sum(CASE WHEN duration=5 THEN 0.35 ELSE 0.70 END),0) FROM public.fal_test_runs WHERE started_at>=date_trunc('day',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC');
 SELECT COALESCE((SELECT daily_limit FROM public.video_launch_settings WHERE id=true),10) INTO cap;
 IF spent+(CASE WHEN r.duration=5 THEN 0.35 ELSE 0.70 END)>cap THEN RAISE EXCEPTION 'Daily generation limit reached. Please try tomorrow.'; END IF;
 UPDATE public.video_payments SET status='SUBMITTING',started_at=now(),cost_usd=CASE WHEN duration=5 THEN 0.35 ELSE 0.70 END WHERE id=p_id RETURNING * INTO r;
 RETURN r;
END $$;
REVOKE ALL ON FUNCTION public.claim_video_payment(uuid) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.claim_video_payment(uuid) TO authenticated;
CREATE FUNCTION public.save_video_job(p_id uuid,p_request text,p_status text,p_video text DEFAULT NULL,p_error text DEFAULT NULL) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
 IF p_status NOT IN ('IN_QUEUE','IN_PROGRESS','COMPLETED','FAILED') OR length(p_request)>100 OR length(p_error)>500 THEN RAISE EXCEPTION 'Invalid job status'; END IF;
 IF p_video IS NOT NULL AND p_video !~ '^https://([a-zA-Z0-9-]+\.)*fal\.media/' THEN RAISE EXCEPTION 'Invalid video URL'; END IF;
 UPDATE public.video_payments SET request_id=COALESCE(request_id,p_request),status=p_status,video_url=p_video,error=p_error,finished_at=CASE WHEN p_status IN ('COMPLETED','FAILED') THEN now() ELSE NULL END WHERE id=p_id AND user_id=auth.uid() AND status IN ('SUBMITTING','IN_QUEUE','IN_PROGRESS') AND (request_id IS NULL OR request_id=p_request);
 IF NOT FOUND THEN RAISE EXCEPTION 'Active video not found'; END IF;
END $$;
REVOKE ALL ON FUNCTION public.save_video_job(uuid,text,text,text,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.save_video_job(uuid,text,text,text,text) TO service_role;
CREATE FUNCTION public.guard_audit_budget() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE spent numeric; cap numeric;
BEGIN
 PERFORM pg_advisory_xact_lock(724202610);
 SELECT COALESCE(sum(cost_usd),0) INTO spent FROM public.video_payments WHERE started_at>=date_trunc('day',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
 spent:=spent+(SELECT COALESCE(sum(CASE WHEN duration=5 THEN 0.35 ELSE 0.70 END),0) FROM public.fal_test_runs WHERE started_at>=date_trunc('day',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC');
 SELECT COALESCE((SELECT daily_limit FROM public.video_launch_settings WHERE id=true),10) INTO cap;
 IF spent+(CASE WHEN NEW.duration=5 THEN 0.35 ELSE 0.70 END)>cap THEN RAISE EXCEPTION 'Daily generation limit reached'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER audit_daily_budget BEFORE INSERT ON public.fal_test_runs FOR EACH ROW EXECUTE FUNCTION public.guard_audit_budget();