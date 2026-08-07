/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  // ─── Performance ────────────────────────────────────────────────────────────
  compress: true,
  poweredByHeader: false, // Don't advertise Next.js to attackers

  // ─── Image Domains ──────────────────────────────────────────────────────────
  // Allow next/image to optimise images from these remote sources.
  images: {
    remotePatterns: [
      // Unsplash — hero banners and campaign images
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // ImgBB — user-uploaded campaign images
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        pathname: '/**',
      },
      // Google profile pictures (OAuth)
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      // Other common avatar/CDN hostnames
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },

  // ─── HTTP Security Headers ───────────────────────────────────────────────────
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: [
          // Prevent clickjacking
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Stop MIME sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Control referrer information
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Disable dangerous browser features
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Content-Security-Policy — adjust 'connect-src' if you add analytics
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Allow inline styles (needed by Tailwind / HeroUI) and external CDN fonts
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Google Fonts
              "font-src 'self' https://fonts.gstatic.com",
              // Scripts: self + Stripe.js
              "script-src 'self' 'unsafe-inline' https://js.stripe.com",
              // Frames: Stripe checkout only
              "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
              // Images: self, data URIs, our CDN sources
              "img-src 'self' data: blob: https://images.unsplash.com https://i.ibb.co https://*.googleusercontent.com",
              // API calls: self and backend
              "connect-src 'self' https://api.stripe.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
