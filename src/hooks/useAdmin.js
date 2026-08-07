'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success(data?.message || 'User role updated successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to update user role.');
    }
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/api/admin/users/${id}`);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success(data?.message || 'User removed successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to remove user.');
    }
  });
}

export function useFeatureCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.patch(`/api/admin/campaigns/${id}/feature`);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign featured status updated!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to update campaign featured status.');
    }
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
      toast.success('Report updated successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to update report.');
    }
  });
}

export function useSubmitReport() {
  return useMutation({
    mutationFn: async (reportData) => {
      const { data } = await api.post('/api/reports', reportData);
      return data;
    },
    onSuccess: () => {
      toast.success('Campaign reported successfully.');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to submit report.');
    }
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['adminPendingCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success(data?.message || 'Campaign approved successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to approve campaign.');
    }
  });
}

export function useRejectCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }) => {
      const { data } = await api.patch(`/api/admin/campaigns/${id}/reject`, { reason });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['adminPendingCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast.success(data?.message || 'Campaign rejected and creator notified!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to reject campaign.');
    }
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['adminAllCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['adminPendingCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success(data?.message || 'Campaign deleted successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to delete campaign.');
    }
  });
}

export function useSuspendCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.patch(`/api/admin/campaigns/${id}/suspend`);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['adminAllCampaigns'] });
      queryClient.invalidateQueries({ queryKey: ['adminReports'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success(data?.message || 'Campaign suspended successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to suspend campaign.');
    }
  });
}
