CREATE FUNCTION public.guard_free_ai_shared_reservations() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE spent numeric; cap numeric; today_utc timestamptz:=date_trunc('day',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC'; extra numeric:=0;
BEGIN
 IF TG_TABLE_NAME='video_payments' THEN
  IF NEW.status<>'SUBMITTING' OR OLD.status='SUBMITTING' THEN RETURN NEW; END IF;
  IF NEW.duration<>5 THEN RAISE EXCEPTION 'Free.ai integration supports 2–6 seconds; ten-second credit has not been used'; END IF;
  extra:=NEW.cost_usd;
 ELSE
  IF NEW.duration<>5 THEN RAISE EXCEPTION 'Free.ai integration supports only five-second test offers'; END IF;
  extra:=NEW.cost_usd;
 END IF;
 PERFORM pg_advisory_xact_lock(724202610);
 SELECT COALESCE(sum(reserved_usd),0) INTO spent FROM public.video_provider_jobs WHERE started_at>=today_utc;
 spent:=spent+(SELECT COALESCE(sum(cost_usd),0) FROM public.video_payments WHERE started_at>=today_utc)+(SELECT COALESCE(sum(cost_usd),0) FROM public.fal_test_runs WHERE started_at>=today_utc);
 SELECT COALESCE((SELECT daily_limit FROM public.video_launch_settings WHERE id=true),10) INTO cap;
 IF spent+extra>cap THEN RAISE EXCEPTION 'Shared daily reservation budget reached'; END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER free_ai_shared_payment_budget BEFORE UPDATE ON public.video_payments FOR EACH ROW EXECUTE FUNCTION public.guard_free_ai_shared_reservations();
CREATE TRIGGER free_ai_shared_owner_budget BEFORE INSERT ON public.fal_test_runs FOR EACH ROW EXECUTE FUNCTION public.guard_free_ai_shared_reservations();
COMMENT ON COLUMN public.video_payments.cost_usd IS 'Legacy cost or conservative reservation; new Free.ai reservations are not verified provider charges.';