'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/shared/Sidebar';
import { PageLoader } from '@/components/shared/LoadingSpinner';
import { ROUTES } from '@/utils/constants';

export default function DashboardLayout({ children }) {
  const { user, isLoading, isAuthenticated, role } = useAuth();
  const router = useRouter();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) setTimedOut(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading && !timedOut) return <PageLoader />;

  if (timedOut && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <p className="text-gray-600">Unable to verify your session.</p>
          <button
            onClick={() => window.location.href = ROUTES.LOGIN}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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
