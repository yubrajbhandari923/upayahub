-- Comprehensive schema verification and fixes
-- Run this in your Supabase SQL Editor to ensure all tables and policies exist

-- First, check if problem_votes table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'problem_votes') THEN
        -- Create problem votes table
        CREATE TABLE public.problem_votes (
          user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
          problem_id uuid REFERENCES public.problems(id) ON DELETE CASCADE,
          value int CHECK (value IN (-1,1)) NOT NULL,
          created_at timestamptz DEFAULT now(),
          PRIMARY KEY (user_id, problem_id)
        );

        -- Enable RLS
        ALTER TABLE public.problem_votes ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Anyone can view problem votes" ON public.problem_votes
          FOR SELECT USING (true);

        CREATE POLICY "Authenticated users can vote" ON public.problem_votes
          FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

        CREATE POLICY "Users can update their own votes" ON public.problem_votes
          FOR UPDATE USING (auth.uid() = user_id);

        CREATE POLICY "Users can delete their own votes" ON public.problem_votes
          FOR DELETE USING (auth.uid() = user_id);

        RAISE NOTICE 'Created problem_votes table with RLS policies';
    ELSE
        RAISE NOTICE 'problem_votes table already exists';
    END IF;
END $$;

-- Verify and fix delete policies for problems
DO $$
BEGIN
    -- Drop existing delete policy if it exists
    DROP POLICY IF EXISTS "Users can delete their own problems" ON public.problems;
    DROP POLICY IF EXISTS "Moderators can delete problems" ON public.problems;

    -- Create a unified delete policy
    CREATE POLICY "Users and moderators can delete problems" ON public.problems
      FOR DELETE USING (
        auth.uid() = author_id OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin'))
      );

    RAISE NOTICE 'Updated delete policy for problems';
END $$;

-- Verify and fix delete policies for comments
DO $$
BEGIN
    -- Drop existing delete policy if it exists
    DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;
    DROP POLICY IF EXISTS "Moderators can delete comments" ON public.comments;

    -- Create a unified delete policy
    CREATE POLICY "Users and moderators can delete comments" ON public.comments
      FOR DELETE USING (
        auth.uid() = author_id OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin'))
      );

    RAISE NOTICE 'Updated delete policy for comments';
END $$;

-- Verify and fix delete policies for attempts
DO $$
BEGIN
    -- Drop existing delete policy if it exists
    DROP POLICY IF EXISTS "Users can delete their own attempts" ON public.attempts;
    DROP POLICY IF EXISTS "Moderators can delete attempts" ON public.attempts;

    -- Create a unified delete policy
    CREATE POLICY "Users and moderators can delete attempts" ON public.attempts
      FOR DELETE USING (
        auth.uid() = author_id OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin'))
      );

    RAISE NOTICE 'Updated delete policy for attempts';
END $$;

-- Grant necessary permissions
GRANT ALL ON public.problem_votes TO authenticated;
GRANT ALL ON public.problem_votes TO service_role;

-- Verify feedback table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'feedback') THEN
        -- Create feedback table
        CREATE TABLE public.feedback (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
          name text,
          email text,
          feedback_type text CHECK (feedback_type IN ('bug','feature','improvement','other')) NOT NULL,
          message text NOT NULL,
          status text CHECK (status IN ('open','reviewed','resolved')) DEFAULT 'open',
          created_at timestamptz DEFAULT now()
        );

        -- Create indexes
        CREATE INDEX idx_feedback_status ON public.feedback(status);
        CREATE INDEX idx_feedback_created_at ON public.feedback(created_at DESC);

        -- Enable RLS
        ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Anyone can submit feedback" ON public.feedback
          FOR INSERT WITH CHECK (true);

        CREATE POLICY "Moderators can view feedback" ON public.feedback
          FOR SELECT USING (
            EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin'))
          );

        -- Grant permissions
        GRANT ALL ON public.feedback TO authenticated;
        GRANT ALL ON public.feedback TO service_role;

        RAISE NOTICE 'Created feedback table with RLS policies';
    ELSE
        RAISE NOTICE 'feedback table already exists';
    END IF;
END $$;

-- Summary
SELECT
    'Schema verification complete. Check NOTICES above for details.' as message,
    (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public') as total_tables;
