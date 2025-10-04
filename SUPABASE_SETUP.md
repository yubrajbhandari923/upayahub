# Supabase Setup Instructions

To make the authentication and problem submission functional, you need to set up Supabase. Follow these steps:

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Wait for the project to be ready (takes 1-2 minutes)

## 2. Get Project Credentials

1. Go to Project Settings → API
2. Copy the following values:
   - Project URL (`https://xxx.supabase.co`)
   - Anon public key (`eyJhbGciOiJ...`)

## 3. Configure Environment Variables

Create a `.env.local` file in the project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. Set Up Database Schema

1. Go to SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase-schema.sql` (already created in this project)
3. Paste and run the SQL to create all tables and policies

## 5. Configure Authentication

1. Go to Authentication → Settings
2. Enable Google OAuth:
   - Add Google as a provider
   - Get Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com)
   - Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`

## 6. Set Up Storage

1. Go to Storage
2. The `media` bucket should be created automatically by the schema
3. Configure bucket policies for public access to uploaded files

## 7. Test the Setup

1. Restart your development server: `npm run dev`
2. Visit the app - you should no longer see "Setup Required" messages
3. Try signing in with Google
4. Try submitting a problem

## Features Now Working

With Supabase configured, these features will work:

- ✅ Sign in with Google OAuth
- ✅ Sign in with Magic Link (email)
- ✅ Problem submission with media upload
- ✅ Problem listing and detail pages
- ✅ User authentication state management
- ✅ Protected routes and forms

## Next Steps

After Supabase is configured, the platform will be fully functional for:
- User authentication
- Problem posting and viewing
- Media uploads
- Basic navigation

Additional features like voting, commenting, and solution attempts can be added next.