'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/shared/Footer';

export default function FooterGate() {
  const pathname = usePathname() || '';
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard) return null;
  return <Footer />;
}
