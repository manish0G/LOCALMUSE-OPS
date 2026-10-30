import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { registerMcpLifecycleHooks } from "./mcp/client.js";
import { healthRouter } from "./routes/health.js";
import { apiRouter } from "./routes/index.js";

// Load backend environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

// Register clean process shutdown hooks for the stdio MCP child process
registerMcpLifecycleHooks();

// Middleware
app.use(
  cors({
    origin: [FRONTEND_ORIGIN, "http://localhost:3000"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Body parser with 1MB payload limit
app.use(express.json({ limit: "1mb" }));

// Malformed JSON handler middleware
app.use((err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      status: "error",
      summary: "Malformed JSON payload in request body.",
      results: [],
      result_count: 0
    });
  }
  return next(err);
});

// Existing /health endpoint (preserved for root probes and monitoring)
app.use("/health", healthRouter);

// New /api router hosting all LocalMuse Ops workflow endpoints
app.use("/api", apiRouter);

// Root information endpoint
app.get("/", (_req, res) => {
  res.json({
    name: "LocalMuse Ops Backend",
    version: "0.1.0",
    description: "Persistent Node.js Backend for Qloo Cultural Intelligence & MCP Integration",
    endpoints: {
      health: "/health",
      apiHealth: "/api/health",
      locationInsights: "POST /api/location-insights",
      compareAudiences: "POST /api/compare-audiences",
      localTrends: "POST /api/local-trends",
      recommendations: "POST /api/recommendations",
      culturePlan: "POST /api/plan"
    }
  });
});

// Start HTTP server only if not being imported for testing
let server: ReturnType<typeof app.listen> | undefined;

if (process.env.NODE_ENV !== "test") {
  server = app.listen(PORT, () => {
    console.log(`[LocalMuse Ops Backend] Server listening on port ${PORT}`);
    console.log(`[LocalMuse Ops Backend] CORS configured for: ${FRONTEND_ORIGIN}`);
  });
}

// Graceful HTTP server shutdown
function shutdown() {
  console.log("[LocalMuse Ops Backend] Shutting down HTTP server...");
  if (server) {
    server.close(() => {
      console.log("[LocalMuse Ops Backend] HTTP server closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);

export default app;
