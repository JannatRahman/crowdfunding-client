'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/providers/AuthProvider';
import { authClient } from '@/lib/auth-client';
import { ROUTES, ROLES } from '@/utils/constants';
import NotificationBell from '@/components/dashboard/NotificationBell';
import Logo from '@/components/shared/Logo';

const navItems = [
  { label: 'Home', href: ROUTES.HOME },
  { label: 'Explore Campaigns', href: ROUTES.CAMPAIGNS },
];

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

  const isActive = (href) =>
    href === ROUTES.HOME ? pathname === href : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-cf-cream/85 backdrop-blur-xl border-b border-cf-tan/70 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Logo />

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    active
                      ? 'text-cf-dark'
                      : 'text-cf-brown hover:text-cf-dark hover:bg-white/60'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 bg-white/70 border border-cf-tan/60 rounded-xl"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  href={ROUTES.LOGIN}
                  className="px-4 py-2 text-sm font-semibold text-cf-brown hover:text-cf-dark rounded-xl transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href={ROUTES.REGISTER}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-cf-dark hover:bg-black rounded-xl shadow-sm transition-all hover:shadow-md hover:-translate-y-px"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                {/* Available Credits */}
                <div className="flex items-center gap-2 px-3.5 py-2 bg-white/70 border border-green-200 rounded-xl text-green-700 font-semibold shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-90">
                    Credits
                  </span>
                  <span className="text-sm font-extrabold">${user?.credits ?? 0}</span>
                </div>

                {/* Vertical Divider */}
                <div className="h-6 w-px bg-cf-tan/80" />

                {/* Notifications */}
                <div className="flex items-center">
                  <NotificationBell />
                </div>

                {/* User Profile Card */}
                <Link
                  href={dashboardLink()}
                  className="flex items-center gap-2.5 pl-1 pr-2.5 py-1.5 rounded-2xl border border-transparent hover:border-cf-tan hover:bg-white/70 transition-all"
                >
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-cf-tan"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cf-brown to-cf-tan flex items-center justify-center text-cf-dark font-bold text-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="flex flex-col leading-tight text-left">
                    <span className="text-sm font-bold text-cf-dark line-clamp-1 max-w-[110px]">
                      {user?.name}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cf-brown">
                      {role || 'Supporter'}
                    </span>
                  </div>
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-cf-brown hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Logout"
                  aria-label="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl text-cf-dark hover:bg-white/60 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-cf-cream border-t border-cf-tan/70"
          >
            <div className="px-4 py-5 space-y-1.5">
              {!isAuthenticated ? (
                <>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        isActive(item.href)
                          ? 'bg-white/70 text-cf-dark'
                          : 'text-cf-brown hover:bg-white/60 hover:text-cf-dark'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="pt-3 mt-3 border-t border-cf-tan/60 flex gap-3">
                    <Link
                      href={ROUTES.LOGIN}
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center px-4 py-2.5 text-sm font-bold text-cf-brown border border-cf-tan rounded-xl hover:bg-white/60 transition-colors"
                    >
                      Log In
                    </Link>
                    <Link
                      href={ROUTES.REGISTER}
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center px-4 py-2.5 text-sm font-bold text-white bg-cf-dark hover:bg-black rounded-xl transition-colors"
                    >
                      Get Started
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="px-3 py-3 flex items-center gap-3 rounded-xl bg-white/60 border border-cf-tan/50 mb-2">
                    {user?.image ? (
                      <img src={user.image} alt={user.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-cf-tan" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cf-brown to-cf-tan flex items-center justify-center text-cf-dark font-bold">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-cf-dark truncate">{user?.name}</p>
                      <p className="text-[10px] uppercase font-bold text-cf-brown tracking-wider">{role}</p>
                      <p className="text-sm font-semibold text-green-600 mt-0.5">
                        Credits: ${user?.credits ?? 0}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={dashboardLink()}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-cf-brown hover:bg-white/60 hover:text-cf-dark transition-colors"
                  >
                    Dashboard Home
                  </Link>

                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        isActive(item.href)
                          ? 'bg-white/70 text-cf-dark'
                          : 'text-cf-brown hover:bg-white/60 hover:text-cf-dark'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}

                  <div className="flex items-center justify-between px-3 py-2.5">
                    <span className="text-sm font-semibold text-cf-brown">Notifications</span>
                    <NotificationBell />
                  </div>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2.5 text-sm font-bold text-red-600 bg-red-50/60 hover:bg-red-100 rounded-xl transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
