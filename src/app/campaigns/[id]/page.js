'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useCampaign } from '@/hooks/useCampaigns';
import { useCreateContribution } from '@/hooks/useContributions';
import { useAuth } from '@/providers/AuthProvider';
import api from '@/lib/api';
import { formatCurrency, getProgressPercent, getDaysLeft, formatDate } from '@/utils/formatters';
import { Button, Input, TextArea, Chip } from '@heroui/react';
import SimpleModal, { SimpleModalHeader, SimpleModalBody, SimpleModalFooter } from '@/components/shared/SimpleModal';
import ProgressBar from '@/components/campaign/ProgressBar';
import CountdownTimer from '@/components/campaign/CountdownTimer';
import PaymentSummary from '@/components/payment/PaymentSummary';
import ReportForm from '@/components/dashboard/ReportForm';
import { PageLoader } from '@/components/shared/LoadingSpinner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants';
import { motion } from 'framer-motion';

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data, isLoading } = useCampaign(params.id);
  const { user, isAuthenticated } = useAuth();
  const createContribution = useCreateContribution();
  const [contributeOpen, setContributeOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [paymentStep, setPaymentStep] = useState('form');

  const campaign = data?.campaign;
  const creator = data?.creator;
  const contributions = data?.recentContributions || [];

  if (isLoading) return <PageLoader />;
  if (!campaign) return <div className="text-center py-20 text-gray-500">Campaign not found</div>;

  const progress = getProgressPercent(campaign.currentAmount, campaign.goalAmount);
  const daysLeft = getDaysLeft(campaign.endDate);

  const handleContribute = async () => {
    try {
      const { data: sessionData } = await api.post('/api/payments/create-session', {
        campaignId: campaign._id,
        amount: parseFloat(amount),
        message,
        anonymous,
      });
      if (sessionData.url) {
        window.location.href = sessionData.url;
      }
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {campaign.images?.[0] ? (
              <img
                src={campaign.images[0]}
                alt={campaign.title}
                className="w-full h-80 object-cover rounded-2xl"
              />
            ) : (
              <div className="w-full h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                <span className="text-6xl">🚀</span>
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex flex-wrap gap-2 mb-3">
              <Chip color="primary" variant="flat" size="sm" className="capitalize">{campaign.category}</Chip>
              {campaign.featured && <Chip color="warning" variant="flat" size="sm">Featured</Chip>}
              {campaign.status === 'funded' && <Chip color="success" variant="flat" size="sm">Fully Funded</Chip>}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{campaign.title}</h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                {creator?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="font-medium text-gray-900">{creator?.name || 'Unknown Creator'}</p>
                <p className="text-sm text-gray-500">Campaign Creator</p>
              </div>
            </div>

            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
              {campaign.description}
            </div>
          </motion.div>

          {contributions.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Backers</h2>
              <div className="space-y-3">
                {contributions.map((c) => (
                  <div key={c._id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                      {c.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{c.name}</p>
                      {c.message && <p className="text-xs text-gray-500">{c.message}</p>}
                    </div>
                    <span className="text-sm font-semibold text-green-600">{formatCurrency(c.amount)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24 space-y-6"
          >
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-3xl font-bold text-gray-900">{formatCurrency(campaign.currentAmount)}</span>
                <span className="text-gray-500">raised of {formatCurrency(campaign.goalAmount)}</span>
              </div>
              <ProgressBar current={campaign.currentAmount} goal={campaign.goalAmount} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-2xl font-bold text-gray-900">{campaign.backersCount || 0}</p>
                <p className="text-xs text-gray-500">Backers</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-2xl font-bold text-gray-900">{daysLeft}</p>
                <p className="text-xs text-gray-500">Days Left</p>
              </div>
            </div>

            {daysLeft > 0 && campaign.status === 'active' ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Contribution Amount</label>
                  <div className="flex gap-2">
                    {[10, 25, 50, 100].map((v) => (
                      <Button
                        key={v}
                        size="sm"
                        variant={amount === String(v) ? 'solid' : 'bordered'}
                        color={amount === String(v) ? 'primary' : 'default'}
                        onPress={() => setAmount(String(v))}
                      >
                        ${v}
                      </Button>
                    ))}
                  </div>
                </div>

                <Input
                  type="number"
                  placeholder="Custom amount"
                  value={amount}
                  onValueChange={setAmount}
                  startContent={<span className="text-gray-400">$</span>}
                  min="1"
                />

                <Button
                  color="primary"
                  className="w-full"
                  size="lg"
                  isDisabled={!amount || parseFloat(amount) <= 0 || !isAuthenticated}
                  onPress={() => isAuthenticated ? setContributeOpen(true) : router.push(ROUTES.LOGIN)}
                >
                  {isAuthenticated ? 'Back This Campaign' : 'Sign In to Contribute'}
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">
                  {campaign.status === 'funded' ? 'This campaign has been fully funded!' : 'This campaign has ended.'}
                </p>
              </div>
            )}

            {isAuthenticated && user?.id !== campaign.creatorId && (
              <Button variant="bordered" color="danger" className="w-full" onPress={() => setReportOpen(true)}>
                Report Campaign
              </Button>
            )}
          </motion.div>
        </div>
      </div>

      <SimpleModal isOpen={contributeOpen} onClose={() => setContributeOpen(false)} size="lg">
        <SimpleModalHeader>Confirm Contribution</SimpleModalHeader>
        <SimpleModalBody>
          <PaymentSummary campaign={campaign} amount={parseFloat(amount || 0)} />
          <TextArea
            placeholder="Add a message (optional)"
            value={message}
            onValueChange={setMessage}
            minRows={2}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="rounded"
            />
            Make this contribution anonymous
          </label>
        </SimpleModalBody>
        <SimpleModalFooter>
          <Button variant="light" onPress={() => setContributeOpen(false)}>Cancel</Button>
          <Button
            color="primary"
            onPress={handleContribute}
            isLoading={createContribution.isPending}
          >
            Proceed to Payment
          </Button>
        </SimpleModalFooter>
      </SimpleModal>

      <ReportForm
        targetType="campaign"
        targetId={campaign._id}
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
      />
    </div>
  );
}
