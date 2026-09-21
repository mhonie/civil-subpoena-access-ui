import { useChartContext } from "../../utils/contextUtils";

import { Box, Grid, TextField } from "@mui/material";

export default function ChartFilters() {

    const {
        filingStartDate,
        filingEndDate,
        setFilingStartDate,
        setFilingEndDate,
    } = useChartContext();

    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: 700,
          mx: "auto"
        }}
      >
        <Grid container spacing={2} sx={{mb:5}}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Filing Start Date"
              type="date"
              value={filingStartDate}
              onChange={(e) => setFilingStartDate(e.target.value)}
              slotProps={{
                inputLabel: {
                  shrink: true
                }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Filing End Date"
              type="date"
              value={filingEndDate}
              onChange={(e) => setFilingEndDate(e.target.value)}
              slotProps={{
                inputLabel: {
                  shrink: true
                }
              }}
            />
          </Grid>
        </Grid>
      </Box>
  );
}