import BottomButtons from "../components/BottomButtons";
import TopBanner from "../components/TopBanner";
import ChartFilters from "../features/charts/ChartFilters";
import SubpoenaCharts from "../features/charts/SubpoenaCharts";

import { Typography } from "@mui/material";

export default function Charts() {
  return (
    <>
      <TopBanner/>
      <Typography variant="h4" sx={{mb: 4}}>
        Charts & Graphs
      </Typography>
      <ChartFilters />
      <SubpoenaCharts />
      <BottomButtons/>
    </>
  );
}