'use client';

import EmptyState from '@/components/shared/EmptyState';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants';

export default function SupporterSaved() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Saved Campaigns</h1>
      <EmptyState
        icon="🔖"
        title="Coming Soon"
        description="Campaign saving feature is under development. Explore campaigns in the meantime!"
        action={
          <Link href={ROUTES.CAMPAIGNS}>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              Explore Campaigns
            </button>
          </Link>
        }
      />
    </div>
  );
}
