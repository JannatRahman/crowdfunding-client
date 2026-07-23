'use client';

import { useAdminStats } from '@/hooks/useAdmin';
import { formatCurrency } from '@/utils/formatters';
import { Card, CardBody } from '@heroui/react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const stats = [
  { key: 'totalUsers', label: 'Total Users', icon: '👥', color: 'bg-blue-50 text-blue-600' },
  { key: 'totalCampaigns', label: 'Total Campaigns', icon: '📋', color: 'bg-purple-50 text-purple-600' },
  { key: 'activeCampaigns', label: 'Active Campaigns', icon: '🟢', color: 'bg-green-50 text-green-600' },
  { key: 'fundedCampaigns', label: 'Funded Campaigns', icon: '✅', color: 'bg-emerald-50 text-emerald-600' },
  { key: 'totalContributions', label: 'Total Raised', icon: '💰', color: 'bg-yellow-50 text-yellow-600', isCurrency: true },
  { key: 'totalBackers', label: 'Total Backers', icon: '💝', color: 'bg-pink-50 text-pink-600' },
  { key: 'pendingWithdrawals', label: 'Pending Withdrawals', icon: '⏳', color: 'bg-orange-50 text-orange-600' },
  { key: 'pendingReports', label: 'Pending Reports', icon: '⚠️', color: 'bg-red-50 text-red-600' },
];

export default function DashboardStats({ data, isLoading }) {
  if (isLoading) return <LoadingSpinner />;

  const statsData = data?.stats || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.key}>
          <CardBody className="flex flex-row items-center gap-4 p-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900">
                {stat.isCurrency
                  ? formatCurrency(statsData[stat.key] || 0)
                  : (statsData[stat.key] || 0).toLocaleString()
                }
              </p>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
