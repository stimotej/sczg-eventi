"use client";

import { createRentiqeOrder, deleteRentiqeOrder } from "@/lib/data/rentiqe";
import { useCheckout } from "@/modules/checkout/context/checkout-context";
import { formatCurrency } from "@/modules/checkout/utils/pricing";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import * as React from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
);

type StripeCheckoutProps = {
  clientSecret: string;
  amount: number;
  currency: string;
  cartId: string;
};

export function StripeCheckout({
  clientSecret,
  amount,
  currency,
  cartId,
}: StripeCheckoutProps) {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        Neispravna konfiguracija
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <StripePaymentForm amount={amount} currency={currency} cartId={cartId} />
    </Elements>
  );
}

function StripePaymentForm({
  amount,
  currency,
  cartId,
}: {
  amount: number;
  currency: string;
  cartId: string;
}) {
  const { personalDetails, address } = useCheckout();
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const formattedAmount = React.useMemo(
    () => formatCurrency(amount, currency),
    [amount, currency],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setMessage(null);

    if (
      address.lat === null ||
      address.lng === null ||
      !personalDetails.customerEmail.trim()
    ) {
      setMessage("Nedostaju podaci za završetak narudžbe.");
      setIsProcessing(false);
      return;
    }

    try {
      await createRentiqeOrder({
        cartId,
        guestEmail: personalDetails.customerEmail.trim(),
        ...(personalDetails.isCompanyPayer && personalDetails.companyName
          ? { companyName: personalDetails.companyName.trim() }
          : {}),
        ...(personalDetails.isCompanyPayer && personalDetails.vatNumber
          ? { vatNumber: personalDetails.vatNumber.trim() }
          : {}),
        billingLocation: {
          addressLine1: address.addressLine1.trim(),
          ...(address.addressLine2
            ? { addressLine2: address.addressLine2.trim() }
            : {}),
          city: address.city.trim(),
          ...(address.state ? { state: address.state.trim() } : {}),
          postal: address.postal.trim(),
          country: address.country.trim(),
          ...(address.message ? { message: address.message.trim() } : {}),
          lat: address.lat,
          lng: address.lng,
        },
      });
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Došlo je do pogreške prilikom izrade narudžbe.",
      );
      setIsProcessing(false);
      return;
    }

    const returnUrl = new URL(
      "/eventi/payment-complete",
      window.location.origin,
    );

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl.toString(),
      },
      redirect: "always",
    });

    if (error) {
      setMessage(error.message ?? "Plaćanje nije uspjelo.");
      void deleteRentiqeOrder({ cartId }).catch(() => {});
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isProcessing ? "Obrada..." : `Plati ${formattedAmount}`}
      </button>
      {message ? <p className="text-sm text-red-600">{message}</p> : null}
    </form>
  );
}
