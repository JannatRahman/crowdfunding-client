// Server Component — can export metadata for SEO
// All interactive JSX lives in _HomeClient.js (a 'use client' component)
import HomeClient from './_HomeClient';

export const metadata = {
  title: 'CrowdFund — Empower Ideas Through Community',
  description:
    'Browse the most-funded campaigns on CrowdFund. Back the projects you believe in and help creators bring their ideas to life with community-powered funding.',
  openGraph: {
    title: 'CrowdFund — Empower Ideas Through Community',
    description:
      'Browse the most-funded campaigns on CrowdFund. Back the projects you believe in.',
    url: '/',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    title: 'CrowdFund — Empower Ideas Through Community',
    description: 'Browse campaigns and back the projects you believe in.',
    images: ['/og-image.png'],
  },
};

export default function Home() {
  return <HomeClient />;
}
