'use client';

import { useState } from 'react';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useFeatureCampaign } from '@/hooks/useAdmin';
import { formatCurrency, getProgressPercent, formatDate } from '@/utils/formatters';
import Pagination from '@/components/shared/Pagination';
import { useDebounce } from '@/hooks/useDebounce';
import { Button, Card, CardContent, Chip, Input, ProgressBar } from '@heroui/react';

export default function AdminCampaigns() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const featureCampaign = useFeatureCampaign();

  const { data, isLoading } = useCampaigns({ page, limit: 10, search: debouncedSearch, status: '' });
  const campaigns = data?.campaigns || [];
  const pagination = data?.pagination || { pages: 1, page: 1 };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Manage Campaigns</h1>

      <Input
        placeholder="Search campaigns..."
        value={search}
        onValueChange={setSearch}
        className="max-w-md"
      />

      <div className="space-y-3">
        {campaigns.map((c) => (
          <Card key={c._id}>
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4">
              {c.images?.[0] ? (
                <img src={c.images[0]} alt="" className="w-14 h-14 rounded-lg object-cover" />
              ) : (
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{c.title}</p>
                <div className="mt-1 max-w-xs">
                  <ProgressBar value={getProgressPercent(c.currentAmount, c.goalAmount)} size="sm" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(c.currentAmount)} / {formatCurrency(c.goalAmount)} &middot; Created {formatDate(c.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Chip size="sm" color={c.status === 'active' ? 'success' : 'default'} variant="flat">
                  {c.status}
                </Chip>
                <Button
                  size="sm"
                  variant={c.featured ? 'solid' : 'bordered'}
                  color={c.featured ? 'warning' : 'default'}
                  onPress={() => featureCampaign.mutate(c._id)}
                >
                  {c.featured ? '★ Featured' : 'Feature'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={setPage} />
    </div>
  );
}
