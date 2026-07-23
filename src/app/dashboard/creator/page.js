'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useMyCampaigns } from '@/hooks/useCampaigns';
import { formatCurrency, getProgressPercent, getDaysLeft, formatDate } from '@/utils/formatters';
import EmptyState from '@/components/shared/EmptyState';
import Link from 'next/link';
import { Button, Card, CardContent, Chip, ProgressBar } from '@heroui/react';
import { ROUTES } from '@/utils/constants';

export default function CreatorDashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useMyCampaigns({ limit: 10 });
  const campaigns = data?.campaigns || [];

  const totalRaised = campaigns.reduce((sum, c) => sum + c.currentAmount, 0);
  const totalBackers = campaigns.reduce((sum, c) => sum + (c.backersCount || 0), 0);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Creator Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your campaigns</p>
        </div>
        <Link href={ROUTES.CREATOR_NEW_CAMPAIGN}>
          <Button color="primary">+ New Campaign</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{campaigns.length}</p>
            <p className="text-sm text-gray-500">Total Campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{formatCurrency(totalRaised)}</p>
            <p className="text-sm text-gray-500">Total Raised</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{totalBackers}</p>
            <p className="text-sm text-gray-500">Total Backers</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">My Campaigns</h2>
        {campaigns.length === 0 ? (
          <EmptyState
            icon="🚀"
            title="No campaigns yet"
            description="Create your first campaign and start raising funds!"
            action={
              <Link href={ROUTES.CREATOR_NEW_CAMPAIGN}>
                <Button color="primary">Create Campaign</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {campaigns.map((c) => (
              <Card key={c._id}>
                <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4">
                  {c.images?.[0] ? (
                    <img src={c.images[0]} alt="" className="w-16 h-16 rounded-lg object-cover" />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white text-xl">
                      🚀
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{c.title}</p>
                    <p className="text-sm text-gray-500">Created {formatDate(c.createdAt)} &middot; {getDaysLeft(c.endDate)} days left</p>
                    <div className="mt-2 max-w-xs">
                      <ProgressBar value={getProgressPercent(c.currentAmount, c.goalAmount)} size="sm" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatCurrency(c.currentAmount)} of {formatCurrency(c.goalAmount)} &middot; {c.backersCount || 0} backers
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip
                      size="sm"
                      color={c.status === 'active' ? 'success' : c.status === 'funded' ? 'primary' : c.status === 'draft' ? 'default' : 'danger'}
                      variant="flat"
                    >
                      {c.status}
                    </Chip>
                    <Link href={ROUTES.CREATOR_EDIT_CAMPAIGN(c._id)}>
                      <Button size="sm" variant="bordered">Edit</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
