"use client";

import { useCallback } from "react";
import { useAsyncWorkflow } from "./useAsyncWorkflow";
import { fetchCulturePlan, type ApiClientError } from "@/services/api-client";
import type { CulturePlanRequest, CulturePlanData, QlooMcpEnvelope } from "@/types";

export interface UseCulturePlanReturn {
  data: QlooMcpEnvelope<CulturePlanData> | null;
  loading: boolean;
  error: ApiClientError | Error | null;
  execute: (params: CulturePlanRequest) => Promise<QlooMcpEnvelope<CulturePlanData> | null>;
  reset: () => void;
}

/**
 * React hook for generating and regenerating the Weekly Culture Plan.
 */
export function useCulturePlan(): UseCulturePlanReturn {
  const action = useCallback(
    (params: CulturePlanRequest, signal?: AbortSignal) => fetchCulturePlan(params, signal),
    []
  );

  return useAsyncWorkflow<QlooMcpEnvelope<CulturePlanData>, [CulturePlanRequest]>(action);
}
