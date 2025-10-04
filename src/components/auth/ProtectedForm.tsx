'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signInWithGoogle } from '@/lib/auth';
import { Loader2, Lock, Mountain } from 'lucide-react';
import { toast } from 'sonner';

interface ProtectedFormProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function ProtectedForm({ children, title, description }: ProtectedFormProps) {
  const { user, loading, isAuthenticated, isConfigured } = useAuth();
  const router = useRouter();
  const locale = useLocale();

  const handleSignIn = () => {
    const currentUrl = window.location.pathname;
    router.push(`/${locale}/signin?returnTo=${encodeURIComponent(currentUrl)}`);
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast.error(locale === 'en' ? 'Failed to sign in with Google' : 'गुगलसँग साइन इन गर्न असफल');
      }
    } catch (error) {
      toast.error(locale === 'en' ? 'An error occurred' : 'त्रुटि देखा पर्‍यो');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-nepal-crimson" />
      </div>
    );
  }

  if (!isConfigured) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Mountain className="h-12 w-12 text-nepal-crimson" />
            </div>
            <CardTitle className="text-2xl">
              {locale === 'en' ? 'Setup Required' : 'सेटअप आवश्यक'}
            </CardTitle>
            <CardDescription className="text-base">
              {locale === 'en'
                ? 'To enable authentication, please configure your Supabase environment variables in .env.local'
                : 'प्रमाणीकरण सक्षम गर्न, कृपया .env.local मा आफ्नो Supabase वातावरण चरहरू कन्फिगर गर्नुहोस्'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Required environment variables:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• NEXT_PUBLIC_SUPABASE_URL</li>
                <li>• NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Mountain className="h-12 w-12 text-nepal-crimson" />
                <Lock className="h-6 w-6 text-nepal-blue absolute -bottom-1 -right-1 bg-white rounded-full p-1" />
              </div>
            </div>
            <CardTitle className="text-2xl">
              {title || (locale === 'en' ? 'Sign In Required' : 'साइन इन आवश्यक')}
            </CardTitle>
            <CardDescription className="text-base">
              {description || (locale === 'en'
                ? 'You need to sign in to post problems and contribute to solutions.'
                : 'तपाईंले समस्याहरू पोस्ट गर्न र समाधानमा योगदान दिन साइन इन गर्नुपर्छ।'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleGoogleSignIn} className="w-full" size="lg">
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {locale === 'en' ? 'Continue with Google' : 'गुगलसँग जारी राख्नुहोस्'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  {locale === 'en' ? 'Or' : 'वा'}
                </span>
              </div>
            </div>

            <Button onClick={handleSignIn} variant="outline" className="w-full" size="lg">
              {locale === 'en' ? 'Sign In with Email' : 'इमेलसँग साइन इन गर्नुहोस्'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}