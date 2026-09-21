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
    dataKey: "walkIn",
    name: "Walk-Ins",
    color: "#6d4c41"
  },
  {
    dataKey: "cityLaw",
    name: "City Law",
    color: "#7b1fa2"
  },
  {
    dataKey: "citySolicitor",
    name: "City Solicitor",
    color: "#00838f"
  },
  {
    dataKey: "inFormaPauperis",
    name: "IFP",
    color: "#616161"
  }
];

export default function SubpoenasByOfflinePaymentType() {

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
      walkIn: period.paymentTypeCount.walkIn,
      cityLaw: period.paymentTypeCount.cityLaw,
      citySolicitor: period.paymentTypeCount.citySolicitor,
      inFormaPauperis: period.paymentTypeCount.inFormaPauperis
    })) ?? [];

  return (
    <PaymentTypeBarChart
      title="Subpoenas by Payment Type (Other)"
      data={chartData}
      series={SERIES}
    />
  );
}