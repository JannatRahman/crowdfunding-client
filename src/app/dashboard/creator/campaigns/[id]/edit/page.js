'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCampaign, useUpdateCampaign } from '@/hooks/useCampaigns';
import CampaignForm from '@/components/campaign/CampaignForm';
import { Card, CardBody } from '@heroui/react';
import { PageLoader } from '@/components/shared/LoadingSpinner';
import { ROUTES } from '@/utils/constants';

export default function EditCampaignPage() {
  const params = useParams();
  const router = useRouter();
  const { data, isLoading } = useCampaign(params.id);
  const updateCampaign = useUpdateCampaign();

  if (isLoading) return <PageLoader />;
  if (!data?.campaign) return <div className="text-center py-20 text-gray-500">Campaign not found</div>;

  const campaign = data.campaign;

  const handleSubmit = (formData) => {
    updateCampaign.mutate({ id: params.id, ...formData }, {
      onSuccess: () => router.push(ROUTES.CREATOR_CAMPAIGNS),
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Edit Campaign</h1>
      <Card>
        <CardBody className="p-6">
          <CampaignForm
            initialData={{
              title: campaign.title,
              description: campaign.description,
              shortDescription: campaign.shortDescription,
              category: campaign.category,
              goalAmount: campaign.goalAmount,
              endDate: campaign.endDate?.split('T')[0] || '',
            }}
            onSubmit={handleSubmit}
            isLoading={updateCampaign.isPending}
            submitText="Update Campaign"
          />
        </CardBody>
      </Card>
    </div>
  );
}
