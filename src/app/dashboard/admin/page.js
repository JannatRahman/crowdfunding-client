'use client';

import { useAdminStats } from '@/hooks/useAdmin';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Card, CardContent } from '@heroui/react';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants';

export default function AdminDashboard() {
  const { data, isLoading } = useAdminStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of the platform</p>
      </div>

      <DashboardStats data={data} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Campaigns</h2>
              <Link href={ROUTES.ADMIN_CAMPAIGNS} className="text-sm text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {(data?.recentCampaigns || []).map((c) => (
                <div key={c._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm">
                    🚀
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{c.title}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(c.currentAmount)} raised</p>
                  </div>
                </div>
              ))}
              {(!data?.recentCampaigns || data.recentCampaigns.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">No campaigns yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Contributions</h2>
            </div>
            <div className="space-y-3">
              {(data?.recentContributions || []).map((c) => (
                <div key={c._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm font-medium">
                    💰
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{c.amount} contributed</p>
                    <p className="text-xs text-gray-500">{formatDate(c.createdAt)}</p>
                  </div>
                </div>
              ))}
              {(!data?.recentContributions || data.recentContributions.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">No contributions yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
