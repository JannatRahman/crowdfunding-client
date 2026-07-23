import CampaignCard from './CampaignCard';
import EmptyState from '@/components/shared/EmptyState';
import { CardLoader } from '@/components/shared/LoadingSpinner';

export default function CampaignGrid({ campaigns, isLoading, emptyMessage = 'No campaigns found' }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardLoader key={i} />
        ))}
      </div>
    );
  }

  if (!campaigns?.length) {
    return (
      <EmptyState
        icon="🔍"
        title={emptyMessage}
        description="Try adjusting your search or filters"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign, index) => (
        <CampaignCard key={campaign._id} campaign={campaign} index={index} />
      ))}
    </div>
  );
}
