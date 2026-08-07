'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatCurrency, getProgressPercent, getDaysLeft, formatDate } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';
import { Card, CardContent, ProgressBar, Button } from '@heroui/react';

export default function CampaignCard({ campaign, index = 0 }) {
  const progress = getProgressPercent(campaign.currentAmount, campaign.goalAmount);
  const daysLeft = getDaysLeft(campaign.endDate || campaign.deadline);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="h-full"
    >
      <Card className="hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between border border-gray-200">
        <div>
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

          <CardContent className="p-4 space-y-3">
            <div>
              <h3 className="font-bold text-gray-900 text-lg line-clamp-1 mb-0.5">{campaign.title}</h3>
              <p className="text-xs text-gray-500">
                by <span className="font-semibold text-gray-700">{campaign.creatorName || 'Unknown Creator'}</span>
              </p>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2 h-10">
              {campaign.shortDescription || campaign.description}
            </p>

            <div className="space-y-1">
              <ProgressBar
                value={progress}
                color={progress >= 100 ? 'success' : 'primary'}
                size="sm"
                className="w-full"
              />
              <div className="flex justify-between text-xs font-semibold text-gray-500 mt-1">
                <span>{progress}% funded</span>
                <span>{campaign.backersCount || 0} backers</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs">
              <div>
                <p className="text-gray-400 font-medium">Raised</p>
                <p className="font-bold text-green-600 text-sm">{formatCurrency(campaign.currentAmount)}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 font-medium">Goal</p>
                <p className="font-bold text-gray-800 text-sm">{formatCurrency(campaign.goalAmount)}</p>
              </div>
            </div>

            <div className="text-xs font-medium text-gray-500 pt-1 flex justify-between items-center">
              <span>Deadline:</span>
              <span className="font-semibold text-gray-700">
                {campaign.endDate ? formatDate(campaign.endDate) : 'N/A'}
              </span>
            </div>
          </CardContent>
        </div>

        <div className="p-4 pt-0">
          <Link href={ROUTES.CAMPAIGN_DETAIL(campaign._id)} className="block w-full">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl text-sm transition-all shadow-sm cursor-pointer">
              View Details
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}
