import { Router } from "express";
import { healthRouter } from "./health.js";
import { locationInsightsRouter } from "./location-insights.js";
import { compareAudiencesRouter } from "./compare-audiences.js";
import { localTrendsRouter } from "./local-trends.js";
import { recommendationsRouter } from "./recommendations.js";
import { planRouter } from "./plan.js";

export const apiRouter = Router();

// Mount all /api subroutes
apiRouter.use("/health", healthRouter);
apiRouter.use("/location-insights", locationInsightsRouter);
apiRouter.use("/compare-audiences", compareAudiencesRouter);
apiRouter.use("/local-trends", localTrendsRouter);
apiRouter.use("/recommendations", recommendationsRouter);
apiRouter.use("/plan", planRouter);

export {
  healthRouter,
  locationInsightsRouter,
  compareAudiencesRouter,
  localTrendsRouter,
  recommendationsRouter,
  planRouter
};
