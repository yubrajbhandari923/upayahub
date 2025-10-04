-- Add feedback table migration
-- Run this in your Supabase SQL Editor

-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  name text,
  email text,
  feedback_type text CHECK (feedback_type IN ('bug','feature','improvement','other')) NOT NULL,
  message text NOT NULL,
  status text CHECK (status IN ('open','reviewed','resolved')) DEFAULT 'open',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for feedback table
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);

-- Enable RLS on feedback table
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Feedback policies
CREATE POLICY "Anyone can submit feedback" ON public.feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Moderators can view feedback" ON public.feedback
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin'))
  );

-- Grant permissions
GRANT ALL ON public.feedback TO authenticated;
GRANT ALL ON public.feedback TO service_role;
