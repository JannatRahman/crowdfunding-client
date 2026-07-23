'use client';

import { useState } from 'react';
import { usePendingWithdrawals, useApproveWithdrawal, useRejectWithdrawal } from '@/hooks/useWithdrawals';
import { formatCurrency, formatDate } from '@/utils/formatters';
import Pagination from '@/components/shared/Pagination';
import ConfirmModal from '@/components/shared/ConfirmModal';
import { Button, Card, CardBody, Chip, Textarea } from '@heroui/react';

export default function AdminWithdrawals() {
  const [page, setPage] = useState(1);
  const [actionId, setActionId] = useState(null);
  const [actionType, setActionType] = useState('');
  const [adminNote, setAdminNote] = useState('');

  const { data, isLoading } = usePendingWithdrawals({ page, limit: 20 });
  const approve = useApproveWithdrawal();
  const reject = useRejectWithdrawal();
  const withdrawals = data?.withdrawals || [];
  const pagination = data?.pagination || { pages: 1, page: 1 };

  const handleAction = () => {
    if (!actionId) return;
    const payload = { id: actionId, adminNote };
    if (actionType === 'approve') {
      approve.mutate(payload, { onSuccess: () => { setActionId(null); setAdminNote(''); } });
    } else {
      reject.mutate(payload, { onSuccess: () => { setActionId(null); setAdminNote(''); } });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Pending Withdrawals</h1>

      {withdrawals.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No pending withdrawal requests</p>
      ) : (
        <>
          <div className="space-y-3">
            {withdrawals.map((w) => (
              <Card key={w._id}>
                <CardBody className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{w.campaign?.title || 'Campaign'}</p>
                      <p className="text-sm text-gray-500">by {w.creator?.name || 'Unknown'} ({w.creator?.email})</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(w.createdAt)}</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(w.amount)}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    <p><span className="text-gray-500">Bank:</span> {w.bankDetails?.bankName}</p>
                    <p><span className="text-gray-500">Account:</span> {w.bankDetails?.accountNumber}</p>
                    <p><span className="text-gray-500">Holder:</span> {w.bankDetails?.accountHolder}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" color="success" onPress={() => { setActionId(w._id); setActionType('approve'); }}>
                      Approve
                    </Button>
                    <Button size="sm" color="danger" variant="bordered" onPress={() => { setActionId(w._id); setActionType('reject'); }}>
                      Reject
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
        isOpen={!!actionId}
        onClose={() => { setActionId(null); setAdminNote(''); }}
        onConfirm={handleAction}
        title={actionType === 'approve' ? 'Approve Withdrawal' : 'Reject Withdrawal'}
        message={
          <div className="space-y-3">
            <p>Are you sure you want to {actionType} this withdrawal?</p>
            <Textarea
              placeholder="Add a note (optional)"
              value={adminNote}
              onValueChange={setAdminNote}
              minRows={2}
            />
          </div>
        }
        confirmText={actionType === 'approve' ? 'Approve' : 'Reject'}
        confirmColor={actionType === 'approve' ? 'success' : 'danger'}
      />
    </div>
  );
}
