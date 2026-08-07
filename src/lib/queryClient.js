'use client';

import { useState } from 'react';
import { QueryClient } from '@tanstack/react-query';

export function useQueryClientInstance() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));
  return queryClient;
}
