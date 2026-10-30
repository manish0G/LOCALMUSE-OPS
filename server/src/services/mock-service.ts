import type { QlooMcpEnvelope } from "../mcp/executor.js";
import type { WeeklyCulturalPlanData } from "./qloo-types.js";
import {
  MOCK_AUSTIN_COFFEE_INSIGHTS,
  MOCK_AUSTIN_VS_NASHVILLE_COMPARISON,
  MOCK_AUSTIN_COFFEE_TRENDS,
  MOCK_CAFE_WEEKDAY_FOOTFALL_RECOMMENDATIONS,
  MOCK_WEEKLY_CULTURAL_OPERATIONS_PLAN_CAFE,
  type MockLocationInsightsData,
  type MockAudienceComparisonData,
  type MockLocalTrendsData,
  type MockRecommendationsData
} from "./mock-data.js";

/**
 * Creates the standardized metadata block guaranteeing honest disclosure
 * for all simulated demo mode responses.
 */
function createDemoMetadata(fixtureKey: string) {
  return {
    isDemo: true,
    source: "curated_mock_fixture" as const,
    fixture: fixtureKey,
    timestamp: new Date().toISOString(),
    disclosure: "Illustrative demo fixture for hackathon evaluation; not official live Qloo API data."
  };
}

/**
 * 1. Location Insights Demo Service
 *
 * Simulates cultural anchors, affinity concepts, and demographic distribution
 * for a business category within a geographic locality.
 */
export function getMockLocationInsights(
  location: string = "Austin, TX",
  businessType: string = "Specialty Coffee"
): QlooMcpEnvelope<MockLocationInsightsData> {
  const trimmedLoc = (location || "").trim();
  const trimmedType = (businessType || "").trim();

  if (!trimmedLoc || !trimmedType) {
    return {
      status: "needs_input",
      summary: "Location and business type must both be provided to generate location intelligence.",
      results: [],
      result_count: 0,
      metadata: createDemoMetadata("location_insights_needs_input")
    };
  }

  const isAustinCoffee =
    trimmedLoc.toLowerCase().includes("austin") &&
    (trimmedType.toLowerCase().includes("coffee") || trimmedType.toLowerCase().includes("café"));

  // If the demo query matches Austin & coffee, return the rich curated dataset
  if (isAustinCoffee) {
    return {
      status: "ok",
      summary: `[Demo Mode] Identified 5 top cultural anchors and 5 defining taste concepts for ${trimmedType} in ${trimmedLoc}.`,
      results: [MOCK_AUSTIN_COFFEE_INSIGHTS],
      result_count: 1,
      metadata: createDemoMetadata("austin_specialty_coffee")
    };
  }

  // Generalized illustrative fixture for any other location / business type
  const adaptedFixture: MockLocationInsightsData = {
    target_location: trimmedLoc,
    business_type: trimmedType,
    cultural_overview: `[Illustrative Demo] Cultural positioning for ${trimmedType} in ${trimmedLoc} highlighting typical peer anchors and community affinity vectors.`,
    top_cultural_anchors: [
      {
        id: `place-demo-01`,
        name: `${trimmedLoc.split(",")[0]} Artisan ${trimmedType.split(" ")[0]} Co.`,
        category: `Specialty ${trimmedType}`,
        neighborhood: "Historic Downtown District",
        illustrative_affinity_score: 94,
        cultural_tags: ["urn:tag:lifestyle:locally_owned", "urn:tag:culinary:artisan_quality"],
        vibe_keywords: ["Neighborhood Anchor", "Design-Forward", "Locally Sourced"],
        description: `Prominent independent ${trimmedType} establishment favored by neighborhood creatives.`
      },
      {
        id: `place-demo-02`,
        name: `The Urban ${trimmedType.split(" ")[0]} Project`,
        category: `Contemporary ${trimmedType}`,
        neighborhood: "Arts & Innovation Corridor",
        illustrative_affinity_score: 89,
        cultural_tags: ["urn:tag:lifestyle:creative_hub", "urn:tag:lifestyle:sustainable"],
        vibe_keywords: ["Industrial", "Community Gathering", "Modern"],
        description: `Popular daytime gathering spot with high overlap among creative professionals.`
      }
    ],
    defining_concept_tags: [
      { urn: "urn:tag:lifestyle:locally_owned", label: "Locally Sourced & Community Focused", prevalence: "High" },
      { urn: "urn:tag:culinary:artisan_quality", label: "Artisan Craftsmanship", prevalence: "Very High" },
      { urn: "urn:tag:lifestyle:third_place", label: "Neighborhood Third Place Hub", prevalence: "Dominant" }
    ],
    demographic_breakdown: {
      primary_age_bracket: "22–40 years old",
      target_segments: ["Urban Professionals", "Creative Freelancers", "Specialty Category Enthusiasts"],
      lifestyle_interests: ["Independent Brands", "Sustainable Living", "Experiential Dining"]
    }
  };

  return {
    status: "ok",
    summary: `[Demo Mode] Returned illustrative cultural anchors and concepts for ${trimmedType} in ${trimmedLoc}.`,
    results: [adaptedFixture],
    result_count: 1,
    metadata: createDemoMetadata("adapted_location_insights")
  };
}

/**
 * 2. Audience Comparison Demo Service
 *
 * Contrasts two geographic or cultural signal groups, identifying shared
 * cross-domain affinities and market-specific differentiating traits.
 */
export function getMockAudienceComparison(
  locationA: string = "Austin, TX",
  locationB: string = "Nashville, TN",
  targetCategory: string = "brand"
): QlooMcpEnvelope<MockAudienceComparisonData> {
  const locA = (locationA || "").trim();
  const locB = (locationB || "").trim();

  if (!locA || !locB) {
    return {
      status: "needs_input",
      summary: "Two locations or signal groups must be specified for audience comparison.",
      results: [],
      result_count: 0,
      metadata: createDemoMetadata("audience_comparison_needs_input")
    };
  }

  const isAustinNashville =
    (locA.toLowerCase().includes("austin") && locB.toLowerCase().includes("nashville")) ||
    (locA.toLowerCase().includes("nashville") && locB.toLowerCase().includes("austin"));

  if (isAustinNashville) {
    return {
      status: "ok",
      summary: `[Demo Mode] Contrasted cultural affinities between Austin, TX and Nashville, TN across ${targetCategory} and lifestyle dimensions.`,
      results: [MOCK_AUSTIN_VS_NASHVILLE_COMPARISON],
      result_count: 1,
      metadata: createDemoMetadata("austin_vs_nashville")
    };
  }

  // Generalized illustrative comparative fixture
  const adaptedFixture: MockAudienceComparisonData = {
    market_a: {
      name: locA,
      cultural_anchor_signals: [`${locA} Flagship Arts Center`, `${locA} Independent Roasters`],
      dominant_lifestyle_themes: ["Creative Innovation", "Local Craft Dining", "Active Outdoor Living"]
    },
    market_b: {
      name: locB,
      cultural_anchor_signals: [`${locB} Historic Music Hall`, `${locB} Heritage District`],
      dominant_lifestyle_themes: ["Heritage Traditions", "Boutique Hospitality", "Regional Culinary Arts"]
    },
    shared_affinities: [
      {
        category: "Beverage & Dining",
        concept: "Independent Specialty Roasters & Microbreweries",
        illustrative_index: 89,
        description: `Audiences in both ${locA} and ${locB} strongly favor independent neighborhood dining and craft beverages over national chains.`
      },
      {
        category: "Cultural Engagement",
        concept: "Live Music & Local Community Events",
        illustrative_index: 85,
        description: `Both markets index high for local event participation and regional festivals.`
      }
    ],
    differentiating_affinities: {
      market_a_exclusive: [
        {
          trait: "Contemporary Tech Casual & Innovation Hubs",
          affinity_divergence: `+35% compared to ${locB}`,
          context: `${locA} patrons skew towards tech-enabled, fast-casual, and minimalist aesthetic concepts.`
        }
      ],
      market_b_exclusive: [
        {
          trait: "Heritage Craft & Traditional Hospitality",
          affinity_divergence: `+32% compared to ${locA}`,
          context: `${locB} patrons prioritize heritage storytelling, historic spaces, and warm hospitality service.`
        }
      ]
    },
    operational_takeaway: `When expanding concepts between ${locA} and ${locB}, maintain core quality while tailoring brand storytelling to each market's lifestyle tone.`
  };

  return {
    status: "ok",
    summary: `[Demo Mode] Generated comparative affinity analysis between ${locA} and ${locB}.`,
    results: [adaptedFixture],
    result_count: 1,
    metadata: createDemoMetadata("adapted_audience_comparison")
  };
}

/**
 * 3. Local Trends Demo Service
 *
 * Demonstrates time-series momentum and geographic hotspot density
 * for a cultural category within a target location.
 */
export function getMockLocalTrends(
  location: string = "Austin, TX",
  category: string = "Specialty Coffee",
  dateRange?: { startDate?: string; endDate?: string }
): QlooMcpEnvelope<MockLocalTrendsData> {
  const loc = (location || "").trim();
  const cat = (category || "").trim();
  const rangeDesc = dateRange?.startDate && dateRange?.endDate ? ` (${dateRange.startDate} to ${dateRange.endDate})` : "";

  if (!loc || !cat) {
    return {
      status: "needs_input",
      summary: "Location and cultural category must be provided to evaluate local trends.",
      results: [],
      result_count: 0,
      metadata: createDemoMetadata("local_trends_needs_input")
    };
  }

  const isAustinCoffee =
    loc.toLowerCase().includes("austin") &&
    (cat.toLowerCase().includes("coffee") || cat.toLowerCase().includes("café"));

  if (isAustinCoffee) {
    return {
      status: "ok",
      summary: `[Demo Mode] Evaluated 6-quarter cultural momentum and emerging shifts for ${cat} in ${loc}${rangeDesc}.`,
      results: [MOCK_AUSTIN_COFFEE_TRENDS],
      result_count: 1,
      metadata: createDemoMetadata("austin_coffee_trends")
    };
  }

  const adaptedFixture: MockLocalTrendsData = {
    location: loc,
    category: cat,
    historical_timeline: [
      { period: "2025-Q1", illustrative_momentum_index: 65, sample_volume_indicator: "Baseline" },
      { period: "2025-Q2", illustrative_momentum_index: 72, sample_volume_indicator: "Growth" },
      { period: "2025-Q3", illustrative_momentum_index: 78, sample_volume_indicator: "Expansion" },
      { period: "2025-Q4", illustrative_momentum_index: 84, sample_volume_indicator: "Strong adoption" },
      { period: "2026-Q1", illustrative_momentum_index: 90, sample_volume_indicator: "High interest" },
      { period: "2026-Q2", illustrative_momentum_index: 95, sample_volume_indicator: "Peak momentum" }
    ],
    emerging_cultural_shifts: [
      {
        shift_name: `Experiential & Artisanal ${cat} Formats`,
        momentum_growth: "+31% YoY",
        description: `Patrons seeking interactive, highly curated experiences within ${cat}.`,
        pioneering_local_spots: [`Central ${cat} Collective`, `The Roastery Loft`]
      },
      {
        shift_name: "Sustainable & Low-Impact Practices",
        momentum_growth: "+26% YoY",
        description: `Growing demand for verified sustainable sourcing and transparent supply chains.`,
        pioneering_local_spots: [`Eco-${cat} Lab`, `Green Mile Provisions`]
      }
    ],
    neighborhood_heatmaps: [
      {
        neighborhood: "Central Arts District",
        affinity_density: "Peak",
        primary_patron_profile: "Creative professionals and early adopters"
      },
      {
        neighborhood: "Uptown Commercial District",
        affinity_density: "High",
        primary_patron_profile: "Business professionals and weekend visitors"
      }
    ]
  };

  return {
    status: "ok",
    summary: `[Demo Mode] Returned illustrative trend momentum and geographic density for ${cat} in ${loc}${rangeDesc}.`,
    results: [adaptedFixture],
    result_count: 1,
    metadata: createDemoMetadata("adapted_local_trends")
  };
}

/**
 * 4. Business Recommendations & Ranking Demo Service
 *
 * Implements a simulated two-stage pipeline:
 * (1) Candidate Discovery and (2) Contextual Ranking of tactical initiatives
 * against a specific business operational goal.
 */
export function getMockRecommendations(
  businessProfile:
    | string
    | { name?: string; location?: string; category?: string; description?: string } = "Solstice Craft Coffee Lab",
  goal:
    | string
    | { objective?: string; timeframe?: string; targetSegment?: string } = "Increase weekday midday footfall"
): QlooMcpEnvelope<MockRecommendationsData> {
  const profileName =
    typeof businessProfile === "string" ? businessProfile : businessProfile.name || "Independent Specialty Café";
  const goalObjective = typeof goal === "string" ? goal : goal.objective || "Increase off-peak revenue and dwell time";

  if (!profileName.trim() || !goalObjective.trim()) {
    return {
      status: "needs_input",
      summary: "Business profile and strategic operational goal are both required for ranking recommendations.",
      results: [],
      result_count: 0,
      metadata: createDemoMetadata("recommendations_needs_input")
    };
  }

  const isCafeWeekday =
    profileName.toLowerCase().includes("café") ||
    profileName.toLowerCase().includes("coffee") ||
    goalObjective.toLowerCase().includes("footfall") ||
    goalObjective.toLowerCase().includes("weekday");

  if (isCafeWeekday) {
    return {
      status: "ok",
      summary: `[Demo Mode] Discovered and ranked 5 operational initiatives for '${profileName}' targeting '${goalObjective}'.`,
      results: [MOCK_CAFE_WEEKDAY_FOOTFALL_RECOMMENDATIONS],
      result_count: 1,
      metadata: createDemoMetadata("cafe_weekday_footfall")
    };
  }

  // Generalized illustrative ranking fixture
  const adaptedFixture: MockRecommendationsData = {
    business_name: profileName,
    business_context: `Local enterprise seeking targeted customer acquisition and engagement in its primary market.`,
    strategic_goal: goalObjective,
    ranked_opportunities: [
      {
        id: "rec-gen-01",
        rank: 1,
        title: "Targeted Neighborhood Community Partnership & Cross-Promotion",
        type: "Partnership",
        illustrative_fit_score: 93,
        target_segment: "Active neighborhood patrons & local professionals",
        operational_effort: "Low",
        strategic_rationale:
          "Leverages existing patron loyalty of adjacent complementary businesses to drive shared foot traffic without expensive ad spend.",
        implementation_milestones: [
          "Identify 2 non-competing local makers or wellness studios within a 10-minute walk",
          "Create a shared digital pass or joint loyalty perk",
          "Track referral conversions over a 4-week trial"
        ]
      },
      {
        id: "rec-gen-02",
        rank: 2,
        title: "Off-Peak Experiential Programming & Mini-Workshops",
        type: "Programming",
        illustrative_fit_score: 88,
        target_segment: "Enthusiasts seeking skill-building or social experiences",
        operational_effort: "Medium",
        strategic_rationale:
          "Converts underutilized daytime or early-evening floor space into dedicated revenue sessions.",
        implementation_milestones: [
          "Host bi-weekly educational or appreciation sessions led by lead staff",
          "Cap attendance at 15 participants for premium feel",
          "Offer bundle pricing including take-home merchandise"
        ]
      },
      {
        id: "rec-gen-03",
        rank: 3,
        title: "Curated Limited-Edition Product Collaborations",
        type: "Product",
        illustrative_fit_score: 81,
        target_segment: "Brand advocates and collector patrons",
        operational_effort: "Medium",
        strategic_rationale: "Creates artificial scarcity and bursts of visit urgency.",
        implementation_milestones: [
          "Partner with local artist for co-branded seasonal packaging",
          "Promote limited-drop date via email and social channels",
          "Reserve first batch for top loyal customers"
        ]
      }
    ],
    projected_impact_summary:
      "Implementing the top 2 ranked initiatives is projected to increase off-peak dwell time by 20–30% and improve average ticket size by 15–20% based on illustrative peer benchmark models."
  };

  return {
    status: "ok",
    summary: `[Demo Mode] Ranked 3 strategic opportunities for '${profileName}' aligning with '${goalObjective}'.`,
    results: [adaptedFixture],
    result_count: 1,
    metadata: createDemoMetadata("adapted_recommendations")
  };
}

/**
 * 5. Coordinated Weekly Cultural Operations Plan Demo Service
 *
 * Simulates the full multi-stage agent orchestration flow, combining
 * peer anchors, cross-market audience divergence, local trends, and tactical ranking.
 */
export function getMockWeeklyCulturalPlan(
  businessProfile: {
    name?: string;
    category?: string;
    city?: string;
    neighborhood?: string;
    vibeKeywords?: string[];
    seedSignals?: string[];
  } = {},
  operationalGoal: {
    objective?: string;
    targetDemographic?: string;
    benchmarkCity?: string;
    targetWeek?: string;
  } = {}
): QlooMcpEnvelope<WeeklyCulturalPlanData> {
  const profileName = (businessProfile.name || "Solstice Craft Coffee Lab").trim();
  const profileCity = (businessProfile.city || "Austin, TX").trim();
  const profileCat = (businessProfile.category || "Specialty Coffee & Modern Café").trim();
  const objective = (operationalGoal.objective || "Increase weekday midday footfall & check size").trim();
  const targetWeek = operationalGoal.targetWeek || "Upcoming Week (W45)";
  const benchmarkCity = operationalGoal.benchmarkCity?.trim() || undefined;

  if (!profileName || !profileCity) {
    return {
      status: "needs_input",
      summary: "Business name and city are required to synthesize a weekly cultural operations plan.",
      results: [],
      result_count: 0,
      metadata: createDemoMetadata("agent_weekly_plan_needs_input")
    };
  }

  const isAustinCoffee =
    profileCity.toLowerCase().includes("austin") ||
    profileName.toLowerCase().includes("solstice") ||
    profileName.toLowerCase().includes("coffee") ||
    profileCat.toLowerCase().includes("coffee");

  if (isAustinCoffee) {
    // If user provided a custom benchmarkCity (or omitted), adjust divergence section accordingly
    const plan = { ...MOCK_WEEKLY_CULTURAL_OPERATIONS_PLAN_CAFE };
    plan.businessName = profileName;
    plan.targetWeek = targetWeek;

    if (!benchmarkCity) {
      plan.audienceDivergence = undefined;
    } else if (benchmarkCity.toLowerCase() !== "nashville, tn" && benchmarkCity.toLowerCase() !== "nashville") {
      plan.audienceDivergence = {
        benchmarkMarket: benchmarkCity,
        sharedAffinities: ["Specialty Craft Quality", "Third-Place Dwell Dynamics"],
        distinguishingLocalTraits: ["Hyper-Local Roaster Flights", "Analog Vinyl Soundscapes"],
        divergenceTakeaway: `Austin patrons index higher in independent design and analog acoustics compared to the ${benchmarkCity} baseline.`,
        status: "complete"
      };
    }

    return {
      status: "ok",
      summary: `[Demo Mode] Coordinated weekly cultural operations plan synthesized for '${profileName}' in '${profileCity}'.`,
      results: [plan],
      result_count: 1,
      metadata: createDemoMetadata("cafe_weekly_cultural_plan")
    };
  }

  // Generalized adapted weekly plan fixture (e.g. South Delhi Bistro or Gurgaon Wellness)
  const neighborhoodStr = businessProfile.neighborhood ? `${businessProfile.neighborhood}, ` : "";
  const fullLocality = `${neighborhoodStr}${profileCity}`;

  const adaptedPlan: WeeklyCulturalPlanData = {
    businessName: profileName,
    locality: fullLocality,
    targetWeek,
    executiveStrategy: `Synthesizes local cultural anchors in ${profileCity}, high-affinity lifestyle concepts, and emerging patron trends to achieve: "${objective}".`,
    culturalAnchorSummary: `Grounded in local peer anchors across ${profileCity}, emphasizing verified craftsmanship and community-driven engagement.`,
    targetPatronSegment:
      operationalGoal.targetDemographic || "Urban professionals, creative freelancers, and specialty category patrons aged 22–40.",
    specialsAndMenu: [
      {
        dayOfWeek: "Tuesday & Thursday (Off-Peak Hours)",
        title: `Curated ${profileCat} Tasting Special`,
        themeCategory: "Culinary Special",
        description: `Signature tasting format highlighting artisanal ingredients paired with house beverages.`,
        operationalNotes: "Prepped during morning lull; rapid 2-minute assembly for high-velocity service.",
        origin: "agent_derived",
        provenance: {
          sourceTool: "qloo_trends",
          groundingEntityOrTag: `Experiential & Artisanal Formats in ${profileCity}`,
          empiricalMeasurement: "Growth trend in local peer benchmark",
          interpretationNote: "Derives from local trend momentum toward interactive artisanal experiences.",
          origin: "agent_derived"
        }
      },
      {
        dayOfWeek: "Friday Midday (12:00 PM – 2:30 PM)",
        title: "Limited-Batch Artisan Collaboration Drop",
        themeCategory: "Product",
        description: "Seasonal limited-quantity offering co-developed with an adjacent local maker.",
        operationalNotes: "Consignment delivery from partner maker; zero cooking or prep equipment required.",
        origin: "agent_derived",
        provenance: {
          sourceTool: "qloo_rank",
          groundingEntityOrTag: "Rank #1 Opportunity: Neighborhood Community Cross-Promotion",
          empiricalMeasurement: "Fit Score: 93/100",
          interpretationNote: "Leverages adjacent customer affinity to cross-pollinate midday foot traffic.",
          origin: "agent_derived"
        }
      }
    ],
    eventsAndPartnerships: [
      {
        dayOfWeek: "Wednesday Afternoon (2:00 PM – 4:30 PM)",
        title: "Off-Peak Experiential Skill Session & Dwell Lounge",
        partnerType: "Local Creative or Wellness Studio",
        targetAudience: "Skill-seekers, remote professionals & creative enthusiasts",
        executionSteps: [
          "Host bi-weekly educational or appreciation session capped at 15 attendees.",
          "Offer bundle pricing including signature beverage and take-home merchandise.",
          "Preserve separate area for standard walk-in patrons."
        ],
        origin: "agent_derived",
        provenance: {
          sourceTool: "qloo_rank",
          groundingEntityOrTag: "Rank #2 Opportunity: Off-Peak Experiential Programming",
          empiricalMeasurement: "Fit Score: 88/100",
          interpretationNote: "Converts underutilized daytime floor capacity into dedicated revenue blocks.",
          origin: "agent_derived"
        }
      }
    ],
    atmosphereAndPlaylist: {
      musicalGenre: "Warm acoustic downtempo, ambient modern jazz, and melodic instrumental",
      soundscapeVibe: "Low-decibel textural acoustics allowing conversation and focused work",
      lightingAndDwellPacing: "Bright open daylight during daytime, transitioning to warm 2700K low lighting after 4:00 PM",
      curatedArtistSignals: ["Leon Bridges", "Yussef Dayes", "Arlo Parks", "Tom Misch"],
      origin: "agent_derived",
      provenance: {
        sourceTool: "qloo_entity_tags",
        groundingEntityOrTag: "urn:tag:lifestyle:third_place & artisanal quality concepts",
        empiricalMeasurement: "Dominant prevalence in category",
        interpretationNote: "Calibrated to patron profile seeking calm third-place aesthetic.",
        origin: "agent_derived"
      }
    },
    socialContentCalendar: [
      {
        dayOfWeek: "Monday 11:00 AM",
        hook: `Start the week with purpose: explore our curated ${profileCat} offerings in ${profileCity}.`,
        contentAngle: "Behind-the-scenes preparation and craftsmanship overview.",
        recommendedFormat: "Reel / Short Video",
        origin: "agent_derived",
        provenance: {
          sourceTool: "qloo_rank",
          groundingEntityOrTag: "Top Strategic Initiative",
          empiricalMeasurement: "Fit Score: 93/100",
          interpretationNote: "Early-week brand framing driving discovery.",
          origin: "agent_derived"
        }
      },
      {
        dayOfWeek: "Thursday 1:30 PM",
        hook: "Midday pause: seasonal drops and quiet corner tables open all afternoon.",
        contentAngle: "Atmosphere dwell shot featuring cozy seating and tasting pairing.",
        recommendedFormat: "Story / Carousel",
        origin: "agent_derived",
        provenance: {
          sourceTool: "qloo_trends",
          groundingEntityOrTag: "Local Afternoon Engagement Trend",
          empiricalMeasurement: "Expansion Phase",
          interpretationNote: "Captures afternoon off-peak footfall.",
          origin: "agent_derived"
        }
      }
    ],
    dailySchedule: [
      {
        day: "Monday",
        shiftFocus: "Weekly Strategy Alignment & Ingredient Prep",
        keyMilestones: ["Align team on weekly tasting feature", "Prepare social content story"],
        targetOutcome: "Smooth launch of weekly operational rhythm",
        origin: "agent_derived"
      },
      {
        day: "Tuesday",
        shiftFocus: "Off-Peak Tasting Special Activation",
        keyMilestones: ["Launch signature tasting format", "Collect early patron feedback"],
        targetOutcome: "Increase afternoon check size",
        origin: "agent_derived"
      },
      {
        day: "Wednesday",
        shiftFocus: "Experiential Mini-Session & Midday Dwell",
        keyMilestones: ["Host afternoon workshop / demo session", "Engage local community partners"],
        targetOutcome: "Convert floor space to structured revenue",
        origin: "agent_derived"
      },
      {
        day: "Thursday",
        shiftFocus: "Acoustic Atmosphere & Evening Transition",
        keyMilestones: ["Switch lighting and soundscape to warm ambient profile", "Highlight weekend drop preview"],
        targetOutcome: "Extend dwell time past 4:00 PM",
        origin: "agent_derived"
      },
      {
        day: "Friday",
        shiftFocus: "Limited Artisan Collaboration Drop",
        keyMilestones: ["Receive partner maker delivery", "Promote lunch combo to nearby offices/studios"],
        targetOutcome: "Peak Friday revenue velocity",
        origin: "agent_derived"
      },
      {
        day: "Saturday",
        shiftFocus: "High-Volume Community Social Hub",
        keyMilestones: ["Full team deployment", "Seamless service and queue pacing"],
        targetOutcome: "Maximize weekend patron satisfaction",
        origin: "agent_derived"
      },
      {
        day: "Sunday",
        shiftFocus: "Slow Social Sunday & Weekly Reconciliation",
        keyMilestones: ["Relaxed service pace", "Review weekly metrics against objective"],
        targetOutcome: "Evaluate week's revenue impact and restock",
        origin: "agent_derived"
      }
    ],
    expectedImpact: {
      projectedOutcomeSummary: `Implementing this operations plan is estimated to increase off-peak dwell time by 20–30% and raise average ticket size by 15–20% based on illustrative peer benchmark models. Note: These figures are illustrative model projections rather than guaranteed commercial returns.`,
      supportingDataPoints: [
        {
          metricName: "Top Initiative Fit Score",
          value: "93/100",
          source: "qloo_rank benchmark fixture"
        },
        {
          metricName: "Category Momentum",
          value: "Expansion",
          source: "qloo_trends benchmark fixture"
        }
      ],
      dataSupported: false
    },
    audienceDivergence: benchmarkCity
      ? {
          benchmarkMarket: benchmarkCity,
          sharedAffinities: ["Craft Orientation", "Community Third Place"],
          distinguishingLocalTraits: [`${profileCity} Specific Lifestyle Density`],
          divergenceTakeaway: `${profileCity} demonstrates distinct hyper-local affinity patterns compared to ${benchmarkCity}.`,
          status: "complete"
        }
      : undefined,
    orchestrationTrace: {
      toolsExecuted: ["qloo_recommend", "qloo_entity_tags", "qloo_trends", "qloo_rank"],
      stagesCompleted: benchmarkCity ? 4 : 3,
      timestamp: new Date().toISOString(),
      isDemo: true
    }
  };

  return {
    status: "ok",
    summary: `[Demo Mode] Coordinated weekly cultural operations plan synthesized for '${profileName}' in '${profileCity}'.`,
    results: [adaptedPlan],
    result_count: 1,
    metadata: createDemoMetadata("adapted_weekly_cultural_plan")
  };
}
