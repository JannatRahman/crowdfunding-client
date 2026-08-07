'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export function useMyWithdrawals(params = {}) {
  return useQuery({
    queryKey: ['myWithdrawals', params],
    queryFn: async () => {
      const { data } = await api.get('/api/withdrawals/my', { params });
      return data;
    },
  });
}

export function usePendingWithdrawals(params = {}) {
  return useQuery({
    queryKey: ['pendingWithdrawals', params],
    queryFn: async () => {
      const { data } = await api.get('/api/withdrawals/pending', { params });
      return data;
    },
  });
}

export function useCreateWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (withdrawalData) => {
      const { data } = await api.post('/api/withdrawals', withdrawalData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['myWithdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['pendingWithdrawals'] });
      toast.success(data?.message || 'Withdrawal request submitted successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to submit withdrawal request.');
    }
  });
}

export function useApproveWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, adminNote }) => {
      const { data } = await api.patch(`/api/withdrawals/${id}/approve`, { adminNote });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pendingWithdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast.success(data?.message || 'Withdrawal marked as successful!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to approve withdrawal.');
    }
  });
}

export function useRejectWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, adminNote }) => {
      const { data } = await api.patch(`/api/withdrawals/${id}/reject`, { adminNote });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pendingWithdrawals'] });
      toast.success(data?.message || 'Withdrawal request rejected.');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to reject withdrawal request.');
    }
  });
}
