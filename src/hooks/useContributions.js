'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useMyContributions(params = {}) {
  return useQuery({
    queryKey: ['myContributions', params],
    queryFn: async () => {
      const { data } = await api.get('/api/contributions/my', { params });
      return data;
    },
  });
}

export function useCampaignContributions(campaignId) {
  return useQuery({
    queryKey: ['campaignContributions', campaignId],
    queryFn: async () => {
      const { data } = await api.get(`/api/contributions/campaign/${campaignId}`);
      return data;
    },
    enabled: !!campaignId,
  });
}

export function useCreateContribution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (contributionData) => {
      const { data } = await api.post('/api/contributions', contributionData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myContributions'] });
    },
  });
}
