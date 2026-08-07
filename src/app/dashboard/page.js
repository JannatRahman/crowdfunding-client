'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { ROUTES } from '@/utils/constants';

export default function DashboardPage() {
  const { role, isLoading } = useAuth();
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (redirected.current) return;
    redirected.current = true;

    if (role === 'admin') router.replace(ROUTES.ADMIN_DASHBOARD);
    else if (role === 'creator') router.replace(ROUTES.CREATOR_DASHBOARD);
    else router.replace(ROUTES.SUPPORTER_DASHBOARD);
  }, [role, isLoading, router]);

  return null;
}
