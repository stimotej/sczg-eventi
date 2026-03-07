"use client";

import { geocodeAddress } from "@/lib/data/geocode-address";
import { cn } from "@/lib/utils/cn";
import { useCheckout } from "@/modules/checkout/context/checkout-context";
import * as React from "react";

function buildGeocodeQuery(
  addressLine1: string,
  addressLine2: string,
  city: string,
  state: string,
  postal: string,
  country: string,
) {
  return [addressLine1, addressLine2, postal, city, state, country]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(", ");
}

export function AddressStep() {
  const { dateRange, address, setAddress, completedSteps, setCompletedSteps } =
    useCheckout();

  const [isGeocoding, setIsGeocoding] = React.useState(false);
  const [addressError, setAddressError] = React.useState<string | null>(null);
  const [geocodeError, setGeocodeError] = React.useState<string | null>(null);
  const errorMessage = addressError ?? geocodeError;

  const updateField = React.useCallback(
    (key: keyof typeof address, value: string) => {
      setAddress((previous) => ({ ...previous, [key]: value }));
      setAddressError(null);
      setGeocodeError(null);
    },
    [setAddress],
  );

  const handleConfirmAddress = React.useCallback(async () => {
    setGeocodeError(null);
    setAddressError(null);

    const trimmedLine1 = address.addressLine1.trim();
    const trimmedCity = address.city.trim();
    const trimmedPostal = address.postal.trim();
    const trimmedCountry = address.country.trim();

    if (!trimmedLine1 || !trimmedCity || !trimmedPostal || !trimmedCountry) {
      setAddressError("Unesi obavezna polja adrese.");
      return;
    }

    const query = buildGeocodeQuery(
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state,
      address.postal,
      address.country,
    );

    const controller = new AbortController();
    setIsGeocoding(true);
    try {
      const result = await geocodeAddress(query, controller.signal);
      if (result.error || result.lat === null || result.lng === null) {
        setGeocodeError(
          result.error ?? "Nije moguće odrediti lokaciju za ovu adresu.",
        );
        return;
      }

      const nextAddress = {
        ...address,
        lat: result.lat,
        lng: result.lng,
      };

      setAddress(nextAddress);
      setCompletedSteps((previous) => ({ ...previous, address: true }));
    } catch {
      if (!controller.signal.aborted) {
        setGeocodeError("Došlo je do greške prilikom dohvaćanja lokacije.");
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsGeocoding(false);
      }
    }
  }, [address, setAddress, setCompletedSteps]);

  const editAddress = React.useCallback(() => {
    setCompletedSteps((previous) => ({ ...previous, address: false }));
    setAddressError(null);
    setGeocodeError(null);
  }, [setCompletedSteps]);

  return (
    <section
      className={cn(
        "rounded-lg border border-neutral-200 p-4 transition",
        (!dateRange?.from ||
          !completedSteps.date ||
          !completedSteps.personalDetails) &&
          "pointer-events-none opacity-50",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">3. Adresa</h3>
          <p className="text-sm text-neutral-500">
            {completedSteps.date
              ? completedSteps.personalDetails
                ? completedSteps.address
                  ? "Adresa spremljena."
                  : "Unesi adresu za dostavu."
                : "Dovrši osobne podatke kako bi unio adresu."
              : "Potvrdi datum kako bi unio adresu."}
          </p>
        </div>
        {completedSteps.address ? (
          <button
            type="button"
            onClick={editAddress}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Promijeni
          </button>
        ) : null}
      </div>

      {completedSteps.date &&
      completedSteps.personalDetails &&
      !completedSteps.address ? (
        <div className="mt-4 space-y-4">
          <label className="block text-sm font-medium text-neutral-700">
            Ulica i broj
            <input
              type="text"
              value={address.addressLine1}
              onChange={(event) =>
                updateField("addressLine1", event.target.value)
              }
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
              placeholder="Ilica 10"
            />
          </label>

          <label className="block text-sm font-medium text-neutral-700">
            Dodatak adrese (opcionalno)
            <input
              type="text"
              value={address.addressLine2}
              onChange={(event) =>
                updateField("addressLine2", event.target.value)
              }
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
              placeholder="Stan, kat, jedinica"
            />
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="block text-sm font-medium text-neutral-700">
              Grad
              <input
                type="text"
                value={address.city}
                onChange={(event) => updateField("city", event.target.value)}
                className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                placeholder="Zagreb"
              />
            </label>
            <label className="block text-sm font-medium text-neutral-700">
              Drzava
              <input
                type="text"
                value={address.country}
                onChange={(event) => updateField("country", event.target.value)}
                className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                placeholder="Hrvatska"
              />
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="block text-sm font-medium text-neutral-700">
              Poštanski broj
              <input
                type="text"
                value={address.postal}
                onChange={(event) => updateField("postal", event.target.value)}
                className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                placeholder="10000"
              />
            </label>
            <label className="block text-sm font-medium text-neutral-700">
              Županija (opcionalno)
              <input
                type="text"
                value={address.state}
                onChange={(event) => updateField("state", event.target.value)}
                className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                placeholder="Grad Zagreb"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-neutral-700">
            Napomena (opcionalno)
            <textarea
              value={address.message}
              onChange={(event) => updateField("message", event.target.value)}
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
              rows={3}
              placeholder="Dodatne upute za dostavu"
            />
          </label>

          <button
            type="button"
            onClick={handleConfirmAddress}
            disabled={isGeocoding}
            className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition"
          >
            {isGeocoding ? "Spremam..." : "Spremi adresu"}
          </button>
          {errorMessage ? (
            <p className="text-sm text-red-600">{errorMessage}</p>
          ) : null}
        </div>
      ) : null}

      {completedSteps.address ? (
        <div className="mt-4 rounded-md bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
          <p>
            {address.addressLine1}
            {address.addressLine2 ? `, ${address.addressLine2}` : ""}
          </p>
          <p>
            {address.postal} {address.city}
            {address.state ? `, ${address.state}` : ""}
          </p>
          <p>{address.country}</p>
          {address.message ? <p>Poruka: {address.message}</p> : null}
        </div>
      ) : null}
    </section>
  );
}
