import CampaignsExplorer from '@/components/campaign/CampaignsExplorer';

export const metadata = {
  title: 'Explore Campaigns',
  description: 'Browse active crowdfunding campaigns, filter by category, and back the projects you believe in.',
};

export default function CampaignsPage() {
  return <CampaignsExplorer />;
}
