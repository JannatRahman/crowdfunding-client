'use client';

import Link from 'next/link';
import { Button } from '@heroui/react';
import { ROUTES } from '@/utils/constants';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">⏸️</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
        <p className="text-gray-500 mb-8">
          No worries! Your payment was not processed. You can try again anytime.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href={ROUTES.CAMPAIGNS}>
            <Button color="primary">Browse Campaigns</Button>
          </Link>
          <Link href={ROUTES.HOME}>
            <Button variant="bordered">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
