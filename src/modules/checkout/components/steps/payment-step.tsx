"use client";

import { refreshRentiqeCartPaymentIntent } from "@/lib/data/rentiqe";
import { RentiqeCartResponse, RentiqeListing } from "@/lib/data/rentiqe-types";
import { cn } from "@/lib/utils/cn";
import { StripeCheckout } from "@/modules/checkout/components/stripe/stripe-checkout";
import { useCheckout } from "@/modules/checkout/context/checkout-context";
import {
  calculateRangeTotal,
  formatCurrency,
  getRangeTotalDays,
} from "@/modules/checkout/utils/pricing";
import * as React from "react";

type PaymentStepProps = {
  cart: RentiqeCartResponse | null;
  listing: RentiqeListing;
};

export function PaymentStep({ cart, listing }: PaymentStepProps) {
  const { dateRange, completedSteps } = useCheckout();
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  const [isLoadingIntent, setIsLoadingIntent] = React.useState(false);
  const [intentError, setIntentError] = React.useState<string | null>(null);
  const hasCompleteDateRange = Boolean(dateRange?.from && dateRange?.to);

  const isReadyForPayment =
    completedSteps.date &&
    completedSteps.personalDetails &&
    completedSteps.address &&
    hasCompleteDateRange;

  const totalAmount = React.useMemo(() => {
    if (typeof cart?.total === "number") {
      return cart.total;
    }

    if (!dateRange?.from || !dateRange.to) {
      return 0;
    }

    return calculateRangeTotal(listing.price, dateRange.from, dateRange.to);
  }, [cart?.total, dateRange, listing.price]);

  const totalDays = React.useMemo(() => {
    if (!dateRange?.from || !dateRange.to) {
      return 0;
    }

    return getRangeTotalDays(dateRange.from, dateRange.to);
  }, [dateRange]);

  const formattedTotal = React.useMemo(
    () => formatCurrency(totalAmount, cart?.currency ?? "eur"),
    [cart?.currency, totalAmount],
  );
  const baseRentAmount = React.useMemo(() => {
    if (!dateRange?.from || !dateRange.to) {
      return 0;
    }

    return calculateRangeTotal(listing.price, dateRange.from, dateRange.to);
  }, [dateRange, listing.price]);
  const itemsSubtotal = React.useMemo(() => {
    if (typeof cart?.itemsTotal === "number") {
      return cart.itemsTotal;
    }

    return baseRentAmount;
  }, [baseRentAmount, cart?.itemsTotal]);
  const feeAmount = React.useMemo(() => {
    return itemsSubtotal - baseRentAmount;
  }, [itemsSubtotal, baseRentAmount]);
  const additionalAmount = React.useMemo(() => {
    return totalAmount - itemsSubtotal;
  }, [itemsSubtotal, totalAmount]);
  const formattedBaseRent = React.useMemo(
    () => formatCurrency(baseRentAmount, cart?.currency ?? "eur"),
    [baseRentAmount, cart?.currency],
  );
  const formattedItemsSubtotal = React.useMemo(
    () => formatCurrency(itemsSubtotal, cart?.currency ?? "eur"),
    [cart?.currency, itemsSubtotal],
  );
  const formattedFee = React.useMemo(
    () => formatCurrency(feeAmount, cart?.currency ?? "eur"),
    [cart?.currency, feeAmount],
  );
  const formattedAdditional = React.useMemo(
    () => formatCurrency(additionalAmount, cart?.currency ?? "eur"),
    [additionalAmount, cart?.currency],
  );

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
  }, [cart?.id, isReadyForPayment, dateRange?.from, dateRange?.to]);

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
      {isReadyForPayment ? (
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
          <div className="space-y-4">
            <div className="rounded-md bg-neutral-50 px-4 py-3 leading-relaxed text-sm text-neutral-700">
              <p>
                Osnovni najam ({totalDays} x {formatCurrency(listing.price)}):{" "}
                <strong>{formattedBaseRent}</strong>
              </p>
              <p>
                Naknada: <strong>{formattedFee}</strong>
              </p>
              {additionalAmount !== 0 ? (
                <>
                  <p>
                    Međuzbroj stavki: <strong>{formattedItemsSubtotal}</strong>
                  </p>
                  <p>
                    Dodatni troškovi: <strong>{formattedAdditional}</strong>
                  </p>
                </>
              ) : null}
              <p>
                Ukupno ({totalDays} {totalDays === 1 ? "dan" : "dana"}):{" "}
                <strong>{formattedTotal}</strong>
              </p>
            </div>
            <StripeCheckout
              clientSecret={clientSecret}
              amount={totalAmount}
              currency={cart?.currency ?? "eur"}
              cartId={cart.id}
            />
          </div>
        )
      ) : null}
    </section>
  );
}
