'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { withdrawalSchema } from '@/utils/validations';
import { useCreateWithdrawal } from '@/hooks/useWithdrawals';
import { Button, Input, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import { useState } from 'react';

export default function WithdrawalForm({ campaigns, isOpen, onClose }) {
  const createWithdrawal = useCreateWithdrawal();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
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
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Request Withdrawal</ModalHeader>
          <ModalBody className="space-y-4">
            <select
              {...register('campaignId')}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Select Campaign</option>
              {campaigns?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title} (Balance: ${c.currentAmount})
                </option>
              ))}
            </select>
            {errors.campaignId && <p className="text-red-500 text-xs">{errors.campaignId.message}</p>}

            <Input
              {...register('amount', { valueAsNumber: true })}
              type="number"
              label="Amount ($)"
              placeholder="500"
              errorMessage={errors.amount?.message}
              isInvalid={!!errors.amount}
            />

            <Input
              {...register('bankDetails.accountHolder')}
              label="Account Holder Name"
              errorMessage={errors.bankDetails?.accountHolder?.message}
              isInvalid={!!errors.bankDetails?.accountHolder}
            />

            <Input
              {...register('bankDetails.accountNumber')}
              label="Account Number"
              errorMessage={errors.bankDetails?.accountNumber?.message}
              isInvalid={!!errors.bankDetails?.accountNumber}
            />

            <Input
              {...register('bankDetails.bankName')}
              label="Bank Name"
              errorMessage={errors.bankDetails?.bankName?.message}
              isInvalid={!!errors.bankDetails?.bankName}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>Cancel</Button>
            <Button type="submit" color="primary" isLoading={createWithdrawal.isPending}>
              Submit Request
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
