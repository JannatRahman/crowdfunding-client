'use client';

import { useMyCampaigns, useDeleteCampaign, useUpdateCampaignStatus } from '@/hooks/useCampaigns';
import { formatCurrency, getProgressPercent, getDaysLeft, formatDate } from '@/utils/formatters';
import EmptyState from '@/components/shared/EmptyState';
import ConfirmModal from '@/components/shared/ConfirmModal';
import Pagination from '@/components/shared/Pagination';
import Link from 'next/link';
import { Button, Card, CardBody, Chip, Progress } from '@heroui/react';
import { useState } from 'react';
import { ROUTES } from '@/utils/constants';

export default function CreatorCampaigns() {
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const { data, isLoading } = useMyCampaigns({ page, limit: 10 });
  const deleteCampaign = useDeleteCampaign();
  const updateStatus = useUpdateCampaignStatus();
  const campaigns = data?.campaigns || [];
  const pagination = data?.pagination || { pages: 1, page: 1 };

  const handleDelete = () => {
    if (deleteId) {
      deleteCampaign.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Campaigns</h1>
        <Link href={ROUTES.CREATOR_NEW_CAMPAIGN}>
          <Button color="primary">+ New Campaign</Button>
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <EmptyState
          icon="🚀"
          title="No campaigns yet"
          description="Start your first campaign today!"
          action={
            <Link href={ROUTES.CREATOR_NEW_CAMPAIGN}>
              <Button color="primary">Create Campaign</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="space-y-3">
            {campaigns.map((c) => (
              <Card key={c._id}>
                <CardBody className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4">
                  {c.images?.[0] ? (
                    <img src={c.images[0]} alt="" className="w-16 h-16 rounded-lg object-cover" />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{c.title}</p>
                    <div className="mt-1 max-w-xs">
                      <Progress value={getProgressPercent(c.currentAmount, c.goalAmount)} size="sm" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatCurrency(c.currentAmount)} / {formatCurrency(c.goalAmount)} &middot; {getDaysLeft(c.endDate)} days left
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Chip size="sm" color={c.status === 'active' ? 'success' : 'default'} variant="flat">
                      {c.status}
                    </Chip>
                    <Link href={ROUTES.CREATOR_EDIT_CAMPAIGN(c._id)}>
                      <Button size="sm" variant="bordered">Edit</Button>
                    </Link>
                    {c.status === 'active' && (
                      <Button size="sm" variant="light" color="warning" onPress={() => updateStatus.mutate({ id: c._id, status: 'draft' })}>
                        Pause
                      </Button>
                    )}
                    {c.status === 'draft' && (
                      <Button size="sm" variant="light" color="success" onPress={() => updateStatus.mutate({ id: c._id, status: 'active' })}>
                        Resume
                      </Button>
                    )}
                    <Button size="sm" variant="light" color="danger" onPress={() => setDeleteId(c._id)}>
                      Delete
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
          <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={setPage} />
        </>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Campaign"
        message="Are you sure? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
