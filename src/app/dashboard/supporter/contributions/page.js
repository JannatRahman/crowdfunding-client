'use client';

import { useMyContributions } from '@/hooks/useContributions';
import { formatCurrency, formatDate } from '@/utils/formatters';
import EmptyState from '@/components/shared/EmptyState';
import Pagination from '@/components/shared/Pagination';
import { Card, CardContent, Chip } from '@heroui/react';
import { useState } from 'react';

export default function SupporterContributions() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyContributions({ page, limit: 10 });
  const contributions = data?.contributions || [];
  const pagination = data?.pagination || { pages: 1, page: 1 };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Contributions</h1>

      {contributions.length === 0 ? (
        <EmptyState
          icon="💝"
          title="No contributions yet"
          description="Your contribution history will appear here"
        />
      ) : (
        <>
          <div className="space-y-3">
            {contributions.map((c) => (
              <Card key={c._id}>
                <CardContent className="flex flex-row items-center gap-4 p-4">
                  {c.campaign?.image ? (
                    <img src={c.campaign.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{c.campaign?.title || 'Campaign'}</p>
                    <p className="text-sm text-gray-500">{formatDate(c.createdAt)}</p>
                    {c.message && <p className="text-xs text-gray-400 mt-0.5">&quot;{c.message}&quot;</p>}
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
                </CardContent>
              </Card>
            ))}
          </div>
          <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
