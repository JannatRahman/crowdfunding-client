'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { authClient } from '@/lib/auth-client';
import { ROUTES, ROLES } from '@/utils/constants';
import NotificationBell from '@/components/dashboard/NotificationBell';

export default function Navbar() {
  const { user, isAuthenticated, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
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

  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <nav className="sticky top-0 z-50 bg-cf-cream/90 backdrop-blur-md border-b border-cf-tan shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cf-dark rounded-xl flex items-center justify-center shadow-md">
              <span className="text-cf-cream font-bold text-lg font-serif">C</span>
            </div>
            <span className="font-bold text-2xl text-cf-dark tracking-tight">CrowdFund</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link href={ROUTES.CAMPAIGNS} className="text-cf-brown hover:text-cf-dark font-semibold transition-colors">
                  Explore Campaigns
                </Link>
                <Link href={ROUTES.LOGIN} className="text-cf-brown hover:text-cf-dark font-semibold transition-colors">
                  Login
                </Link>
                <Link href={ROUTES.REGISTER} className="px-5 py-2.5 bg-cf-brown hover:bg-cf-dark text-white rounded-xl font-semibold transition-all shadow-sm">
                  Register
                </Link>
              </>
            ) : (
              <>
                {/* Available Credits */}
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-green-700 font-semibold shadow-sm">
                  <span className="text-xs uppercase tracking-wider opacity-95">Credits</span>
                  <span className="text-md font-bold">${user?.credits !== undefined ? user.credits : 0}</span>
                </div>

                {/* Vertical Divider */}
                <div className="h-6 w-[1px] bg-cf-tan" />

                {/* User Image, User Role, User Name Profile Card */}
                <Link href={dashboardLink()} className="flex items-center gap-3 hover:bg-white/40 p-2 rounded-xl transition-all duration-200 border border-transparent hover:border-cf-tan">
                  {user?.image ? (
                    <img 
                      src={user.image} 
                      alt={user.name} 
                      className="w-10 h-10 rounded-full object-cover border-2 border-cf-tan shadow-sm" 
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-cf-brown flex items-center justify-center text-cf-cream font-bold shadow-sm border border-cf-tan">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-sm text-cf-dark line-clamp-1">{user?.name}</span>
                    <span className="text-[10px] uppercase font-bold text-cf-brown tracking-wider">{role || 'Supporter'}</span>
                  </div>
                </Link>

                {/* Vertical Divider */}
                <div className="h-6 w-[1px] bg-cf-tan" />

                {/* Notification */}
                <div className="flex items-center">
                  <NotificationBell />
                </div>

                {/* Logout Button */}
                <button 
                  onClick={handleLogout} 
                  className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-800 rounded-xl transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-cf-dark rounded-lg hover:bg-white/40"
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
          <div className="md:hidden pb-6 space-y-4 pt-2 border-t border-cf-tan animate-in fade-in slide-in-from-top duration-200">
            {!isAuthenticated ? (
              <>
                <Link href={ROUTES.CAMPAIGNS} className="block px-2 py-2 text-cf-brown font-semibold">
                  Explore Campaigns
                </Link>
                <Link href={ROUTES.LOGIN} className="block px-2 py-2 text-cf-brown font-semibold">
                  Login
                </Link>
                <Link href={ROUTES.REGISTER} className="block px-2 py-2.5 bg-cf-brown text-white text-center rounded-xl font-semibold">
                  Register
                </Link>
              </>
            ) : (
              <>
                <div className="px-2 py-3 flex items-center gap-3 border-b border-cf-tan/50 mb-2">
                  {user?.image ? (
                    <img src={user.image} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-cf-brown flex items-center justify-center text-cf-cream font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-cf-dark">{user?.name}</p>
                    <p className="text-xs uppercase font-bold text-cf-brown tracking-wider">{role}</p>
                    <p className="text-sm font-semibold text-green-600 mt-1">Credits: ${user?.credits || 0}</p>
                  </div>
                </div>
                
                <Link href={dashboardLink()} className="block px-2 py-2 text-cf-brown font-semibold hover:text-cf-dark">
                  Dashboard Home
                </Link>

                <div className="flex items-center justify-between px-2 py-2">
                  <span className="text-sm font-semibold text-cf-brown">Notifications</span>
                  <NotificationBell />
                </div>

                <button 
                  onClick={handleLogout} 
                  className="block w-full text-left px-2 py-2.5 text-red-600 font-semibold bg-red-50/50 rounded-xl"
                >
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
