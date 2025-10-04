'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/auth';
import { Menu, X, Globe, Mountain, User, LogOut, Settings } from 'lucide-react';
import { toast } from 'sonner';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('navigation');
  const locale = useLocale();
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const otherLocale = locale === 'en' ? 'ne' : 'en';
  const otherLocaleName = locale === 'en' ? 'नेपाली' : 'English';

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(locale === 'en' ? 'Failed to sign out' : 'साइन आउट गर्न असफल');
    } else {
      toast.success(locale === 'en' ? 'Signed out successfully' : 'सफलतापूर्वक साइन आउट भयो');
      router.push(`/${locale}`);
    }
  };

  const handleSignIn = () => {
    router.push(`/${locale}/signin`);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-nepal-blue/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and primary nav */}
          <div className="flex items-center">
            <Link href={`/${locale}`} className="flex items-center space-x-2">
              <Mountain className="h-8 w-8 text-nepal-crimson" />
              <span className="text-xl font-bold text-nepal-blue">
                समस्या समाधान
              </span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              <Link
                href={`/${locale}`}
                className="text-gray-700 hover:text-nepal-crimson px-3 py-2 text-sm font-medium"
              >
                {t('home')}
              </Link>
              <Link
                href={`/${locale}/problems`}
                className="text-gray-700 hover:text-nepal-crimson px-3 py-2 text-sm font-medium"
              >
                {t('problems')}
              </Link>
              <Link
                href={`/${locale}/about`}
                className="text-gray-700 hover:text-nepal-crimson px-3 py-2 text-sm font-medium"
              >
                {t('about')}
              </Link>
              <Link
                href={`/${locale}/guidelines`}
                className="text-gray-700 hover:text-nepal-crimson px-3 py-2 text-sm font-medium"
              >
                {t('guidelines')}
              </Link>
            </div>
          </div>

          {/* Right side - Language switcher, Submit, Sign in */}
          <div className="flex items-center space-x-4">
            {/* Language switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/${otherLocale}`}>
                    {otherLocaleName}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Submit Problem Button */}
            <Button asChild className="hidden sm:flex">
              <Link href={`/${locale}/submit`}>
                {t('submit')}
              </Link>
            </Button>

            {/* Auth Section */}
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
                      <AvatarFallback>
                        {user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.user_metadata?.full_name || 'User'}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/${locale}/dashboard`}>
                      <User className="mr-2 h-4 w-4" />
                      <span>{t('dashboard')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('signOut')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" onClick={handleSignIn}>
                {t('signIn')}
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleMenu}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 pt-4 pb-4">
            <div className="space-y-2">
              <Link
                href={`/${locale}`}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-nepal-crimson"
                onClick={() => setIsOpen(false)}
              >
                {t('home')}
              </Link>
              <Link
                href={`/${locale}/problems`}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-nepal-crimson"
                onClick={() => setIsOpen(false)}
              >
                {t('problems')}
              </Link>
              <Link
                href={`/${locale}/submit`}
                className="block px-3 py-2 text-base font-medium text-nepal-crimson font-semibold"
                onClick={() => setIsOpen(false)}
              >
                {t('submit')}
              </Link>
              <Link
                href={`/${locale}/about`}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-nepal-crimson"
                onClick={() => setIsOpen(false)}
              >
                {t('about')}
              </Link>
              <Link
                href={`/${locale}/guidelines`}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-nepal-crimson"
                onClick={() => setIsOpen(false)}
              >
                {t('guidelines')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}