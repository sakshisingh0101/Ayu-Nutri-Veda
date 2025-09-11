-- Enable RLS on users table (safe if already enabled)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anon or authenticated) to insert into users table
DROP POLICY IF EXISTS "Anyone can insert users" ON public.users;
CREATE POLICY "Anyone can insert users"
ON public.users
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow authenticated users to read their own row by email
DROP POLICY IF EXISTS "Users can select their own row" ON public.users;
CREATE POLICY "Users can select their own row"
ON public.users
FOR SELECT
TO authenticated
USING (Email = auth.jwt()->>'email');
