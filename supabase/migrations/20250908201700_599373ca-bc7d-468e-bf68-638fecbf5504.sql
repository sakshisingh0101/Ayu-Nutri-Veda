-- Allow public (unauthenticated) SELECT on users for manual password-based login
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can select users"
ON public.users
FOR SELECT
USING (true);