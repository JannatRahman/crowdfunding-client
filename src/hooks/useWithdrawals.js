'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myWithdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['pendingWithdrawals'] });
    },
  });
}

export function useApproveWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, adminNote }) => {
      const { data } = await api.patch(`/api/withdrawals/${id}/approve`, { adminNote });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingWithdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
    },
  });
}

export function useRejectWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, adminNote }) => {
      const { data } = await api.patch(`/api/withdrawals/${id}/reject`, { adminNote });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingWithdrawals'] });
    },
  });
}
