'use client';

import { useMyContributions } from '@/hooks/useContributions';
import { formatCurrency, formatDate } from '@/utils/formatters';
import EmptyState from '@/components/shared/EmptyState';
import Pagination from '@/components/shared/Pagination';
import { useState } from 'react';

const getStatusStyles = (status) => {
  switch (status) {
    case 'approved':
    case 'completed':
      return {
        backgroundColor: 'hsl(142, 70%, 95%)',
        color: 'hsl(142, 76%, 30%)',
        borderColor: 'hsl(142, 70%, 85%)',
      };
    case 'pending':
      return {
        backgroundColor: 'hsl(48, 96%, 95%)',
        color: 'hsl(48, 96%, 25%)',
        borderColor: 'hsl(48, 96%, 85%)',
      };
    case 'rejected':
    case 'refunded':
      return {
        backgroundColor: 'hsl(0, 84%, 96%)',
        color: 'hsl(0, 84%, 35%)',
        borderColor: 'hsl(0, 84%, 88%)',
      };
    default:
      return {
        backgroundColor: 'hsl(215, 15%, 95%)',
        color: 'hsl(215, 15%, 35%)',
        borderColor: 'hsl(215, 15%, 85%)',
      };
  }
};

export default function SupporterContributions() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyContributions({ page, limit: 10 });
  const contributions = data?.contributions || [];
  const pagination = data?.pagination || { pages: 1, page: 1 };

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Loading contributions...</div>;
  }

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
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead className="bg-gray-50 text-gray-700 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Campaign Title</th>
                    <th className="px-6 py-4">Contributed Amount</th>
                    <th className="px-6 py-4">Creator Name</th>
                    <th className="px-6 py-4">Contributed Date</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-900 bg-white">
                  {contributions.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium">
                        {c.campaignTitle || c.campaign?.title || 'Campaign'}
                      </td>
                      <td className="px-6 py-4 text-green-600 font-semibold">
                        {formatCurrency(c.amount || c.Contribution_amount || 0)}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {c.creator_name || c.campaign?.creatorName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {formatDate(c.createdAt || c.current_date)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border capitalize"
                          style={getStatusStyles(c.status)}
                        >
                          {c.status}
                        </span>
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
    </div>
  );
}
