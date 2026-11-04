-- Rename the table to reflect the new provider (optional but recommended)
ALTER TABLE public.fal_test_runs RENAME TO freeai_test_runs;
ALTER INDEX one_active_fal_test_per_user RENAME TO one_active_freeai_test_per_user;
ALTER POLICY admin_test_read   ON public.freeai_test_runs RENAME TO admin_test_read;
ALTER POLICY admin_test_insert ON public.freeai_test_runs RENAME TO admin_test_insert;
ALTER POLICY admin_test_update ON public.freeai_test_runs RENAME TO admin_test_update;

-- status: add terminal states + Free.ai's documented status shape
ALTER TABLE public.freeai_test_runs
  DROP CONSTRAINT IF EXISTS freeai_test_runs_status_check;
ALTER TABLE public.freeai_test_runs
  ADD CONSTRAINT freeai_test_runs_status_check
  CHECK (status IN ('SUBMITTING','PENDING','IN_PROGRESS','COMPLETED','FAILED','CANCELED'));

-- Free.ai returns video_url; keep error / finished_at. Optionally add:
ALTER TABLE public.freeai_test_runs
  ADD COLUMN IF NOT EXISTS model text,
  ADD COLUMN IF NOT EXISTS tokens_used integer,
  ADD COLUMN IF NOT EXISTS free_ai_usage jsonb;

-- Keep the partial unique index but update status set to match new states
DROP INDEX IF EXISTS public.one_active_freeai_test_per_user;
CREATE UNIQUE INDEX one_active_freeai_test_per_user
  ON public.freeai_test_runs(user_id)
  WHERE status IN ('SUBMITTING','PENDING','IN_PROGRESS');