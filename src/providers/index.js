'use client';

import { HeroUIProvider } from '@heroui/react';
import { QueryProvider } from './QueryProvider';
import { AuthProvider } from './AuthProvider';

export function Providers({ children }) {
  return (
    <HeroUIProvider>
      <QueryProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </QueryProvider>
    </HeroUIProvider>
  );
}
