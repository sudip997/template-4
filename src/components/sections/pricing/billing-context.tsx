"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type BillingPeriod = "monthly" | "yearly";

type BillingContextValue = {
  period: BillingPeriod;
  setPeriod: (period: BillingPeriod) => void;
};

const BillingContext = createContext<BillingContextValue | null>(null);

type BillingProviderProps = {
  children: ReactNode;
  defaultPeriod?: BillingPeriod;
};

/**
 * Holds the selected billing period for the pricing section. It only wraps
 * the section's content, so the header, cards and footer stay Server
 * Components; just the toggle and the prices read this state.
 */
export function BillingProvider({
  children,
  defaultPeriod = "yearly",
}: BillingProviderProps) {
  const [period, setPeriod] = useState<BillingPeriod>(defaultPeriod);
  const value = useMemo(() => ({ period, setPeriod }), [period]);

  return (
    <BillingContext.Provider value={value}>{children}</BillingContext.Provider>
  );
}

export function useBilling(): BillingContextValue {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error("useBilling must be used inside <BillingProvider>.");
  }
  return context;
}
