CREATE TABLE public.christmas_message_access_state (
 id text PRIMARY KEY,
 message text NOT NULL,
 status integer NOT NULL,
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.christmas_message_access_state TO service_role;
REVOKE ALL ON public.christmas_message_access_state FROM anon, authenticated;
ALTER TABLE public.christmas_message_access_state ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.christmas_message_access_state IS 'Server-only durable provider denial circuit breaker; no recipient or greeting content stored.';