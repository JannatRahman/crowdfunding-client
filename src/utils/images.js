// Serves responsive, CDN-resized images instead of full-resolution originals.
// Unsplash URLs without explicit sizing params can be up to ~5760px wide and are
// the single biggest contributor to slow loads. Other hosts pass through as-is.
export function getOptimizedImage(src, width = 1200, quality = 80) {
  if (!src || typeof src !== 'string') return src;
  if (!src.includes('images.unsplash.com')) return src;

  const [base, query = ''] = src.split('?');
  const params = new URLSearchParams(query);

  // Already sized / pre-processed — leave untouched.
  if (params.has('w') || params.has('h') || params.has('auto')) return src;

  params.set('auto', 'format');
  params.set('fit', 'crop');
  params.set('w', String(width));
  params.set('q', String(quality));
  return `${base}?${params.toString()}`;
}
