'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useCampaign } from '@/hooks/useCampaigns';
import { useCreateContribution } from '@/hooks/useContributions';
import { useAuth } from '@/providers/AuthProvider';
import api from '@/lib/api';
import { formatCurrency, getProgressPercent, getDaysLeft, formatDate } from '@/utils/formatters';
import { Button } from '@heroui/react';
import { FormInput, FormTextarea } from '@/components/shared/FormField';
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

const CATEGORY_ICONS = {
  technology: '🔌',
  education: '📖',
  health: '❤️',
  art: '🎨',
  community: '🤝',
  environment: '🌱',
};

const QUICK_AMOUNTS = [10, 25, 50, 100];

function useCountUp(target, { duration = 1000, decimals = 0 } = {}) {
  const [value, setValue] = useState(0);
  const frame = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + (target - from) * eased);
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration]);

  return decimals > 0 ? Number(value.toFixed(decimals)) : Math.round(value);
}

export default function CampaignDetailClient() {
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

  const campaign = data?.campaign;
  const creator = data?.creator;
  const contributions = data?.recentContributions || [];

  // Hooks must run before any early return (rules-of-hooks). Targets update
  // automatically once the campaign data arrives and animate in.
  const progress = getProgressPercent(campaign?.currentAmount, campaign?.goalAmount);
  const daysLeft = getDaysLeft(campaign?.endDate);
  const isFunded = campaign?.status === 'funded';
  const isEnded = daysLeft <= 0 || campaign?.status === 'cancelled';

  const raisedCount = useCountUp(campaign?.currentAmount || 0, { duration: 1100, decimals: 0 });
  const backersCount = useCountUp(campaign?.backersCount || 0, { duration: 800 });
  const daysLeftCount = useCountUp(isEnded ? 0 : Math.max(daysLeft, 0), { duration: 700 });

  if (isLoading) return <PageLoader />;
  if (!campaign) return <div className="text-center py-20 text-gray-500">Campaign not found</div>;

  const categoryKey = (campaign.category || '').toLowerCase();
  const isCreator = isAuthenticated && user?.id === campaign.creatorId;

  const handleContribute = async () => {
    try {
      const { data: sessionData } = await api.post('/api/payments/create-session', {
        campaignId: campaign._id,
        amount: parseFloat(amount),
        Contribution_amount: parseFloat(amount),
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

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: 'easeOut' },
  });

  return (
    <div className="min-h-screen bg-cf-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Breadcrumb */}
        <motion.nav {...fadeUp(0)} className="flex items-center gap-2 text-sm text-cf-brown/70 font-medium mb-6">
          <Link href={ROUTES.HOME} className="hover:text-cf-dark transition-colors">Home</Link>
          <span>/</span>
          <Link href={ROUTES.CAMPAIGNS} className="hover:text-cf-dark transition-colors">Campaigns</Link>
          <span>/</span>
          <span className="text-cf-dark font-semibold truncate">{campaign.title}</span>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* ── Main column ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero image */}
            <motion.div {...fadeUp(0.05)} className="relative rounded-3xl overflow-hidden shadow-xl shadow-cf-brown/10 group">
              {campaign.images?.[0] ? (
                <img
                  src={campaign.images[0]}
                  alt={campaign.title}
                  className="w-full h-[300px] md:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-[300px] md:h-[400px] bg-gradient-to-br from-cf-brown to-cf-dark flex items-center justify-center">
                  <span className="text-7xl">{CATEGORY_ICONS[categoryKey] || '🚀'}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-cf-dark/40 to-transparent" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur rounded-full text-xs font-bold text-cf-dark capitalize shadow-sm">
                  {CATEGORY_ICONS[categoryKey] || '🎯'} {campaign.category}
                </span>
                {campaign.featured && (
                  <span className="px-3 py-1.5 bg-cf-tan/95 backdrop-blur rounded-full text-xs font-bold text-cf-dark shadow-sm">
                    ★ Featured
                  </span>
                )}
                {isFunded && (
                  <span className="px-3 py-1.5 bg-emerald-500/95 backdrop-blur rounded-full text-xs font-bold text-white shadow-sm">
                    ✓ Fully Funded
                  </span>
                )}
              </div>
            </motion.div>

            {/* Title & meta */}
            <motion.div {...fadeUp(0.1)} className="space-y-5">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {campaign.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cf-brown to-cf-tan flex items-center justify-center text-white font-bold border-2 border-white shadow-sm">
                    {creator?.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{creator?.name || 'Unknown Creator'}</p>
                    <p className="text-xs text-cf-brown/70 flex items-center gap-1">
                      Campaign Creator
                      <svg className="w-3.5 h-3.5 text-cf-brown" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </p>
                  </div>
                </div>

                <div className="hidden sm:block w-px h-8 bg-cf-brown/15" />

                <div className="flex items-center gap-2 text-cf-brown/80">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-semibold">Launched {formatDate(campaign.createdAt)}</span>
                </div>

                <div className="flex items-center gap-2 text-cf-brown/80">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-semibold">{campaign.backersCount || 0} backers</span>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              {...fadeUp(0.15)}
              className="bg-white rounded-2xl border border-cf-brown/10 p-6 md:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-[2px] bg-cf-brown rounded-full" />
                <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">About this campaign</h2>
              </div>
              <div className="prose prose-sm md:prose-base max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                {campaign.description}
              </div>
            </motion.div>

            {/* Recent backers */}
            {contributions.length > 0 && (
              <motion.div
                {...fadeUp(0.2)}
                className="bg-white rounded-2xl border border-cf-brown/10 p-6 md:p-8 shadow-sm"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-[2px] bg-cf-brown rounded-full" />
                    <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Recent Backers</h2>
                  </div>
                  <span className="text-xs font-bold text-cf-brown bg-cf-cream border border-cf-brown/10 px-2.5 py-1 rounded-full">
                    {campaign.backersCount || 0} total
                  </span>
                </div>
                <div className="space-y-3">
                  {contributions.map((c, idx) => (
                    <motion.div
                      key={c._id}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-3 p-3.5 bg-cf-cream/60 border border-cf-brown/5 rounded-xl hover:bg-cf-cream transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cf-brown to-cf-tan flex items-center justify-center text-sm font-bold text-white shrink-0">
                        {c.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                          {c.name || 'Anonymous backer'}
                          {c.name && (
                            <svg className="w-3.5 h-3.5 text-cf-brown shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </p>
                        {c.message && <p className="text-xs text-gray-500 truncate">{c.message}</p>}
                      </div>
                      <span className="text-sm font-extrabold text-emerald-600 shrink-0">+{formatCurrency(c.amount)}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* ── Sidebar ─────────────────────────────────────────────── */}
          <div className="space-y-6">
            <motion.div
              {...fadeUp(0.15)}
              className="bg-white rounded-2xl border border-cf-brown/10 p-6 shadow-lg shadow-cf-brown/5 lg:sticky lg:top-24 space-y-6"
            >
              {/* Progress */}
              <div>
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
                      {formatCurrency(raisedCount)}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      raised of <span className="font-semibold text-gray-700">{formatCurrency(campaign.goalAmount)}</span> goal
                    </p>
                  </div>
                  <span className={`text-2xl font-extrabold ${isFunded ? 'text-emerald-600' : 'text-cf-brown'}`}>
                    {progress}%
                  </span>
                </div>
                <ProgressBar current={campaign.currentAmount} goal={campaign.goalAmount} showLabel={false} />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-cf-cream/70 border border-cf-brown/10 rounded-xl p-3.5">
                  <p className="text-2xl font-extrabold text-gray-900">{backersCount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5">Backers</p>
                </div>
                <div className="bg-cf-cream/70 border border-cf-brown/10 rounded-xl p-3.5">
                  <p className={`text-2xl font-extrabold ${isEnded ? 'text-red-500' : 'text-gray-900'}`}>
                    {isEnded ? '0' : daysLeftCount}
                  </p>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5">Days Left</p>
                </div>
              </div>

              {/* Countdown */}
              {!isEnded && !isFunded && (
                <div className="pt-1">
                  <p className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-2.5">Time remaining</p>
                  <CountdownTimer endDate={campaign.endDate} />
                </div>
              )}

              {/* Contribute */}
              {daysLeft > 0 && campaign.status === 'active' ? (
                <div className="space-y-4 pt-1 border-t border-cf-brown/10">
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-2.5">Choose an amount</p>
                    <div className="grid grid-cols-4 gap-2">
                      {QUICK_AMOUNTS.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setAmount(String(v))}
                          className={`py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 cursor-pointer select-none ${
                            amount === String(v)
                              ? 'bg-cf-dark border-cf-dark text-cf-cream shadow-md scale-[1.03]'
                              : 'bg-white border-cf-brown/20 text-cf-brown hover:border-cf-dark hover:text-cf-dark'
                          }`}
                        >
                          ${v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <FormInput
                    type="number"
                    name="Contribution_amount"
                    placeholder="Custom amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    startContent={<span className="text-gray-400 font-semibold">$</span>}
                    min="1"
                    classNames={{
                      inputWrapper: 'border border-cf-brown/20 focus-within:!border-cf-dark rounded-xl bg-white transition-all duration-200',
                    }}
                  />

                  <Button
                    color="primary"
                    className="w-full bg-gradient-to-r from-cf-dark to-cf-brown hover:from-cf-brown hover:to-cf-dark text-cf-cream font-extrabold h-12 rounded-xl shadow-lg shadow-cf-brown/25 transition-all cursor-pointer select-none"
                    size="lg"
                    isDisabled={!amount || parseFloat(amount) <= 0 || !isAuthenticated}
                    onPress={() => (isAuthenticated ? setContributeOpen(true) : router.push(ROUTES.LOGIN))}
                  >
                    {isAuthenticated ? 'Back This Campaign' : 'Sign In to Contribute'}
                  </Button>

                  {!isAuthenticated && (
                    <p className="text-center text-xs text-gray-400 font-medium">
                      You&apos;ll be asked to sign in before confirming.
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-5 bg-cf-cream/60 rounded-xl border border-dashed border-cf-brown/20">
                  <p className="text-sm font-bold text-gray-700">
                    {isFunded ? '🎉 Fully funded — congrats to the creator!' : 'This campaign has ended.'}
                  </p>
                </div>
              )}

              {/* Report */}
              {isAuthenticated && !isCreator && (
                <Button
                  variant="bordered"
                  color="danger"
                  className="w-full rounded-xl font-semibold"
                  onPress={() => setReportOpen(true)}
                >
                  Report Campaign
                </Button>
              )}
            </motion.div>

            {/* Creator card */}
            <motion.div
              {...fadeUp(0.2)}
              className="bg-white rounded-2xl border border-cf-brown/10 p-6 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cf-brown to-cf-tan flex items-center justify-center text-lg font-extrabold text-white shadow-md shrink-0">
                  {creator?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-gray-900 truncate flex items-center gap-1.5">
                    {creator?.name || 'Unknown Creator'}
                    <svg className="w-4 h-4 text-cf-brown shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </p>
                  <p className="text-xs text-cf-brown/70 font-medium mt-0.5">Verified campaign creator</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-cf-brown/10 space-y-2 text-sm">
                <p className="flex justify-between text-gray-600">
                  <span className="text-gray-400 font-medium">Campaigns launched</span>
                  <span className="font-bold text-gray-900">1</span>
                </p>
                <p className="flex justify-between text-gray-600">
                  <span className="text-gray-400 font-medium">Member since</span>
                  <span className="font-bold text-gray-900 capitalize">{formatDate(campaign.createdAt)}</span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Contribution modal */}
      <SimpleModal isOpen={contributeOpen} onClose={() => setContributeOpen(false)} size="lg">
        <SimpleModalHeader>Confirm Contribution</SimpleModalHeader>
        <SimpleModalBody>
          <PaymentSummary campaign={campaign} amount={parseFloat(amount || 0)} />
          <FormTextarea
            placeholder="Add a message (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            minRows={2}
          />
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="rounded border-cf-brown/30"
            />
            Make this contribution anonymous
          </label>
        </SimpleModalBody>
        <SimpleModalFooter>
          <Button variant="light" onPress={() => setContributeOpen(false)}>Cancel</Button>
          <Button
            className="bg-gradient-to-r from-cf-dark to-cf-brown text-cf-cream font-bold rounded-xl"
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
