'use client';

import { useState } from 'react';
import { useMyWithdrawals } from '@/hooks/useWithdrawals';
import { useMyCampaigns } from '@/hooks/useCampaigns';
import WithdrawalForm from '@/components/dashboard/WithdrawalForm';
import EmptyState from '@/components/shared/EmptyState';
import Pagination from '@/components/shared/Pagination';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Button, Card, CardContent, Chip } from '@heroui/react';

export default function CreatorWithdrawals() {
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const { data, isLoading } = useMyWithdrawals({ page, limit: 10 });
  const { data: campaignData } = useMyCampaigns({});
  const withdrawals = data?.withdrawals || [];
  const pagination = data?.pagination || { pages: 1, page: 1 };
  const campaigns = campaignData?.campaigns || [];

  const statusColor = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
    completed: 'success',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Withdrawals</h1>
        <Button color="primary" onPress={() => setFormOpen(true)}>Request Withdrawal</Button>
      </div>

      {withdrawals.length === 0 ? (
        <EmptyState
          icon="💰"
          title="No withdrawals yet"
          description="When you request a withdrawal, it will appear here"
        />
      ) : (
        <>
          <div className="space-y-3">
            {withdrawals.map((w) => (
              <Card key={w._id}>
                <CardContent className="flex flex-row items-center gap-4 p-4">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{w.campaign?.title || 'Campaign'}</p>
                    <p className="text-sm text-gray-500">{formatDate(w.createdAt)}</p>
                    {w.adminNote && <p className="text-xs text-gray-400 mt-1">Note: {w.adminNote}</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(w.amount)}</p>
                    <Chip size="sm" color={statusColor[w.status]} variant="flat">
                      {w.status}
                    </Chip>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={setPage} />
        </>
      )}

      <WithdrawalForm campaigns={campaigns} isOpen={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}
