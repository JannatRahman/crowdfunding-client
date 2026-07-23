'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from '@/utils/constants';

export default function DashboardPage() {
  const { role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (role === 'admin') router.replace(ROUTES.ADMIN_DASHBOARD);
    else if (role === 'creator') router.replace(ROUTES.CREATOR_DASHBOARD);
    else router.replace(ROUTES.SUPPORTER_DASHBOARD);
  }, [role, router]);

  return null;
}
