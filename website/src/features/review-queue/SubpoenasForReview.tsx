import { useEffect, useState } from "react";
import { Alert, Box } from "@mui/material";

import ReviewQueueGrid from "../../components/tables/SubpoenaReviewGrid.tsx";
import ReviewQueueFilters from "./ReviewQueueFilters.tsx";
import {
  getSubpoenasForReview,
  type ReviewQueuePageInfo
} from "../../api/subpoenasForReview.ts";

import type { subpoenasByTransaction } from "../../models/SubpoenasByTransaction.ts";
import {
  initialReviewQueueFilters,
  type ReviewQueueFilters as FilterValues
} from "../../models/ReviewQueueFilters.ts";

import {
  optionalDateRangeError,
  toUtcEndDate,
  toUtcStartDate
} from "../../utils/dateUtils.ts";

import type { GridSortModel } from "@mui/x-data-grid";

type PagingRequest = {
  first?: number;
  after: string | null;
  last?: number;
  before: string | null;
};

export default function ReviewQueue() {

  const [rows, setRows] = useState<subpoenasByTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [draftFilters, setDraftFilters] = useState<FilterValues>({
    ...initialReviewQueueFilters
  });
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>({
    ...initialReviewQueueFilters
  });
  const [pageSize, setPageSize] = useState(10);
  const [pageInfo, setPageInfo] = useState<ReviewQueuePageInfo | null>(null);
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([]);
  const [pagingRequest, setPagingRequest] =

    useState<PagingRequest>({
      first: 10,
      after: null,
      last: undefined,
      before: null
    });

  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  function resetPagination() {
    setCursorHistory([]);
    setPagingRequest({
      first: pageSize,
      after: null,
      last: undefined,
      before: null
    });
  }

  function applyFilters() {
    setError(null);

    const dateError = optionalDateRangeError(
      draftFilters.filingStartDate,
      draftFilters.filingEndDate,
      "Filing"
    )

    ?? optionalDateRangeError(
      draftFilters.reviewStartDate,
      draftFilters.reviewEndDate,
      "Review"
    );

    setValidationError(dateError);

    if (dateError) {
      return;
    }

    setAppliedFilters({...draftFilters});
    resetPagination();
  }

  function resetFilters() {
    const initialFilters = {...initialReviewQueueFilters};

    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setValidationError(null);
    setError(null);
    resetPagination();
  }

  useEffect(() => {

    let cancelled = false;

    async function load() {

      setLoading(true);
      setError(null);

      try {

        const result = await getSubpoenasForReview({
          status: appliedFilters.status,
          isPendingApproval: appliedFilters.isPendingApproval,
          isPendingPayment: appliedFilters.isPendingPayment,
          includeWebPayments: appliedFilters.includeWebPayments,
          orderNumber: appliedFilters.transactionNumber || null,
          filingStartDate: appliedFilters.filingStartDate
            ? toUtcStartDate(appliedFilters.filingStartDate)
            : null,
          filingEndDate: appliedFilters.filingEndDate
            ? toUtcEndDate(appliedFilters.filingEndDate)
            : null,
          caseId: appliedFilters.caseId || null,
          submitterEmail: appliedFilters.submitterEmail || null,
          reviewClerk: appliedFilters.reviewClerk || null,
          reviewStartDate: appliedFilters.reviewStartDate
            ? toUtcStartDate(appliedFilters.reviewStartDate)
            : null,
          reviewEndDate: appliedFilters.reviewEndDate
            ? toUtcEndDate(appliedFilters.reviewEndDate)
            : null,
          first: pagingRequest.first,
          after: pagingRequest.after,
          last: pagingRequest.last,
          before: pagingRequest.before,
          sort: sortModel[0]?.sort
            ? {
                field: sortModel[0].field as keyof Omit<
                  subpoenasByTransaction,
                  "subpoenas"
                >,
                direction: sortModel[0].sort.toUpperCase() as "ASC" | "DESC"
              }
            : null
        });

        if (!cancelled) {
          setRows(result.nodes);
          setPageInfo(result.pageInfo);
        }
      }
      catch (loadError) {
        if (!cancelled) {
          setRows([]);
          setPageInfo(null);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load transactions."
          );
        }
      }
      finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => { cancelled = true; };

  }, [appliedFilters, pagingRequest, sortModel]);
  
  return (
    <Box sx={{mb: 2, px: 2}}>
      {validationError &&
        <Alert severity="error" sx={{mb: 3, textAlign: "left"}}>
          {validationError}
        </Alert>
      }

      {error &&
        <Alert severity="error" sx={{mb: 3, textAlign: "left"}}>
          {error}
        </Alert>
      }

      <ReviewQueueFilters
        filters={draftFilters}
        loading={loading}
        onChange={(filters) => {
          setDraftFilters(filters);
          setValidationError(null);
          setError(null);
        }}
        onApply={applyFilters}
        onReset={resetFilters}
      />

      <ReviewQueueGrid
        rows={rows}
        loading={loading}
        pageSize={pageSize}
        hasNextPage={pageInfo?.hasNextPage ?? false}
        hasPreviousPage={cursorHistory.length > 0}

        onPageSizeChange={(size) => {
          setPageSize(size);
          setCursorHistory([]);
          setPagingRequest({
            first: size,
            after: null,
            last: undefined,
            before: null
          });
        }}

        onNextPage={() => {
          if (!pageInfo?.endCursor) {
            return;
          }
          setCursorHistory(history => [
            ...history,
            pageInfo.startCursor ?? null
          ]);
          setPagingRequest({
            first: pageSize,
            after: pageInfo.endCursor,
            last: undefined,
            before: null
          });
        }}

        onPreviousPage={() => {
          if (!pageInfo?.startCursor) {
            return;
          }
          setCursorHistory(history =>
            history.slice(0, -1)
          );
          setPagingRequest({
            first: undefined,
            after: null,
            last: pageSize,
            before: pageInfo.startCursor
          });
        }}

        sortModel={sortModel}
        onSortModelChange={(model) => {
          setSortModel(model.slice(0, 1));
          resetPagination();
  }}
      />
    </Box>
  );
}
