'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { authClient } from '@/lib/auth-client';
import { ROUTES } from '@/utils/constants';
import { Button } from '@heroui/react';
import NotificationBell from '@/components/dashboard/NotificationBell';

export default function Navbar() {
  const { user, isAuthenticated, role } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push(ROUTES.LOGIN);
  };

  const dashboardLink = () => {
    if (role === ROLES.ADMIN) return ROUTES.ADMIN_DASHBOARD;
    if (role === ROLES.CREATOR) return ROUTES.CREATOR_DASHBOARD;
    return ROUTES.SUPPORTER_DASHBOARD;
  };

  const ROLES = { ADMIN: 'admin', CREATOR: 'creator', SUPPORTER: 'supporter' };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-bold text-xl text-gray-900">CrowdFund</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href={ROUTES.CAMPAIGNS} className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Explore
            </Link>

            {isAuthenticated ? (
              <>
                <NotificationBell />
                <Link href={dashboardLink()}>
                  <Button variant="light" size="sm">Dashboard</Button>
                </Link>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <Button color="danger" variant="light" size="sm" onPress={handleLogout}>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href={ROUTES.LOGIN}>
                  <Button variant="light" size="sm">Login</Button>
                </Link>
                <Link href={ROUTES.REGISTER}>
                  <Button color="primary" size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link href={ROUTES.CAMPAIGNS} className="block py-2 text-gray-600 hover:text-gray-900">
              Explore Campaigns
            </Link>
            {isAuthenticated ? (
              <>
                <Link href={dashboardLink()} className="block py-2 text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <Button color="danger" variant="light" size="sm" onPress={handleLogout} className="w-full">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href={ROUTES.LOGIN}>
                  <Button variant="light" size="sm" className="w-full">Login</Button>
                </Link>
                <Link href={ROUTES.REGISTER}>
                  <Button color="primary" size="sm" className="w-full">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
