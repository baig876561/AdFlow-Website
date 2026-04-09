-- Fix Ad Editing Row Level Security
-- Paste and run this entirely in Supabase SQL Editor

DROP POLICY IF EXISTS "Users can update own draft ads" ON public.ads;

CREATE POLICY "Users can update own draft ads" ON public.ads
  FOR UPDATE 
  USING (auth.uid() = user_id AND status IN ('Draft', 'Rejected'))
  WITH CHECK (auth.uid() = user_id AND status IN ('Draft', 'Rejected', 'Submitted'));
