'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useCampaigns(params = {}) {
  return useQuery({
    queryKey: ['campaigns', params],
    queryFn: async () => {
      const { data } = await api.get('/api/campaigns', { params });
      return data;
    },
  });
}

export function useCampaign(id) {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      const { data } = await api.get(`/api/campaigns/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useMyCampaigns(params = {}) {
  return useQuery({
    queryKey: ['myCampaigns', params],
    queryFn: async () => {
      const { data } = await api.get('/api/campaigns/my', { params });
      return data;
    },
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (campaignData) => {
      const { data } = await api.post('/api/campaigns', campaignData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...campaignData }) => {
      const { data } = await api.put(`/api/campaigns/${id}`, campaignData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['myCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/api/campaigns/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}

export function useUpdateCampaignStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await api.patch(`/api/campaigns/${id}/status`, { status });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['myCampaigns'] });
    },
  });
}
