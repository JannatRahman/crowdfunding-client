'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@heroui/react';
import { ROUTES } from '@/utils/constants';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('loading');
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    let active = true;
    if (sessionId) {
      api.post('/api/payments/verify-checkout-session', { sessionId })
        .then((res) => {
          if (!active) return;
          if (res.data?.success) {
            setStatus('success');
            setCredits(res.data?.credits || 0);
            toast.success(`Wallet upgraded! Added ${res.data?.credits || 0} credits.`);
          } else {
            setStatus('error');
            toast.error('Payment verification failed.');
          }
        })
        .catch((err) => {
          if (!active) return;
          console.error(err);
          setStatus('error');
          toast.error(err.response?.data?.error || 'Error verifying payment.');
        });
      return () => {
        active = false;
      };
    }
    const timer = setTimeout(() => {
      if (active) setStatus('error');
    }, 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [sessionId]);

  return (
    <div className="min-h-[65vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 border-4 border-cf-tan border-t-cf-dark rounded-full animate-spin mx-auto mb-4" />
            <p className="text-cf-brown font-semibold">Processing and verifying your payment...</p>
          </>
        )}
        {status === 'success' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h1 className="text-3xl font-extrabold text-cf-dark tracking-tight mb-2">Payment Successful!</h1>
            <p className="text-cf-brown font-medium mb-2">
              Thank you for your purchase! {credits > 0 ? `${credits} credits have been added to your wallet.` : 'Your wallet is being updated.'}
            </p>
            <p className="text-cf-brown/60 text-xs font-mono mb-8">
              Session: {sessionId?.substring(0, 15)}...
            </p>
            <div className="flex gap-3 justify-center">
              <Link href={ROUTES.CAMPAIGNS}>
                <Button className="bg-gradient-to-r from-cf-dark to-cf-brown text-cf-cream font-bold rounded-xl px-6" size="lg">
                  Explore Campaigns
                </Button>
              </Link>
              <Link href={ROUTES.DASHBOARD}>
                <Button className="font-bold rounded-xl border-cf-tan" variant="bordered" size="lg">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
        {status === 'error' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-cf-dark tracking-tight mb-2">Verification Failed</h1>
            <p className="text-cf-brown font-medium mb-8">
              We couldn&apos;t verify your payment. If you believe this is an error, please contact support.
            </p>
            <Link href={ROUTES.HOME}>
              <Button className="bg-gradient-to-r from-cf-dark to-cf-brown text-cf-cream font-bold rounded-xl px-6" size="lg">
                Go Home
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[65vh]"><div className="w-8 h-8 border-4 border-cf-tan border-t-cf-dark rounded-full animate-spin" /></div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
