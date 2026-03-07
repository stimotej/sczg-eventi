"use client";

import type {
  RentiqeCartResponse,
  RentiqeListing,
  RentiqeListingOrder,
} from "@/lib/data/rentiqe-types";
import { AddressStep } from "@/modules/checkout/components/steps/address-step";
import { DateStep } from "@/modules/checkout/components/steps/date-step";
import { PaymentStep } from "@/modules/checkout/components/steps/payment-step";
import { PersonalDetailsStep } from "@/modules/checkout/components/steps/personal-details-step";
import { CheckoutProvider } from "@/modules/checkout/context/checkout-context";
import { parseDateStringToDate } from "@/modules/checkout/utils/date";

type CheckoutFormProps = {
  cart: RentiqeCartResponse | null;
  listing: RentiqeListing;
  orderedItems: RentiqeListingOrder[];
  warehouseId?: string;
};

export default function CheckoutForm({
  cart,
  listing,
  orderedItems,
  warehouseId,
}: CheckoutFormProps) {
  const resolvedStartDate = parseDateStringToDate(cart?.items[0]?.startDate);
  const resolvedEndDate = parseDateStringToDate(cart?.items[0]?.endDate);
  const resolvedInitialDateRange = resolvedStartDate
    ? {
        from: resolvedStartDate,
        to: resolvedEndDate ?? resolvedStartDate,
      }
    : undefined;

  return (
    <CheckoutProvider initialDateRange={resolvedInitialDateRange}>
      <aside className="rounded-lg border border-neutral-200 p-5 md:p-6">
        <div className="space-y-6">
          <DateStep
            listing={listing}
            orderedItems={orderedItems}
            warehouseId={warehouseId}
            cart={cart}
          />
          <PersonalDetailsStep />
          <AddressStep />
          <PaymentStep cart={cart} listing={listing} />
        </div>
      </aside>
    </CheckoutProvider>
  );
}
