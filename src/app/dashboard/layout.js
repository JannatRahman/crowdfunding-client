'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar, { supporterLinks, creatorLinks, adminLinks } from '@/components/shared/Sidebar';
import { PageLoader } from '@/components/shared/LoadingSpinner';
import { ROUTES } from '@/utils/constants';
import Link from 'next/link';

export default function DashboardLayout({ children }) {
  const { user, isLoading, isAuthenticated, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) setTimedOut(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading && !timedOut) return <PageLoader />;

  if (timedOut && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <p className="text-gray-600">Unable to verify your session.</p>
          <button
            onClick={() => window.location.href = ROUTES.LOGIN}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const links = role === 'admin' ? adminLinks : role === 'creator' ? creatorLinks : supporterLinks;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Mobile Horizontal Sub-Navigation */}
      <div className="lg:hidden flex overflow-x-auto gap-2 py-3.5 px-4 bg-cf-cream border-b border-cf-tan shadow-sm scrollbar-none sticky top-20 z-40">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cf-dark text-cf-cream shadow-sm'
                  : 'text-cf-brown bg-white/40 hover:bg-white/70 border border-cf-tan/30'
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Page Content */}
      <div className="flex-1 p-6 lg:p-8 overflow-auto bg-cf-cream/30">
        {children}
      </div>
    </div>
  );
}
