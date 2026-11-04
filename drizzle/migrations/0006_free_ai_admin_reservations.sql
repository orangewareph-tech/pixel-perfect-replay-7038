CREATE TABLE public.video_provider_jobs (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, model text NOT NULL, duration integer NOT NULL CHECK (duration BETWEEN 2 AND 6), template text NOT NULL, request_id text UNIQUE, status text NOT NULL DEFAULT 'SUBMITTING' CHECK (status IN ('SUBMITTING','IN_QUEUE','IN_PROGRESS','COMPLETED','FAILED')), video_url text, error text, reserved_usd numeric NOT NULL DEFAULT 0.35, started_at timestamptz NOT NULL DEFAULT now(), finished_at timestamptz);
GRANT SELECT ON public.video_provider_jobs TO authenticated;
GRANT ALL ON public.video_provider_jobs TO service_role;
ALTER TABLE public.video_provider_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY read_own_provider_jobs ON public.video_provider_jobs FOR SELECT TO authenticated USING (user_id=auth.uid());
CREATE FUNCTION public.reserve_free_ai_admin_test(p_model text,p_duration integer,p_template text) RETURNS public.video_provider_jobs LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE r public.video_provider_jobs; spent numeric; cap numeric; today_utc timestamptz:=date_trunc('day',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
BEGIN
 IF auth.uid() IS NULL OR NOT EXISTS(SELECT 1 FROM auth.users u JOIN auth.identities i ON i.user_id=u.id AND i.provider='google' WHERE u.id=auth.uid() AND u.email_confirmed_at IS NOT NULL AND lower(u.email) IN ('orangewareph@gmail.com','orangawareph@gmail.com','jorjan.g.lanaja@gmail.com')) THEN RAISE EXCEPTION 'Verified administrator Google account required'; END IF;
 IF p_duration<>5 OR p_template NOT IN ('parol','snow','bokeh','globe','fire') OR p_model NOT IN ('wan22-ti2v-5b','cogvideox','hunyuan-video') THEN RAISE EXCEPTION 'Invalid free-model test choices'; END IF;
 PERFORM pg_advisory_xact_lock(724202610);
 IF (SELECT count(*) FROM public.video_provider_jobs WHERE user_id=auth.uid() AND started_at>=today_utc)>=10 THEN RAISE EXCEPTION 'Administrator limit: 10 tests per UTC day'; END IF;
 SELECT COALESCE(sum(reserved_usd),0) INTO spent FROM public.video_provider_jobs WHERE started_at>=today_utc;
 spent:=spent+(SELECT COALESCE(sum(cost_usd),0) FROM public.video_payments WHERE started_at>=today_utc)+(SELECT COALESCE(sum(cost_usd),0) FROM public.fal_test_runs WHERE started_at>=today_utc);
 SELECT COALESCE((SELECT daily_limit FROM public.video_launch_settings WHERE id=true),10) INTO cap;
 IF spent+0.35>cap THEN RAISE EXCEPTION 'Shared daily reservation budget reached'; END IF;
 IF (SELECT COALESCE(sum(reserved_usd),0) FROM public.video_provider_jobs WHERE user_id=auth.uid() AND started_at>=today_utc)+0.35>10 THEN RAISE EXCEPTION 'Administrator daily reservation budget reached'; END IF;
 INSERT INTO public.video_provider_jobs(user_id,model,duration,template) VALUES(auth.uid(),p_model,p_duration,p_template) RETURNING * INTO r;
 RETURN r;
END $$;
REVOKE ALL ON FUNCTION public.reserve_free_ai_admin_test(text,integer,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.reserve_free_ai_admin_test(text,integer,text) TO authenticated;
COMMENT ON COLUMN public.video_provider_jobs.reserved_usd IS 'Conservative legacy budget reservation; not a verified Free.ai charge.';