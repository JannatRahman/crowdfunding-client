'use client';

import { useState } from 'react';
import { Button, Input, Card, CardContent } from '@heroui/react';
import api from '@/lib/api';
import { formatCurrency } from '@/utils/formatters';

export default function PurchaseCreditPage() {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handlePurchase = async (v) => {
    const purchaseAmount = parseFloat(v || amount);
    if (!purchaseAmount || purchaseAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess(false);
    try {
      const { data } = await api.post('/api/payments/purchase-credit', { amount: purchaseAmount });
      if (data.success) {
        setSuccess(true);
        setAmount('');
        // Reload to update credits in navbar
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to purchase credits. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-cf-dark tracking-tight">Purchase Credits</h1>
        <p className="text-cf-brown font-medium mt-1">Add credits to your wallet to fund your favorite campaigns</p>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-xl text-green-700 text-sm font-semibold shadow-sm animate-pulse">
          Credits purchased successfully! Refreshing your wallet...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-sm font-semibold shadow-sm">
          {error}
        </div>
      )}

      <Card className="border border-cf-tan bg-white shadow-sm">
        <CardContent className="p-6 space-y-6">
          <div>
            <label className="text-sm font-bold text-cf-dark block mb-2">Select Predefined Amount</label>
            <div className="grid grid-cols-3 gap-3">
              {[20, 50, 100].map((val) => (
                <Button
                  key={val}
                  variant="bordered"
                  className="border-2 border-cf-tan text-cf-dark hover:border-cf-brown hover:bg-cf-cream/20 font-bold py-6 rounded-xl text-md"
                  onPress={() => handlePurchase(val)}
                  isDisabled={isLoading}
                >
                  ${val}
                </Button>
              ))}
            </div>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-cf-tan/50"></div>
            <span className="flex-shrink mx-4 text-cf-brown font-bold text-xs uppercase tracking-wider">Or custom amount</span>
            <div className="flex-grow border-t border-cf-tan/50"></div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-cf-dark block mb-2">Amount to Purchase ($)</label>
              <Input
                type="number"
                placeholder="Enter custom amount"
                value={amount}
                onValueChange={setAmount}
                startContent={<span className="text-gray-400 font-bold">$</span>}
                min="1"
                isDisabled={isLoading}
                classNames={{
                  inputWrapper: "border-cf-tan hover:border-cf-brown focus-within:!border-cf-dark rounded-xl",
                }}
              />
            </div>

            <Button
              className="w-full bg-cf-dark hover:bg-[#3A2A2A] text-cf-cream font-bold py-6 text-md rounded-xl shadow-md"
              onPress={() => handlePurchase()}
              isLoading={isLoading}
              isDisabled={!amount || parseFloat(amount) <= 0}
            >
              Purchase Credits
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
