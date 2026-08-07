'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useMyContributions } from '@/hooks/useContributions';
import { formatCurrency, formatDate } from '@/utils/formatters';
import DashboardStats from '@/components/dashboard/DashboardStats';
import EmptyState from '@/components/shared/EmptyState';
import Pagination from '@/components/shared/Pagination';
import { Card, CardContent, Chip } from '@heroui/react';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants';

export default function SupporterDashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useMyContributions({ limit: 100 });
  const contributions = data?.contributions || [];
  const approvedContributions = contributions.filter(c => c.status === 'approved');

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'Supporter'}!</h1>
        <p className="text-gray-500 mt-1">Here is an overview of your activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{data?.stats?.totalContributions || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Total Contributions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{data?.stats?.totalPendingContributions || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Total Pending Contributions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(data?.stats?.totalAmountContributed || 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total Amount Contributed</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Approved Contributions</h2>
        {approvedContributions.length === 0 ? (
          <EmptyState
            icon="💝"
            title="No approved contributions yet"
            description="Start supporting amazing campaigns!"
            action={
              <Link href={ROUTES.CAMPAIGNS}>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 cursor-pointer">
                  Explore Campaigns
                </button>
              </Link>
            }
          />
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead className="bg-gray-50 text-gray-700 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Campaign Title</th>
                    <th className="px-6 py-4">Contribution Amount</th>
                    <th className="px-6 py-4">Creator Name</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-900 bg-white">
                  {approvedContributions.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium">{c.campaignTitle || c.campaign?.title || 'Campaign'}</td>
                      <td className="px-6 py-4 text-green-600 font-semibold">{formatCurrency(c.amount || c.Contribution_amount || 0)}</td>
                      <td className="px-6 py-4 text-gray-500">{c.creator_name || c.campaign?.creatorName || 'N/A'}</td>
                      <td className="px-6 py-4 text-center">
                        <Chip
                          size="sm"
                          color="success"
                          variant="flat"
                          className="capitalize"
                        >
                          {c.status}
                        </Chip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
