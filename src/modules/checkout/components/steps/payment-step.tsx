"use client";

import { refreshRentiqeCartPaymentIntent } from "@/lib/data/rentiqe";
import { RentiqeCartResponse } from "@/lib/data/rentiqe-types";
import { cn } from "@/lib/utils/cn";
import { StripeCheckout } from "@/modules/checkout/components/stripe/stripe-checkout";
import { useCheckout } from "@/modules/checkout/context/checkout-context";
import * as React from "react";

type PaymentStepProps = {
  cart: RentiqeCartResponse | null;
};

export function PaymentStep({ cart }: PaymentStepProps) {
  const { date, completedSteps } = useCheckout();
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  const [isLoadingIntent, setIsLoadingIntent] = React.useState(false);
  const [intentError, setIntentError] = React.useState<string | null>(null);

  const isReadyForPayment =
    completedSteps.date &&
    completedSteps.personalDetails &&
    completedSteps.address;

  React.useEffect(() => {
    let isMounted = true;

    async function refreshIntent() {
      if (!cart?.id || !isReadyForPayment) {
        setClientSecret(null);
        setIntentError(null);
        setIsLoadingIntent(false);
        return;
      }

      setIsLoadingIntent(true);
      setIntentError(null);

      try {
        const { clientSecret: nextClientSecret } =
          await refreshRentiqeCartPaymentIntent({
            cartId: cart.id,
          });

        if (isMounted) {
          setClientSecret(nextClientSecret ?? null);
        }
      } catch (error) {
        if (isMounted) {
          setClientSecret(null);
          setIntentError(
            error instanceof Error
              ? error.message
              : "Došlo je do pogreške prilikom pripreme plaćanja.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingIntent(false);
        }
      }
    }

    refreshIntent();

    return () => {
      isMounted = false;
    };
  }, [cart?.id, isReadyForPayment, date]);

  return (
    <section
      className={cn(
        "rounded-lg border border-neutral-200 p-4 transition",
        !isReadyForPayment && "pointer-events-none opacity-50",
      )}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold">4. Plaćanje</h3>
        <p className="text-sm text-neutral-500">
          {isReadyForPayment
            ? "Unesi podatke kartice za potvrdu rezervacije."
            : "Potvrdi datum, unesi podatke i adresu kako bi nastavio na plaćanje."}
        </p>
      </div>
      {isReadyForPayment && date ? (
        isLoadingIntent ? (
          <p className="text-sm text-neutral-500">Priprema plaćanja...</p>
        ) : intentError ? (
          <p role="alert" className="text-sm text-red-600">
            {intentError}
          </p>
        ) : !cart ? (
          <p role="alert" className="text-sm text-red-600">
            Košarica nije dostupna za plaćanje.
          </p>
        ) : !clientSecret ? (
          <p role="alert" className="text-sm text-red-600">
            Došlo je do pogreške prilikom pripreme plaćanja.
          </p>
        ) : (
          <StripeCheckout
            clientSecret={clientSecret}
            amount={cart?.total ?? 0}
            currency={cart?.currency ?? "eur"}
            cartId={cart.id}
          />
        )
      ) : null}
    </section>
  );
}
