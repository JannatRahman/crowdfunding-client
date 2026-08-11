'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useMyContributions } from '@/hooks/useContributions';
import useCountUp from '@/hooks/useCountUp';
import { formatCurrency, formatDate } from '@/utils/formatters';
import EmptyState from '@/components/shared/EmptyState';
import { Chip } from '@heroui/react';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

function StatCard({ icon, label, value, accent, delay }) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className="relative overflow-hidden rounded-2xl border border-cf-tan bg-white p-5 shadow-sm hover:shadow-lg hover:shadow-cf-brown/10 transition-all duration-300"
    >
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10" style={{ background: accent }} />
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
          style={{ background: accent }}
        >
          {icon}
        </div>
        <div>
          <p className="text-3xl font-black text-cf-dark leading-none">{value}</p>
          <p className="text-sm font-semibold text-cf-brown mt-1.5">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function SupporterDashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useMyContributions({ limit: 100 });
  const contributions = data?.contributions || [];
  const approvedContributions = contributions.filter((c) => c.status === 'approved');

  const totalCount = useCountUp(data?.stats?.totalContributions || 0, { duration: 800 });
  const pendingCount = useCountUp(data?.stats?.totalPendingContributions || 0, { duration: 800 });
  const amountContributed = useCountUp(data?.stats?.totalAmountContributed || 0, { duration: 1100, decimals: 0 });

  if (isLoading) {
    return <div className="text-center py-16 text-cf-brown font-semibold">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div {...fadeUp(0)}>
        <h1 className="text-3xl font-extrabold text-cf-dark tracking-tight">
          Welcome back, <span className="text-cf-brown">{user?.name || 'Supporter'}</span>!
        </h1>
        <p className="text-cf-brown font-medium mt-1">Here is an overview of your support activity</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          icon="💝"
          label="Total Contributions"
          value={totalCount.toLocaleString()}
          accent="#EAD9C8"
          delay={0.05}
        />
        <StatCard
          icon="⏳"
          label="Pending Contributions"
          value={pendingCount.toLocaleString()}
          accent="#F5E6CE"
          delay={0.1}
        />
        <StatCard
          icon="💰"
          label="Total Amount Contributed"
          value={formatCurrency(amountContributed)}
          accent="#E7F0DD"
          delay={0.15}
        />
      </div>

      {/* Approved contributions */}
      <motion.div {...fadeUp(0.2)}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-cf-dark">Approved Contributions</h2>
          <span className="text-xs font-bold text-cf-brown bg-white border border-cf-tan px-2.5 py-1 rounded-full">
            {approvedContributions.length} approved
          </span>
        </div>

        {approvedContributions.length === 0 ? (
          <div className="bg-white rounded-3xl border border-cf-tan shadow-sm p-6">
            <EmptyState
              icon="💝"
              title="No approved contributions yet"
              description="Start supporting amazing campaigns!"
              action={
                <Link href={ROUTES.CAMPAIGNS}>
                  <button className="px-5 py-2.5 bg-cf-dark text-cf-cream rounded-xl text-sm font-bold hover:bg-[#3A2A2A] transition-colors cursor-pointer">
                    Explore Campaigns
                  </button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-cf-tan shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-cf-tan/35 text-left text-sm">
                <thead className="bg-cf-cream/40 text-cf-dark font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Campaign Title</th>
                    <th className="px-6 py-4">Contribution Amount</th>
                    <th className="px-6 py-4">Creator Name</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cf-tan/20 text-cf-dark bg-white">
                  {approvedContributions.map((c) => (
                    <tr key={c._id} className="hover:bg-cf-cream/10 transition-colors">
                      <td className="px-6 py-4 font-semibold">{c.campaignTitle || c.campaign?.title || 'Campaign'}</td>
                      <td className="px-6 py-4 text-green-700 font-bold">{formatCurrency(c.amount || c.Contribution_amount || 0)}</td>
                      <td className="px-6 py-4 text-cf-brown">{c.creator_name || c.campaign?.creatorName || 'N/A'}</td>
                      <td className="px-6 py-4 text-cf-brown">{formatDate(c.createdAt)}</td>
                      <td className="px-6 py-4 text-center">
                        <Chip size="sm" color="success" variant="flat" className="capitalize font-bold">
                          {c.status}
                        </Chip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
