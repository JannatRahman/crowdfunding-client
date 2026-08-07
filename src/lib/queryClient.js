'use client';

import { useRef } from 'react';
import { QueryClient } from '@tanstack/react-query';

export function useQueryClientInstance() {
  const ref = useRef(null);
  if (!ref.current) {
    ref.current = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000,
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    });
  }
  return ref.current;
}
