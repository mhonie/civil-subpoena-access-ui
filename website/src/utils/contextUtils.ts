import { useContext } from "react";

import { ReportsContext } from "../features/reports/ReportsContext";
import { ChartContext } from "../features/charts/ChartContext";
import { AuthenticationContext } from "../features/authentication/AuthenticationContext";

export function useAuthenticationContext() {
  const context = useContext(AuthenticationContext);

  if (!context) {
    throw new Error
    (
      "useAuthenticationContext must be used inside AuthenticationContextProvider"
    );
  }

  return context;
}

export function useReportsContext() {
  const context = useContext(ReportsContext);

  if (!context) {
    throw new Error("useReportsContext must be used inside ReportsContextProvider");
  }

  return context;
}

export function useChartContext() {
  const context = useContext(ChartContext);

  if (!context) {
    throw new Error("useChartContext must be used inside ChartContextProvider");
  }

  return context;
}