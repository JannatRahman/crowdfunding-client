'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { ROUTES } from '@/utils/constants';

export const supporterLinks = [
  { href: ROUTES.SUPPORTER_DASHBOARD, label: 'Home', icon: '🏠' },
  { href: ROUTES.CAMPAIGNS, label: 'Explore Campaigns', icon: '🔍' },
  { href: ROUTES.SUPPORTER_CONTRIBUTIONS, label: 'My Contributions', icon: '💝' },
  { href: ROUTES.SUPPORTER_PURCHASE_CREDIT, label: 'Purchase Credit', icon: '💳' },
  { href: ROUTES.SUPPORTER_PAYMENT_HISTORY, label: 'Payment History', icon: '📜' },
];

export const creatorLinks = [
  { href: ROUTES.CREATOR_DASHBOARD, label: 'Home', icon: '🏠' },
  { href: ROUTES.CREATOR_NEW_CAMPAIGN, label: 'Add New Campaign', icon: '➕' },
  { href: ROUTES.CREATOR_CAMPAIGNS, label: 'My Campaigns', icon: '📋' },
  { href: ROUTES.CREATOR_WITHDRAWALS, label: 'Withdrawals', icon: '💰' },
  { href: ROUTES.CREATOR_PAYMENT_HISTORY, label: 'Payment History', icon: '📜' },
];

export const adminLinks = [
  { href: ROUTES.ADMIN_DASHBOARD, label: 'Home', icon: '🏠' },
  { href: ROUTES.ADMIN_USERS, label: 'Manage Users', icon: '👥' },
  { href: ROUTES.ADMIN_CAMPAIGNS, label: 'Manage Campaigns', icon: '📋' },
  { href: ROUTES.ADMIN_WITHDRAWALS, label: 'Withdrawal Requests', icon: '💰' },
  { href: ROUTES.ADMIN_REPORTS, label: 'Reports', icon: '⚠️' },
];

export default function Sidebar() {
  const { role } = useAuth();
  const pathname = usePathname();

  const links = role === 'admin' ? adminLinks : role === 'creator' ? creatorLinks : supporterLinks;

  return (
    <aside className="w-64 bg-cf-cream border-r border-cf-tan min-h-[calc(100vh-64px)] p-6 hidden lg:block shadow-sm">
      <div className="mb-8 px-3">
        <p className="text-xs text-cf-brown uppercase tracking-wider font-bold">
          {role} Dashboard
        </p>
      </div>
      <nav className="space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== ROUTES.HOME && pathname.startsWith(link.href) && link.href !== ROUTES.DASHBOARD && !['/dashboard/supporter', '/dashboard/creator', '/dashboard/admin'].includes(link.href) && pathname !== link.href);
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                pathname === link.href
                  ? 'bg-cf-dark text-cf-cream shadow-md'
                  : 'text-cf-brown hover:bg-white/60 hover:text-cf-dark'
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
