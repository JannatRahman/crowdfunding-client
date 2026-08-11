'use client';

import Link from 'next/link';
import { Button } from '@heroui/react';
import { ROUTES } from '@/utils/constants';
import { motion } from 'framer-motion';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[65vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-extrabold text-cf-dark tracking-tight mb-2"
        >
          Payment Cancelled
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-cf-brown font-medium mb-8"
        >
          No worries! Your payment was not processed. You can try again anytime.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex gap-3 justify-center">
          <Link href={ROUTES.CAMPAIGNS}>
            <Button className="bg-gradient-to-r from-cf-dark to-cf-brown text-cf-cream font-bold rounded-xl px-6" size="lg">
              Browse Campaigns
            </Button>
          </Link>
          <Link href={ROUTES.HOME}>
            <Button className="font-bold rounded-xl border-cf-tan" variant="bordered" size="lg">
              Go Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
