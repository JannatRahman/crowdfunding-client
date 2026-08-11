'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatCurrency, getProgressPercent, getDaysLeft, formatDate } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';

const CATEGORY_ICONS = {
  technology: '🔌',
  education: '📖',
  health: '❤️',
  art: '🎨',
  community: '🤝',
  environment: '🌱',
};

export default function CampaignCard({ campaign, index = 0 }) {
  const progress = getProgressPercent(campaign.currentAmount, campaign.goalAmount);
  const daysLeft = getDaysLeft(campaign.endDate || campaign.deadline);
  const isUrgent = daysLeft > 0 && daysLeft <= 5;
  const funded = progress >= 100;
  const categoryKey = (campaign.category || '').toLowerCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <Link
        href={`${ROUTES.CAMPAIGNS}/${campaign._id || campaign.id}`}
        className="block h-full group bg-white rounded-2xl border border-cf-brown/10 shadow-sm hover:shadow-xl hover:shadow-cf-brown/10 hover:border-cf-brown/25 transition-all duration-300 overflow-hidden flex flex-col"
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          {campaign.images?.[0] ? (
            <img
              src={campaign.images[0]}
              alt={campaign.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cf-brown to-cf-dark flex items-center justify-center">
              <span className="text-white text-5xl">{CATEGORY_ICONS[categoryKey] || '🚀'}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-cf-dark/70 via-cf-dark/10 to-transparent" />

          {/* Category badge */}
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur rounded-full text-[11px] font-bold text-cf-dark capitalize shadow-sm">
            <span>{CATEGORY_ICONS[categoryKey] || '🎯'}</span>
            {campaign.category}
          </span>

          {/* Days left badge */}
          <span
            className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur shadow-sm ${
              funded
                ? 'bg-emerald-500/95 text-white'
                : isUrgent
                  ? 'bg-red-500/95 text-white'
                  : 'bg-white/95 text-cf-dark'
            }`}
          >
            {funded
              ? '✓ Funded'
              : isUrgent
                ? `⏳ ${daysLeft} day${daysLeft === 1 ? '' : 's'} left`
                : `🗓 ${daysLeft} days left`}
          </span>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col p-5">
          <h3 className="text-base font-extrabold text-gray-900 line-clamp-1 group-hover:text-cf-brown transition-colors">
            {campaign.title}
          </h3>
          <p className="mt-1.5 text-[13px] text-gray-500 line-clamp-2 leading-relaxed">
            {campaign.shortDescription || campaign.description}
          </p>

          {/* Progress */}
          <div className="mt-4">
            <div className="h-2 rounded-full bg-cf-cream overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.min(progress, 100)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 + index * 0.05 }}
                className={`h-full rounded-full ${funded ? 'bg-emerald-500' : 'bg-gradient-to-r from-cf-brown to-cf-dark'}`}
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-medium">{Math.min(progress, 100)}% funded</span>
              <span className="text-xs text-gray-400 font-medium capitalize">{formatDate(campaign.endDate || campaign.deadline)}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-cf-brown/10 pt-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Raised</p>
              <p className="text-sm font-extrabold text-gray-900">{formatCurrency(campaign.currentAmount)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Goal</p>
              <p className="text-sm font-extrabold text-gray-900">{formatCurrency(campaign.goalAmount)}</p>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex -space-x-2 items-center">
                {campaign.backers > 0 &&
                  Array.from({ length: Math.min(3, campaign.backers) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-gradient-to-br from-cf-brown to-cf-tan border-2 border-white flex items-center justify-center text-[8px] font-black text-white"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                {campaign.backers > 3 && (
                  <div className="w-6 h-6 rounded-full bg-cf-dark border-2 border-white flex items-center justify-center text-[8px] font-black text-cf-cream">
                    +{campaign.backers - 3}
                  </div>
                )}
              </div>
              <span className="text-[11px] text-gray-400 font-semibold whitespace-nowrap truncate">
                {campaign.backers || 0} backers
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-cf-brown group-hover:text-cf-dark transition-colors">
              View
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
