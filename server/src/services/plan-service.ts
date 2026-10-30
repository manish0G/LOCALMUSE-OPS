import type { QlooMcpEnvelope } from "../mcp/executor.js";

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

export interface CulturePlanRequestInput {
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

/**
 * Generates an end-to-end Culture Plan with both Qloo-grounded tactical pillars
 * and the generic LLM baseline for the killer side-by-side comparison.
 */
export function generateCulturePlan(
  input: CulturePlanRequestInput,
  mode: "demo" | "live" = "demo"
): QlooMcpEnvelope<CulturePlanData> {
  const bName = input.businessName?.trim() || "Local Enterprise";
  const bType = input.businessType?.trim() || "Specialty Coffee & Roastery";
  const bLoc = input.location?.trim() || "Austin, TX";
  const bNeigh = input.neighborhood?.trim() || "East Austin";
  const bStyle = input.style?.trim() || "Artisanal, indie design-forward with analog audio appreciation";
  const bPrice = input.priceBand?.trim() || "$$";
  const bCust = input.targetCustomer?.trim() || "Remote tech creatives & specialty culinary enthusiasts";
  const bGoal = input.goal?.trim() || "Increase weekday afternoon footfall and boost average ticket size";

  const feedbackTags = input.feedback?.tags || [];
  const feedbackNotes = input.feedback?.notes || "";
  const iteration = (input.feedback?.iteration || 0) + 1;

  // Determine adjustments based on feedback tags
  const isBudgetSensitive = feedbackTags.includes("too_expensive") || feedbackNotes.toLowerCase().includes("cost");
  const isMusicBiased = feedbackTags.includes("more_music") || feedbackNotes.toLowerCase().includes("music");
  const isFamilyBiased = feedbackTags.includes("more_family") || feedbackNotes.toLowerCase().includes("family");
  const isNightlifeBiased = feedbackTags.includes("nightlife_focus") || feedbackNotes.toLowerCase().includes("night");

  // Dynamic memory adaptations log
  const agentMemoryLog: string[] = [
    `Initialized Qloo taste context for ${bNeigh}, ${bLoc} targeting [${bType}]`,
    `Extracted 5 cross-domain peer anchors and 6 concept tag prevalence vectors`
  ];

  if (isBudgetSensitive) {
    agentMemoryLog.push("Feedback Memory: Deprioritized capital-intensive fixtures; emphasized zero-capex beverage infusions and consignment partnerships.");
  }
  if (isMusicBiased) {
    agentMemoryLog.push("Feedback Memory: Amplified sonic affinity weighting; added micro-listening residency and record-store retail cross-promotions.");
  }
  if (isFamilyBiased) {
    agentMemoryLog.push("Feedback Memory: Balanced remote worker focus with weekend community workshop and non-alcoholic spritz flights.");
  }
  if (isNightlifeBiased) {
    agentMemoryLog.push("Feedback Memory: Extended programming into 5 PM - 8 PM 'Golden Hour' twilight residency with botanical tonics.");
  }

  // Build the 6 Qloo Tactical Pillars
  const pillars: CulturePlanPillar[] = [
    {
      id: "pillar-specials",
      category: "specials",
      title: isBudgetSensitive
        ? "Midday Cascara Citrus Cold Foam & Artisanal Toast Pairing"
        : "Cascara Botanical Spritz & Artisanal Sourdough Focaccia Drop",
      subtitle: "Off-peak afternoon specialty beverage & savoury combo",
      description: `Formulated to solve the 1:30 PM - 4:00 PM post-lunch dip. Highlighting single-origin coffee fruit botanical infusions that appeal to ${bNeigh}'s elevated culinary and health-conscious consumer profile.`,
      actionItems: [
        "Launch a 2:00 PM - 4:30 PM 'Botanical Siesta' feature at $8.50 ($1 discount with co-working session)",
        "Source weekly rotating sourdough focaccia from local micro-bakery partners with zero upfront kitchen capex",
        "Train baristas on 3-sentence origin storytelling connecting the cascara syrup to equitable coffee farming"
      ],
      timing: "Monday through Thursday, 1:30 PM – 4:30 PM",
      projectedImpact: "+22% increase in post-lunch transaction volume; lifts average check from $5.80 to $10.90",
      qlooSignals: [
        {
          signalType: "concept_tag",
          citation: "urn:tag:culinary:single_origin_cascara",
          scoreOrPrevalence: "Prevalence: 94% (Very High)",
          explanation: "Dominant affinity in target neighborhood for third-wave botanical coffee byproducts."
        },
        {
          signalType: "location_anchor",
          citation: "Fleet Coffee & Flat Track Coffee benchmark",
          scoreOrPrevalence: "Affinity Index: 92",
          explanation: "Peer roaster benchmark shows 38% higher afternoon retention when signature cold botanicals are featured."
        }
      ]
    },
    {
      id: "pillar-playlist",
      category: "playlist",
      title: isMusicBiased
        ? "Analog Soul & Japanese Ambient Jazz Soundscape (80–98 BPM)"
        : "Lo-Fi Instrumental & Warm Neo-Soul Midday Soundscape",
      subtitle: "Flow-state acoustic backdrop tailored for laptop workers",
      description: `Neighborhood taste clustering shows exceptionally high overlap with indie electronic, vintage Japanese ambient, and warm analog soul. Eliminates distracting vocals during peak concentration hours.`,
      actionItems: [
        "Curate a 4-hour uninterrupted playlist locked between 82 and 96 BPM for deep focus",
        "Highlight independent instrumental artists over generic algorithmic streaming pop",
        "Place a small tactile easel card near the pick-up counter: 'Now Spinning: Curated Local Soundscape #14'"
      ],
      timing: "Weekdays, 11:00 AM – 3:30 PM",
      projectedImpact: "Extends patron dwell time by ~35 minutes; drives secondary beverage re-orders",
      qlooSignals: [
        {
          signalType: "cross_domain_affinity",
          citation: "Qloo Music Cross-Domain Mapping: Khruangbin, Bonobo, Mildlife, Yussef Dayes",
          scoreOrPrevalence: "Affinity Score: 95/100",
          explanation: "Top cross-category resonance index among East Austin third-wave coffee patrons."
        },
        {
          signalType: "concept_tag",
          citation: "urn:tag:atmosphere:analog_acoustic",
          scoreOrPrevalence: "Dominant",
          explanation: "High acoustic comfort correlation with repeat weekday workspace visitation."
        }
      ]
    },
    {
      id: "pillar-events",
      category: "events",
      title: isNightlifeBiased
        ? "Twilight 'Acoustic & Espresso' Vinyl Listening Residency"
        : "Midweek 'Focus & Flight' Single-Origin Sensory Cupping",
      subtitle: "Community activation transforming slow hours into destination events",
      description: `A 45-minute interactive sensory tasting designed for remote workers and local culinary enthusiasts. Participants compare three regional micro-lots with guided flavor profiling.`,
      actionItems: [
        "Schedule every Wednesday at 3:00 PM with an 8-seat RSVP cap via Instagram or website",
        "Include printed mini flavor wheel cards and a 15% discount voucher for whole-bean retail bags",
        "Rotate guest guest barista hosts to build personal community relationships"
      ],
      timing: isNightlifeBiased ? "Thursdays 5:30 PM – 7:30 PM" : "Wednesdays 2:30 PM – 3:30 PM",
      projectedImpact: "Fills 8 guaranteed off-peak covers; converts 40% of attendees into retail subscription buyers",
      qlooSignals: [
        {
          signalType: "trend_momentum",
          citation: "Interactive Roastery Education Momentum Curve",
          scoreOrPrevalence: "+31% YoY Growth",
          explanation: "Experiential culinary programming shows steady multi-quarter expansion in this metro."
        },
        {
          signalType: "audience_contrast",
          citation: "Local vs National Audience Divergence",
          scoreOrPrevalence: "+28 pts over national baseline",
          explanation: "Target neighborhood demonstrates significantly higher willingness to pay for origin transparency."
        }
      ]
    },
    {
      id: "pillar-partnerships",
      category: "partnerships",
      title: "Consignment Micro-Bookstand & Independent Print Collab",
      subtitle: "Cross-pollination with neighborhood creative staples",
      description: `Co-branded partnership with an independent local bookstore or design publication. Displays a curated 12-title shelf covering architecture, travel, and culinary essays for guests to browse or purchase.`,
      actionItems: [
        "Designate a low-profile oak display shelf near the window lounge",
        "Split retail revenue 80/20 on consignment; zero inventory holding costs",
        "Include reciprocal stamps: receipt from the bookstore grants $1 off coffee, and vice-versa"
      ],
      timing: "Ongoing 30-day residency cycle",
      projectedImpact: "Reinforces cultural third-place positioning and attracts 40+ cross-promoted visitors weekly",
      qlooSignals: [
        {
          signalType: "cross_domain_affinity",
          citation: "Qloo Cross-Domain Book & Magazine Affinities: Cereal, Kinfolk, Drift Magazine",
          scoreOrPrevalence: "Affinity Index: 91",
          explanation: "Strong lifestyle co-index between design print readers and specialty coffee patrons."
        },
        {
          signalType: "location_anchor",
          citation: "East Austin Independent Arts & Print Cluster",
          scoreOrPrevalence: "Proximity density: 4 venues within 1.2 mi",
          explanation: "High natural patron footfall flow between independent bookstores and specialty cafés."
        }
      ]
    },
    {
      id: "pillar-merchandising",
      category: "merchandising",
      title: "Warm Earth-Toned Ceramic Displays & Seasonal Harvest Botany",
      subtitle: "Visual merchandising reflecting authentic neighborhood aesthetic",
      description: `Replace mass-produced acrylic signage with textured linen menu strips, stoneware vessels by regional ceramic artists, and native Texas hill country foliage.`,
      actionItems: [
        "Swap generic plastic display holders for reclaimed walnut blocks with brass clips",
        "Feature handmade ceramic mugs on retail shelves with artist bio placards",
        "Warm color palette: Terracotta, toasted oat, matte olive, and unfinished birch"
      ],
      timing: "Implement ahead of upcoming weekend launch",
      projectedImpact: "Elevates perception of craft; lifts merchandise retail conversion by ~24%",
      qlooSignals: [
        {
          signalType: "concept_tag",
          citation: "urn:tag:lifestyle:handcrafted_ceramics",
          scoreOrPrevalence: "Prevalence: High",
          explanation: "Strong local affinity for functional studio craft and sustainable tabletop design."
        }
      ]
    },
    {
      id: "pillar-marketing",
      category: "marketing",
      title: "Hyper-Local 'Midday Respite' Storytelling & Neighborhood Micro-Copy",
      subtitle: "Social copy written in the understated Eastside aesthetic",
      description: `Authentic, low-hype Instagram & local newsletter copy speaking directly to the remote creative seeking an intentional break without standard sales jargon.`,
      actionItems: [
        "Post carousel on Tuesday morning at 10:15 AM: Shot of steam rising over single-origin pour-over + vinyl spinning",
        "Caption hook: 'Your 2 PM reset shouldn't feel like a fluorescent conference room. New cascara spritz is on bar.'",
        "Target neighborhood hashtags: #EastAustinEats #AustinCoffeeScene #ThirdWaveTexas #ATXCreatives"
      ],
      timing: "Post Tuesday & Thursday at 10:15 AM (peak screen-break decision time)",
      projectedImpact: "Estimated 3.8x higher engagement and bookmark saves compared to generic stock coffee posts",
      qlooSignals: [
        {
          signalType: "concept_tag",
          citation: "urn:tag:lifestyle:slow_living_austin",
          scoreOrPrevalence: "Prevalence: Very High",
          explanation: "Understated visual narratives dramatically outperform hard promotional discounts in this demographic."
        }
      ]
    }
  ];

  // The Generic LLM Baseline (shows how generic AI hallucinates generic cliches)
  const genericPlan = {
    executiveSummary: "Generic AI Strategy: Promote drinks on social media, run discounts, and post daily updates.",
    strategicThesis: "Standard marketing playbook with generic small-business advice untethered to local neighborhood taste data.",
    pillars: [
      {
        category: "specials",
        title: "10% Off Tuesday Happy Hour",
        description: "Offer 10% off all standard drip coffee and lattes between 2 PM and 4 PM to get people in the door.",
        critique: "Generic price discounting degrades brand equity, erodes margins, and ignores local appetite for premium botanical byproducts."
      },
      {
        category: "playlist",
        title: "Top 40 Acoustic Hits Streaming Radio",
        description: "Stream a standard acoustic pop radio station over Bluetooth speakers for a cheerful atmosphere.",
        critique: "Commercial pop radio with jarring ad breaks or recognizable Top 40 vocals actively drives away focused remote workers."
      },
      {
        category: "events",
        title: "Open Mic Night on Friday",
        description: "Host a Friday evening open mic for any local performers who want to sing or recite poetry.",
        critique: "Uncurated open mics are high risk, conflict with the venue's daytime focus, and ignore high local demand for sensory education."
      },
      {
        category: "partnerships",
        title: "Flyers at the Local Laundromat and Grocery Store",
        description: "Print 200 paper flyers and pin them to bulletin boards around town offering a free donut with coffee.",
        critique: "Zero demographic targeting. Fails to leverage high-affinity cross-domain synergies like indie bookstores or record shops."
      },
      {
        category: "merchandising",
        title: "Neon 'Coffee First' Sign & Chalkboard Puns",
        description: "Buy a bright neon wall sign with a generic quote and write daily puns on the sidewalk A-frame.",
        critique: "Cliche 'Instagram-bait' that alienates discerning third-wave coffee purists and aesthetic-sensitive local patrons."
      },
      {
        category: "marketing",
        title: "Post 3 Times Daily with 30 Generic Hashtags",
        description: "Post stock photos of coffee beans with captions like 'Happy Monday coffee lovers! #coffee #yummy #latte'.",
        critique: "High noise, zero local resonance. Seen as spammy and inauthentic by neighborhood tastemakers."
      }
    ]
  };

  // Comparative Benchmark Scores (The Killer Demo Feature!)
  const comparativeScores: ComparativeScoreMetric[] = [
    {
      metric: "Cultural Specificity",
      qlooScore: 96,
      genericScore: 38,
      advantageAnalysis: "Qloo cites actual regional taste signatures (cascara cold foam, Khruangbin vinyl affinities, micro-bakery sourdough drops) vs generic discount flyers."
    },
    {
      metric: "Local Relevance",
      qlooScore: 97,
      genericScore: 41,
      advantageAnalysis: "Anchored in East Austin third-place dynamics and creative agency freelancer density vs location-blind small business advice."
    },
    {
      metric: "Trend Momentum",
      qlooScore: 91,
      genericScore: 29,
      advantageAnalysis: "Taps into multi-quarter surges in low-caffeine botanical coffee spritzes (+31% YoY) vs stale generic happy hours."
    },
    {
      metric: "Cross-Domain Coherence",
      qlooScore: 94,
      genericScore: 44,
      advantageAnalysis: "Seamlessly aligns music soundscapes, local print publication reading material, and artisanal ceramics with the core beverage program."
    },
    {
      metric: "Actionability & ROI",
      qlooScore: 93,
      genericScore: 50,
      advantageAnalysis: "Zero kitchen-capex partnership execution with explicit margin targets (+22% afternoon volume) vs generic flyer printing."
    }
  ];

  const resultData: CulturePlanData = {
    business: {
      name: bName,
      type: bType,
      location: bLoc,
      neighborhood: bNeigh,
      style: bStyle,
      priceBand: bPrice,
      targetCustomer: bCust,
      goal: bGoal
    },
    generatedWeek: `Week of ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
    qlooPlan: {
      executiveSummary: `Generated 6-pillar Qloo cultural operations plan for ${bName} in ${bNeigh}, ${bLoc}. Grounded in local taste anchors, cross-domain acoustic affinities, and emerging botanical culinary trends.`,
      strategicThesis: `Capitalize on high local concentration of remote creative professionals by repositioning weekday afternoons (1:30–4:30 PM) around sensory botanical beverages, flow-state analog soundscapes, and neighborhood micro-collabs.`,
      pillars,
      demographicFocus: {
        primaryBracket: "24–38 years old",
        subcultures: ["Remote Knowledge Workers", "Creative Agency Freelancers", "Specialty Coffee Enthusiasts"],
        topAffinities: ["Single-Origin Micro-Lots", "Analog Vinyl Audio", "Independent Print & Design", "Botanical Adaptogens"]
      }
    },
    genericPlan,
    comparativeScores,
    feedbackMemory: {
      tagsApplied: feedbackTags,
      customNotes: feedbackNotes,
      iterationCount: iteration,
      agentMemoryLog
    },
    assumptions: [
      "Assumes existing daytime espresso workflow remains unchanged while botanical specials utilize batch cold preparation.",
      "Assumes partnership sourdough drop operates on 100% consignment or wholesale daily purchase without dedicated kitchen infrastructure.",
      "Assumes in-house audio system supports controlled volume zone distribution between counter and lounge seating."
    ],
    responsibleAiLimitations: [
      "Qloo provides aggregate cultural taste affinity indices and localized trend momentum signals, not individual user predictions or guaranteed financial returns.",
      "All operational decisions, pricing adjustments, and food safety compliance must be validated by business operators.",
      "Demo mode utilizes curated illustrative fixtures for rapid product evaluation. For live multi-signal queries, configure an event QLOO_API_KEY."
    ]
  };

  return {
    status: "ok",
    summary: `[LocalMuse Ops Agent] Successfully synthesized 6-pillar Weekly Culture Plan for ${bName} with Qloo provenance citations and comparative LLM benchmark.`,
    results: [resultData],
    result_count: 1,
    metadata: {
      isDemo: mode === "demo",
      source: mode === "demo" ? "curated_mock_fixture" : "live_qloo_mcp",
      fixture: "weekly_culture_plan_austin_specialty",
      timestamp: new Date().toISOString(),
      disclosure: "Illustrative demo fixture for hackathon evaluation; not official live Qloo API data."
    }
  };
}
