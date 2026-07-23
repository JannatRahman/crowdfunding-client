'use client';

import { I18nProvider } from '@heroui/react';
import { QueryProvider } from './QueryProvider';
import { AuthProvider } from './AuthProvider';

export function Providers({ children }) {
  return (
    <I18nProvider>
      <QueryProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </QueryProvider>
    </I18nProvider>
  );
}
