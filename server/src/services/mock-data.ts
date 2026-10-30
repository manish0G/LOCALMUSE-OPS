import type { WeeklyCulturalPlanData } from "./qloo-types.js";

/**
 * LocalMuse Ops - Curated Demo Datasets & Mock Fixtures
 *
 * NOTE ON DATA PROVENANCE & HONESTY:
 * All records, affinities, and trend indices contained in this file are
 * curated illustrative mock fixtures designed exclusively for demonstration,
 * testing, and UI evaluation when Qloo credentials are unavailable.
 * They do NOT represent live Qloo API queries or verified empirical measurements.
 */

export interface MockLocationEntity {
  id: string;
  name: string;
  category: string;
  neighborhood: string;
  illustrative_affinity_score: number;
  cultural_tags: string[];
  vibe_keywords: string[];
  description: string;
}

export interface MockLocationInsightsData {
  target_location: string;
  business_type: string;
  cultural_overview: string;
  top_cultural_anchors: MockLocationEntity[];
  defining_concept_tags: Array<{ urn: string; label: string; prevalence: string }>;
  demographic_breakdown: {
    primary_age_bracket: string;
    target_segments: string[];
    lifestyle_interests: string[];
  };
}

export interface MockAudienceComparisonData {
  market_a: {
    name: string;
    cultural_anchor_signals: string[];
    dominant_lifestyle_themes: string[];
  };
  market_b: {
    name: string;
    cultural_anchor_signals: string[];
    dominant_lifestyle_themes: string[];
  };
  shared_affinities: Array<{
    category: string;
    concept: string;
    illustrative_index: number;
    description: string;
  }>;
  differentiating_affinities: {
    market_a_exclusive: Array<{ trait: string; affinity_divergence: string; context: string }>;
    market_b_exclusive: Array<{ trait: string; affinity_divergence: string; context: string }>;
  };
  operational_takeaway: string;
}

export interface MockTrendDataPoint {
  period: string; // e.g. "2026-Q1" or "Jan 2026"
  illustrative_momentum_index: number; // 0-100 scale
  sample_volume_indicator: string;
}

export interface MockLocalTrendsData {
  location: string;
  category: string;
  historical_timeline: MockTrendDataPoint[];
  emerging_cultural_shifts: Array<{
    shift_name: string;
    momentum_growth: string;
    description: string;
    pioneering_local_spots: string[];
  }>;
  neighborhood_heatmaps: Array<{
    neighborhood: string;
    affinity_density: "Peak" | "High" | "Growing";
    primary_patron_profile: string;
  }>;
}

export interface MockRecommendationItem {
  id: string;
  rank: number;
  title: string;
  type: "Programming" | "Partnership" | "Product" | "Atmosphere";
  illustrative_fit_score: number; // 0-100
  target_segment: string;
  operational_effort: "Low" | "Medium" | "High";
  strategic_rationale: string;
  implementation_milestones: string[];
}

export interface MockRecommendationsData {
  business_name: string;
  business_context: string;
  strategic_goal: string;
  ranked_opportunities: MockRecommendationItem[];
  projected_impact_summary: string;
}

// ---------------------------------------------------------------------------
// 1. SCENARIO 1: Location Insights - Specialty Coffee in Austin, Texas
// ---------------------------------------------------------------------------
export const MOCK_AUSTIN_COFFEE_INSIGHTS: MockLocationInsightsData = {
  target_location: "Austin, Texas",
  business_type: "Specialty Coffee & Roastery",
  cultural_overview:
    "Austin's specialty coffee landscape is driven by third-wave roasters, pet-friendly outdoor patios, and creative hybrid workspaces blending artisanal single-origin espresso with remote tech and creative lifestyles.",
  top_cultural_anchors: [
    {
      id: "place-atx-001",
      name: "Flat Track Coffee",
      category: "Specialty Café & Moto-Roastery",
      neighborhood: "East Austin (Cesar Chavez)",
      illustrative_affinity_score: 96,
      cultural_tags: [
        "urn:tag:culinary:specialty_roaster",
        "urn:tag:lifestyle:moto_culture",
        "urn:tag:atmosphere:industrial_patio"
      ],
      vibe_keywords: ["Eastside Creative", "Bold Single-Origin", "Artisan Roaster"],
      description: "Pioneering East Austin coffeehouse and custom motorcycle garage with high creative worker affinity."
    },
    {
      id: "place-atx-002",
      name: "Houndstooth Coffee",
      category: "Third-Wave Coffee Bar",
      neighborhood: "Downtown & North Lamar",
      illustrative_affinity_score: 93,
      cultural_tags: [
        "urn:tag:culinary:third_wave",
        "urn:tag:lifestyle:design_forward",
        "urn:tag:lifestyle:business_casual"
      ],
      vibe_keywords: ["Precision Brews", "Minimalist Architecture", "Downtown Focus"],
      description: "Architecturally refined espresso bars serving meticulous pour-overs with high young professional overlap."
    },
    {
      id: "place-atx-003",
      name: "Fleet Coffee",
      category: "Craft Micro-Café",
      neighborhood: "East Austin (Webberville)",
      illustrative_affinity_score: 89,
      cultural_tags: [
        "urn:tag:culinary:experimental_tonics",
        "urn:tag:lifestyle:indie_music",
        "urn:tag:atmosphere:walkup_window"
      ],
      vibe_keywords: ["Experimental Espresso", "Compact Bar", "Neighborhood Staple"],
      description: "Intimate converted gas-station space famed for seasonal espresso cocktails and indie community appeal."
    },
    {
      id: "place-atx-004",
      name: "Radio Coffee & Beer",
      category: "Café, Beer Garden & Food Truck Park",
      neighborhood: "South Lamar (78704)",
      illustrative_affinity_score: 95,
      cultural_tags: [
        "urn:tag:lifestyle:community_gathering",
        "urn:tag:music:bluegrass_acoustic",
        "urn:tag:atmosphere:shaded_grove"
      ],
      vibe_keywords: ["All-Day Hub", "Live Music", "Food Truck Synergy"],
      description: "Quintessential South Austin community compound hosting morning espresso, Veracruz All Natural tacos, and evening bluegrass."
    },
    {
      id: "place-atx-005",
      name: "Figure 8 Coffee Purveyors",
      category: "Neighborhood Third-Wave Café",
      neighborhood: "East Austin (Chicon)",
      illustrative_affinity_score: 88,
      cultural_tags: [
        "urn:tag:lifestyle:vinyl_records",
        "urn:tag:culinary:artisan_pastry",
        "urn:tag:atmosphere:analog_cozy"
      ],
      vibe_keywords: ["Vinyl Aesthetic", "Unpretentious Baristas", "Natural Light"],
      description: "Low-key neighborhood staple featuring rotating guest roasters, vintage turntables, and local artwork."
    }
  ],
  defining_concept_tags: [
    { urn: "urn:tag:culinary:single_origin", label: "Single-Origin Pour Over", prevalence: "Very High" },
    { urn: "urn:tag:atmosphere:dog_friendly_patio", label: "Canine-Friendly Outdoor Seating", prevalence: "Dominant" },
    { urn: "urn:tag:lifestyle:remote_creative_hub", label: "Freelancer & Remote Work Haven", prevalence: "High" },
    { urn: "urn:tag:music:indie_electronic", label: "Indie Rock & Ambient Electronics", prevalence: "Elevated" },
    { urn: "urn:tag:culinary:plant_based_milks", label: "Housemade Oat & Nut Milks", prevalence: "Standard" }
  ],
  demographic_breakdown: {
    primary_age_bracket: "24–38 years old",
    target_segments: [
      "Remote Tech & Startup Professionals",
      "Creative Agency Freelancers & Designers",
      "Local Culinary & Specialty Beverage Enthusiasts"
    ],
    lifestyle_interests: [
      "Independent Roasters & Bean Subscriptions",
      "Boutique Activewear & Outdoor Recreation",
      "Sustainable Architecture & Mid-Century Modern Design"
    ]
  }
};

// ---------------------------------------------------------------------------
// 2. SCENARIO 2: Audience Comparison - Austin vs Nashville
// ---------------------------------------------------------------------------
export const MOCK_AUSTIN_VS_NASHVILLE_COMPARISON: MockAudienceComparisonData = {
  market_a: {
    name: "Austin, TX (Creative Tech & Hill Country Hub)",
    cultural_anchor_signals: ["ACL Music Fest", "South Congress Artisan Shops", "Barton Springs", "Eastside Roasters"],
    dominant_lifestyle_themes: ["Casual Tech", "Active Wellness", "Outdoor Escapism", "Third-Wave Coffee"]
  },
  market_b: {
    name: "Nashville, TN (Music City & Heritage Craft Hub)",
    cultural_anchor_signals: ["The Ryman Auditorium", "East Nashville Vintage", "12 South Boutiques", "Germantown Dining"],
    dominant_lifestyle_themes: ["Singer-Songwriter Culture", "Heritage Denim", "Hospitality Craft", "Bourbon & Espresso"]
  },
  shared_affinities: [
    {
      category: "Independent Music & Nightlife",
      concept: "Live Venue Patronage & Vinyl Record Collecting",
      illustrative_index: 94,
      description: "Both Austin and Nashville audiences index dramatically above national averages for live performance attendance and vinyl curation."
    },
    {
      category: "Craft Beverage Dedication",
      concept: "Third-Wave Roasteries & Artisanal Microbreweries",
      illustrative_index: 91,
      description: "Heavy daytime reliance on independent local coffeehouses transitioning into neighborhood micro-bars in the late afternoon."
    },
    {
      category: "Culinary Identity",
      concept: "Artisan Smokehouse / BBQ & Elevated Comfort Food",
      illustrative_index: 88,
      description: "Deep loyalty to regional specialty culinary traditions executed with artisanal culinary techniques."
    },
    {
      category: "Retail Lifestyle",
      concept: "Locally-Owned Boutique Brands over Mass Retail",
      illustrative_index: 86,
      description: "Strong civic preference for hyper-local makers, independent print shops, and homegrown apparel creators."
    }
  ],
  differentiating_affinities: {
    market_a_exclusive: [
      {
        trait: "Indie Electronic, Psych-Rock & Synthpop",
        affinity_divergence: "+38% relative to Nashville",
        context: "Austin listeners exhibit much higher overlap with modern electronic, indie psych-rock, and ambient work playlists."
      },
      {
        trait: "Casual Tech Apparel & Sustainable Activewear",
        affinity_divergence: "+42% relative to Nashville",
        context: "Higher brand index for technical apparel, commuter cycling gear, and casual footwear (e.g., On Running, Vuori)."
      },
      {
        trait: "Breakfast Taco Ritual & Tex-Mex Coffee Pairings",
        affinity_divergence: "+54% relative to Nashville",
        context: "Daily morning coffee runs in Austin are structurally linked with breakfast taco food trucks."
      }
    ],
    market_b_exclusive: [
      {
        trait: "Americana, Neo-Traditional Country & Roots Rock",
        affinity_divergence: "+51% relative to Austin",
        context: "Nashville crowds maintain an unparalleled cultural resonance with singer-songwriter listening rooms and roots music."
      },
      {
        trait: "Heritage Leather, Vintage Denim & Tailored Craft",
        affinity_divergence: "+39% relative to Austin",
        context: "Strong affinity for bespoke American heritage labels, dry denim, and leather boot craft (e.g., Imogene + Willie)."
      },
      {
        trait: "Boutique Hospitality & Speakeasy Cocktail Culture",
        affinity_divergence: "+33% relative to Austin",
        context: "Higher preference for historic brick architecture, hotel lobby lounges, and craft cocktail parlors."
      }
    ]
  },
  operational_takeaway:
    "Brands expanding from Austin to Nashville or vice-versa can rely on a shared appreciation for craft beverages and live music. However, brand tone should shift from Austin's laid-back, sun-drenched tech minimalism to Nashville's richer, heritage-crafted storytelling and hospitality warmth."
};

// ---------------------------------------------------------------------------
// 3. SCENARIO 3: Local Trends - Specialty Coffee & Café Culture
// ---------------------------------------------------------------------------
export const MOCK_AUSTIN_COFFEE_TRENDS: MockLocalTrendsData = {
  location: "Austin, Texas",
  category: "Specialty Coffee & Modern Café Culture",
  historical_timeline: [
    { period: "2025-Q1", illustrative_momentum_index: 68, sample_volume_indicator: "Stable baseline" },
    { period: "2025-Q2", illustrative_momentum_index: 74, sample_volume_indicator: "Summer iced format jump" },
    { period: "2025-Q3", illustrative_momentum_index: 81, sample_volume_indicator: "Back-to-work campus surge" },
    { period: "2025-Q4", illustrative_momentum_index: 85, sample_volume_indicator: "Holiday single-origin sales" },
    { period: "2026-Q1", illustrative_momentum_index: 92, sample_volume_indicator: "Functional tonics spike" },
    { period: "2026-Q2", illustrative_momentum_index: 96, sample_volume_indicator: "Peak cold-brew season" }
  ],
  emerging_cultural_shifts: [
    {
      shift_name: "Botanical Tonics & Adaptogenic Cold Brews",
      momentum_growth: "+38% YoY",
      description:
        "Infusions of sparkling cascara, citrus blossom water, and reishi/ashwagandha cold brews as afternoon pick-me-ups replacing standard espresso.",
      pioneering_local_spots: ["Fleet Coffee", "Civil Goat Coffee", "Desnudo Coffee"]
    },
    {
      shift_name: "Day-to-Night Hybrid Venues (Espresso to Natural Wine)",
      momentum_growth: "+45% YoY",
      description:
        "Cafés seamlessly converting into low-intervention natural wine and tinned-fish listening bars after 4:00 PM to capture after-work socializing.",
      pioneering_local_spots: ["Radio East", "Better Half Craft", "Vintage Bookstore & Wine Bar"]
    },
    {
      shift_name: "Micro-Batch Neighborhood Roaster Pop-ups",
      momentum_growth: "+29% YoY",
      description:
        "Single-origin roasters collaborating with local bakeries and ceramics studios for weekend morning drops featuring limited-run varietals.",
      pioneering_local_spots: ["Flat Track Roasters", "Figure 8 Coffee Purveyors", "Talent Coffee"]
    }
  ],
  neighborhood_heatmaps: [
    {
      neighborhood: "East Austin (78702)",
      affinity_density: "Peak",
      primary_patron_profile: "Designers, tech remote workers, creative startup founders"
    },
    {
      neighborhood: "South Congress & Bouldin (78704)",
      affinity_density: "High",
      primary_patron_profile: "Creative professionals, weekend travelers, wellness enthusiasts"
    },
    {
      neighborhood: "Mueller & Cherrywood (78722 / 78723)",
      affinity_density: "Growing",
      primary_patron_profile: "Young families, academic researchers, sustainability advocates"
    }
  ]
};

// ---------------------------------------------------------------------------
// 4. SCENARIO 4: Business Recommendations - Weekday Footfall for an Independent Café
// ---------------------------------------------------------------------------
export const MOCK_CAFE_WEEKDAY_FOOTFALL_RECOMMENDATIONS: MockRecommendationsData = {
  business_name: "Solstice Craft Coffee Lab",
  business_context: "Independent 35-seat specialty café located in an active mixed-use neighborhood",
  strategic_goal: "Activate weekday footfall between 11:00 AM and 4:00 PM while upholding craft coffee credibility",
  ranked_opportunities: [
    {
      id: "rec-wf-001",
      rank: 1,
      title: "Midday 'Focus & Flow' Co-Working Pass with Dedicated Ergonomic Seating",
      type: "Programming",
      illustrative_fit_score: 95,
      target_segment: "Remote knowledge workers & independent consultants",
      operational_effort: "Low",
      strategic_rationale:
        "Addresses the 11 AM - 2 PM weekday plateau by packaging high-speed verified WiFi, unlimited batch brew refills, and a guaranteed power-station booth during off-peak hours.",
      implementation_milestones: [
        "Designate 8-10 perimeter tables as reserved co-working zones from 10:30 AM to 3:30 PM",
        "Introduce a $14 'Focus Pass' including 1 pour-over/batch brew, 1 pastry, and 3 hours of reserved table time",
        "Implement polite laptop-friendly signage that preserves communal lounge space for casual walk-ins"
      ]
    },
    {
      id: "rec-wf-002",
      rank: 2,
      title: "Artisanal Sourdough & Specialty Tostada Afternoon Lunch Drop",
      type: "Partnership",
      illustrative_fit_score: 91,
      target_segment: "Local neighborhood residents & midday office workers",
      operational_effort: "Medium",
      strategic_rationale:
        "Solves the lack of savoury midday food options that currently drives patrons away to nearby fast-casual restaurants at lunch.",
      implementation_milestones: [
        "Partner with a nearby micro-bakery for a 11:30 AM daily drop of 2 savoury foccacias and grain bowls",
        "Requires zero kitchen build-out or cooking equipment—served with house specialty iced teas",
        "Promote lunch combos on Instagram Stories and neighborhood Slack channels at 10:45 AM"
      ]
    },
    {
      id: "rec-wf-003",
      rank: 3,
      title: "Cascara Tonic & Afternoon Botanical Spritz Hour (2 PM - 4 PM)",
      type: "Product",
      illustrative_fit_score: 87,
      target_segment: "Afternoon health-conscious creatives & post-lunch caffeine shifters",
      operational_effort: "Low",
      strategic_rationale:
        "Offers refreshing, lower-caffeine botanical coffee-leaf tonics during the 2–4 PM afternoon slump when patrons avoid heavy espresso.",
      implementation_milestones: [
        "Curate a 3-drink signature spritz menu: Cascara Blood Orange, Nitro Lavender Matcha, and Sparkling Cold Brew Yuzu",
        "Offer a $1 discount between 2:00 PM and 4:00 PM branded as 'The Botanical Siesta'",
        "Provide aesthetic glassware for table service to encourage social sharing"
      ]
    },
    {
      id: "rec-wf-004",
      rank: 4,
      title: "Bi-Weekly Acoustic Lo-Fi & Ambient Vinyl Listening Sessions",
      type: "Atmosphere",
      illustrative_fit_score: 82,
      target_segment: "Creative freelancers, audio enthusiasts & students",
      operational_effort: "Medium",
      strategic_rationale:
        "Replaces generic background playlists with curated, low-decibel analog music sessions that attract focused workers seeking creative stimulation.",
      implementation_milestones: [
        "Install a visible vintage turntable setup behind the espresso bar",
        "Invite local vinyl collectors or baristas to spin low-tempo ambient/jazz records on Tuesday and Thursday afternoons",
        "Partner with a local independent record shop for a rotating 'Record of the Week' display"
      ]
    },
    {
      id: "rec-wf-005",
      rank: 5,
      title: "Hyper-Local 'Neighborhood Roaster Tasting Flights' on Wednesday Afternoons",
      type: "Programming",
      illustrative_fit_score: 79,
      target_segment: "Coffee connoisseurs and home-brewing enthusiasts",
      operational_effort: "Low",
      strategic_rationale:
        "Transforms Wednesday afternoon lulls into mini sensory experiences for coffee enthusiasts without slowing down standard bar flow.",
      implementation_milestones: [
        "Offer a 3-cup comparative flight comparing roast profiles from 3 regional roasters",
        "Include a printed tasting notes card with origin stories and flavor wheels",
        "Pair with retail whole-bean bag discounts for attendees"
      ]
    }
  ],
  projected_impact_summary:
    "Implementing the top 2 ranked initiatives (Co-Working Pass + Midday Savoury Drop) provides an estimated 25–35% increase in weekday midday dwell time and raises average patron check size from $6.20 to $11.50 without disrupting peak morning coffee operations."
};

// ---------------------------------------------------------------------------
// 5. SCENARIO 5: Coordinated Weekly Cultural Operations Plan (Agent Synthesis)
// ---------------------------------------------------------------------------
export const MOCK_WEEKLY_CULTURAL_OPERATIONS_PLAN_CAFE: WeeklyCulturalPlanData = {
  businessName: "Solstice Craft Coffee Lab",
  locality: "East Austin (78702), Austin, TX",
  targetWeek: "Upcoming Week (W45)",
  executiveStrategy:
    "Synthesizes Austin East Side third-place culture, strong weekday creative worker affinity, and high-growth botanical beverage trends to expand dwell time and midday revenues without compromising specialty coffee credibility.",
  culturalAnchorSummary:
    "Grounded in peer anchor signals from Flat Track Coffee and Figure 8 Coffee Purveyors, highlighting artisan quality, community orientation, and analog music culture.",
  targetPatronSegment:
    "Remote knowledge workers, creative freelancers, and neighborhood design professionals aged 24–38.",
  specialsAndMenu: [
    {
      dayOfWeek: "Tuesday & Thursday (2:00 PM – 4:00 PM)",
      title: "Cascara Blood Orange Nitro Spritz",
      themeCategory: "Botanical Beverage",
      description:
        "Refreshing low-caffeine sparkling beverage brewed from upcycled coffee-cherry cascara and cold-pressed citrus oil.",
      operationalNotes:
        "Pre-batched in chilled kegs for instantaneous tap pour; zero barista workflow slowdown during midday shifts.",
      origin: "agent_derived",
      provenance: {
        sourceTool: "qloo_trends",
        groundingEntityOrTag: "Experiential & Low-Impact Coffee Formats (+31% YoY Momentum)",
        empiricalMeasurement: "+31% YoY momentum growth in Austin",
        interpretationNote:
          "Derived from local trend momentum toward refreshing afternoon coffee-leaf alternatives during off-peak hours.",
        origin: "agent_derived"
      }
    },
    {
      dayOfWeek: "Daily Midday (11:30 AM – 2:00 PM)",
      title: "Artisanal Sourdough & Whipped Ricotta Toast Drop",
      themeCategory: "Culinary Special",
      description:
        "Locally baked seeded sourdough topped with lemon-whipped ricotta, olive oil, and house-infused chili crunch.",
      operationalNotes:
        "Sourced fresh daily from nearby micro-bakery partner; simple assembly requiring zero kitchen buildout or cooktop equipment.",
      origin: "agent_derived",
      provenance: {
        sourceTool: "qloo_rank",
        groundingEntityOrTag: "Rank #2 Opportunity (Score 91): Artisanal Sourdough Lunch Drop",
        empiricalMeasurement: "Illustrative Fit Score: 91/100",
        interpretationNote:
          "Solves the lack of savoury midday food options that previously caused patron churn to fast-casual restaurants at lunch.",
        origin: "agent_derived"
      }
    }
  ],
  eventsAndPartnerships: [
    {
      dayOfWeek: "Monday through Thursday (10:30 AM – 3:30 PM)",
      title: "Focus & Flow Midday Co-Working Pass",
      partnerType: "Neighborhood Remote Knowledge Workers & Freelance Designers",
      targetAudience: "Independent consultants, remote software engineers, and writers",
      executionSteps: [
        "Designate 8 perimeter booths as quiet, laptop-friendly zones with dedicated power strips.",
        "Offer a $14 bundled pass including unlimited batch brew refills, 1 artisan pastry, and high-speed Wi-Fi token.",
        "Preserve central communal tables for non-laptop walk-in casual guests to protect third-place atmosphere."
      ],
      origin: "agent_derived",
      provenance: {
        sourceTool: "qloo_rank",
        groundingEntityOrTag: "Rank #1 Opportunity (Score 95): Midday Co-Working Pass",
        empiricalMeasurement: "Illustrative Fit Score: 95/100",
        interpretationNote:
          "Capitalizes on high third-place concept tag prevalence to monetize idle midday tables.",
        origin: "agent_derived"
      }
    },
    {
      dayOfWeek: "Thursday Afternoon (2:00 PM – 5:00 PM)",
      title: "Bi-Weekly Acoustic Lo-Fi & Ambient Vinyl Listening Sessions",
      partnerType: "Local Independent Vinyl Record Shop (Breakaway Records)",
      targetAudience: "Creative freelancers, audio enthusiasts & students",
      executionSteps: [
        "Spin curated analog vinyl albums at low volume (under 68 dB) on the espresso bar turntable setup.",
        "Display a rotating 'Record of the Week' with partner record store branding and QR code to stream.",
        "Host low-decibel artist listening previews without disrupting focused co-working guests."
      ],
      origin: "agent_derived",
      provenance: {
        sourceTool: "qloo_entity_tags",
        groundingEntityOrTag: "urn:tag:lifestyle:analog_sound_culture & Austin music affinity",
        empiricalMeasurement: "Prevalence: High in 78702",
        interpretationNote:
          "Translates Austin's distinctive music-listening lifestyle trait into subtle off-peak afternoon energy.",
        origin: "agent_derived"
      }
    }
  ],
  atmosphereAndPlaylist: {
    musicalGenre: "Low-tempo ambient jazz, Japanese city pop, and analog acoustic instrumental",
    soundscapeVibe: "Warm, unhurried, low-decibel analog acoustics (under 68 dB) allowing focused screen work",
    lightingAndDwellPacing:
      "Natural daylight through 3:00 PM, transitioning to warm amber low-kelvin sconces at 4:00 PM for late-afternoon wind-down",
    curatedArtistSignals: ["Khruangbin", "Hania Rani", "Makoto Matsushita", "BADBADNOTGOOD", "Yussef Dayes"],
    origin: "agent_derived",
    provenance: {
      sourceTool: "qloo_compare_audiences",
      groundingEntityOrTag: "Austin distinctive lifestyle trait: Independent Vinyl Culture & Ambient Audio",
      empiricalMeasurement: "High divergence vs benchmark mainstream commercial radio",
      interpretationNote:
        "Directly matches creative remote worker preferences for textured acoustic background without vocal distraction.",
      origin: "agent_derived"
    }
  },
  socialContentCalendar: [
    {
      dayOfWeek: "Monday 10:30 AM",
      hook: "Reclaim your midday flow: batch brew refills + dedicated power booths open all week.",
      contentAngle: "Showcase ergonomic desk setup and peaceful natural lighting for remote workers.",
      recommendedFormat: "Reel / Short Video",
      origin: "agent_derived",
      provenance: {
        sourceTool: "qloo_rank",
        groundingEntityOrTag: "Rank #1 Co-Working Initiative",
        empiricalMeasurement: "Score: 95/100",
        interpretationNote: "Drives Monday morning discovery for the upcoming work week.",
        origin: "agent_derived"
      }
    },
    {
      dayOfWeek: "Wednesday 2:00 PM",
      hook: "Midweek botanical recharge: Cascara Blood Orange Spritz is on tap today.",
      contentAngle: "Slow-pour beauty shot highlighting sparkling effervescence and citrus garnish.",
      recommendedFormat: "Story / Static Post",
      origin: "agent_derived",
      provenance: {
        sourceTool: "qloo_trends",
        groundingEntityOrTag: "Experiential & Low-Impact Coffee Formats",
        empiricalMeasurement: "+31% YoY Momentum",
        interpretationNote: "Targets Wednesday 2 PM slump when caffeine shifters seek refreshing alternatives.",
        origin: "agent_derived"
      }
    },
    {
      dayOfWeek: "Friday 11:45 AM",
      hook: "Weekend warm-up: Fresh sourdough focaccia drop just landed for lunch.",
      contentAngle: "Close-up bread pull showcasing bubbly crumb and local micro-bakery partner tag.",
      recommendedFormat: "Carousel / Story",
      origin: "agent_derived",
      provenance: {
        sourceTool: "qloo_rank",
        groundingEntityOrTag: "Rank #2 Sourdough Partnership Drop",
        empiricalMeasurement: "Score: 91/100",
        interpretationNote: "Encourages patrons to stay for lunch rather than leaving for external restaurants.",
        origin: "agent_derived"
      }
    }
  ],
  dailySchedule: [
    {
      day: "Monday",
      shiftFocus: "Focus & Flow Launch (10:30 AM – 3:30 PM)",
      keyMilestones: [
        "Open reserved perimeter booths for co-working pass holders.",
        "Brew morning batch roast origin (Guatemala Huehuetenango).",
        "Publish Monday social co-working story."
      ],
      targetOutcome: "Establish co-working routine with early-week remote workers.",
      origin: "agent_derived"
    },
    {
      day: "Tuesday",
      shiftFocus: "Botanical Spritz Tap Activation (2:00 PM – 4:00 PM)",
      keyMilestones: [
        "Check nitrogen carbonation on Cascara Spritz keg line.",
        "Offer complimentary 2 oz tasting pours to co-working patrons.",
        "Log customer feedback on cascara sweetness profile."
      ],
      targetOutcome: "Drive afternoon check average lift during the 2–4 PM lull.",
      origin: "agent_derived"
    },
    {
      day: "Wednesday",
      shiftFocus: "Midweek Roaster Tasting Flights (1:00 PM – 3:30 PM)",
      keyMilestones: [
        "Set out 3-cup flight cards with flavor wheels on the bar counter.",
        "Rotate between washed Ethiopian and natural processed Costa Rican beans.",
        "Promote retail whole-bean bag discount bundle with each flight."
      ],
      targetOutcome: "Engage coffee connoisseurs and generate whole-bean retail revenue.",
      origin: "agent_derived"
    },
    {
      day: "Thursday",
      shiftFocus: "Analog Vinyl Afternoon Session (2:00 PM – 5:00 PM)",
      keyMilestones: [
        "Cue up ambient jazz & instrumental beats on bar turntable.",
        "Feature Record of the Week card with partner micro-record shop.",
        "Monitor sound level to maintain comfortable conversation under 68 dB."
      ],
      targetOutcome: "Create unique sensory dwell atmosphere that encourages extended visits.",
      origin: "agent_derived"
    },
    {
      day: "Friday",
      shiftFocus: "Artisanal Sourdough Midday Drop (11:30 AM – 2:00 PM)",
      keyMilestones: [
        "Receive fresh morning delivery of savoury focaccia and sourdough bread.",
        "Prep whipped herb ricotta and cold-pressed olive oil spreads.",
        "Run lunch combo: Toast + Cold Brew or Iced Cascara."
      ],
      targetOutcome: "Capture lunch rush revenue without kitchen capital expenditures.",
      origin: "agent_derived"
    },
    {
      day: "Saturday",
      shiftFocus: "Neighborhood Third-Place Social Hub (9:00 AM – 4:00 PM)",
      keyMilestones: [
        "Stow perimeter co-working signage to transition floor to communal social tables.",
        "Feature dual single-origin pour-over bar.",
        "Engage weekend neighborhood walk-ins and local patio patrons."
      ],
      targetOutcome: "Maximize morning turnover and weekend community connection.",
      origin: "agent_derived"
    },
    {
      day: "Sunday",
      shiftFocus: "Slow Sunday Coffee & Cultural Reflection (10:00 AM – 3:00 PM)",
      keyMilestones: [
        "Spin low-tempo acoustic and bossa nova vinyl selections.",
        "Review weekly sales figures across co-working passes, cascara spritzes, and lunch drops.",
        "Plan ingredient orders and partner drops for upcoming Monday."
      ],
      targetOutcome: "Calm end-of-week community wind-down and operational reconciliation.",
      origin: "agent_derived"
    }
  ],
  expectedImpact: {
    projectedOutcomeSummary:
      "Implementing this weekly operations plan is estimated to increase midday dwell time by 25–35% and raise average customer ticket size from $6.20 to $11.50 during off-peak weekday hours. Note: These figures are illustrative model projections rather than guaranteed commercial returns.",
    supportingDataPoints: [
      {
        metricName: "Austin Specialty Coffee Trend Growth",
        value: "+31% YoY",
        source: "qloo_trends benchmark fixture"
      },
      {
        metricName: "Top Tactical Initiative Fit Score",
        value: "95/100",
        source: "qloo_rank benchmark fixture"
      },
      {
        metricName: "Third-Place Concept Tag Prevalence",
        value: "Dominant in 78702",
        source: "qloo_entity_tags benchmark fixture"
      }
    ],
    dataSupported: false
  },
  audienceDivergence: {
    benchmarkMarket: "Nashville, TN",
    sharedAffinities: [
      "Specialty Pour-Over Culture",
      "Artisan Bakery Sourcing",
      "Third-Place Dwell Dynamics"
    ],
    distinguishingLocalTraits: [
      "Hyper-Local Roaster Tasting Flights",
      "Vinyl Soundscapes & Low-Decibel Audio",
      "Botanical & Low-Impact Cascara Brews"
    ],
    divergenceTakeaway:
      "While Nashville leans toward daytime Americana hospitality, Austin patrons strongly index toward independent design aesthetics, plant-forward ingredients, and analog acoustic spaces.",
    status: "complete"
  },
  orchestrationTrace: {
    toolsExecuted: [
      "qloo_recommend",
      "qloo_entity_tags",
      "qloo_compare_audiences",
      "qloo_trends",
      "qloo_rank"
    ],
    stagesCompleted: 4,
    timestamp: new Date().toISOString(),
    isDemo: true
  }
};
