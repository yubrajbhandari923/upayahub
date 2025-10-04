# Nepal Community Problem-Solving Platform

A mobile-first platform where community members in Nepal can post real problems (technical or policy), discuss solution ideas, and share attempts (including failures) with links to repos or docs.

## Features

- 🏔️ **Nepal-themed design** with crimson, saffron, and deep green colors
- 🌐 **Bilingual support** (English/Nepali) with next-intl
- 📱 **Mobile-first responsive** design optimized for low-end phones
- 🔐 **Secure authentication** with Supabase (Magic Link + Google OAuth)
- 💬 **Threaded discussions** with voting and moderation
- 📄 **Solution attempts** with lessons learned (including failures)
- 🏷️ **Community moderation** with reporting and admin dashboard
- 🔍 **Full-text search** with filters by category, tags, location, status
- 📸 **Media uploads** for problems and attempts
- ⚡ **Fast performance** with Next.js 15 and Supabase

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage + RLS)
- **Internationalization**: next-intl
- **Styling**: Tailwind CSS v4 with custom Nepal-themed colors
- **Forms**: react-hook-form + zod validation
- **Icons**: Lucide React

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm
- A Supabase account

### 2. Clone and Install

```bash
git clone <your-repo-url>
cd problems-solving-platform
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your project URL and anon key
3. In the SQL Editor, run the complete schema from `supabase-schema.sql`
4. Set up Storage buckets:
   - Go to Storage > Create bucket: `problem-media` (public)
   - Create bucket: `attempt-media` (public)
5. Enable Authentication:
   - Go to Authentication > Settings
   - Enable Email (Magic Link)
   - Optionally enable Google OAuth provider

### 4. Environment Variables

Create `.env.local` with your actual Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudflare Turnstile (optional - for spam protection)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
TURNSTILE_SECRET_KEY=your_turnstile_secret_key

# Analytics (optional)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com

# Error Tracking (optional)
SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_sentry_auth_token
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # Internationalized routes
│   │   ├── layout.tsx     # Locale-specific layout
│   │   ├── page.tsx       # Home page
│   │   ├── problems/      # Problems listing and detail
│   │   ├── submit/        # Problem submission
│   │   └── about/         # Static pages
│   ├── globals.css        # Global styles with Nepal theme
│   └── layout.tsx         # Root layout
├── components/
│   ├── layout/            # Navigation, Footer
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── supabase.ts        # Supabase client and types
│   └── i18n.ts            # Internationalization config
└── messages/
    ├── en.json            # English translations
    └── ne.json            # Nepali translations
```

## Key Features Implementation

### Authentication
- Magic link authentication through Supabase
- Automatic profile creation on signup
- Role-based access (member/moderator/admin)

### Database Schema
- **Problems**: Title, description, category, tags, location, media
- **Comments**: Threaded discussions with voting
- **Attempts**: Solution attempts with status and lessons learned
- **Reports**: Community moderation system
- **Votes**: Upvote/downvote for problems and comments

### Row Level Security (RLS)
- Public read access for browsing without signup
- Authenticated write access for posting
- User-specific permissions for editing own content
- Moderator/admin privileges for content management

### Internationalization
- English and Nepali language support
- Automatic locale detection
- Content-specific language tagging
- Fallback to English for missing translations

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Supabase Configuration

1. Update redirect URLs in Supabase Auth settings to include your production domain
2. Set up custom domain (optional)
3. Configure image optimization domains in `next.config.js`

## Content Guidelines

- **Problems**: Be specific, add photos, share constraints (cost/time/tools)
- **Discussions**: Ideas, questions, resources welcome
- **Attempts**: Include lessons learned, even from failures
- **Moderation**: Community-driven with admin oversight

## License

Content is licensed under CC BY-SA 4.0. Code follows repository license.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and feature requests, please use the GitHub Issues tab.

---

**चलिए, समस्याको समाधानमा सँगै लागौँ।** (Let's work together on solutions!)
