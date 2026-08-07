'use client';

import { useState } from 'react';
import { useMyWithdrawals } from '@/hooks/useWithdrawals';
import WithdrawalForm from '@/components/dashboard/WithdrawalForm';
import EmptyState from '@/components/shared/EmptyState';
import Pagination from '@/components/shared/Pagination';
import { formatDate } from '@/utils/formatters';
import { Button, Card, CardContent, Chip } from '@heroui/react';

export default function CreatorWithdrawals() {
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const { data, isLoading } = useMyWithdrawals({ page, limit: 10 });
  
  const withdrawals = data?.withdrawals || [];
  const pagination = data?.pagination || { pages: 1, page: 1 };
  
  const totalRaisedCredits = data?.totalRaisedCredits || 0;
  const totalWithdrawnCredits = data?.totalWithdrawnCredits || 0;
  const availableCredits = data?.availableCredits || 0;

  const statusColor = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
    completed: 'success',
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-cf-dark tracking-tight">Withdrawals</h1>
          <p className="text-cf-brown font-medium mt-1">Request credit payouts and view withdrawal history</p>
        </div>
        <Button 
          className="bg-cf-dark hover:bg-[#3A2A2A] text-cf-cream font-bold px-6 py-5.5 rounded-xl shadow-md transition-all"
          onPress={() => setFormOpen(true)}
        >
          Request Payout
        </Button>
      </div>

      {/* Creator Total Earnings & Balances Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-cf-tan bg-white shadow-sm">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-cf-brown uppercase tracking-wider">Total Raised Earnings</p>
            <div className="flex justify-between items-end mt-2">
              <div>
                <p className="text-3xl font-black text-cf-dark">{totalRaisedCredits}</p>
                <p className="text-xs text-cf-brown font-semibold mt-0.5">credits raised</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-green-700">${(totalRaisedCredits / 20).toFixed(2)}</p>
                <p className="text-xs text-cf-brown font-semibold mt-0.5">USD value</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-cf-tan bg-white shadow-sm">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-cf-brown uppercase tracking-wider">Total Withdrawn</p>
            <div className="flex justify-between items-end mt-2">
              <div>
                <p className="text-3xl font-black text-cf-dark">{totalWithdrawnCredits}</p>
                <p className="text-xs text-cf-brown font-semibold mt-0.5">credits processed</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-cf-dark">${(totalWithdrawnCredits / 20).toFixed(2)}</p>
                <p className="text-xs text-cf-brown font-semibold mt-0.5">USD payout</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-cf-tan bg-white/70 shadow-sm relative overflow-hidden">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-cf-brown uppercase tracking-wider">Available to Withdraw</p>
            <div className="flex justify-between items-end mt-2">
              <div>
                <p className="text-3xl font-black text-[#A16207]">{availableCredits}</p>
                <p className="text-xs text-cf-brown font-semibold mt-0.5">credits available</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-green-700">${(availableCredits / 20).toFixed(2)}</p>
                <p className="text-xs text-cf-brown font-semibold mt-0.5">available value</p>
              </div>
            </div>
            {availableCredits < 200 && (
              <p className="text-[10px] text-red-600 font-bold mt-2 bg-red-50 p-1.5 rounded-lg border border-red-100 text-center">
                Min. 200 credits required to withdraw
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Logs Table */}
      <div className="bg-white rounded-3xl border border-cf-tan shadow-sm overflow-hidden">
        <div className="p-6 border-b border-cf-tan/30 bg-cf-cream/20">
          <h2 className="text-xl font-bold text-cf-dark">Withdrawal Requests</h2>
          <p className="text-sm text-cf-brown font-medium mt-1">Track the status of your payment requests</p>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-cf-brown font-semibold">
            Loading withdrawals...
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="p-12 text-center text-cf-brown font-medium">
            <p className="text-lg font-bold text-cf-dark">No Payout Requests Yet</p>
            <p className="mt-1">When you request a payout withdrawal, it will be listed here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-cf-tan/35 text-left text-sm">
              <thead className="bg-cf-cream/40 text-cf-dark font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4.5">Request Date</th>
                  <th className="px-6 py-4.5">Method</th>
                  <th className="px-6 py-4.5">Account Number</th>
                  <th className="px-6 py-4.5 text-right">Credits</th>
                  <th className="px-6 py-4.5 text-right">USD Amount</th>
                  <th className="px-6 py-4.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cf-tan/20 font-medium text-cf-dark bg-white">
                {withdrawals.map((w) => (
                  <tr key={w._id} className="hover:bg-cf-cream/10 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(w.withdraw_date || w.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize text-cf-brown font-semibold">{w.payment_system || w.paymentSystem}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">{w.account_number || w.accountNumber || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-bold">{w.withdrawal_credit || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-green-700">
                      ${Number(w.withdrawal_amount || w.amount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Chip size="sm" color={statusColor[w.status]} variant="flat" className="font-bold capitalize">
                        {w.status}
                      </Chip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={setPage} />

      <WithdrawalForm 
        availableCredits={availableCredits} 
        isOpen={formOpen} 
        onClose={() => setFormOpen(false)} 
      />
    </div>
  );
}
