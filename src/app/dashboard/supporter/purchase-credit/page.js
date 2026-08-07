'use client';

import { useState } from 'react';
import { Button, Card, CardContent } from '@heroui/react';
import { FormInput } from '@/components/shared/FormField';
import api from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { formatCurrency } from '@/utils/formatters';
import SimpleModal, { SimpleModalHeader, SimpleModalBody, SimpleModalFooter } from '@/components/shared/SimpleModal';

const PACKAGES = [
  { credits: 100, price: 10, title: 'Starter Pack', badge: 'Standard rate', color: 'border-blue-200 hover:border-blue-400' },
  { credits: 300, price: 25, title: 'Popular Pack', badge: 'Bonus +20 credits!', popular: true, color: 'border-green-200 hover:border-green-400' },
  { credits: 800, price: 60, title: 'Super Pack', badge: 'Bonus +80 credits!', color: 'border-amber-200 hover:border-amber-400' },
  { credits: 1500, price: 110, title: 'Mega Pack', badge: 'Bonus +400 credits!', color: 'border-purple-200 hover:border-purple-400' },
];

export default function PurchaseCreditPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Checkout modal states
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null); // { price, credits }
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState(user?.name || '');
  const [formError, setFormError] = useState('');

  const handleOpenCheckout = (pack) => {
    if (!pack.price || pack.price <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    setError('');
    setSelectedPack(pack);
    setCardNumber('');
    setCardExp('');
    setCardCvc('');
    setFormError('');
    setCheckoutOpen(true);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setFormError('Please enter a valid 16-digit card number.');
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardExp)) {
      setFormError('Please enter expiration date in MM/YY format.');
      return;
    }
    if (cardCvc.length < 3 || cardCvc.length > 4) {
      setFormError('Please enter a valid 3 or 4 digit CVC.');
      return;
    }
    if (!cardName.trim()) {
      setFormError('Please enter cardholder name.');
      return;
    }

    setFormError('');
    setIsLoading(true);
    try {
      const { data } = await api.post('/api/payments/purchase-credit', {
        amount: selectedPack.price,
        credits: selectedPack.credits,
      });

      if (data.success) {
        setSuccess(true);
        setCheckoutOpen(false);
        setAmount('');
        // Reload to update credits in navbar
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      setFormError(err.response?.data?.error || 'Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-cf-dark tracking-tight">Purchase Credits</h1>
        <p className="text-cf-brown font-medium mt-1">Select a credit package or purchase custom credits instantly</p>
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

      {/* Credit Package Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PACKAGES.map((pack) => (
          <Card
            key={pack.credits}
            className={`border-2 relative flex flex-col justify-between p-5 hover:shadow-md transition-shadow cursor-pointer ${pack.color} ${
              pack.popular ? 'bg-gradient-to-b from-green-50/30 to-white' : 'bg-white'
            }`}
            onClick={() => handleOpenCheckout({ price: pack.price, credits: pack.credits })}
          >
            {pack.popular && (
              <span className="absolute top-2 right-2 bg-green-600 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full">
                Popular
              </span>
            )}
            <div>
              <p className="text-cf-brown text-xs font-semibold uppercase tracking-wider mb-1">{pack.title}</p>
              <h3 className="text-2xl font-black text-cf-dark">{pack.credits} Credits</h3>
              <p className="text-xs text-green-600 font-bold mt-1">{pack.badge}</p>
            </div>
            <div className="mt-6 flex items-baseline justify-between pt-3 border-t border-gray-100">
              <span className="text-gray-400 text-xs font-medium">Price</span>
              <span className="text-xl font-bold text-cf-dark">${pack.price}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Custom Amount Section */}
      <Card className="border border-cf-tan bg-white shadow-sm max-w-xl mx-auto">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-cf-dark block mb-2">Purchase Custom Amount</label>
              <FormInput
                type="number"
                placeholder="Enter custom amount in USD"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                startContent={<span className="text-gray-400 font-bold">$</span>}
                min="1"
                disabled={isLoading}
                classNames={{
                  inputWrapper: "border-cf-tan hover:border-cf-brown focus-within:!border-cf-dark rounded-xl",
                }}
              />
              {amount && parseFloat(amount) > 0 && (
                <p className="text-xs text-cf-brown font-semibold mt-2">
                  You will receive <span className="text-green-600 font-bold">{parseFloat(amount) * 10} Credits</span> (base rate of 10 credits / $)
                </p>
              )}
            </div>

            <Button
              className="w-full bg-cf-dark hover:bg-[#3A2A2A] text-cf-cream font-bold py-6 text-md rounded-xl shadow-md cursor-pointer"
              onPress={() => handleOpenCheckout({ price: parseFloat(amount), credits: parseFloat(amount) * 10 })}
              isLoading={isLoading}
              isDisabled={!amount || parseFloat(amount) <= 0}
            >
              Continue to Payment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* High-Fidelity Stripe Checkout Simulation Modal */}
      <SimpleModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} size="md">
        <div className="bg-gray-50 flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-1.5">
            <span className="text-blue-600 font-black tracking-tight text-lg">stripe</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest pt-0.5">Checkout</span>
          </div>
          <button
            onClick={() => setCheckoutOpen(false)}
            className="text-gray-400 hover:text-gray-600 font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleCheckoutSubmit}>
          <SimpleModalBody className="space-y-6 bg-white">
            <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase">Product</p>
                <p className="font-bold text-gray-800">{selectedPack?.credits} Credits Wallet Upgrade</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 font-medium uppercase">Total</p>
                <p className="font-extrabold text-lg text-gray-900">${selectedPack?.price?.toFixed(2)}</p>
              </div>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-lg border border-red-200">
                ⚠️ {formError}
              </div>
            )}

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Card Details</h4>
              
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Card number"
                    maxLength="19"
                    value={cardNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                      setCardNumber(val);
                    }}
                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:border-blue-500 focus:outline-none placeholder-gray-400 shadow-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-gray-400">💳</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    maxLength="5"
                    placeholder="MM/YY"
                    value={cardExp}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (val.length === 2 && !val.includes('/')) {
                        val = val + '/';
                      }
                      setCardExp(val);
                    }}
                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:border-blue-500 focus:outline-none placeholder-gray-400 shadow-sm"
                  />
                  <input
                    type="password"
                    required
                    maxLength="4"
                    placeholder="CVC"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:border-blue-500 focus:outline-none placeholder-gray-400 shadow-sm"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder="Name on card"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:border-blue-500 focus:outline-none placeholder-gray-400 shadow-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-1 text-[11px] text-gray-400">
              <span>🔒 Secured by Stripe</span>
            </div>
          </SimpleModalBody>

          <SimpleModalFooter>
            <Button
              variant="light"
              onPress={() => setCheckoutOpen(false)}
              isDisabled={isLoading}
              className="rounded-xl text-sm font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-4.5 rounded-xl text-sm transition-colors cursor-pointer"
            >
              Pay ${selectedPack?.price?.toFixed(2)}
            </Button>
          </SimpleModalFooter>
        </form>
      </SimpleModal>
    </div>
  );
}
