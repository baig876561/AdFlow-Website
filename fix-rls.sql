-- Fix Infinite Recursion on Users Table
-- Paste and run this entirely in Supabase SQL Editor

-- 1. Create a function that securely fetches the role without triggering RLS rules
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;

-- 2. Drop the recursive policies from the users table
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update any user" ON public.users;

-- 3. Re-create them using the safe function
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    public.get_my_role() IN ('admin', 'super_admin')
  );

CREATE POLICY "Admins can update any user" ON public.users
  FOR UPDATE USING (
    public.get_my_role() IN ('admin', 'super_admin')
  );
