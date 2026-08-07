'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/utils/formatters';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function SupporterPaymentHistoryPage() {
  const { data: history, isLoading } = useQuery({
    queryKey: ['paymentHistory'],
    queryFn: async () => {
      const { data } = await api.get('/api/payments/history');
      return data || [];
    }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-cf-dark tracking-tight">Payment History</h1>
        <p className="text-cf-brown font-medium mt-1">Review your credits purchases and transaction logs</p>
      </div>

      <div className="bg-white rounded-3xl border border-cf-tan shadow-sm overflow-hidden">
        <div className="p-6 border-b border-cf-tan/30 bg-cf-cream/20">
          <h2 className="text-xl font-bold text-cf-dark">Transaction Logs</h2>
        </div>

        {isLoading ? (
          <div className="p-12">
            <LoadingSpinner />
          </div>
        ) : !history || history.length === 0 ? (
          <div className="p-12 text-center text-cf-brown font-medium">
            <p className="text-lg font-bold text-cf-dark">No Transactions Yet</p>
            <p className="mt-1">When you purchase credits or contribute, your records will show up here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-cf-tan/35 text-left text-sm">
              <thead className="bg-cf-cream/40 text-cf-dark font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4.5">Transaction ID</th>
                  <th className="px-6 py-4.5">Type</th>
                  <th className="px-6 py-4.5 text-center">Credits Added</th>
                  <th className="px-6 py-4.5 text-right">Amount Paid</th>
                  <th className="px-6 py-4.5">Date</th>
                  <th className="px-6 py-4.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cf-tan/20 font-medium text-cf-dark bg-white">
                {history.map((tx) => (
                  <tr key={tx._id} className="hover:bg-cf-cream/10 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-cf-brown">{tx._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                      {tx.type === 'credit_purchase' ? 'Credit Purchase 💳' : 'Contribution 💝'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-green-600">
                      +{tx.credits || tx.amount * 10}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-cf-dark">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(tx.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Chip
                        size="sm"
                        color={tx.status === 'completed' ? 'success' : 'warning'}
                        variant="flat"
                      >
                        {tx.status || 'completed'}
                      </Chip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple chip implementation in case HeroUI Chip is not resolved
function Chip({ children, color, variant }) {
  const colorClass = {
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    default: 'bg-gray-50 text-gray-700 border-gray-200',
  }[color] || 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
      {children}
    </span>
  );
}
