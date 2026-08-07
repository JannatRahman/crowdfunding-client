'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { useQueryClientInstance } from '@/lib/queryClient';

export function QueryProvider({ children }) {
  const queryClient = useQueryClientInstance();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
