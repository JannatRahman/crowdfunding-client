'use client';

import Link from 'next/link';
import { ROUTES } from '@/utils/constants';

/**
 * CrowdFund brand logo.
 *
 * <Logo />                     → gradient badge + "CrowdFund" wordmark (light bg)
 * <Logo light />                → light badge + "CrowdFund" (dark backgrounds, e.g. footer)
 * <Logo size={28} />            → smaller mark
 * <Logo withText={false} />     → mark only
 */
export default function Logo({ size = 40, withText = true, light = false }) {
  const mark = (
    <span
      className={`flex items-center justify-center rounded-xl shadow-md shrink-0 ${
        light
          ? 'bg-gradient-to-tr from-cf-cream to-cf-tan text-cf-dark'
          : 'bg-gradient-to-tr from-cf-dark to-cf-brown text-cf-cream'
      }`}
      style={{ width: size, height: size }}
    >
      <svg
        width={Math.round(size * 0.6)}
        height={Math.round(size * 0.6)}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 20.6c-.3 0-.6-.1-.9-.3C6.9 17.7 3.5 14.9 3.5 11.4 3.5 9 5.4 7 7.8 7c1.6 0 3 .8 3.9 2.1C12.6 7.8 14 7 15.6 7c2.4 0 4.3 2 4.3 4.4 0 3.5-3.4 6.3-7.6 8.9-.3.2-.6.3-.9.3z"
          fill="currentColor"
        />
        <path
          d="M16.6 2.6l.65 1.95 1.95.65-1.95.65-.65 1.95-.65-1.95-1.95-.65 1.95-.65.65-1.95z"
          fill="currentColor"
          opacity="0.9"
        />
      </svg>
    </span>
  );

  if (!withText) {
    return (
      <Link href={ROUTES.HOME} className="inline-flex items-center" aria-label="CrowdFund home">
        {mark}
      </Link>
    );
  }

  return (
    <Link href={ROUTES.HOME} className="flex items-center gap-3 group" aria-label="CrowdFund home">
      {mark}
      <span
        className={`font-extrabold tracking-tight ${light ? 'text-cf-cream' : 'text-cf-dark'}`}
        style={{ fontSize: Math.round(size * 0.55) }}
      >
        CrowdFund
      </span>
    </Link>
  );
}
