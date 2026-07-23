'use client';

import { useRouter } from 'next/navigation';
import { useCreateCampaign } from '@/hooks/useCampaigns';
import CampaignForm from '@/components/campaign/CampaignForm';
import { Card, CardContent } from '@heroui/react';
import { ROUTES } from '@/utils/constants';

export default function NewCampaignPage() {
  const router = useRouter();
  const createCampaign = useCreateCampaign();

  const handleSubmit = (data) => {
    createCampaign.mutate(data, {
      onSuccess: () => router.push(ROUTES.CREATOR_CAMPAIGNS),
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Create New Campaign</h1>
      <Card>
        <CardContent className="p-6">
          <CampaignForm onSubmit={handleSubmit} isLoading={createCampaign.isPending} submitText="Create Campaign" />
        </CardContent>
      </Card>
    </div>
  );
}
