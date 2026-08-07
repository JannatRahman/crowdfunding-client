'use client';

import Link from 'next/link';
import { ROUTES } from '@/utils/constants';
import { motion } from 'framer-motion';

export default function Footer() {
  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'GitHub',
      url: 'https://github.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-cf-dark text-gray-300 mt-auto border-t border-cf-brown/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-cf-brown to-cf-tan rounded-xl flex items-center justify-center shadow-md">
                <span className="text-cf-dark font-extrabold text-lg">C</span>
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-cf-cream">CrowdFund</span>
            </div>
            <p className="text-sm text-cf-tan/70 max-w-sm leading-relaxed">
              Empowering global change-makers to share ideas, gain backers, and build a brighter future through community-driven crowdfunding.
            </p>
            
            {/* Social media icons */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold tracking-wider text-cf-tan uppercase">Connect With Us</h4>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-xl bg-cf-brown/20 border border-cf-brown/40 flex items-center justify-center text-cf-tan hover:text-cf-cream hover:bg-cf-brown/50 transition-colors shadow-sm"
                    aria-label={`Visit our ${social.name} profile`}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h3 className="text-cf-cream font-bold tracking-wide">Platform</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href={ROUTES.CAMPAIGNS} className="hover:text-cf-tan text-cf-tan/80 transition-colors">
                  Explore Campaigns
                </Link>
              </li>
              <li>
                <Link href={ROUTES.REGISTER} className="hover:text-cf-tan text-cf-tan/80 transition-colors">
                  Start a Campaign
                </Link>
              </li>
              <li>
                <span className="hover:text-cf-tan text-cf-tan/80 transition-colors cursor-pointer">
                  How It Works
                </span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h3 className="text-cf-cream font-bold tracking-wide">Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <span className="hover:text-cf-tan text-cf-tan/80 transition-colors cursor-pointer">
                  Help Center
                </span>
              </li>
              <li>
                <span className="hover:text-cf-tan text-cf-tan/80 transition-colors cursor-pointer">
                  Trust & Safety
                </span>
              </li>
              <li>
                <span className="hover:text-cf-tan text-cf-tan/80 transition-colors cursor-pointer">
                  Creator Resources
                </span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h3 className="text-cf-cream font-bold tracking-wide">Stay Updated</h3>
            <p className="text-xs text-cf-tan/70 leading-relaxed">
              Subscribe to get the latest trending campaigns and platform updates delivered straight to your inbox.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full px-3 py-2 text-xs rounded-xl bg-cf-brown/15 border border-cf-brown/40 text-cf-cream placeholder-cf-tan/50 focus:outline-none focus:border-cf-tan transition-all"
                required
              />
              <button
                type="submit"
                className="px-3 py-2 text-xs font-bold rounded-xl bg-cf-tan text-cf-dark hover:bg-cf-cream hover:shadow transition-all cursor-pointer whitespace-nowrap"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-cf-brown/20 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-cf-tan/60">
          <div>
            &copy; {new Date().getFullYear()} CrowdFund Inc. All rights reserved.
          </div>
          <div className="flex gap-6">
            <span className="hover:text-cf-cream cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-cf-cream cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-cf-cream cursor-pointer transition-colors">Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
