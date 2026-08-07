'use client';

import { useState } from 'react';
import { Button, Card, CardContent } from '@heroui/react';
import { FormInput } from '@/components/shared/FormField';
import api from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { formatCurrency } from '@/utils/formatters';
import SimpleModal, { SimpleModalHeader, SimpleModalBody, SimpleModalFooter } from '@/components/shared/SimpleModal';
import { toast } from 'react-hot-toast';

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
  const [paymentMethod, setPaymentMethod] = useState('stripe'); // 'stripe' | 'bkash' | 'nagad'
  const [formError, setFormError] = useState('');

  // bKash / Nagad input states
  const [walletNumber, setWalletNumber] = useState('');
  const [walletOtp, setWalletOtp] = useState('');
  const [walletPin, setWalletPin] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleOpenCheckout = (pack) => {
    if (!pack.price || pack.price <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    setError('');
    setSelectedPack(pack);
    setPaymentMethod('stripe');
    setWalletNumber('');
    setWalletOtp('');
    setWalletPin('');
    setOtpSent(false);
    setFormError('');
    setCheckoutOpen(true);
  };

  const handleStripeCheckout = async () => {
    setIsLoading(true);
    setFormError('');
    try {
      const { data } = await api.post('/api/payments/create-checkout-session', {
        price: selectedPack.price,
        credits: selectedPack.credits,
      });

      if (data.url) {
        toast.loading('Redirecting to Stripe Secure Checkout...');
        window.location.href = data.url;
      } else {
        setFormError('Failed to generate checkout URL from Stripe.');
        toast.error('Stripe setup error.');
      }
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.error || 'Failed to initialize Stripe checkout session.');
      toast.error('Failed to initialize payment.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletOtpRequest = (e) => {
    e.preventDefault();
    if (!/^(01)[3-9]\d{8}$/.test(walletNumber.trim())) {
      setFormError('Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX).');
      return;
    }
    setFormError('');
    setIsLoading(true);
    // Simulate sending OTP to Wallet Number
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      toast.success(`Verification code (OTP) sent to ${walletNumber}!`);
    }, 1000);
  };

  const handleWalletPaymentSubmit = async (e) => {
    e.preventDefault();
    if (walletOtp.trim().length < 4) {
      setFormError('Please enter the 4-6 digit verification code (OTP) sent to your mobile.');
      return;
    }
    if (walletPin.trim().length < 4) {
      setFormError('Please enter a valid wallet PIN.');
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
        toast.success(`Success! Added ${selectedPack.credits} credits to your wallet via ${paymentMethod === 'bkash' ? 'bKash' : 'Nagad'}.`);
        
        // Reload page to refresh context credits
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      setFormError(err.response?.data?.error || 'Payment processing failed. Please try again.');
      toast.error('Payment failed.');
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
            className={`border-2 relative flex flex-col justify-between p-5 hover:shadow-md transition-all duration-300 cursor-pointer ${pack.color} ${
              pack.popular ? 'bg-gradient-to-b from-green-50/30 to-white' : 'bg-white'
            }`}
            isPressable
            onClick={() => handleOpenCheckout({ price: pack.price, credits: pack.credits })}
          >
            <div className="p-0 flex flex-col justify-between h-full w-full">
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
              <div className="mt-6 flex items-baseline justify-between pt-3 border-t border-gray-100 w-full">
                <span className="text-gray-400 text-xs font-medium">Price</span>
                <span className="text-xl font-bold text-cf-dark">${pack.price}</span>
              </div>
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
              className="w-full bg-cf-dark hover:bg-[#3A2A2A] text-cf-cream font-bold py-6 text-md rounded-xl shadow-md cursor-pointer transition-transform active:scale-[0.98]"
              onPress={() => handleOpenCheckout({ price: parseFloat(amount), credits: parseFloat(amount) * 10 })}
              isLoading={isLoading}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              Continue to Payment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Selection & Checkout Modal */}
      <SimpleModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} size="md">
        {/* Modal Header & Tabs */}
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200/60">
            <h3 className="font-extrabold text-gray-800 text-lg">Choose Payment Method</h3>
            <button
              onClick={() => setCheckoutOpen(false)}
              className="text-gray-400 hover:text-gray-600 font-bold text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>
          
          {/* Method Selection Tabs */}
          <div className="grid grid-cols-3 text-center text-xs font-bold text-gray-500">
            <button
              type="button"
              onClick={() => { setPaymentMethod('stripe'); setFormError(''); }}
              className={`py-3 transition-colors border-b-2 hover:bg-gray-100 ${
                paymentMethod === 'stripe'
                  ? 'border-blue-600 text-blue-600 bg-white font-black'
                  : 'border-transparent'
              }`}
            >
              💳 Stripe
            </button>
            <button
              type="button"
              onClick={() => { setPaymentMethod('bkash'); setFormError(''); setOtpSent(false); }}
              className={`py-3 transition-colors border-b-2 hover:bg-gray-100 ${
                paymentMethod === 'bkash'
                  ? 'border-[#E2136E] text-[#E2136E] bg-white font-black'
                  : 'border-transparent'
              }`}
            >
              📱 bKash
            </button>
            <button
              type="button"
              onClick={() => { setPaymentMethod('nagad'); setFormError(''); setOtpSent(false); }}
              className={`py-3 transition-colors border-b-2 hover:bg-gray-100 ${
                paymentMethod === 'nagad'
                  ? 'border-[#EE2B24] text-[#EE2B24] bg-white font-black'
                  : 'border-transparent'
              }`}
            >
              🟧 Nagad
            </button>
          </div>
        </div>

        <SimpleModalBody className="space-y-6 bg-white py-6">
          {/* Product Summary */}
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Product</p>
              <p className="font-extrabold text-sm text-gray-800">{selectedPack?.credits} Credits Wallet Upgrade</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total</p>
              <p className="font-black text-md text-gray-900">${selectedPack?.price?.toFixed(2)}</p>
            </div>
          </div>

          {formError && (
            <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100 flex items-start gap-2">
              <span className="text-sm">⚠️</span>
              <span>{formError}</span>
            </div>
          )}

          {/* Payment Method Screens */}
          {paymentMethod === 'stripe' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50/20 text-center space-y-3">
                <span className="text-4xl">💳</span>
                <h4 className="font-bold text-gray-800">Secure Stripe Checkout</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  You will be securely redirected to Stripe hosted checkout to complete your debit/credit card payment.
                </p>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
                <span>🔒 Secured, end-to-end encrypted by Stripe Inc.</span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="light"
                  onPress={() => setCheckoutOpen(false)}
                  disabled={isLoading}
                  className="rounded-xl text-sm font-bold"
                >
                  Cancel
                </Button>
                <Button
                  onPress={handleStripeCheckout}
                  isLoading={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 rounded-xl text-sm shadow-md transition-colors cursor-pointer"
                >
                  Proceed to Stripe
                </Button>
              </div>
            </div>
          )}

          {/* bKash Simulation */}
          {paymentMethod === 'bkash' && (
            <div className="animate-fadeIn">
              {/* bKash Branded Container */}
              <div className="bg-[#E2136E] rounded-2xl p-6 text-white space-y-6 shadow-lg border border-pink-700">
                <div className="flex justify-between items-center border-b border-white/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black">bkash</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded">Payment</span>
                  </div>
                  <span className="text-xs font-bold text-pink-100">Merchant: CrowdFund</span>
                </div>

                {!otpSent ? (
                  <form onSubmit={handleWalletOtpRequest} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold tracking-wide uppercase text-pink-100 block">bKash Account Number</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 017XXXXXXXX"
                        maxLength="11"
                        value={walletNumber}
                        onChange={(e) => setWalletNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-3 bg-white text-gray-900 border-none rounded-xl text-md font-bold focus:outline-none placeholder-pink-300 shadow-inner"
                      />
                      <p className="text-[10px] text-pink-100/80">Enter the 11-digit personal or agent account number</p>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        type="button"
                        onClick={() => setCheckoutOpen(false)}
                        className="text-pink-100 hover:text-white font-bold text-sm"
                      >
                        Cancel
                      </button>
                      <Button
                        type="submit"
                        isLoading={isLoading}
                        className="bg-white text-[#E2136E] font-black px-6 py-2.5 rounded-xl text-sm shadow-md border-none cursor-pointer"
                      >
                        Proceed (Send OTP)
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleWalletPaymentSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-pink-100 block">Enter Verification Code</label>
                        <input
                          type="text"
                          required
                          placeholder="OTP"
                          maxLength="6"
                          value={walletOtp}
                          onChange={(e) => setWalletOtp(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-3 py-2.5 bg-white text-gray-900 border-none rounded-xl text-sm font-bold focus:outline-none placeholder-pink-300 text-center"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-pink-100 block">Enter bKash PIN</label>
                        <input
                          type="password"
                          required
                          placeholder="PIN"
                          maxLength="5"
                          value={walletPin}
                          onChange={(e) => setWalletPin(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-3 py-2.5 bg-white text-gray-900 border-none rounded-xl text-sm font-bold focus:outline-none placeholder-pink-300 text-center tracking-widest"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-pink-100 hover:text-white font-bold text-xs"
                      >
                        ← Back
                      </button>
                      <Button
                        type="submit"
                        isLoading={isLoading}
                        className="bg-white text-[#E2136E] font-black px-6 py-2.5 rounded-xl text-sm shadow-md border-none cursor-pointer"
                      >
                        Confirm Payment
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Nagad Simulation */}
          {paymentMethod === 'nagad' && (
            <div className="animate-fadeIn">
              {/* Nagad Branded Container */}
              <div className="bg-gradient-to-r from-[#EE2B24] to-[#F69220] rounded-2xl p-6 text-white space-y-6 shadow-lg border border-red-700">
                <div className="flex justify-between items-center border-b border-white/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black">nagad</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded">Checkout</span>
                  </div>
                  <span className="text-xs font-bold text-red-100">Merchant: CrowdFund</span>
                </div>

                {!otpSent ? (
                  <form onSubmit={handleWalletOtpRequest} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold tracking-wide uppercase text-red-100 block">Nagad Wallet Number</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 017XXXXXXXX"
                        maxLength="11"
                        value={walletNumber}
                        onChange={(e) => setWalletNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-3 bg-white text-gray-900 border-none rounded-xl text-md font-bold focus:outline-none placeholder-red-300 shadow-inner"
                      />
                      <p className="text-[10px] text-red-100/80">Enter the 11-digit Nagad personal account number</p>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        type="button"
                        onClick={() => setCheckoutOpen(false)}
                        className="text-red-100 hover:text-white font-bold text-sm"
                      >
                        Cancel
                      </button>
                      <Button
                        type="submit"
                        isLoading={isLoading}
                        className="bg-white text-[#EE2B24] font-black px-6 py-2.5 rounded-xl text-sm shadow-md border-none cursor-pointer"
                      >
                        Proceed (Send OTP)
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleWalletPaymentSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-red-100 block">Enter Verification Code</label>
                        <input
                          type="text"
                          required
                          placeholder="OTP"
                          maxLength="6"
                          value={walletOtp}
                          onChange={(e) => setWalletOtp(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-3 py-2.5 bg-white text-gray-900 border-none rounded-xl text-sm font-bold focus:outline-none placeholder-red-300 text-center"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-red-100 block">Enter Nagad PIN</label>
                        <input
                          type="password"
                          required
                          placeholder="PIN"
                          maxLength="4"
                          value={walletPin}
                          onChange={(e) => setWalletPin(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-3 py-2.5 bg-white text-gray-900 border-none rounded-xl text-sm font-bold focus:outline-none placeholder-red-300 text-center tracking-widest"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-red-100 hover:text-white font-bold text-xs"
                      >
                        ← Back
                      </button>
                      <Button
                        type="submit"
                        isLoading={isLoading}
                        className="bg-white text-[#EE2B24] font-black px-6 py-2.5 rounded-xl text-sm shadow-md border-none cursor-pointer"
                      >
                        Confirm Payment
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </SimpleModalBody>
      </SimpleModal>
    </div>
  );
}
