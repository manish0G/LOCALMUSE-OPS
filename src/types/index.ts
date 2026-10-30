/**
 * Core application types and domain models for LocalMuse Ops
 */

export interface AppConfig {
  name: string;
  description: string;
  version: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

// ---------------------------------------------------------------------------
// 1. Operation Mode & Canonical MCP Envelope
// ---------------------------------------------------------------------------

export type OperationMode = "demo" | "live";

export type McpStatus = "ok" | "empty" | "needs_input" | "partial" | "degraded" | "error";

export interface McpErrorDetail {
  code: string;
  retryable: boolean;
  recovery?: string;
  layer?: string;
}

export interface McpMetadata {
  isDemo: boolean;
  source: string;
  timestamp: string;
  fixture?: string;
  disclosure?: string;
  toolChain?: string[];
  [key: string]: unknown;
}

export interface QlooMcpEnvelope<T = unknown> {
  status: McpStatus;
  summary: string;
  results: T[];
  result_count: number;
  error?: McpErrorDetail;
  metadata?: McpMetadata;
  execution?: Record<string, unknown>;
  provenance?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// 2. Qloo Entity & Domain Enums
// ---------------------------------------------------------------------------

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

export type QlooSearchEntityType =
  | QlooInsightsEntityType
  | "locality"
  | "actor"
  | "album"
  | "author"
  | "director";

// ---------------------------------------------------------------------------
// 3. Location Insights Domain & Request Types
// ---------------------------------------------------------------------------

export interface LocationInsightsRequest {
  mode: OperationMode;
  location: string;
  businessType: string;
}

export interface QlooTagRecord {
  id?: string;
  name?: string;
  tag_id?: string;
  urn?: string;
  score?: number;
  prevalence?: string;
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
  vibe_keywords?: string[];
  description?: string;
  illustrative_affinity_score?: number;
  [key: string]: unknown;
}

export interface LocationInsightsData {
  location?: string;
  target_location?: string;
  businessType?: string;
  business_type?: string;
  cultural_overview?: string;
  analysisSummary?: string;
  resolvedTags?: QlooTagRecord[];
  defining_concept_tags?: Array<{ urn?: string; label?: string; prevalence?: string }>;
  places?: QlooPlaceRecord[];
  top_cultural_anchors?: QlooPlaceRecord[];
  characterizingConcepts?: Array<{
    entityId: string;
    entityName?: string;
    tags: QlooTagRecord[];
  }>;
  demographic_breakdown?: {
    primary_age_bracket?: string;
    target_segments?: string[];
    lifestyle_interests?: string[];
  };
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// 4. Audience Comparison Domain & Request Types
// ---------------------------------------------------------------------------

export interface CompareAudiencesRequest {
  mode: OperationMode;
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

export interface SharedAffinityItem {
  category?: string;
  concept: string;
  illustrative_index?: number;
  shared_affinity_index?: number;
  description: string;
}

export interface DifferentiatingTraitItem {
  trait: string;
  affinity_divergence?: string;
  strength?: number;
  context?: string;
  note?: string;
}

export interface AudienceComparisonData {
  marketA?: ResolvedLocality;
  marketB?: ResolvedLocality;
  market_a?: {
    name: string;
    cultural_anchor_signals?: string[];
    dominant_lifestyle_themes?: string[];
  };
  market_b?: {
    name: string;
    cultural_anchor_signals?: string[];
    dominant_lifestyle_themes?: string[];
  };
  targetCategory?: QlooInsightsEntityType;
  shared_affinities?: SharedAffinityItem[];
  differentiating_affinities?: {
    market_a_exclusive?: DifferentiatingTraitItem[];
    market_b_exclusive?: DifferentiatingTraitItem[];
  };
  comparisonResults?: unknown[];
  divergenceSummary?: string;
  operational_takeaway?: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// 5. Local Trends Domain & Request Types
// ---------------------------------------------------------------------------

export interface LocalTrendsRequest {
  mode: OperationMode;
  location: string;
  category: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

export interface TrendTimelinePoint {
  period: string;
  illustrative_momentum_index?: number;
  momentum_index?: number;
  sample_volume_indicator?: string;
  search_interest?: number;
}

export interface EmergingCulturalShift {
  shift_name: string;
  momentum_growth: string;
  description: string;
  pioneering_local_spots?: string[];
}

export interface NeighborhoodHeatmapItem {
  neighborhood: string;
  affinity_density: "Peak" | "High" | "Growing";
  primary_patron_profile?: string;
}

export interface LocalTrendsData {
  location: string;
  category?: string;
  requestedCategory?: string;
  inferredEntityType?: QlooInsightsEntityType;
  historical_timeline?: TrendTimelinePoint[];
  emerging_cultural_shifts?: EmergingCulturalShift[];
  neighborhood_heatmaps?: NeighborhoodHeatmapItem[];
  seedEntities?: Array<{ id?: string; name?: string }>;
  dateRange?: { startDate: string; endDate: string };
  trendMetrics?: unknown[];
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// 6. Recommendations & Rank Domain & Request Types
// ---------------------------------------------------------------------------

export interface BusinessProfileInput {
  name: string;
  location?: string;
  category?: string;
  seedSignals?: string[];
  vibeKeywords?: string[];
}

export interface BusinessGoalInput {
  objective: string;
  targetDemographic?: string;
  targetCategory?: QlooInsightsEntityType;
  includeTags?: string[];
  excludeTags?: string[];
}

export interface RecommendationsRequest {
  mode: OperationMode;
  businessProfile: BusinessProfileInput | string;
  goal: BusinessGoalInput | string;
}

export interface RankedOpportunityItem {
  id?: string;
  rank: number;
  title?: string;
  option?: string;
  type?: "Programming" | "Partnership" | "Product" | "Atmosphere" | string;
  illustrative_fit_score?: number;
  score?: number;
  target_segment?: string;
  operational_effort?: "Low" | "Medium" | "High" | string;
  strategic_rationale?: string;
  implementation_milestones?: string[];
  context?: Record<string, unknown>;
}

export interface RecommendationsData {
  business_name?: string;
  businessName?: string;
  business_context?: string;
  strategic_goal?: string;
  goalObjective?: string;
  targetCategory?: QlooInsightsEntityType;
  resolvedDemographic?: string;
  candidateOptionsDiscovered?: string[];
  ranked_opportunities?: RankedOpportunityItem[];
  rankedShortlist?: RankedOpportunityItem[];
  projected_impact_summary?: string;
  strategyRationale?: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// 7. Agent Orchestration & Weekly Cultural Plan Types
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
  mode: OperationMode;
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

// ---------------------------------------------------------------------------
// 8. Backend Health & Capabilities Types
// ---------------------------------------------------------------------------

export interface BackendCapabilitiesInfo {
  isAvailable: boolean;
  isReady: boolean;
  credentialState: "ready" | "missing" | "error";
  totalTools: number;
  tools?: Array<{ name: string; description?: string }>;
  summary: string;
  adapterId?: string;
  supportedOperations?: string[];
}

export interface BackendHealthResponse {
  status: "online" | "degraded";
  service: string;
  mcpConnected: boolean;
  capabilities?: BackendCapabilitiesInfo;
  modesAvailable: {
    demo: boolean;
    live: boolean;
  };
  recommendedMode: OperationMode;
  error?: string;
  hint?: string;
}

// ---------------------------------------------------------------------------
// 8. Weekly Culture Plan & Comparative Agent Domain Types
// ---------------------------------------------------------------------------

export interface CulturePlanSignal {
  signalType: "location_anchor" | "concept_tag" | "trend_momentum" | "cross_domain_affinity" | "audience_contrast";
  citation: string;
  scoreOrPrevalence?: string | number;
  explanation: string;
}

export interface CulturePlanPillar {
  id: string;
  category: "specials" | "playlist" | "events" | "partnerships" | "merchandising" | "marketing";
  title: string;
  subtitle: string;
  description: string;
  actionItems: string[];
  timing: string;
  projectedImpact: string;
  qlooSignals: CulturePlanSignal[];
}

export interface ComparativeScoreMetric {
  metric: string;
  qlooScore: number;
  genericScore: number;
  advantageAnalysis: string;
}

export interface CulturePlanData {
  business: {
    name: string;
    type: string;
    location: string;
    neighborhood: string;
    style: string;
    priceBand: string;
    targetCustomer: string;
    goal: string;
  };
  generatedWeek: string;
  qlooPlan: {
    executiveSummary: string;
    strategicThesis: string;
    pillars: CulturePlanPillar[];
    demographicFocus: {
      primaryBracket: string;
      subcultures: string[];
      topAffinities: string[];
    };
  };
  genericPlan: {
    executiveSummary: string;
    strategicThesis: string;
    pillars: Array<{
      category: string;
      title: string;
      description: string;
      critique: string;
    }>;
  };
  comparativeScores: ComparativeScoreMetric[];
  feedbackMemory?: {
    tagsApplied: string[];
    customNotes?: string;
    iterationCount: number;
    agentMemoryLog: string[];
  };
  assumptions: string[];
  responsibleAiLimitations: string[];
}

export interface CulturePlanRequest {
  mode: OperationMode;
  businessName?: string;
  businessType: string;
  location: string;
  neighborhood?: string;
  style?: string;
  priceBand?: string;
  targetCustomer?: string;
  goal: string;
  feedback?: {
    tags?: string[];
    notes?: string;
    iteration?: number;
  };
}
