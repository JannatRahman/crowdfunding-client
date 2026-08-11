'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useMyCampaigns } from '@/hooks/useCampaigns';
import useCountUp from '@/hooks/useCountUp';
import { usePendingContributions, useApproveContribution, useRejectContribution } from '@/hooks/useContributions';
import { formatCurrency, getDaysLeft, formatDate } from '@/utils/formatters';
import EmptyState from '@/components/shared/EmptyState';
import Link from 'next/link';
import { Button, Card, CardContent, Chip } from '@heroui/react';
import { ROUTES } from '@/utils/constants';
import { useState } from 'react';
import SimpleModal, { SimpleModalHeader, SimpleModalBody, SimpleModalFooter } from '@/components/shared/SimpleModal';
import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
});

export default function CreatorDashboard() {
  const { user } = useAuth();
  const { data: campaignData, isLoading: campaignsLoading } = useMyCampaigns({ limit: 100 });
  const { data: contributions, isLoading: contributionsLoading } = usePendingContributions();
  
  const approveMutation = useApproveContribution();
  const rejectMutation = useRejectContribution();

  const [selectedContribution, setSelectedContribution] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const campaigns = campaignData?.campaigns || [];

  // 1. Total campaign count (campaigns launched by the user)
  const totalCampaigns = campaigns.length;

  // 2. Active campaigns (campaigns where the deadline has not passed and status is active)
  const activeCampaigns = campaigns.filter(c => {
    const daysLeft = getDaysLeft(c.endDate);
    return daysLeft > 0 && c.status === 'active';
  }).length;

  // 3. Total amount raised across all campaigns
  const totalRaised = campaigns.reduce((sum, c) => sum + (c.currentAmount || 0), 0);

  const totalCampaignsCount = useCountUp(totalCampaigns, { duration: 700 });
  const activeCampaignsCount = useCountUp(activeCampaigns, { duration: 700 });
  const totalRaisedCount = useCountUp(totalRaised, { duration: 1100, decimals: 0 });

  const handleViewContribution = (contr) => {
    setSelectedContribution(contr);
    setModalOpen(true);
  };

  const handleApprove = async (id) => {
    if (confirm("Are you sure you want to approve this contribution? The amount will be added to your campaign raised amount.")) {
      try {
        await approveMutation.mutateAsync(id);
        setModalOpen(false);
      } catch (err) {
        alert(err.response?.data?.error || "Failed to approve contribution");
      }
    }
  };

  const handleReject = async (id) => {
    if (confirm("Are you sure you want to reject this contribution? The amount will be refunded to the supporter's credits.")) {
      try {
        await rejectMutation.mutateAsync(id);
        setModalOpen(false);
      } catch (err) {
        alert(err.response?.data?.error || "Failed to reject contribution");
      }
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header section */}
      <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-cf-dark tracking-tight">Creator Dashboard</h1>
          <p className="text-cf-brown font-medium mt-1">Monitor your campaign performance and review contributions</p>
        </div>
        <Link href={ROUTES.CREATOR_NEW_CAMPAIGN}>
          <Button className="bg-cf-dark hover:bg-[#3A2A2A] text-cf-cream font-bold px-6 py-5.5 rounded-xl shadow-md transition-all">
            + New Campaign
          </Button>
        </Link>
      </motion.div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div {...fadeUp(0.05)}>
          <Card className="border border-cf-tan bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cf-cream text-cf-dark flex items-center justify-center text-2xl font-bold">
                🚀
              </div>
              <div>
                <p className="text-4xl font-extrabold text-cf-dark">{totalCampaignsCount}</p>
                <p className="text-sm font-semibold text-cf-brown mt-0.5">Total Campaigns</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeUp(0.1)}>
          <Card className="border border-cf-tan bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center text-2xl font-bold">
                🟢
              </div>
              <div>
                <p className="text-4xl font-extrabold text-green-700">{activeCampaignsCount}</p>
                <p className="text-sm font-semibold text-cf-brown mt-0.5">Active Campaigns</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeUp(0.15)}>
          <Card className="border border-cf-tan bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-2xl font-bold">
                💰
              </div>
              <div>
                <p className="text-3xl font-extrabold text-cf-dark">{formatCurrency(totalRaisedCount)}</p>
                <p className="text-sm font-semibold text-cf-brown mt-0.5">Total Amount Raised</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Contributions To Review Table Section */}
      <motion.div {...fadeUp(0.2)} className="bg-white rounded-3xl border border-cf-tan shadow-sm overflow-hidden">
        <div className="p-6 border-b border-cf-tan/30 bg-cf-cream/20">
          <h2 className="text-xl font-bold text-cf-dark">Contributions to Review</h2>
          <p className="text-sm text-cf-brown font-medium mt-1">These contributions are pending your approval to count towards your campaigns</p>
        </div>

        {contributionsLoading ? (
          <div className="p-12 text-center text-cf-brown font-semibold">
            Loading contributions to review...
          </div>
        ) : !contributions || contributions.length === 0 ? (
          <div className="p-12 text-center text-cf-brown font-medium">
            <p className="text-lg font-bold text-cf-dark">All Caught Up!</p>
            <p className="mt-1">No pending contributions to review for your campaigns.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-cf-tan/35 text-left text-sm">
              <thead className="bg-cf-cream/40 text-cf-dark font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4.5">Supporter Name</th>
                  <th className="px-6 py-4.5">Campaign Title</th>
                  <th className="px-6 py-4.5 text-right">Contribution Amount</th>
                  <th className="px-6 py-4.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cf-tan/20 font-medium text-cf-dark bg-white">
                {contributions.map((contr) => (
                  <tr key={contr._id} className="hover:bg-cf-cream/10 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{contr.supporterName || contr.name}</td>
                    <td className="px-6 py-4 truncate max-w-xs">{contr.campaignTitle || contr.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-green-700">
                      {formatCurrency(contr.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="solid"
                          className="bg-cf-dark text-cf-cream hover:bg-[#3A2A2A] font-bold rounded-lg"
                          onPress={() => handleViewContribution(contr)}
                        >
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          color="success"
                          variant="bordered"
                          className="font-bold rounded-lg border-2 hover:bg-green-50"
                          isLoading={approveMutation.isPending && approveMutation.variables === contr._id}
                          onPress={() => handleApprove(contr._id)}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          color="danger"
                          variant="bordered"
                          className="font-bold rounded-lg border-2 hover:bg-red-50"
                          isLoading={rejectMutation.isPending && rejectMutation.variables === contr._id}
                          onPress={() => handleReject(contr._id)}
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Detail Modal */}
      {selectedContribution && (
        <SimpleModal isOpen={modalOpen} onClose={() => setModalOpen(false)} size="md">
          <SimpleModalHeader>Contribution Details</SimpleModalHeader>
          <SimpleModalBody className="space-y-4">
            <div className="bg-cf-cream/30 p-4 rounded-2xl border border-cf-tan/40 space-y-3">
              <div>
                <p className="text-xs uppercase font-bold text-cf-brown tracking-wider">Supporter</p>
                <p className="text-sm font-bold text-cf-dark mt-0.5">{selectedContribution.supporterName || selectedContribution.name}</p>
                <p className="text-xs text-cf-brown mt-0.5">{selectedContribution.supporterEmail || 'No email provided'}</p>
              </div>

              <div>
                <p className="text-xs uppercase font-bold text-cf-brown tracking-wider">Target Campaign</p>
                <p className="text-sm font-bold text-cf-dark mt-0.5">{selectedContribution.campaignTitle || selectedContribution.title}</p>
              </div>

              <div>
                <p className="text-xs uppercase font-bold text-cf-brown tracking-wider">Amount Paid</p>
                <p className="text-lg font-black text-green-700 mt-0.5">{formatCurrency(selectedContribution.amount)}</p>
              </div>

              {selectedContribution.message && (
                <div>
                  <p className="text-xs uppercase font-bold text-cf-brown tracking-wider">Support Message</p>
                  <p className="text-sm text-cf-dark bg-white p-3 rounded-xl border border-cf-tan/40 mt-1 italic">
                    &ldquo;{selectedContribution.message}&rdquo;
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs uppercase font-bold text-cf-brown tracking-wider">Contributed On</p>
                <p className="text-xs text-cf-dark mt-0.5">{formatDate(selectedContribution.createdAt)}</p>
              </div>
            </div>
          </SimpleModalBody>
          <SimpleModalFooter>
            <Button 
              variant="light" 
              className="font-bold"
              onPress={() => setModalOpen(false)}
            >
              Close
            </Button>
            <Button 
              color="danger" 
              className="font-bold bg-red-600 text-white hover:bg-red-700"
              isLoading={rejectMutation.isPending}
              onPress={() => handleReject(selectedContribution._id)}
            >
              Reject & Refund
            </Button>
            <Button 
              color="success" 
              className="font-bold bg-green-600 text-white hover:bg-green-700"
              isLoading={approveMutation.isPending}
              onPress={() => handleApprove(selectedContribution._id)}
            >
              Approve
            </Button>
          </SimpleModalFooter>
        </SimpleModal>
      )}
    </div>
  );
}
