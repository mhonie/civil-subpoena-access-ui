import { useState, type ReactNode } from "react";

import { ChartContext } from "./ChartContext";

import { areValidChartDates, firstDayOfCurrentYear, today } from "../../utils/dateUtils";

export function ChartContextProvider(
    { children }: { children: ReactNode }
) {
    const [filingStartDate, setFilingStartDate] = useState(firstDayOfCurrentYear());
    const [filingEndDate, setFilingEndDate] = useState(today());

    const dateError = areValidChartDates(filingStartDate, filingEndDate)
        ? null
        : "Filing dates cannot be future dates. Year cannot be before 1900.";

    return (
      <ChartContext.Provider
        value={{
          filingStartDate,
          filingEndDate,
          dateError,
          setFilingStartDate,
          setFilingEndDate,
        }}
    >
        {children}
      </ChartContext.Provider>
  );
}