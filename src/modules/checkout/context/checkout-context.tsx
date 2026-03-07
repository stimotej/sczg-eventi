"use client";

import * as React from "react";
import type { DateRange } from "react-day-picker";

type CheckoutProviderProps = {
  initialDateRange?: DateRange;
  children: React.ReactNode;
};

export type CheckoutPersonalDetails = {
  customerEmail: string;
  isCompanyPayer: boolean;
  companyName: string;
  vatNumber: string;
};

export type CheckoutAddress = {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postal: string;
  country: string;
  message: string;
  lat: number | null;
  lng: number | null;
};

export type CheckoutCompletedSteps = {
  date: boolean;
  personalDetails: boolean;
  address: boolean;
};

export type CheckoutContextValue = {
  dateRange: DateRange | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  personalDetails: CheckoutPersonalDetails;
  setPersonalDetails: React.Dispatch<
    React.SetStateAction<CheckoutPersonalDetails>
  >;
  address: CheckoutAddress;
  setAddress: React.Dispatch<React.SetStateAction<CheckoutAddress>>;
  completedSteps: CheckoutCompletedSteps;
  setCompletedSteps: React.Dispatch<
    React.SetStateAction<CheckoutCompletedSteps>
  >;
};

const CheckoutContext = React.createContext<CheckoutContextValue | null>(null);

export function useCheckout() {
  const context = React.useContext(CheckoutContext);
  if (!context) {
    throw new Error("Checkout context is missing.");
  }
  return context;
}

export function CheckoutProvider({
  initialDateRange,
  children,
}: CheckoutProviderProps) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    initialDateRange,
  );
  const [personalDetails, setPersonalDetails] =
    React.useState<CheckoutPersonalDetails>({
      customerEmail: "",
      isCompanyPayer: false,
      companyName: "",
      vatNumber: "",
    });
  const [address, setAddress] = React.useState<CheckoutAddress>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postal: "",
    country: "",
    message: "",
    lat: null,
    lng: null,
  });
  const [completedSteps, setCompletedSteps] =
    React.useState<CheckoutCompletedSteps>({
      date: Boolean(initialDateRange?.from && initialDateRange?.to),
      personalDetails: false,
      address: false,
    });

  const contextValue = React.useMemo<CheckoutContextValue>(
    () => ({
      dateRange,
      setDateRange,
      personalDetails,
      setPersonalDetails,
      address,
      setAddress,
      completedSteps,
      setCompletedSteps,
    }),
    [dateRange, personalDetails, address, completedSteps],
  );

  return (
    <CheckoutContext.Provider value={contextValue}>
      {children}
    </CheckoutContext.Provider>
  );
}
