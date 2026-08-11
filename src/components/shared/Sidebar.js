'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { authClient } from '@/lib/auth-client';
import { ROUTES } from '@/utils/constants';
import { motion } from 'framer-motion';

export function Icon({ name }) {  const paths = {
    home: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    explore: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    heart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
    card: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h.01M7 15h-2m16-6a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V9z" />,
    history: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />,
    plus: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />,
    clipboard: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    wallet: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />,
    users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
    flag: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />,
    logout: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />,
  };
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  );
};

export const supporterLinks = [
  { href: ROUTES.SUPPORTER_DASHBOARD, label: 'Home', icon: 'home' },
  { href: ROUTES.CAMPAIGNS, label: 'Explore Campaigns', icon: 'explore' },
  { href: ROUTES.SUPPORTER_CONTRIBUTIONS, label: 'My Contributions', icon: 'heart' },
  { href: ROUTES.SUPPORTER_PURCHASE_CREDIT, label: 'Purchase Credit', icon: 'card' },
  { href: ROUTES.SUPPORTER_PAYMENT_HISTORY, label: 'Payment History', icon: 'history' },
];

export const creatorLinks = [
  { href: ROUTES.CREATOR_DASHBOARD, label: 'Home', icon: 'home' },
  { href: ROUTES.CREATOR_NEW_CAMPAIGN, label: 'Add New Campaign', icon: 'plus' },
  { href: ROUTES.CREATOR_CAMPAIGNS, label: 'My Campaigns', icon: 'clipboard' },
  { href: ROUTES.CREATOR_WITHDRAWALS, label: 'Withdrawals', icon: 'wallet' },
  { href: ROUTES.CREATOR_PAYMENT_HISTORY, label: 'Payment History', icon: 'history' },
];

export const adminLinks = [
  { href: ROUTES.ADMIN_DASHBOARD, label: 'Home', icon: 'home' },
  { href: ROUTES.ADMIN_USERS, label: 'Manage Users', icon: 'users' },
  { href: ROUTES.ADMIN_CAMPAIGNS, label: 'Manage Campaigns', icon: 'clipboard' },
  { href: ROUTES.ADMIN_WITHDRAWALS, label: 'Withdrawal Requests', icon: 'wallet' },
  { href: ROUTES.ADMIN_REPORTS, label: 'Reports', icon: 'flag' },
];

const ROLE_LABELS = { admin: 'Admin', creator: 'Creator', supporter: 'Supporter' };
const ROLE_BADGES = {
  admin: 'bg-[#7A2E0E] text-[#FFF8E7]',
  creator: 'bg-cf-dark text-cf-cream',
  supporter: 'bg-[#A16207] text-[#FFF8E7]',
};

export function isActive(pathname, href) {
  if (pathname === href) return true;
  return pathname.startsWith(href + '/');
}

export default function Sidebar() {
  const { user, role } = useAuth();
  const pathname = usePathname() || '';
  const router = useRouter();

  const links = role === 'admin' ? adminLinks : role === 'creator' ? creatorLinks : supporterLinks;

  // Longest-prefix match so nested routes (e.g. /creator/campaigns/new) only
  // highlight their most specific nav item.
  let activeHref;
  let bestLen = -1;
  for (const link of links) {
    if (isActive(pathname, link.href) && link.href.length > bestLen) {
      bestLen = link.href.length;
      activeHref = link.href;
    }
  }

  const initials = (user?.name || user?.email || '?').charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      localStorage.removeItem('access-token');
    } catch (_) {}
    await authClient.signOut();
    router.push(ROUTES.HOME);
    router.refresh();
  };

  return (
    <aside className="w-64 bg-white border-r border-cf-tan min-h-[calc(100vh-64px)] p-4 hidden lg:flex flex-col shadow-sm">
      {/* Profile card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cf-dark via-[#4A2E20] to-cf-brown p-5 mb-4">
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-cf-cream/10" />
        <div className="absolute -bottom-8 -left-4 w-20 h-20 rounded-full bg-cf-tan/20" />
        <div className="relative flex items-center gap-3">
          {user?.image ? (
            <img src={user.image} alt={user?.name || 'User'} className="w-11 h-11 rounded-full object-cover border-2 border-cf-cream/40" />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cf-tan to-cf-cream flex items-center justify-center text-lg font-black text-cf-dark border-2 border-cf-cream/40">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-cf-cream truncate">{user?.name || 'Guest User'}</p>
            <p className="text-[11px] font-semibold text-cf-tan truncate">{user?.email || ''}</p>
          </div>
        </div>
        <span className={`relative mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${ROLE_BADGES[role] || ROLE_BADGES.supporter}`}>
          {ROLE_LABELS[role] || 'Member'}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const active = link.href === activeHref;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                active ? 'text-cf-dark' : 'text-cf-brown hover:text-cf-dark hover:bg-cf-cream/60'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-cf-cream rounded-xl border border-cf-tan/50"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className={`relative z-10 ${active ? 'text-cf-brown' : ''}`}>
                <Icon name={link.icon} />
              </span>
              <span className="relative z-10">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-4 flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-cf-brown hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
      >
        <Icon name="logout" />
        Log Out
      </button>
    </aside>
  );
}
