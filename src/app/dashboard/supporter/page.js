'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useMyContributions } from '@/hooks/useContributions';
import { formatCurrency, formatDate } from '@/utils/formatters';
import DashboardStats from '@/components/dashboard/DashboardStats';
import EmptyState from '@/components/shared/EmptyState';
import Pagination from '@/components/shared/Pagination';
import { Card, CardBody, Chip } from '@heroui/react';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants';

export default function SupporterDashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useMyContributions({ limit: 5 });
  const contributions = data?.contributions || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'Supporter'}!</h1>
        <p className="text-gray-500 mt-1">Here is an overview of your activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{data?.pagination?.total || 0}</p>
            <p className="text-sm text-gray-500">Total Contributions</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(contributions.reduce((sum, c) => sum + (c.paymentStatus === 'completed' ? c.amount : 0), 0))}
            </p>
            <p className="text-sm text-gray-500">Total Contributed</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">
              {new Set(contributions.map((c) => c.campaignId)).size}
            </p>
            <p className="text-sm text-gray-500">Campaigns Backed</p>
          </CardBody>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Contributions</h2>
        {contributions.length === 0 ? (
          <EmptyState
            icon="💝"
            title="No contributions yet"
            description="Start supporting amazing campaigns!"
            action={
              <Link href={ROUTES.CAMPAIGNS}>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                  Explore Campaigns
                </button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {contributions.map((c) => (
              <Card key={c._id}>
                <CardBody className="flex flex-row items-center gap-4 p-4">
                  {c.campaign?.image ? (
                    <img src={c.campaign.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white">
                      🚀
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{c.campaign?.title || 'Campaign'}</p>
                    <p className="text-sm text-gray-500">{formatDate(c.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{formatCurrency(c.amount)}</p>
                    <Chip
                      size="sm"
                      color={c.paymentStatus === 'completed' ? 'success' : c.paymentStatus === 'pending' ? 'warning' : 'danger'}
                      variant="flat"
                    >
                      {c.paymentStatus}
                    </Chip>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
