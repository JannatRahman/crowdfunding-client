'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@heroui/react';
import { ROUTES } from '@/utils/constants';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (sessionId) {
      setStatus('success');
    } else {
      setStatus('error');
    }
  }, [sessionId]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Processing your payment...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">✅</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-500 mb-8">
              Thank you for your contribution! Your support makes a difference.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href={ROUTES.CAMPAIGNS}>
                <Button color="primary">Explore More Campaigns</Button>
              </Link>
              <Link href={ROUTES.DASHBOARD}>
                <Button variant="bordered">Go to Dashboard</Button>
              </Link>
            </div>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-500 mb-8">
              We couldn&apos;t verify your payment. Please check your email for confirmation.
            </p>
            <Link href={ROUTES.HOME}>
              <Button color="primary">Go Home</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
