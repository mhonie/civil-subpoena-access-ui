import {
  Alert,
  Box,
  CircularProgress
} from "@mui/material";

import {
  getMonthlyPaymentTypeCounts,
  type PaymentTypeCountsByMonth
} from "../../api/subpoenaCounts";

import { useChartContext } from "../../utils/contextUtils";

import { useCallback } from "react";

import useSubpoenaCharts from "../../hooks/useSubpoenaCharts";

import { toUtcEndDate, toUtcStartDate } from "../../utils/dateUtils";

import PaymentTypeBarChart, {
  type BarChartSeries
} from "../../components/charts/PaymentTypeBarChart";

const SERIES: BarChartSeries[] = [
  {
    dataKey: "americanExpress",
    name: "AMEX",
    color: "#1976d2"
  },
  {
    dataKey: "discover",
    name: "Discover",
    color: "#ef6c00"
  },
  {
    dataKey: "mastercard",
    name: "Mastercard",
    color: "#d32f2f"
  },
  {
    dataKey: "visa",
    name: "Visa",
    color: "#2e7d32"
  }
];

export default function SubpoenasByOnlinePaymentType() {

  const {
    filingStartDate,
    filingEndDate,
    dateError
  } = useChartContext();

  const loadStatus = useCallback(
    async () => {

      if (dateError) {
        return {
          paymentTypeCountsByPeriod: []
        };
      }

      return getMonthlyPaymentTypeCounts(
        toUtcStartDate(filingStartDate),
        toUtcEndDate(filingEndDate)
      );
    },
    [
      dateError,
      filingStartDate,
      filingEndDate
    ]
  );

  const {
    data: monthlyPaymentTypeCounts,
    loading,
    error
  } = useSubpoenaCharts<PaymentTypeCountsByMonth>(
    loadStatus,
    "Unable to load payment type information."
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 500
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  const chartData =
    monthlyPaymentTypeCounts?.paymentTypeCountsByPeriod.map(period => ({
      month: new Date(period.startDate).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
        timeZone: "UTC"
      }),
      americanExpress: period.paymentTypeCount.americanExpress,
      discover: period.paymentTypeCount.discoverCard,
      mastercard: period.paymentTypeCount.mastercard,
      visa: period.paymentTypeCount.visaCard
    })) ?? [];

  return (
    <PaymentTypeBarChart
      title="Subpoenas by Payment Type (Credit Card)"
      data={chartData}
      series={SERIES}
    />
  );
}