"use client";

import * as React from "react";

type CheckoutProviderProps = {
  initialDate?: Date;
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
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
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
  initialDate,
  children,
}: CheckoutProviderProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    initialDate ?? new Date(),
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
      date: !!initialDate,
      personalDetails: false,
      address: false,
    });

  const contextValue = React.useMemo<CheckoutContextValue>(
    () => ({
      date,
      setDate,
      personalDetails,
      setPersonalDetails,
      address,
      setAddress,
      completedSteps,
      setCompletedSteps,
    }),
    [date, personalDetails, address, completedSteps],
  );

  return (
    <CheckoutContext.Provider value={contextValue}>
      {children}
    </CheckoutContext.Provider>
  );
}
