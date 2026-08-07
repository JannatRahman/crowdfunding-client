'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useAdminStats() {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const { data } = await api.get('/api/admin/stats');
      return data;
    },
  });
}

export function useAdminUsers(params = {}) {
  return useQuery({
    queryKey: ['adminUsers', params],
    queryFn: async () => {
      const { data } = await api.get('/api/admin/users', { params });
      return data;
    },
  });
}

export function useChangeUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, role }) => {
      const { data } = await api.patch(`/api/admin/users/${id}/role`, { role });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/api/admin/users/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });
}

export function useFeatureCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.patch(`/api/admin/campaigns/${id}/feature`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}

export function useAdminReports(params = {}) {
  return useQuery({
    queryKey: ['adminReports', params],
    queryFn: async () => {
      const { data } = await api.get('/api/reports', { params });
      return data;
    },
  });
}

export function useUpdateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, adminNote }) => {
      const { data } = await api.patch(`/api/reports/${id}`, { status, adminNote });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminReports'] });
    },
  });
}

export function useSubmitReport() {
  return useMutation({
    mutationFn: async (reportData) => {
      const { data } = await api.post('/api/reports', reportData);
      return data;
    },
  });
}

// ─── Admin Campaign Approval Hooks ───────────────────────────────────────────

export function useAdminPendingCampaigns() {
  return useQuery({
    queryKey: ['adminPendingCampaigns'],
    queryFn: async () => {
      const { data } = await api.get('/api/admin/campaigns/pending');
      return data;
    },
  });
}

export function useApproveCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.patch(`/api/admin/campaigns/${id}/approve`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPendingCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}

export function useRejectCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }) => {
      const { data } = await api.patch(`/api/admin/campaigns/${id}/reject`, { reason });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPendingCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
}

// ─── Admin Campaign Management Hooks ─────────────────────────────────────────

export function useAdminAllCampaigns(params = {}) {
  return useQuery({
    queryKey: ['adminAllCampaigns', params],
    queryFn: async () => {
      const { data } = await api.get('/api/admin/all-campaigns', { params });
      return data;
    },
  });
}

export function useAdminDeleteCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/api/admin/campaigns/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAllCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['adminPendingCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}

export function useSuspendCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.patch(`/api/admin/campaigns/${id}/suspend`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAllCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['adminReports'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}
