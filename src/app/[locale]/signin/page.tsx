'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInWithGoogle, signInWithEmail } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';
import { Mountain, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const returnTo = searchParams.get('returnTo') || `/${locale}`;

  // Redirect if already signed in
  if (!authLoading && user) {
    router.push(returnTo);
    return null;
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast.error(locale === 'en' ? 'Failed to sign in with Google' : 'गुगलसँग साइन इन गर्न असफल');
      }
    } catch (error) {
      toast.error(locale === 'en' ? 'An error occurred' : 'त्रुटि देखा पर्‍यो');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const { error } = await signInWithEmail(email);
      if (error) {
        toast.error(locale === 'en' ? 'Failed to send magic link' : 'म्यागिक लिङ्क पठाउन असफल');
      } else {
        setEmailSent(true);
        toast.success(locale === 'en' ? 'Check your email for the magic link!' : 'म्यागिक लिङ्कका लागि आफ्नो इमेल जाँच गर्नुहोस्!');
      }
    } catch (error) {
      toast.error(locale === 'en' ? 'An error occurred' : 'त्रुटि देखा पर्‍यो');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-nepal-crimson" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Mountain className="h-12 w-12 text-nepal-crimson" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {locale === 'en' ? 'Welcome Back' : 'स्वागत छ'}
          </h1>
          <p className="text-gray-600">
            {locale === 'en'
              ? 'Sign in to start sharing problems and solutions'
              : 'समस्या र समाधानहरू साझेदारी गर्न साइन इन गर्नुहोस्'
            }
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {locale === 'en' ? 'Sign In' : 'साइन इन'}
            </CardTitle>
            <CardDescription>
              {locale === 'en'
                ? 'Choose your preferred sign-in method'
                : 'आफ्नो मनपर्ने साइन इन विधि छनौट गर्नुहोस्'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Sign In */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full"
              size="lg"
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
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
              )}
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

            {/* Email Magic Link */}
            {!emailSent ? (
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    {locale === 'en' ? 'Email Address' : 'इमेल ठेगाना'}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={locale === 'en' ? 'you@example.com' : 'तपाईं@example.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={loading} variant="outline" className="w-full">
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  {locale === 'en' ? 'Send Magic Link' : 'म्यागिक लिङ्क पठाउनुहोस्'}
                </Button>
              </form>
            ) : (
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Mail className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <h3 className="font-semibold text-green-800 mb-1">
                  {locale === 'en' ? 'Check Your Email' : 'आफ्नो इमेल जाँच गर्नुहोस्'}
                </h3>
                <p className="text-sm text-green-700">
                  {locale === 'en'
                    ? 'We sent a magic link to your email. Click it to sign in.'
                    : 'हामीले तपाईंको इमेलमा म्यागिक लिङ्क पठायौं। साइन इन गर्न यसमा क्लिक गर्नुहोस्।'
                  }
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEmailSent(false)}
                  className="mt-2"
                >
                  {locale === 'en' ? 'Try different email' : 'फरक इमेल प्रयास गर्नुहोस्'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            {locale === 'en'
              ? 'By signing in, you agree to our Terms and Privacy Policy'
              : 'साइन इन गरेर, तपाईं हाम्रा सर्तहरू र गोपनीयता नीतिमा सहमत हुनुहुन्छ'
            }
          </p>
        </div>
      </div>
    </div>
  );
}