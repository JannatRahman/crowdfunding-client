'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { PageLoader } from '@/components/shared/LoadingSpinner';
import { ROUTES } from '@/utils/constants';

export default function DashboardLayout({ children }) {
  const { user, isLoading, isAuthenticated, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <PageLoader />;

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8 overflow-auto">
        {children}
      </div>
    </div>
  );
}
