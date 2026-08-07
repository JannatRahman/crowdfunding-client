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

const LIMIT_OPTIONS = [5, 10, 20, 50];

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[...Array(5)].map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export default function SupporterContributions() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useMyContributions({ page, limit });
  const contributions = data?.contributions || [];
  const pagination = data?.pagination || { pages: 1, page: 1, total: 0, limit };

  // Compute display range (e.g. "Showing 1–10 of 35")
  const rangeStart = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const rangeEnd = Math.min(pagination.page * pagination.limit, pagination.total);

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1); // reset to first page when page size changes
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">My Contributions</h1>

        {/* Items-per-page selector */}
        {(pagination.total > 0 || isLoading) && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <label htmlFor="limit-select" className="whitespace-nowrap font-medium">
              Rows per page:
            </label>
            <select
              id="limit-select"
              value={limit}
              onChange={handleLimitChange}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              {LIMIT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {isLoading ? (
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
              <tbody className="divide-y divide-gray-200 bg-white">
                {[...Array(limit)].map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : contributions.length === 0 ? (
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

          {/* Footer: result count + pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Showing{' '}
              <span className="font-semibold text-gray-700">
                {rangeStart}–{rangeEnd}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-gray-700">{pagination.total}</span>{' '}
              contribution{pagination.total !== 1 ? 's' : ''}
            </p>

            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
