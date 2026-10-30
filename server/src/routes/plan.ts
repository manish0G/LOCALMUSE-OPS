import { Router, type Request, type Response } from "express";
import { parseMode, sendMcpResponse, sendInputError } from "./utils.js";
import { generateCulturePlan, type CulturePlanRequestInput } from "../services/plan-service.js";

export const planRouter = Router();

/**
 * POST /api/plan
 * Generates an end-to-end Weekly Culture Plan with Qloo provenance citations,
 * generic LLM comparison baseline, and feedback memory adaptation.
 */
planRouter.post("/", async (req: Request, res: Response) => {
  const {
    mode: rawMode = "demo",
    businessName,
    businessType,
    location,
    neighborhood,
    style,
    priceBand,
    targetCustomer,
    goal,
    feedback
  } = req.body ?? {};

  const mode = parseMode(rawMode) || "demo";

  if (!businessType || typeof businessType !== "string" || !businessType.trim()) {
    return sendInputError(res, "Field 'businessType' is required and must be a non-empty string.", mode);
  }

  if (!location || typeof location !== "string" || !location.trim()) {
    return sendInputError(res, "Field 'location' is required (e.g. 'Austin, TX').", mode);
  }

  const input: CulturePlanRequestInput = {
    businessName: typeof businessName === "string" ? businessName : undefined,
    businessType: businessType.trim(),
    location: location.trim(),
    neighborhood: typeof neighborhood === "string" ? neighborhood.trim() : undefined,
    style: typeof style === "string" ? style.trim() : undefined,
    priceBand: typeof priceBand === "string" ? priceBand.trim() : undefined,
    targetCustomer: typeof targetCustomer === "string" ? targetCustomer.trim() : undefined,
    goal: typeof goal === "string" && goal.trim() ? goal.trim() : "Increase footfall and check size",
    feedback: feedback && typeof feedback === "object" ? feedback : undefined
  };

  try {
    const envelope = generateCulturePlan(input, mode);
    return sendMcpResponse(res, envelope, mode);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      status: "error",
      summary: `Failure generating Weekly Culture Plan: ${message}`,
      results: [],
      result_count: 0,
      metadata: {
        isDemo: mode === "demo",
        source: mode === "demo" ? "curated_mock_fixture" : "live_qloo_mcp",
        timestamp: new Date().toISOString()
      }
    });
  }
});
