'use client';

import Link from 'next/link';
import { useCampaigns } from '@/hooks/useCampaigns';
import CampaignCard from '@/components/campaign/CampaignCard';
import { Button, Chip } from '@heroui/react';
import { motion } from 'framer-motion';
import { ROUTES, CAMPAIGN_CATEGORIES } from '@/utils/constants';

export default function Home() {
  const { data, isLoading } = useCampaigns({ limit: 6, sort: 'most-funded', status: 'active' });
  const campaigns = data?.campaigns || [];

  return (
    <div>
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Bring Your Ideas to
              <span className="block text-yellow-300">Life Together</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of creators and supporters building the future through community-powered funding.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={ROUTES.CAMPAIGNS}>
                <Button size="lg" variant="bordered" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                  Explore Campaigns
                </Button>
              </Link>
              <Link href={ROUTES.REGISTER}>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto">
                  Start a Campaign
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto text-center"
          >
            {[
              { value: '10K+', label: 'Campaigns Funded' },
              { value: '$2M+', label: 'Total Raised' },
              { value: '50K+', label: 'Happy Backers' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-blue-200 text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse by Category</h2>
          <p className="text-gray-500">Find campaigns that match your interests</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {CAMPAIGN_CATEGORIES.map((cat) => (
            <Link key={cat.value} href={`${ROUTES.CAMPAIGNS}?category=${cat.value}`}>
              <Chip variant="bordered" className="cursor-pointer hover:bg-blue-50 transition-colors">
                {cat.label}
              </Chip>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Trending Campaigns</h2>
            <p className="text-gray-500">Most funded campaigns right now</p>
          </div>
          <Link href={ROUTES.CAMPAIGNS}>
            <Button variant="bordered">View All</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-xl h-48" />
                <div className="mt-4 space-y-3">
                  <div className="bg-gray-200 rounded h-4 w-3/4" />
                  <div className="bg-gray-200 rounded h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign, index) => (
              <CampaignCard key={campaign._id} campaign={campaign} index={index} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-gray-400 text-lg mb-8">
            Whether you have an idea to share or want to support great causes, there is a place for you here.
          </p>
          <Link href={ROUTES.REGISTER}>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
