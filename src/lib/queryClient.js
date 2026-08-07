'use client';

import { useState } from 'react';
import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

// C5: Derive a human-readable message from an error thrown by our API layer
function getErrorMessage(error) {
  return (
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong. Please try again.'
  );
}

export function useQueryClientInstance() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // C5: Global error handlers — surfaces any silent query/mutation failure via toast
        queryCache: new QueryCache({
          onError: (error, query) => {
            // Only show toast for background refetches, not initial loads
            // (initial load errors are handled by each page's own UI)
            if (query.state.data !== undefined) {
              toast.error(`Failed to refresh data: ${getErrorMessage(error)}`);
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            toast.error(getErrorMessage(error));
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000, // C4: Garbage-collect inactive cache entries after 10 min
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  return queryClient;
}
