'use client';

import { I18nProvider } from '@heroui/react';
import { QueryProvider } from './QueryProvider';
import { AuthProvider } from './AuthProvider';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }) {
  return (
    <I18nProvider>
      <QueryProvider>
        <AuthProvider>
          {children}
          <Toaster position="top-center" reverseOrder={false} />
        </AuthProvider>
      </QueryProvider>
    </I18nProvider>
  );
}

