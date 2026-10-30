import type {
  LocationInsightsRequest,
  CompareAudiencesRequest,
  LocalTrendsRequest,
  RecommendationsRequest,
  CulturePlanRequest,
  AgentWeeklyPlanRequest,
  LocationInsightsData,
  AudienceComparisonData,
  LocalTrendsData,
  RecommendationsData,
  CulturePlanData,
  WeeklyCulturalPlanData,
  QlooMcpEnvelope,
  BackendHealthResponse
} from "@/types";

/**
 * Custom error class capturing HTTP status codes and structured MCP envelopes.
 */
export class ApiClientError extends Error {
  public readonly statusCode: number;
  public readonly envelope?: QlooMcpEnvelope;
  public readonly code?: string;
  public readonly retryable?: boolean;
  public readonly recovery?: string;

  constructor(message: string, statusCode: number, envelope?: QlooMcpEnvelope) {
    super(message);
    this.name = "ApiClientError";
    this.statusCode = statusCode;
    this.envelope = envelope;
    this.code = envelope?.error?.code;
    this.retryable = envelope?.error?.retryable;
    this.recovery = envelope?.error?.recovery;
  }
}

/**
 * Resolves the backend API base URL from NEXT_PUBLIC_API_BASE_URL or defaults to localhost:4000.
 */
export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, "");
  }
  return "http://localhost:4000";
}

/**
 * Core HTTP fetch wrapper with standardized JSON headers, error handling, and timeout support.
 */
async function fetchJson<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers
      }
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw err;
    }
    const message = err instanceof Error ? err.message : String(err);
    throw new ApiClientError(
      `Network request failed to ${url}. Ensure the LocalMuse Ops backend server is running (${message}).`,
      0
    );
  }

  // Parse JSON response safely
  let responseData: unknown;
  try {
    responseData = await response.json();
  } catch {
    throw new ApiClientError(
      `Received non-JSON response from backend (${response.status} ${response.statusText}).`,
      response.status
    );
  }

  // Check HTTP response status
  if (!response.ok) {
    const envelope = responseData as QlooMcpEnvelope | undefined;
    const summary = envelope?.summary || `Request failed with HTTP status ${response.status}`;
    throw new ApiClientError(summary, response.status, envelope);
  }

  return responseData as T;
}

// ---------------------------------------------------------------------------
// Typed API Client Methods
// ---------------------------------------------------------------------------

/**
 * Checks backend connectivity, MCP process readiness, and available operating modes.
 */
export async function getBackendHealth(signal?: AbortSignal): Promise<BackendHealthResponse> {
  return fetchJson<BackendHealthResponse>("/api/health", {
    method: "GET",
    signal
  });
}

/**
 * Requests location intelligence, cultural peer anchors, and defining taste concepts.
 */
export async function fetchLocationInsights(
  params: LocationInsightsRequest,
  signal?: AbortSignal
): Promise<QlooMcpEnvelope<LocationInsightsData>> {
  return fetchJson<QlooMcpEnvelope<LocationInsightsData>>("/api/location-insights", {
    method: "POST",
    body: JSON.stringify(params),
    signal
  });
}

/**
 * Requests comparative cultural audience analysis between two markets.
 */
export async function fetchCompareAudiences(
  params: CompareAudiencesRequest,
  signal?: AbortSignal
): Promise<QlooMcpEnvelope<AudienceComparisonData>> {
  return fetchJson<QlooMcpEnvelope<AudienceComparisonData>>("/api/compare-audiences", {
    method: "POST",
    body: JSON.stringify(params),
    signal
  });
}

/**
 * Requests cultural trend momentum indices and geographic concentration heatmaps.
 */
export async function fetchLocalTrends(
  params: LocalTrendsRequest,
  signal?: AbortSignal
): Promise<QlooMcpEnvelope<LocalTrendsData>> {
  return fetchJson<QlooMcpEnvelope<LocalTrendsData>>("/api/local-trends", {
    method: "POST",
    body: JSON.stringify(params),
    signal
  });
}

/**
 * Requests tactical business initiative recommendations scored and ranked against an operational goal.
 */
export async function fetchRecommendations(
  params: RecommendationsRequest,
  signal?: AbortSignal
): Promise<QlooMcpEnvelope<RecommendationsData>> {
  return fetchJson<QlooMcpEnvelope<RecommendationsData>>("/api/recommendations", {
    method: "POST",
    body: JSON.stringify(params),
    signal
  });
}

/**
 * Requests an end-to-end Weekly Culture Plan with Qloo provenance citations,
 * comparative generic LLM baseline, and staff feedback memory.
 */
export async function fetchCulturePlan(
  params: CulturePlanRequest,
  signal?: AbortSignal
): Promise<QlooMcpEnvelope<CulturePlanData>> {
  return fetchJson<QlooMcpEnvelope<CulturePlanData>>("/api/plan", {
    method: "POST",
    body: JSON.stringify(params),
    signal
  });
}

/**
 * Requests a coordinated weekly cultural operations plan orchestrated across
 * Location Insights, Audience Comparison, Local Trends, and Tactical Ranking.
 */
export async function fetchAgentWeeklyPlan(
  params: AgentWeeklyPlanRequest,
  signal?: AbortSignal
): Promise<QlooMcpEnvelope<WeeklyCulturalPlanData>> {
  return fetchJson<QlooMcpEnvelope<WeeklyCulturalPlanData>>("/api/agent/weekly-plan", {
    method: "POST",
    body: JSON.stringify(params),
    signal
  });
}

/**
 * Client object bundling all API methods for convenient single-import usage.
 */
export const apiClient = {
  getHealth: getBackendHealth,
  getLocationInsights: fetchLocationInsights,
  compareAudiences: fetchCompareAudiences,
  getLocalTrends: fetchLocalTrends,
  getRecommendations: fetchRecommendations,
  getCulturePlan: fetchCulturePlan,
  getAgentWeeklyPlan: fetchAgentWeeklyPlan
};
