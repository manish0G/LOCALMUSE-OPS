import type { QlooMcpEnvelope } from "../mcp/executor.js";
import {
  getLocationInsights,
  compareAudiences,
  getLocalTrends,
  recommendAndRank
} from "./qloo-service.js";
import { getMockWeeklyCulturalPlan } from "./mock-service.js";
import {
  synthesizeWeeklyCulturalPlan,
  type MultiWorkflowResults
} from "./agent-synthesizer.js";
import type {
  AgentWeeklyPlanRequest,
  WeeklyCulturalPlanData
} from "./qloo-types.js";

/**
 * Coordinated LocalMuse Agent Orchestrator.
 *
 * Coordinates the four core cultural capabilities:
 * 1. Location Insights (Peer Anchors, Concept Tags, Demographics)
 * 2. Audience Comparison (Cross-Market Contrast, Conditional on Benchmark)
 * 3. Local Trends (Popularity Momentum & Emerging Shifts)
 * 4. Tactical Recommendations (Two-Stage Candidate Discovery & Ranking)
 *
 * Guarantees:
 * - In Demo Mode: Calls curated benchmark fixtures with honest disclosure.
 * - In Live Mode: Calls actual Qloo MCP tools and never silently falls back to mock data.
 * - Missing Qloo API credentials return authentic HTTP 401 QLOO_AUTH.
 * - Respects the 10-candidate maximum and canonical entity schemas.
 */
export async function orchestrateWeeklyPlan(
  params: AgentWeeklyPlanRequest
): Promise<QlooMcpEnvelope<WeeklyCulturalPlanData>> {
  const { mode, businessProfile, operationalGoal } = params ?? {};

  const profileName = (businessProfile?.name || "").trim();
  const profileCity = (businessProfile?.city || "").trim();
  const profileCat = (businessProfile?.category || "").trim();
  const objective = (operationalGoal?.objective || "").trim();

  // Validate required parameters
  if (!profileName || !profileCity || !profileCat || !objective) {
    return {
      status: "needs_input",
      summary: "Business name, city, category, and strategic goal objective are required to orchestrate a weekly plan.",
      results: [],
      result_count: 0,
      metadata: {
        isDemo: mode === "demo",
        source: mode === "demo" ? "curated_mock_fixture" : "live_qloo_mcp",
        timestamp: new Date().toISOString()
      }
    };
  }

  // 1. Demo Mode Branch
  if (mode === "demo") {
    return getMockWeeklyCulturalPlan(businessProfile, operationalGoal);
  }

  // 2. Live Qloo MCP Mode Branch
  const toolsExecuted: string[] = [];
  const workflowResults: MultiWorkflowResults = { toolsExecuted };
  const fullLocation = businessProfile.neighborhood?.trim()
    ? `${businessProfile.neighborhood.trim()}, ${profileCity}`
    : profileCity;

  // -------------------------------------------------------------------------
  // Stage 1: Location Insights & Cultural Anchoring
  // -------------------------------------------------------------------------
  const insightsEnvelope = await getLocationInsights(fullLocation, profileCat);
  toolsExecuted.push("qloo_recommend", "qloo_entity_tags");

  if (insightsEnvelope.status === "error") {
    // Fail immediately on fatal MCP error (e.g. QLOO_AUTH). Never fall back!
    return {
      status: "error",
      summary: `Location intelligence stage failed: ${insightsEnvelope.summary}`,
      results: [],
      result_count: 0,
      error: insightsEnvelope.error,
      execution: insightsEnvelope.execution,
      provenance: insightsEnvelope.provenance,
      metadata: {
        isDemo: false,
        source: "live_qloo_mcp",
        timestamp: new Date().toISOString()
      }
    };
  }

  workflowResults.locationInsights = insightsEnvelope.results[0];

  // -------------------------------------------------------------------------
  // Stage 2: Local Trends & Momentum Curves (Recent 4 Quarters)
  // -------------------------------------------------------------------------
  const startDate = "2025-01-01";
  const endDate = "2026-06-30";
  const trendsEnvelope = await getLocalTrends(fullLocation, profileCat, startDate, endDate);
  toolsExecuted.push("qloo_trends");

  if (trendsEnvelope.status === "error") {
    // QLOO_AUTH remains fatal and must immediately return the existing authentication error
    if (trendsEnvelope.error?.code === "QLOO_AUTH") {
      return {
        status: "error",
        summary: `Trend momentum stage failed: ${trendsEnvelope.summary}`,
        results: [],
        result_count: 0,
        error: trendsEnvelope.error,
        execution: trendsEnvelope.execution,
        provenance: trendsEnvelope.provenance,
        metadata: {
          isDemo: false,
          source: "live_qloo_mcp",
          timestamp: new Date().toISOString()
        }
      };
    }
    // Non-auth error: preserve sanitized error info, mark trend stage as degraded, and allow ranking to proceed
    workflowResults.trendStageStatus = "degraded";
    workflowResults.trendStageError = trendsEnvelope.summary || trendsEnvelope.error?.code || "Trend analysis failed";
  } else if (trendsEnvelope.status === "empty" || !trendsEnvelope.results || trendsEnvelope.results.length === 0) {
    // Empty trend results: mark trends as empty/unavailable and allow ranking to proceed
    workflowResults.trendStageStatus = "empty";
  } else {
    workflowResults.localTrends = trendsEnvelope.results[0];
    workflowResults.trendStageStatus = "complete";
  }

  // -------------------------------------------------------------------------
  // Stage 3: Audience Comparison (Conditional on Benchmark City)
  // -------------------------------------------------------------------------
  const benchmarkCity = operationalGoal.benchmarkCity?.trim();
  if (benchmarkCity) {
    const comparisonEnvelope = await compareAudiences(profileCity, benchmarkCity, "brand");
    toolsExecuted.push("qloo_describe", "qloo_compare_audiences");

    if (comparisonEnvelope.status === "error") {
      // If error is authentication failure, fail fast
      if (comparisonEnvelope.error?.code === "QLOO_AUTH") {
        return {
          status: "error",
          summary: `Audience comparison stage failed: ${comparisonEnvelope.summary}`,
          results: [],
          result_count: 0,
          error: comparisonEnvelope.error,
          execution: comparisonEnvelope.execution,
          metadata: {
            isDemo: false,
            source: "live_qloo_mcp",
            timestamp: new Date().toISOString()
          }
        };
      }
      // Non-fatal comparison degradation: omit audience comparison section gracefully
    } else if (comparisonEnvelope.results.length > 0) {
      workflowResults.audienceComparison = comparisonEnvelope.results[0];
    }
  }

  // -------------------------------------------------------------------------
  // Stage 4: Tactical Recommendations & Ranking
  // -------------------------------------------------------------------------
  const recsEnvelope = await recommendAndRank(
    {
      name: profileName,
      location: fullLocation,
      category: profileCat,
      seedSignals: businessProfile.seedSignals,
      vibeKeywords: businessProfile.vibeKeywords
    },
    {
      objective,
      targetDemographic: operationalGoal.targetDemographic
    }
  );
  toolsExecuted.push("qloo_rank");

  if (recsEnvelope.status === "error") {
    return {
      status: "error",
      summary: `Tactical ranking stage failed: ${recsEnvelope.summary}`,
      results: [],
      result_count: 0,
      error: recsEnvelope.error,
      execution: recsEnvelope.execution,
      provenance: recsEnvelope.provenance,
      metadata: {
        isDemo: false,
        source: "live_qloo_mcp",
        timestamp: new Date().toISOString()
      }
    };
  }

  workflowResults.recommendations = recsEnvelope.results[0];

  // -------------------------------------------------------------------------
  // Stage 5: Deterministic Plan Synthesis
  // -------------------------------------------------------------------------
  const plan = synthesizeWeeklyCulturalPlan(
    businessProfile,
    operationalGoal,
    workflowResults,
    false // isDemo: false
  );

  return {
    status: "ok",
    summary: `Coordinated weekly cultural operations plan synthesized via 4 Qloo MCP stages for '${profileName}' in '${profileCity}'.`,
    results: [plan],
    result_count: 1,
    metadata: {
      isDemo: false,
      source: "live_qloo_mcp",
      toolChain: toolsExecuted,
      timestamp: new Date().toISOString()
    }
  };
}
