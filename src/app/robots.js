// Next.js Metadata API: auto-generates /robots.txt at build time
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots

export default function robots() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Keep internal/auth/API routes out of search indexes
        disallow: [
          '/dashboard/',
          '/api/',
          '/payment/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
