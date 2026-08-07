// Next.js Metadata API: auto-generates /sitemap.xml at build time
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

export default function sitemap() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const now = new Date().toISOString();

  // Static routes — add more as new public pages are created
  const staticRoutes = [
    { url: `${baseUrl}/`,           lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${baseUrl}/campaigns`,  lastModified: now, changeFrequency: 'hourly',  priority: 0.9 },
    { url: `${baseUrl}/login`,      lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/register`,   lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  return staticRoutes;
}
