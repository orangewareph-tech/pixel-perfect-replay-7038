CREATE OR REPLACE FUNCTION public.create_video_payment(p_duration integer,p_music text,p_template text,p_provider text,p_receipt text DEFAULT NULL) RETURNS public.video_payments LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE r public.video_payments; e text;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in before payment'; END IF;
 SELECT email INTO e FROM auth.users WHERE id=auth.uid();
 IF e IS NULL THEN RAISE EXCEPTION 'A verified account email is required'; END IF;
 IF p_duration NOT IN (5,10) OR p_duration IS NULL THEN RAISE EXCEPTION 'Invalid duration'; END IF;
 IF p_music NOT IN ('no-music','pasko-sa-nayon','christmas-in-our-hearts','ang-pasko-ay-sumapit','jingle-bells-pinoy') OR p_music IS NULL THEN RAISE EXCEPTION 'Invalid music'; END IF;
 IF p_provider IS DISTINCT FROM 'manual' THEN RAISE EXCEPTION 'Automatic checkout is not connected'; END IF;
 IF p_receipt IS NULL OR length(p_receipt)>2800000 OR p_receipt !~ '^data:image/(jpeg|png);base64,' THEN RAISE EXCEPTION 'Upload a JPG or PNG receipt, max 2MB'; END IF;
 IF (SELECT count(*) FROM public.video_payments WHERE user_id=auth.uid() AND status='pending')>=5 THEN RAISE EXCEPTION 'Review your pending payments before submitting more'; END IF;
 INSERT INTO public.video_payments(user_id,email,duration,music,template,provider,receipt,amount) VALUES(auth.uid(),e,p_duration,'pasko-sa-nayon',p_template,p_provider,p_receipt,CASE WHEN p_duration=5 THEN 149 ELSE 299 END) RETURNING * INTO r;
 RETURN r;
END $$;
REVOKE ALL ON FUNCTION public.create_video_payment(integer,text,text,text,text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.create_video_payment(integer,text,text,text,text) TO authenticated;
COMMENT ON FUNCTION public.create_video_payment(integer,text,text,text,text) IS 'New manual payments include automatic Christmas sound at 149/299; existing payment selections and amounts remain unchanged.';