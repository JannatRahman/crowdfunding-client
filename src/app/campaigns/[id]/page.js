import CampaignDetailClient from '@/components/campaign/CampaignDetailClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function generateMetadata({ params }) {
  const id = params?.id;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${API_URL}/api/campaigns/${id}`, {
      signal: controller.signal,
      next: { revalidate: 60 },
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    const campaign = data?.campaign;
    if (campaign?.title) {
      const description = (campaign.description || '').slice(0, 155);
      return {
        title: campaign.title,
        description: description || 'Back this campaign on CrowdFund.',
        openGraph: {
          title: campaign.title,
          description,
          images: campaign.images?.[0] ? [{ url: campaign.images[0] }] : undefined,
        },
      };
    }
  } catch {
    // Fall through to generic metadata below.
  }
  return {
    title: 'Campaign',
    description: 'Discover and back a crowdfunding campaign on CrowdFund.',
  };
}

export default function CampaignDetailPage() {
  return <CampaignDetailClient />;
}
