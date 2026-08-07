'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { authClient } from '@/lib/auth-client';
import { ROUTES, ROLES } from '@/utils/constants';

export default function Navbar() {
  const { user, isAuthenticated, role } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    localStorage.removeItem('access-token');
    router.push(ROUTES.LOGIN);
  };

  const dashboardLink = () => {
    if (role === ROLES.ADMIN) return ROUTES.ADMIN_DASHBOARD;
    if (role === ROLES.CREATOR) return ROUTES.CREATOR_DASHBOARD;
    return ROUTES.SUPPORTER_DASHBOARD;
  };

  return (
    <nav className="sticky top-0 z-50 bg-cf-cream/90 backdrop-blur-md border-b border-cf-tan shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href={ROUTES.HOME} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cf-dark rounded-xl flex items-center justify-center shadow-md">
              <span className="text-cf-cream font-bold text-lg font-serif">C</span>
            </div>
            <span className="font-bold text-2xl text-cf-dark tracking-tight">CrowdFund</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {!isAuthenticated ? (
              <>
                <Link href={ROUTES.CAMPAIGNS} className="text-cf-brown hover:text-cf-dark font-medium transition-colors">
                  Explore Campaigns
                </Link>
                <Link href={ROUTES.LOGIN} className="text-cf-brown hover:text-cf-dark font-medium transition-colors">
                  Login
                </Link>
                <Link href={ROUTES.REGISTER} className="px-5 py-2.5 bg-cf-brown hover:bg-cf-dark text-white rounded-lg font-medium transition-all shadow-sm">
                  Register
                </Link>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 border-2 border-cf-dark text-cf-dark hover:bg-cf-dark hover:text-white rounded-lg font-medium transition-all">
                  Join as Developer
                </a>
              </>
            ) : (
              <>
                <Link href={dashboardLink()} className="text-cf-brown hover:text-cf-dark font-medium transition-colors">
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-cf-tan rounded-full">
                  <span className="text-sm text-cf-brown font-medium">Credits:</span>
                  <span className="text-sm font-bold text-cf-dark">{user?.credits || 0}</span>
                </div>
                <div className="flex items-center gap-3 ml-2 border-l border-cf-tan pl-6">
                  {user?.image ? (
                    <img src={user.image} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-cf-tan shadow-sm" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-cf-brown flex items-center justify-center text-cf-cream text-sm font-bold shadow-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="font-medium text-cf-dark hidden lg:block">{user?.name}</span>
                </div>
                <button onClick={handleLogout} className="text-sm font-medium text-red-700 hover:text-red-900 transition-colors ml-4">
                  Logout
                </button>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="ml-4 px-4 py-2 bg-cf-dark text-cf-cream hover:bg-cf-brown rounded-lg font-medium transition-colors shadow-sm text-sm">
                  Join as Developer
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-cf-dark"
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

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-6 space-y-4 pt-2 border-t border-cf-tan">
            {!isAuthenticated ? (
              <>
                <Link href={ROUTES.CAMPAIGNS} className="block px-2 py-2 text-cf-brown font-medium">
                  Explore Campaigns
                </Link>
                <Link href={ROUTES.LOGIN} className="block px-2 py-2 text-cf-brown font-medium">
                  Login
                </Link>
                <Link href={ROUTES.REGISTER} className="block px-2 py-2 text-cf-dark font-bold">
                  Register
                </Link>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="block px-2 py-2 text-cf-brown font-medium">
                  Join as Developer
                </a>
              </>
            ) : (
              <>
                <div className="px-2 py-3 flex items-center gap-3 border-b border-cf-tan/50 mb-2">
                   {user?.image ? (
                    <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-cf-brown flex items-center justify-center text-cf-cream font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-cf-dark">{user?.name}</p>
                    <p className="text-sm text-cf-brown">Credits: {user?.credits || 0}</p>
                  </div>
                </div>
                <Link href={dashboardLink()} className="block px-2 py-2 text-cf-brown font-medium">
                  Dashboard
                </Link>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="block px-2 py-2 text-cf-brown font-medium">
                  Join as Developer
                </a>
                <button onClick={handleLogout} className="block w-full text-left px-2 py-2 text-red-700 font-medium mt-4">
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
