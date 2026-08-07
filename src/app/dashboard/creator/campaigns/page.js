'use client';

import { useMyCampaigns, useDeleteCampaign } from '@/hooks/useCampaigns';
import { formatCurrency, getProgressPercent, getDaysLeft, formatDate } from '@/utils/formatters';
import EmptyState from '@/components/shared/EmptyState';
import ConfirmModal from '@/components/shared/ConfirmModal';
import Pagination from '@/components/shared/Pagination';
import Link from 'next/link';
import { Button, Card, CardContent, Chip, ProgressBar } from '@heroui/react';
import { useState } from 'react';
import { ROUTES } from '@/utils/constants';

export default function CreatorCampaigns() {
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const { data, isLoading } = useMyCampaigns({ page, limit: 10 });
  const deleteCampaign = useDeleteCampaign();
  const campaigns = data?.campaigns || [];
  const pagination = data?.pagination || { pages: 1, page: 1 };

  const handleDelete = () => {
    if (deleteId) {
      deleteCampaign.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-cf-dark tracking-tight">My Campaigns</h1>
          <p className="text-cf-brown font-medium mt-1">Manage and update your campaigns or request deletions</p>
        </div>
        <Link href={ROUTES.CREATOR_NEW_CAMPAIGN}>
          <Button className="bg-cf-dark hover:bg-[#3A2A2A] text-cf-cream font-bold px-6 py-5.5 rounded-xl shadow-md transition-all">
            + New Campaign
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-cf-brown font-semibold bg-white rounded-3xl border border-cf-tan">
          Loading campaigns...
        </div>
      ) : campaigns.length === 0 ? (
        <EmptyState
          icon="🚀"
          title="No campaigns yet"
          description="Start raising credits by launching your first campaign today!"
          action={
            <Link href={ROUTES.CREATOR_NEW_CAMPAIGN}>
              <Button className="bg-cf-dark hover:bg-[#3A2A2A] text-cf-cream font-bold rounded-xl px-6 py-3">
                Create Campaign
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="bg-white rounded-3xl border border-cf-tan shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-cf-tan/35 text-left text-sm">
                <thead className="bg-cf-cream/40 text-cf-dark font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4.5">Campaign Details</th>
                    <th className="px-6 py-4.5">Category</th>
                    <th className="px-6 py-4.5">Goal & Raised</th>
                    <th className="px-6 py-4.5">Deadline</th>
                    <th className="px-6 py-4.5">Status</th>
                    <th className="px-6 py-4.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cf-tan/20 font-medium text-cf-dark bg-white">
                  {campaigns.map((c) => (
                    <tr key={c._id} className="hover:bg-cf-cream/10 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {c.images?.[0] ? (
                            <img src={c.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover border border-cf-tan/50" />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-cf-tan to-cf-cream rounded-lg flex items-center justify-center text-lg border border-cf-tan/50">
                              📦
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-cf-dark truncate max-w-xs">{c.title}</p>
                            <p className="text-xs text-cf-brown truncate max-w-xs mt-0.5">{c.shortDescription}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap capitalize text-cf-brown">
                        {c.category}
                      </td>
                      <td className="px-6 py-4 min-w-[180px]">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-green-700">{formatCurrency(c.currentAmount)}</span>
                            <span className="text-cf-brown">/ {formatCurrency(c.goalAmount)}</span>
                          </div>
                          <ProgressBar 
                            value={getProgressPercent(c.currentAmount, c.goalAmount)} 
                            size="sm" 
                            className="text-green-600"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-cf-dark font-semibold">{formatDate(c.endDate)}</div>
                        <div className="text-xs text-cf-brown mt-0.5">{getDaysLeft(c.endDate)} days left</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Chip 
                          size="sm" 
                          color={c.status === 'active' || c.status === 'approved' ? 'success' : 'warning'} 
                          variant="flat"
                          className="font-bold capitalize"
                        >
                          {c.status}
                        </Chip>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center items-center gap-2">
                          <Link href={ROUTES.CREATOR_EDIT_CAMPAIGN(c._id)}>
                            <Button 
                              size="sm" 
                              className="bg-cf-dark text-cf-cream hover:bg-[#3A2A2A] font-bold rounded-lg shadow-sm"
                            >
                              Update
                            </Button>
                          </Link>
                          <Button 
                            size="sm" 
                            color="danger" 
                            variant="bordered"
                            className="font-bold rounded-lg border-2 hover:bg-red-50"
                            onPress={() => setDeleteId(c._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={setPage} />
        </>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Campaign"
        message="Are you sure you want to delete this campaign? This will remove the campaign and refund all approved backers their credit contributions. This action cannot be undone."
        confirmText="Delete Campaign"
        isLoading={deleteCampaign.isPending}
      />
    </div>
  );
}
