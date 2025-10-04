import { supabase, isSupabaseConfigured } from './supabase'

export async function signInWithGoogle() {
  if (!isSupabaseConfigured()) {
    return { error: { message: 'Supabase not configured. Please set up your environment variables.' } }
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    }
  })

  if (error) {
    console.error('Error signing in with Google:', error)
    return { error }
  }

  return { data }
}

export async function signInWithEmail(email: string) {
  if (!isSupabaseConfigured()) {
    return { error: { message: 'Supabase not configured. Please set up your environment variables.' } }
  }

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  })

  if (error) {
    console.error('Error sending magic link:', error)
    return { error }
  }

  return { data }
}

export async function signOut() {
  if (!isSupabaseConfigured()) {
    return { error: { message: 'Supabase not configured.' } }
  }

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error signing out:', error)
    return { error }
  }

  return { success: true }
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured()) {
    return { user: null, error: { message: 'Supabase not configured.' } }
  }

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    console.error('Error getting current user:', error)
    return { user: null, error }
  }

  return { user, error: null }
}