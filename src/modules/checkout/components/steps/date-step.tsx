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
import {
  calculateRangeTotal,
  formatCurrency,
  getRangeTotalDays,
} from "@/modules/checkout/utils/pricing";
import * as React from "react";
import { Matcher, type DateRange } from "react-day-picker";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { addRentiqeCartItem, updateRentiqeCartItem } from "@/lib/data/rentiqe";

type DateStepProps = {
  cart: RentiqeCartResponse | null;
  listing: RentiqeListing;
  orderedItems: RentiqeListingOrder[];
  warehouseId?: string;
};

function normalizeStartOfDay(value: Date) {
  const next = new Date(value);
  next.setHours(0, 0, 0, 0);
  return next;
}

function formatDateLabel(value: Date) {
  return value.toLocaleDateString("hr-HR");
}

export function DateStep({
  cart,
  listing,
  orderedItems,
  warehouseId,
}: DateStepProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dateRange, setDateRange, completedSteps, setCompletedSteps } =
    useCheckout();

  const [selectedRange, setSelectedRange] = React.useState<
    DateRange | undefined
  >(dateRange);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setSelectedRange(dateRange);
  }, [dateRange]);

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
      const dayStart = normalizeStartOfDay(day);
      return dayStart < todayStart || isDateDisabled(day);
    },
    [isDateDisabled, todayStart],
  );

  const isRangeBlocked = React.useCallback(
    (range: DateRange | undefined) => {
      if (!range?.from || !range.to) {
        return false;
      }

      const cursor = normalizeStartOfDay(range.from);
      const end = normalizeStartOfDay(range.to);

      while (cursor <= end) {
        if (isDateBlocked(cursor)) {
          return true;
        }

        cursor.setDate(cursor.getDate() + 1);
      }

      return false;
    },
    [isDateBlocked],
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
    if (dateRange?.from && dateRange.to && isRangeBlocked(dateRange)) {
      setDateRange(undefined);
      setCompletedSteps((previous) => ({ ...previous, date: false }));
    }
  }, [dateRange, isRangeBlocked, setCompletedSteps, setDateRange]);

  const previewFrom = selectedRange?.from;
  const previewTo = selectedRange?.to ?? selectedRange?.from;
  const previewDays =
    previewFrom && previewTo ? getRangeTotalDays(previewFrom, previewTo) : 0;
  const previewTotal =
    previewFrom && previewTo
      ? calculateRangeTotal(listing.price, previewFrom, previewTo)
      : 0;

  const confirmDate = React.useCallback(async () => {
    if (
      !selectedRange?.from ||
      !selectedRange.to ||
      isRangeBlocked(selectedRange)
    ) {
      return;
    }

    if (!resolvedWarehouseId) {
      console.error("Missing warehouse id for cart item.");
      return;
    }

    const formatedStartDate = formatDateString(selectedRange.from);
    const formatedEndDate = formatDateString(selectedRange.to);

    try {
      setIsLoading(true);
      setError("");
      const resolvedCartId = cart?.id ?? crypto.randomUUID();

      if (!cart) {
        await addRentiqeCartItem({
          cartId: resolvedCartId,
          listingId: listing.id,
          warehouseId: resolvedWarehouseId,
          quantity: 1,
          startDate: formatedStartDate,
          endDate: formatedEndDate,
        });
      } else {
        const cartItem = cart.items[0];
        if (cartItem) {
          await updateRentiqeCartItem(cartItem.id, {
            cartId: cart.id,
            quantity: 1,
            startDate: formatedStartDate,
            endDate: formatedEndDate,
          });
        } else {
          await addRentiqeCartItem({
            cartId: cart.id,
            listingId: listing.id,
            warehouseId: resolvedWarehouseId,
            quantity: 1,
            startDate: formatedStartDate,
            endDate: formatedEndDate,
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

      router.refresh();
      setDateRange(selectedRange);
      setCompletedSteps((previous) => ({ ...previous, date: true }));
    } catch {
      setError("Došlo je do greške prilikom odabira datuma.");
    } finally {
      setIsLoading(false);
    }
  }, [
    cart,
    selectedRange,
    resolvedWarehouseId,
    isRangeBlocked,
    listing.id,
    pathname,
    router,
    searchParams,
    setCompletedSteps,
    setDateRange,
  ]);

  const changeDate = React.useCallback(() => {
    setCompletedSteps((previous) => ({ ...previous, date: false }));
  }, [setCompletedSteps]);

  return (
    <section className="rounded-lg border border-neutral-200 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">1. Odaberi period</h3>
          <p className="text-sm text-neutral-500">
            {dateRange?.from && dateRange.to ? (
              <>
                Odabrano: <strong>{formatDateLabel(dateRange.from)}</strong> -{" "}
                <strong>{formatDateLabel(dateRange.to)}</strong>
              </>
            ) : selectedRange?.from && selectedRange.to ? (
              `Trenutno: ${formatDateLabel(selectedRange.from)} - ${formatDateLabel(selectedRange.to)}`
            ) : selectedRange?.from ? (
              `Početak: ${formatDateLabel(selectedRange.from)}`
            ) : (
              "Bez odabranog perioda"
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
            mode="range"
            selected={selectedRange}
            onSelect={setSelectedRange}
            disabled={disabledMatchers}
            excludeDisabled
          />

          {previewFrom ? (
            <div className="rounded-md bg-neutral-50 px-4 py-3 leading-relaxed text-sm text-neutral-700">
              <p>
                Cijena po danu: <strong>{formatCurrency(listing.price)}</strong>
              </p>
              <p>
                Ukupno ({previewDays} {previewDays === 1 ? "dan" : "dana"}):{" "}
                <strong>
                  {formatCurrency(previewTotal, cart?.currency ?? "eur")}
                </strong>
              </p>
            </div>
          ) : null}

          <button
            type="button"
            onClick={confirmDate}
            disabled={
              isLoading ||
              !selectedRange?.from ||
              !selectedRange.to ||
              isRangeBlocked(selectedRange)
            }
            className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Spremanje..." : "Potvrdi period"}
          </button>
          {error ? (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          ) : null}
          {dateRange?.from && dateRange.to && isRangeBlocked(dateRange) ? (
            <p role="alert" className="text-sm text-red-600">
              Odabrani period nije dostupan.
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
