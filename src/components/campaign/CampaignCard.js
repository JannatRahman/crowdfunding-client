'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatCurrency, getProgressPercent, getDaysLeft, formatDate } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';
import { Card, CardContent, ProgressBar } from '@heroui/react';

export default function CampaignCard({ campaign, index = 0 }) {
  const progress = getProgressPercent(campaign.currentAmount, campaign.goalAmount);
  const daysLeft = getDaysLeft(campaign.endDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={ROUTES.CAMPAIGN_DETAIL(campaign._id)}>
        <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
          <div className="relative h-48 overflow-hidden">
            {campaign.images?.[0] ? (
              <img
                src={campaign.images[0]}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white text-4xl">🚀</span>
              </div>
            )}
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 capitalize">
                {campaign.category}
              </span>
            </div>
            {daysLeft <= 5 && daysLeft > 0 && (
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 bg-red-500 text-white rounded-full text-xs font-medium">
                  {daysLeft}d left
                </span>
              </div>
            )}
          </div>

          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{campaign.title}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">{campaign.shortDescription || campaign.description}</p>

            <div className="mb-3">
              <ProgressBar
                value={progress}
                color={progress >= 100 ? 'success' : 'primary'}
                size="sm"
                className="w-full"
              />
            </div>

            <div className="flex justify-between text-sm">
              <div>
                <span className="font-semibold text-gray-900">{formatCurrency(campaign.currentAmount)}</span>
                <span className="text-gray-500 ml-1">raised</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-900">{progress}%</span>
              </div>
            </div>

            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>{campaign.backersCount || 0} backers</span>
              <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
