'use client';

import { useState } from 'react';
import { useAdminReports, useUpdateReport } from '@/hooks/useAdmin';
import { formatDate } from '@/utils/formatters';
import Pagination from '@/components/shared/Pagination';
import { Button, Card, CardContent, Chip, TextArea } from '@heroui/react';

const statusItems = [
  { key: '', label: 'All Statuses' },
  { key: 'pending', label: 'Pending' },
  { key: 'reviewed', label: 'Reviewed' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'dismissed', label: 'Dismissed' },
];

const statusColor = {
  pending: 'warning',
  reviewed: 'primary',
  resolved: 'success',
  dismissed: 'default',
};

export default function AdminReports() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [resolveId, setResolveId] = useState(null);
  const [resolveNote, setResolveNote] = useState('');
  const [resolveStatus, setResolveStatus] = useState('resolved');

  const { data } = useAdminReports({ page, limit: 10, status: statusFilter });
  const updateReport = useUpdateReport();
  const reports = data?.reports || [];
  const pagination = data?.pagination || { pages: 1, page: 1 };

  const handleResolve = () => {
    if (!resolveId) return;
    updateReport.mutate({ id: resolveId, status: resolveStatus, adminNote: resolveNote }, {
      onSuccess: () => { setResolveId(null); setResolveNote(''); },
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reports</h1>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="w-48 p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {statusItems.map((s) => (
          <option key={s.key} value={s.key}>{s.label}</option>
        ))}
      </select>

      {reports.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No reports found</p>
      ) : (
        <>
          <div className="space-y-3">
            {reports.map((r) => (
              <Card key={r._id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {r.targetType} report &middot; {r.reason}
                      </p>
                      <p className="text-sm text-gray-500">
                        By {r.reporter?.name || 'Unknown'} &middot; {formatDate(r.createdAt)}
                      </p>
                      {r.target?.title && (
                        <p className="text-xs text-gray-400 mt-1">Target: {r.target.title}</p>
                      )}
                    </div>
                    <Chip size="sm" color={statusColor[r.status]} variant="flat">
                      {r.status}
                    </Chip>
                  </div>
                  {r.description && (
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{r.description}</p>
                  )}
                  {r.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" color="success" onPress={() => { setResolveId(r._id); setResolveStatus('resolved'); }}>
                        Resolve
                      </Button>
                      <Button size="sm" variant="bordered" onPress={() => { setResolveId(r._id); setResolveStatus('dismissed'); }}>
                        Dismiss
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={setPage} />
        </>
      )}

      {resolveId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 space-y-4">
            <h3 className="text-lg font-semibold">Update Report</h3>
            <TextArea
              placeholder="Admin note (optional)"
              value={resolveNote}
              onValueChange={setResolveNote}
              minRows={3}
            />
            <div className="flex justify-end gap-2">
              <Button variant="light" onPress={() => setResolveId(null)}>Cancel</Button>
              <Button color={resolveStatus === 'resolved' ? 'success' : 'default'} onPress={handleResolve}>
                {resolveStatus === 'resolved' ? 'Mark Resolved' : 'Dismiss'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
