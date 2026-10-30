"use client";

import { useCallback } from "react";
import { useAsyncWorkflow } from "./useAsyncWorkflow";
import { fetchAgentWeeklyPlan, type ApiClientError } from "@/services/api-client";
import type { AgentWeeklyPlanRequest, WeeklyCulturalPlanData, QlooMcpEnvelope } from "@/types";

export interface UseAgentWeeklyPlanReturn {
  data: QlooMcpEnvelope<WeeklyCulturalPlanData> | null;
  loading: boolean;
  error: ApiClientError | Error | null;
  execute: (params: AgentWeeklyPlanRequest) => Promise<QlooMcpEnvelope<WeeklyCulturalPlanData> | null>;
  reset: () => void;
}

/**
 * React hook for orchestrating a coordinated weekly cultural operations plan.
 */
export function useAgentWeeklyPlan(): UseAgentWeeklyPlanReturn {
  const action = useCallback(
    (params: AgentWeeklyPlanRequest, signal?: AbortSignal) => fetchAgentWeeklyPlan(params, signal),
    []
  );

  return useAsyncWorkflow<QlooMcpEnvelope<WeeklyCulturalPlanData>, [AgentWeeklyPlanRequest]>(action);
}
