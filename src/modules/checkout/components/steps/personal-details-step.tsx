"use client";

import { cn } from "@/lib/utils/cn";
import { useCheckout } from "@/modules/checkout/context/checkout-context";
import * as React from "react";

export function PersonalDetailsStep() {
  const {
    dateRange,
    personalDetails,
    setPersonalDetails,
    completedSteps,
    setCompletedSteps,
  } = useCheckout();
  const [detailsError, setDetailsError] = React.useState<string | null>(null);

  const updateField = React.useCallback(
    (key: keyof typeof personalDetails, value: string | boolean) => {
      setPersonalDetails((previous) => ({
        ...previous,
        [key]: value,
      }));
      setDetailsError(null);
    },
    [setPersonalDetails],
  );

  const confirmDetails = React.useCallback(async () => {
    const trimmedEmail = personalDetails.customerEmail.trim();
    const trimmedCompany = personalDetails.companyName.trim();
    const trimmedVat = personalDetails.vatNumber.trim();

    if (!trimmedEmail) {
      setDetailsError("Unesi email adresu.");
      return;
    }

    if (personalDetails.isCompanyPayer && (!trimmedCompany || !trimmedVat)) {
      setDetailsError("Unesi naziv tvrtke i VAT broj.");
      return;
    }

    setDetailsError(null);
    setCompletedSteps((previous) => ({ ...previous, personalDetails: true }));
  }, [personalDetails, setCompletedSteps]);

  const editDetails = React.useCallback(() => {
    setCompletedSteps((previous) => ({ ...previous, personalDetails: false }));
    setDetailsError(null);
  }, [setCompletedSteps]);

  return (
    <section
      className={cn(
        "rounded-lg border border-neutral-200 p-4 transition",
        (!dateRange?.from || !completedSteps.date) &&
          "pointer-events-none opacity-50",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">2. Osobni podaci</h3>
          <p className="text-sm text-neutral-500">
            {completedSteps.date
              ? completedSteps.personalDetails
                ? "Podaci spremljeni."
                : "Unesi email za potvrdu rezervacije."
              : "Potvrdi datum kako bi unio podatke."}
          </p>
        </div>
        {completedSteps.personalDetails ? (
          <button
            type="button"
            onClick={editDetails}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Promijeni
          </button>
        ) : null}
      </div>

      {completedSteps.date && !completedSteps.personalDetails ? (
        <div className="mt-4 space-y-4">
          <label className="block text-sm font-medium text-neutral-700">
            Email
            <input
              type="email"
              autoComplete="email"
              value={personalDetails.customerEmail}
              onChange={(event) =>
                updateField("customerEmail", event.target.value)
              }
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
              placeholder="ime@primjer.hr"
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={personalDetails.isCompanyPayer}
              onChange={(event) =>
                updateField("isCompanyPayer", event.target.checked)
              }
              className="h-4 w-4 rounded border-neutral-300"
            />
            Plaćanje kao tvrtka
          </label>

          {personalDetails.isCompanyPayer ? (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-neutral-700">
                Naziv tvrtke
                <input
                  type="text"
                  value={personalDetails.companyName}
                  onChange={(event) =>
                    updateField("companyName", event.target.value)
                  }
                  className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                  placeholder="Naziv d.o.o."
                />
              </label>
              <label className="block text-sm font-medium text-neutral-700">
                VAT broj
                <input
                  type="text"
                  value={personalDetails.vatNumber}
                  onChange={(event) =>
                    updateField("vatNumber", event.target.value)
                  }
                  className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                  placeholder="HR12345678901"
                />
              </label>
            </div>
          ) : null}

          <button
            type="button"
            onClick={confirmDetails}
            className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition"
          >
            Spremi podatke
          </button>
          {detailsError ? (
            <p className="text-sm text-red-600">{detailsError}</p>
          ) : null}
        </div>
      ) : null}

      {completedSteps.personalDetails ? (
        <div className="mt-4 rounded-md bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
          <p>Email: {personalDetails.customerEmail || "—"}</p>
          <p>
            Plaćanje kao tvrtka: {personalDetails.isCompanyPayer ? "Da" : "Ne"}
          </p>
          {personalDetails.isCompanyPayer ? (
            <>
              <p>Naziv tvrtke: {personalDetails.companyName || "—"}</p>
              <p>VAT broj: {personalDetails.vatNumber || "—"}</p>
            </>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
