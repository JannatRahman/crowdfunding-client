'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { ROUTES } from '@/utils/constants';

const supporterLinks = [
  { href: ROUTES.SUPPORTER_DASHBOARD, label: 'Overview', icon: '📊' },
  { href: ROUTES.SUPPORTER_CONTRIBUTIONS, label: 'My Contributions', icon: '💝' },
  { href: ROUTES.SUPPORTER_SAVED, label: 'Saved', icon: '🔖' },
];

const creatorLinks = [
  { href: ROUTES.CREATOR_DASHBOARD, label: 'Overview', icon: '📊' },
  { href: ROUTES.CREATOR_CAMPAIGNS, label: 'My Campaigns', icon: '📋' },
  { href: ROUTES.CREATOR_NEW_CAMPAIGN, label: 'New Campaign', icon: '➕' },
  { href: ROUTES.CREATOR_WITHDRAWALS, label: 'Withdrawals', icon: '💰' },
];

const adminLinks = [
  { href: ROUTES.ADMIN_DASHBOARD, label: 'Overview', icon: '📊' },
  { href: ROUTES.ADMIN_USERS, label: 'Users', icon: '👥' },
  { href: ROUTES.ADMIN_CAMPAIGNS, label: 'Campaigns', icon: '📋' },
  { href: ROUTES.ADMIN_WITHDRAWALS, label: 'Withdrawals', icon: '💰' },
  { href: ROUTES.ADMIN_REPORTS, label: 'Reports', icon: '⚠️' },
  { href: ROUTES.ADMIN_NOTIFICATIONS, label: 'Notifications', icon: '🔔' },
];

export default function Sidebar() {
  const { role } = useAuth();
  const pathname = usePathname();

  const links = role === 'admin' ? adminLinks : role === 'creator' ? creatorLinks : supporterLinks;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4 hidden lg:block">
      <div className="mb-6 px-3">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
          {role} Dashboard
        </p>
      </div>
      <nav className="space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
