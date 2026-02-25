"use client";

import type {
  RentiqeCartResponse,
  RentiqeListing,
  RentiqeListingOrder,
} from "@/lib/data/rentiqe-types";
import { Calendar } from "@/modules/common/components/calendar";
import { useCheckout } from "@/modules/checkout/context/checkout-context";
import {
  formatDateString,
  isSameDay,
  parseDateStringToDate,
} from "@/modules/checkout/utils/date";
import * as React from "react";
import { Matcher } from "react-day-picker";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { addRentiqeCartItem, updateRentiqeCartItem } from "@/lib/data/rentiqe";

type DateStepProps = {
  cart: RentiqeCartResponse | null;
  listing: RentiqeListing;
  orderedItems: RentiqeListingOrder[];
  warehouseId?: string;
};

export function DateStep({
  cart,
  listing,
  orderedItems,
  warehouseId,
}: DateStepProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { date, setDate, completedSteps, setCompletedSteps } = useCheckout();

  const [selectedDate, setSelectedDate] = React.useState(date);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const todayStart = React.useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const inventoryQuantity = React.useMemo(() => {
    if (warehouseId) {
      return (
        listing.inventories.find(
          (inventory) => inventory.warehouseId === warehouseId,
        )?.quantity ?? 1
      );
    }

    return listing.inventories[0]?.quantity ?? 1;
  }, [listing.inventories, warehouseId]);

  const resolvedWarehouseId =
    warehouseId ?? listing.inventories[0]?.warehouseId ?? null;

  const unavailableDates = React.useMemo(
    () =>
      (listing.notAvailableAt ?? [])
        .map((dateString) => parseDateStringToDate(dateString))
        .filter((date): date is Date => Boolean(date)),
    [listing.notAvailableAt],
  );

  const orderedItemDisabledDates = React.useMemo(
    () =>
      orderedItems
        .filter((item) => item.quantity >= inventoryQuantity)
        .map((item) => parseDateStringToDate(item.date))
        .filter((date): date is Date => Boolean(date)),
    [orderedItems, inventoryQuantity],
  );

  const disabledDates = React.useMemo(
    () => [...orderedItemDisabledDates, ...unavailableDates],
    [orderedItemDisabledDates, unavailableDates],
  );

  const isDateDisabled = React.useCallback(
    (day: Date) =>
      disabledDates.some((disabledDay) => isSameDay(disabledDay, day)),
    [disabledDates],
  );

  const isDateBlocked = React.useCallback(
    (day: Date) => {
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      return dayStart < todayStart || isDateDisabled(day);
    },
    [isDateDisabled, todayStart],
  );

  const disabledMatchers = React.useMemo(
    () =>
      [
        {
          before: todayStart,
        },
        isDateDisabled,
      ] satisfies Matcher[],
    [isDateDisabled, todayStart],
  );

  React.useEffect(() => {
    if (date && isDateBlocked(date)) {
      setDate(undefined);
      setCompletedSteps((previous) => ({ ...previous, date: false }));
    }
  }, [date, isDateBlocked, setCompletedSteps, setDate]);

  const confirmDate = React.useCallback(async () => {
    if (!selectedDate || isDateBlocked(selectedDate)) return;

    if (!resolvedWarehouseId) {
      console.error("Missing warehouse id for cart item.");
      return;
    }

    const formatedDate = formatDateString(selectedDate);

    try {
      setIsLoading(true);
      const resolvedCartId = cart?.id ?? crypto.randomUUID();

      if (!cart) {
        await addRentiqeCartItem({
          cartId: resolvedCartId,
          listingId: listing.id,
          warehouseId: resolvedWarehouseId,
          quantity: 1,
          startDate: formatedDate,
          endDate: formatedDate,
        });
      } else {
        const cartItem = cart.items[0];
        if (cartItem) {
          await updateRentiqeCartItem(cartItem.id, {
            cartId: cart.id,
            quantity: 1,
            startDate: formatedDate,
            endDate: formatedDate,
          });
        } else {
          await addRentiqeCartItem({
            cartId: cart.id,
            listingId: listing.id,
            warehouseId: resolvedWarehouseId,
            quantity: 1,
            startDate: formatedDate,
            endDate: formatedDate,
          });
        }
      }

      const params = new URLSearchParams(searchParams.toString());
      if (!params.has("cartId")) {
        params.set("cartId", resolvedCartId);
        router.replace(`${pathname}?${params.toString()}`, {
          scroll: false,
        });
      }

      setDate(selectedDate);
      setCompletedSteps((previous) => ({ ...previous, date: true }));
    } catch {
      setError("Došlo je do greške prilikom odabira datuma.");
    } finally {
      setIsLoading(false);
    }
  }, [
    cart,
    selectedDate,
    resolvedWarehouseId,
    isDateBlocked,
    listing.id,
    pathname,
    router,
    searchParams,
    setCompletedSteps,
    setIsLoading,
    setDate,
  ]);

  const changeDate = React.useCallback(() => {
    setCompletedSteps((previous) => ({ ...previous, date: false }));
  }, [setCompletedSteps]);

  return (
    <section className="rounded-lg border border-neutral-200 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">1. Odaberi datum</h3>
          <p className="text-sm text-neutral-500">
            {date ? (
              <>
                Odabrano: <strong>{date.toLocaleDateString("hr-HR")}</strong>
              </>
            ) : selectedDate ? (
              `Trenutno: ${selectedDate.toLocaleDateString("hr-HR")}`
            ) : (
              "Bez datuma"
            )}
          </p>
        </div>
        {completedSteps.date ? (
          <button
            type="button"
            onClick={changeDate}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Promijeni
          </button>
        ) : null}
      </div>

      {!completedSteps.date ? (
        <div className="mt-4 space-y-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={disabledMatchers}
          />
          <button
            type="button"
            onClick={confirmDate}
            disabled={isLoading || !selectedDate || isDateBlocked(selectedDate)}
            className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Spremanje..." : "Potvrdi datum"}
          </button>
          {error ? (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          ) : null}
          {date && isDateBlocked(date) ? (
            <p role="alert" className="text-sm text-red-600">
              Odabrani datum nije dostupan.
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
