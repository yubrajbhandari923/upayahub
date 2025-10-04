-- Nepal Community Problem-Solving Platform Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  role text CHECK (role IN ('member','moderator','admin')) DEFAULT 'member',
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create problems table
CREATE TABLE public.problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text CHECK (category IN ('technical','policy','both')) NOT NULL,
  tags text[] DEFAULT '{}',
  language text CHECK (language IN ('ne','en')) NOT NULL,
  location jsonb, -- {country:'NP', province:'', district:'', municipality:''}
  status text CHECK (status IN ('open','in_progress','solved','archived')) DEFAULT 'open',
  media jsonb DEFAULT '[]', -- [{type:'image'|'video', url, thumb_url}]
  score int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create problem votes table
CREATE TABLE public.problem_votes (
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  problem_id uuid REFERENCES public.problems(id) ON DELETE CASCADE,
  value int CHECK (value IN (-1,1)) NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, problem_id)
);

-- Create comments table
CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id uuid REFERENCES public.problems(id) ON DELETE CASCADE,
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  body text NOT NULL,
  tag text CHECK (tag IN ('idea','question','resource', 'general')) DEFAULT 'general',
  score int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create comment votes table
CREATE TABLE public.comment_votes (
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  value int CHECK (value IN (-1,1)) NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, comment_id)
);

-- Create attempts table
CREATE TABLE public.attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id uuid REFERENCES public.problems(id) ON DELETE CASCADE,
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  summary text NOT NULL,
  status text CHECK (status IN ('working','partial','failed')) NOT NULL,
  lessons text NOT NULL,
  links text[], -- array of URLs
  media jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reports table
CREATE TABLE public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type text CHECK (target_type IN ('problem','comment','attempt')) NOT NULL,
  target_id uuid NOT NULL,
  reporter_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  reason text CHECK (reason IN ('spam','abuse','misinfo','duplicate','offtopic','other')) NOT NULL,
  note text,
  status text CHECK (status IN ('open','reviewed','dismissed','actioned')) DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  reviewed_by uuid REFERENCES public.profiles(id),
  reviewed_at timestamptz
);

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

-- Create indexes for performance
CREATE INDEX idx_problems_status ON public.problems(status);
CREATE INDEX idx_problems_category ON public.problems(category);
CREATE INDEX idx_problems_created_at ON public.problems(created_at DESC);
CREATE INDEX idx_problems_score ON public.problems(score DESC);
CREATE INDEX idx_problems_author ON public.problems(author_id);
CREATE INDEX idx_problems_language ON public.problems(language);

CREATE INDEX idx_comments_problem ON public.comments(problem_id);
CREATE INDEX idx_comments_parent ON public.comments(parent_id);
CREATE INDEX idx_comments_created_at ON public.comments(created_at);

CREATE INDEX idx_attempts_problem ON public.attempts(problem_id);
CREATE INDEX idx_attempts_status ON public.attempts(status);

CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_target ON public.reports(target_type, target_id);

CREATE INDEX idx_feedback_status ON public.feedback(status);
CREATE INDEX idx_feedback_created_at ON public.feedback(created_at DESC);

-- Create full-text search indexes
CREATE INDEX idx_problems_search ON public.problems USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_problems_tags ON public.problems USING gin(tags);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_problems_updated_at BEFORE UPDATE ON public.problems
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attempts_updated_at BEFORE UPDATE ON public.attempts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ language plpgsql security definer;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Problems policies
CREATE POLICY "Anyone can view problems" ON public.problems
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create problems" ON public.problems
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);

CREATE POLICY "Users can update their own problems" ON public.problems
  FOR UPDATE USING (auth.uid() = author_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin')));

CREATE POLICY "Moderators can delete problems" ON public.problems
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin'))
  );

-- Problem votes policies
CREATE POLICY "Anyone can view problem votes" ON public.problem_votes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote" ON public.problem_votes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update their own votes" ON public.problem_votes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" ON public.problem_votes
  FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Anyone can view comments" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON public.comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);

CREATE POLICY "Users can update their own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = author_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin')));

CREATE POLICY "Moderators can delete comments" ON public.comments
  FOR DELETE USING (
    auth.uid() = author_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin'))
  );

-- Comment votes policies (similar to problem votes)
CREATE POLICY "Anyone can view comment votes" ON public.comment_votes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote on comments" ON public.comment_votes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update their own comment votes" ON public.comment_votes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comment votes" ON public.comment_votes
  FOR DELETE USING (auth.uid() = user_id);

-- Attempts policies
CREATE POLICY "Anyone can view attempts" ON public.attempts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create attempts" ON public.attempts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);

CREATE POLICY "Users can update their own attempts" ON public.attempts
  FOR UPDATE USING (auth.uid() = author_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin')));

CREATE POLICY "Moderators can delete attempts" ON public.attempts
  FOR DELETE USING (
    auth.uid() = author_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin'))
  );

-- Reports policies
CREATE POLICY "Authenticated users can create reports" ON public.reports
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = reporter_id);

CREATE POLICY "Moderators can view and manage reports" ON public.reports
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin'))
  );

-- Feedback policies
CREATE POLICY "Anyone can submit feedback" ON public.feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Moderators can view feedback" ON public.feedback
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin'))
  );

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('problem-media', 'problem-media', true),
  ('attempt-media', 'attempt-media', true);

-- Storage policies
CREATE POLICY "Anyone can view media files" ON storage.objects
  FOR SELECT USING (bucket_id IN ('problem-media', 'attempt-media'));

CREATE POLICY "Authenticated users can upload media files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('problem-media', 'attempt-media') AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own media files" ON storage.objects
  FOR UPDATE USING (
    bucket_id IN ('problem-media', 'attempt-media') AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own media files" ON storage.objects
  FOR DELETE USING (
    bucket_id IN ('problem-media', 'attempt-media') AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Insert sample data for testing (optional)
-- Note: You'll need to create a test user first through Supabase Auth

/*
-- Sample problems (replace UUIDs with actual user IDs)
INSERT INTO public.problems (title, description, category, tags, language, status, author_id) VALUES
('Solar power solution for remote village schools', 'Our village school in Dolakha has no electricity. Looking for affordable solar solutions that can power 3 classrooms and basic computers.', 'technical', ARRAY['solar', 'education', 'energy'], 'en', 'open', 'your-user-uuid-here'),
('दुर्गम गाउँका विद्यालयहरूका लागि सौर्य ऊर्जा समाधान', 'दोलखाको हाम्रो गाउँको विद्यालयमा बिजुली छैन। ३ वटा कक्षाकोठा र आधारभूत कम्प्युटरहरू चलाउने सस्तो सौर्य समाधान खोजिरहेका छौं।', 'technical', ARRAY['सौर्य', 'शिक्षा', 'ऊर्जा'], 'ne', 'open', 'your-user-uuid-here'),
('Improving waste management in local municipalities', 'Plastic waste is accumulating in our neighborhood. Need help drafting a proposal for the municipality to implement proper recycling programs.', 'policy', ARRAY['waste', 'environment', 'policy'], 'en', 'in_progress', 'your-user-uuid-here');
*/