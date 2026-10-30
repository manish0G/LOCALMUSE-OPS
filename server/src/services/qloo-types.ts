/**
 * Types and interfaces for the live Qloo MCP service layer.
 * Strictly adheres to the canonical Qloo Hackathon Kit tool contracts and schemas.
 */

/**
 * Valid entity types supported by Qloo Insights workflows (recommend, rank, trends, compare_audiences).
 */
export type QlooInsightsEntityType =
  | "artist"
  | "book"
  | "brand"
  | "movie"
  | "person"
  | "place"
  | "podcast"
  | "tv_show"
  | "videogame";

/**
 * Valid entity types supported by Qloo Search and Describe workflows.
 */
export type QlooSearchEntityType =
  | QlooInsightsEntityType
  | "locality"
  | "actor"
  | "album"
  | "author"
  | "director";

// ---------------------------------------------------------------------------
// 1. Location Insights Types
// ---------------------------------------------------------------------------

export interface LocationInsightsParams {
  location: string;
  businessType: string;
}

export interface QlooTagRecord {
  id?: string;
  name?: string;
  tag_id?: string;
  urn?: string;
  score?: number;
  [key: string]: unknown;
}

export interface QlooPlaceRecord {
  id?: string;
  name?: string;
  category?: string;
  address?: string;
  location?: string;
  score?: number;
  tags?: string[];
  [key: string]: unknown;
}

export interface LocationInsightsResult {
  location: string;
  businessType: string;
  resolvedTags: QlooTagRecord[];
  places: QlooPlaceRecord[];
  characterizingConcepts: Array<{
    entityId: string;
    entityName?: string;
    tags: QlooTagRecord[];
  }>;
  analysisSummary: string;
}

// ---------------------------------------------------------------------------
// 2. Audience Comparison Types
// ---------------------------------------------------------------------------

export interface AudienceComparisonParams {
  locationA: string;
  locationB: string;
  targetCategory?: QlooInsightsEntityType;
}

export interface ResolvedLocality {
  input: string;
  entityId?: string;
  name?: string;
  disambiguation?: string;
  type: "locality";
  metadata?: Record<string, unknown>;
}

export interface AudienceComparisonResult {
  marketA: ResolvedLocality;
  marketB: ResolvedLocality;
  targetCategory: QlooInsightsEntityType;
  comparisonResults: unknown[];
  divergenceSummary?: string;
}

// ---------------------------------------------------------------------------
// 3. Local Trends Types
// ---------------------------------------------------------------------------

export interface LocalTrendsParams {
  location: string;
  category: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

export interface LocalTrendsResult {
  location: string;
  requestedCategory: string;
  inferredEntityType: QlooInsightsEntityType;
  seedEntities: Array<{
    id?: string;
    name?: string;
  }>;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  trendMetrics: unknown[];
}

// ---------------------------------------------------------------------------
// 4. Recommend & Rank Types
// ---------------------------------------------------------------------------

export interface BusinessProfileInput {
  name: string;
  location?: string;
  category?: string;
  seedSignals?: string[]; // Named entities or Qloo UUIDs
  vibeKeywords?: string[]; // Natural language traits or tag concepts
}

export interface BusinessGoalInput {
  objective: string;
  targetDemographic?: string; // e.g. "young women", "men 25-34", "millennials"
  targetCategory?: QlooInsightsEntityType;
  includeTags?: string[];
  excludeTags?: string[];
}

export interface RecommendAndRankParams {
  businessProfile: BusinessProfileInput;
  goal: BusinessGoalInput;
}

export interface RankedOptionRecord {
  option: string;
  rank: number;
  score?: number;
  context?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface RecommendAndRankResult {
  businessName: string;
  goalObjective: string;
  targetCategory: QlooInsightsEntityType;
  resolvedDemographic?: string;
  candidateOptionsDiscovered: string[];
  rankedShortlist: RankedOptionRecord[];
  strategyRationale: string;
}

// ---------------------------------------------------------------------------
// 5. Agent Orchestration & Weekly Cultural Plan Types
// ---------------------------------------------------------------------------

export type RecommendationOrigin = "qloo_evidence" | "agent_derived";

export interface QlooProvenanceLink {
  sourceTool:
    | "qloo_recommend"
    | "qloo_entity_tags"
    | "qloo_compare_audiences"
    | "qloo_trends"
    | "qloo_rank"
    | "curated_mock_fixture"
    | "none";
  groundingEntityOrTag: string;
  empiricalMeasurement?: string;
  interpretationNote?: string;
  origin: RecommendationOrigin;
}

export interface PlanMenuItemSpecial {
  dayOfWeek: string;
  title: string;
  themeCategory: "Product" | "Culinary Special" | "Botanical Beverage" | string;
  description: string;
  operationalNotes: string;
  origin: RecommendationOrigin;
  provenance: QlooProvenanceLink;
}

export interface PlanEventOrPartnership {
  dayOfWeek: string;
  title: string;
  partnerType: string;
  targetAudience: string;
  executionSteps: string[];
  origin: RecommendationOrigin;
  provenance: QlooProvenanceLink;
}

export interface PlanAtmosphereDirection {
  musicalGenre: string;
  soundscapeVibe: string;
  lightingAndDwellPacing: string;
  curatedArtistSignals: string[];
  origin: RecommendationOrigin;
  provenance: QlooProvenanceLink;
}

export interface PlanSocialPostAngle {
  dayOfWeek: string;
  hook: string;
  contentAngle: string;
  recommendedFormat: "Reel / Short Video" | "Story" | "Carousel" | string;
  origin: RecommendationOrigin;
  provenance: QlooProvenanceLink;
}

export interface PlanDailyScheduleSlot {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  shiftFocus: string;
  keyMilestones: string[];
  targetOutcome: string;
  origin: RecommendationOrigin;
}

export interface PlanExpectedImpact {
  projectedOutcomeSummary: string;
  supportingDataPoints: Array<{
    metricName: string;
    value: string;
    source: string;
  }>;
  dataSupported: boolean;
}

export interface PlanAudienceDivergence {
  benchmarkMarket: string;
  sharedAffinities: string[];
  distinguishingLocalTraits: string[];
  divergenceTakeaway: string;
  status: "complete" | "partial" | "skipped";
}

export interface WeeklyCulturalPlanData {
  businessName: string;
  locality: string;
  targetWeek: string;
  executiveStrategy: string;
  culturalAnchorSummary: string;
  targetPatronSegment: string;
  specialsAndMenu: PlanMenuItemSpecial[];
  eventsAndPartnerships: PlanEventOrPartnership[];
  atmosphereAndPlaylist: PlanAtmosphereDirection;
  socialContentCalendar: PlanSocialPostAngle[];
  dailySchedule: PlanDailyScheduleSlot[];
  expectedImpact: PlanExpectedImpact;
  audienceDivergence?: PlanAudienceDivergence;
  orchestrationTrace: {
    toolsExecuted: string[];
    stagesCompleted: number;
    timestamp: string;
    isDemo: boolean;
  };
  [key: string]: unknown;
}

export interface AgentWeeklyPlanRequest {
  mode: "demo" | "live";
  businessProfile: {
    name: string;
    category: string;
    city: string;
    neighborhood?: string;
    vibeKeywords?: string[];
    seedSignals?: string[];
  };
  operationalGoal: {
    objective: string;
    targetDemographic?: string;
    benchmarkCity?: string;
    targetWeek?: string;
  };
}
