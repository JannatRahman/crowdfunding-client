'use client';

import { motion } from 'framer-motion';
import Logo from '@/components/shared/Logo';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants';

const HIGHLIGHTS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Transparent Funding',
    desc: 'Every credit tracked in the open — no surprises, ever.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Secure Payments',
    desc: 'Bank-grade encryption and verified payouts for creators.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: '85K+ Supporters',
    desc: 'Join a community that backs ideas worth believing in.',
  },
];

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-[calc(100vh-8rem)] lg:min-h-screen relative overflow-hidden bg-cf-cream">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-cf-tan/40 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 w-[28rem] h-[28rem] bg-cf-tan/30 rounded-full blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-[inherit]">
        {/* Brand panel */}
        <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-cf-dark via-cf-brown to-cf-dark p-12 xl:p-16 text-cf-cream flex-col justify-between">
          {/* Decorative orbs */}
          <motion.div
            animate={{ y: [0, -30, 0], opacity: [0.25, 0.45, 0.25] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-16 right-16 w-64 h-64 bg-cf-tan/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 30, 0], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-24 left-10 w-72 h-72 bg-cf-cream/10 rounded-full blur-3xl"
          />
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '28px 28px' }} />

          <div className="relative z-10">
            <Logo light />
          </div>

          <div className="relative z-10 max-w-md space-y-6">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cf-cream/10 border border-cf-cream/20 backdrop-blur text-[11px] font-bold uppercase tracking-widest text-cf-cream/90"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cf-tan animate-pulse" />
              Crowdfunding reimagined
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight"
            >
              Where bold ideas find their backers.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-cf-cream/75 text-base leading-relaxed"
            >
              CrowdFund connects creators with a global community ready to fund the future — transparent, secure, and built on trust.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-4 pt-2"
            >
              {HIGHLIGHTS.map((item) => (
                <div key={item.title} className="flex items-start gap-3.5">
                  <span className="shrink-0 w-10 h-10 rounded-xl bg-cf-cream/10 border border-cf-cream/20 flex items-center justify-center text-cf-tan">
                    {item.icon}
                  </span>
                  <div>
                    <p className="font-bold text-sm text-cf-cream">{item.title}</p>
                    <p className="text-xs text-cf-cream/60 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative z-10 flex items-center gap-4 bg-cf-cream/5 border border-cf-cream/15 rounded-2xl p-5 backdrop-blur"
          >
            <div className="flex -space-x-2.5">
              {['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80'].map((src) => (
                <img key={src} src={src} alt="" className="w-9 h-9 rounded-full border-2 border-cf-dark object-cover" />
              ))}
            </div>
            <p className="text-xs text-cf-cream/80 leading-relaxed">
              <span className="font-extrabold text-cf-cream">12,000+ creators</span> have brought their projects to life with community backing.
            </p>
          </motion.div>
        </div>

        {/* Form panel */}
        <div className="flex items-center justify-center px-4 sm:px-8 py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="lg:hidden flex justify-center mb-8">
              <Logo size={44} />
            </div>

            <div className="text-center lg:text-left mb-8">
              <h1 className="text-3xl md:text-4xl font-extrabold text-cf-dark tracking-tight">{title}</h1>
              <p className="text-cf-brown font-medium mt-2">{subtitle}</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-cf-brown/10 border border-cf-tan/60 p-6 sm:p-8">
              {children}
            </div>

            {footer && (
              <div className="mt-6 text-center">
                {footer}
              </div>
            )}

            <div className="mt-8 flex items-center justify-center gap-6 lg:hidden">
              <Link href={ROUTES.HOME} className="text-xs font-semibold text-cf-brown hover:text-cf-dark transition-colors">Home</Link>
              <Link href={ROUTES.CAMPAIGNS} className="text-xs font-semibold text-cf-brown hover:text-cf-dark transition-colors">Campaigns</Link>
              <Link href="#" className="text-xs font-semibold text-cf-brown hover:text-cf-dark transition-colors">Help Center</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
