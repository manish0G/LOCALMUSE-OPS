import { Router, type Request, type Response } from "express";
import { parseMode, sendMcpResponse, sendInputError } from "./utils.js";
import { orchestrateWeeklyPlan } from "../services/agent-orchestrator.js";
import type { AgentWeeklyPlanRequest } from "../services/qloo-types.js";

export const agentRouter = Router();

/**
 * Common handler for weekly plan orchestration.
 */
async function handleWeeklyPlan(req: Request, res: Response) {
  const { mode: rawMode, businessProfile, operationalGoal } = req.body ?? {};

  const mode = parseMode(rawMode);
  if (!mode) {
    return sendInputError(res, "Field 'mode' is required and must be either 'demo' or 'live'.");
  }

  // Validate businessProfile
  if (!businessProfile || typeof businessProfile !== "object") {
    return sendInputError(
      res,
      "Field 'businessProfile' is required and must be an object with 'name', 'city', and 'category'.",
      mode
    );
  }

  const name = typeof businessProfile.name === "string" ? businessProfile.name.trim() : "";
  const city = typeof businessProfile.city === "string" ? businessProfile.city.trim() : "";
  const category = typeof businessProfile.category === "string" ? businessProfile.category.trim() : "";

  if (!name || !city || !category) {
    return sendInputError(
      res,
      "Properties 'name', 'city', and 'category' are all required in 'businessProfile'.",
      mode
    );
  }

  // Validate operationalGoal
  if (!operationalGoal || typeof operationalGoal !== "object") {
    return sendInputError(
      res,
      "Field 'operationalGoal' is required and must be an object with an 'objective'.",
      mode
    );
  }

  const objective = typeof operationalGoal.objective === "string" ? operationalGoal.objective.trim() : "";
  if (!objective) {
    return sendInputError(
      res,
      "Property 'objective' is required in 'operationalGoal'.",
      mode
    );
  }

  const normalizedRequest: AgentWeeklyPlanRequest = {
    mode,
    businessProfile: {
      name,
      city,
      category,
      neighborhood: typeof businessProfile.neighborhood === "string" ? businessProfile.neighborhood.trim() : undefined,
      vibeKeywords: Array.isArray(businessProfile.vibeKeywords) ? businessProfile.vibeKeywords : undefined,
      seedSignals: Array.isArray(businessProfile.seedSignals) ? businessProfile.seedSignals : undefined
    },
    operationalGoal: {
      objective,
      targetDemographic: typeof operationalGoal.targetDemographic === "string" ? operationalGoal.targetDemographic.trim() : undefined,
      benchmarkCity: typeof operationalGoal.benchmarkCity === "string" ? operationalGoal.benchmarkCity.trim() : undefined,
      targetWeek: typeof operationalGoal.targetWeek === "string" ? operationalGoal.targetWeek.trim() : undefined
    }
  };

  try {
    const envelope = await orchestrateWeeklyPlan(normalizedRequest);
    return sendMcpResponse(res, envelope, mode);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      status: "error",
      summary: `Internal server failure orchestrating weekly plan: ${message}`,
      results: [],
      result_count: 0,
      metadata: {
        isDemo: mode === "demo",
        source: mode === "demo" ? "curated_mock_fixture" : "live_qloo_mcp",
        timestamp: new Date().toISOString()
      }
    });
  }
}

/**
 * POST /api/agent/weekly-plan
 * Coordinates all 4 cultural workflows into a practical weekly cultural operations plan.
 */
agentRouter.post("/weekly-plan", handleWeeklyPlan);

/**
 * POST /api/agent
 * Alias for the weekly plan orchestration endpoint.
 */
agentRouter.post("/", handleWeeklyPlan);
