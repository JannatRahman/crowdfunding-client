'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { withdrawalSchema } from '@/utils/validations';
import { useCreateWithdrawal } from '@/hooks/useWithdrawals';
import { Button, Input } from '@heroui/react';
import SimpleModal, { SimpleModalHeader, SimpleModalBody, SimpleModalFooter } from '@/components/shared/SimpleModal';

export default function WithdrawalForm({ campaigns, isOpen, onClose }) {
  const createWithdrawal = useCreateWithdrawal();

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      campaignId: '',
      amount: '',
      bankDetails: { accountHolder: '', accountNumber: '', bankName: '' },
    },
  });

  const onSubmit = async (data) => {
    createWithdrawal.mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <SimpleModal isOpen={isOpen} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleModalHeader>Request Withdrawal</SimpleModalHeader>
        <SimpleModalBody className="space-y-4">
          <Controller
            name="campaignId"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Select Campaign</option>
                {campaigns?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title} (Balance: ${c.currentAmount})
                  </option>
                ))}
              </select>
            )}
          />
          {errors.campaignId && <p className="text-red-500 text-xs">{errors.campaignId.message}</p>}

          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <Input
                value={field.value}
                onValueChange={(v) => field.onChange(parseFloat(v) || 0)}
                type="number"
                label="Amount ($)"
                placeholder="500"
                errorMessage={errors.amount?.message}
                isInvalid={!!errors.amount}
              />
            )}
          />

          <Controller
            name="bankDetails.accountHolder"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                onValueChange={field.onChange}
                label="Account Holder Name"
                errorMessage={errors.bankDetails?.accountHolder?.message}
                isInvalid={!!errors.bankDetails?.accountHolder}
              />
            )}
          />

          <Controller
            name="bankDetails.accountNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                onValueChange={field.onChange}
                label="Account Number"
                errorMessage={errors.bankDetails?.accountNumber?.message}
                isInvalid={!!errors.bankDetails?.accountNumber}
              />
            )}
          />

          <Controller
            name="bankDetails.bankName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                onValueChange={field.onChange}
                label="Bank Name"
                errorMessage={errors.bankDetails?.bankName?.message}
                isInvalid={!!errors.bankDetails?.bankName}
              />
            )}
          />
        </SimpleModalBody>
        <SimpleModalFooter>
          <Button variant="light" onPress={onClose}>Cancel</Button>
          <Button type="submit" color="primary" isLoading={createWithdrawal.isPending}>
            Submit Request
          </Button>
        </SimpleModalFooter>
      </form>
    </SimpleModal>
  );
}
