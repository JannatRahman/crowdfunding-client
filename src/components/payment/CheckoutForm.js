'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import { formatCurrency } from '@/utils/formatters';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutFormInner({ amount, onSuccess, onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    });

    if (error) {
      console.error(error);
    }
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <ModalBody>
        <PaymentElement />
      </ModalBody>
      <ModalFooter>
        <Button variant="light" onPress={onClose}>Cancel</Button>
        <Button type="submit" color="primary" isLoading={isProcessing} isDisabled={!stripe}>
          Pay {formatCurrency(amount)}
        </Button>
      </ModalFooter>
    </form>
  );
}

export default function PaymentForm({ clientSecret, amount, onSuccess, onClose }) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutFormInner amount={amount} onSuccess={onSuccess} onClose={onClose} />
    </Elements>
  );
}
