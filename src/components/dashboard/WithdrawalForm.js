'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { creatorWithdrawalSchema } from '@/utils/validations';
import { useCreateWithdrawal } from '@/hooks/useWithdrawals';
import { Button } from '@heroui/react';
import { FormInput } from '@/components/shared/FormField';
import SimpleModal, { SimpleModalHeader, SimpleModalBody, SimpleModalFooter } from '@/components/shared/SimpleModal';

export default function WithdrawalForm({ availableCredits = 0, isOpen, onClose }) {
  const createWithdrawal = useCreateWithdrawal();

  const { control, handleSubmit, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(creatorWithdrawalSchema),
    defaultValues: {
      withdrawal_credit: 200,
      payment_system: 'stripe',
      account_number: '',
    },
  });

  const watchCredits = watch('withdrawal_credit', 200);
  const creditsNum = Number(watchCredits) || 0;
  const calculatedUSD = creditsNum / 20;

  // Insufficient credit check:
  // 1. Creator doesn't have at least 200 credits in total available credits
  // 2. Or the entered credits to withdraw exceeds available credits
  const isInsufficient = availableCredits < 200 || (creditsNum > availableCredits);

  const onSubmit = async (data) => {
    createWithdrawal.mutate({
      withdrawal_credit: Number(data.withdrawal_credit),
      payment_system: data.payment_system,
      account_number: data.account_number
    }, {
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
        <SimpleModalBody className="space-y-5 py-4">
          <div className="bg-cf-cream/40 border border-cf-tan/60 p-4.5 rounded-2xl flex justify-between items-center text-cf-dark font-medium">
            <div>
              <p className="text-xs uppercase font-bold text-cf-brown animate-pulse">Available Balance</p>
              <p className="text-2xl font-black text-cf-dark mt-0.5">{availableCredits} Credits</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase font-bold text-cf-brown">Value in USD</p>
              <p className="text-2xl font-black text-green-700 mt-0.5">${(availableCredits / 20).toFixed(2)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <Controller
              name="withdrawal_credit"
              control={control}
              render={({ field }) => (
                <FormInput
                  value={field.value}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  type="number"
                  label="Credits To Withdraw"
                  placeholder="200"
                  description="Minimum 200 credits required"
                  errorMessage={errors.withdrawal_credit?.message}
                  isInvalid={!!errors.withdrawal_credit}
                />
              )}
            />

            <div>
              <label className="text-xs font-bold text-cf-brown uppercase mb-1 block">
                Withdraw Amount ($)
              </label>
              <FormInput
                value={calculatedUSD ? `$${calculatedUSD.toFixed(2)}` : '$0.00'}
                readOnly
                disabled
                className="bg-gray-50 text-gray-500 font-bold rounded-lg cursor-not-allowed"
                description="Conversion rate: 20 credits = 1 dollar"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-cf-brown uppercase mb-1.5 block">
                Select Payment System
              </label>
              <Controller
                name="payment_system"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cf-dark bg-white font-medium text-cf-dark"
                  >
                    <option value="stripe">Stripe (Simulated Payout)</option>
                    <option value="bkash">Bkash</option>
                    <option value="rocket">Rocket</option>
                    <option value="nagad">Nagad</option>
                  </select>
                )}
              />
              {errors.payment_system && (
                <p className="text-red-500 text-xs mt-1">{errors.payment_system.message}</p>
              )}
            </div>

            <Controller
              name="account_number"
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  label="Account Number / Wallet Phone Number"
                  placeholder="e.g. acct_1234... or +88017..."
                  errorMessage={errors.account_number?.message}
                  isInvalid={!!errors.account_number}
                />
              )}
            />
          </div>

          {/* Insufficient Credit Warning */}
          {isInsufficient && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-center font-bold text-sm">
              ⚠️ Insufficient credit
            </div>
          )}
        </SimpleModalBody>
        <SimpleModalFooter>
          <Button variant="light" onPress={onClose} className="font-bold">
            Cancel
          </Button>
          {!isInsufficient && (
            <Button 
              type="submit" 
              className="bg-cf-dark text-cf-cream hover:bg-[#3A2A2A] font-bold rounded-xl"
              isLoading={createWithdrawal.isPending}
            >
              Withdraw
            </Button>
          )}
        </SimpleModalFooter>
      </form>
    </SimpleModal>
  );
}
