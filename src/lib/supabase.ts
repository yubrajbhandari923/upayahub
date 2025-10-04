import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL &&
           process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
           process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http'))
}

// Lazy initialization of Supabase client
let _supabaseClient: SupabaseClient | null = null

export const getSupabase = () => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  if (!_supabaseClient) {
    _supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  return _supabaseClient
}

// For backwards compatibility and convenience
export const supabase = {
  get auth() {
    return getSupabase().auth
  },
  get from() {
    return getSupabase().from
  },
  get storage() {
    return getSupabase().storage
  },
  get rpc() {
    return getSupabase().rpc
  }
}

export type Profile = {
  id: string
  display_name?: string
  avatar_url?: string
  role: 'member' | 'moderator' | 'admin'
  bio?: string
  created_at: string
}

export type Problem = {
  id: string
  author_id?: string
  title: string
  description: string
  category: 'technical' | 'policy' | 'both'
  tags: string[]
  language: 'ne' | 'en'
  location?: {
    country?: string
    province?: string
    district?: string
    municipality?: string
  }
  status: 'open' | 'in_progress' | 'solved' | 'archived'
  media: Array<{
    type: 'image' | 'video'
    url: string
    thumb_url?: string
  }>
  score: number
  created_at: string
  updated_at: string
  profiles?: Profile
}

export type Comment = {
  id: string
  problem_id: string
  author_id?: string
  parent_id?: string
  body: string
  tag: 'idea' | 'question' | 'resource' | 'general'
  score: number
  created_at: string
  profiles?: Profile
  replies?: Comment[]
}

export type Attempt = {
  id: string
  problem_id: string
  author_id?: string
  title: string
  summary: string
  status: 'working' | 'partial' | 'failed'
  lessons: string
  links: string[]
  media: Array<{
    type: 'image' | 'video'
    url: string
    thumb_url?: string
  }>
  created_at: string
  profiles?: Profile
}

export type Report = {
  id: string
  target_type: 'problem' | 'comment' | 'attempt'
  target_id: string
  reporter_id?: string
  reason: 'spam' | 'abuse' | 'misinfo' | 'duplicate' | 'offtopic' | 'other'
  note?: string
  status: 'open' | 'reviewed' | 'dismissed' | 'actioned'
  created_at: string
  reviewed_by?: string
}

export type Vote = {
  user_id: string
  target_id: string
  value: -1 | 1
  created_at: string
}