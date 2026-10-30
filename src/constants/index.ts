/**
 * Application constants for LocalMuse Ops
 */

export const APP_CONFIG = {
  name: "LocalMuse Ops",
  shortName: "LocalMuse",
  tagline: "Taste & Cultural Intelligence Platform",
  description: "Operations and Intelligence Platform powered by Qloo Cultural AI",
  version: "0.1.0",
  author: "Qloo Agentic Hackathon",
  docsUrl: "https://docs.qloo.com"
} as const;

export interface NavItem {
  id: string;
  label: string;
  href: string;
  description: string;
  badge?: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "overview",
    label: "Overview",
    href: "/",
    description: "System overview, active mode, and workflow index"
  },
  {
    id: "culture-plan",
    label: "Weekly Culture Plan",
    href: "/culture-plan",
    description: "Agentic weekly action plan, Qloo vs Generic mode & memory",
    badge: "Copilot"
  },
  {
    id: "location-insights",
    label: "Location Insights",
    href: "/location-insights",
    description: "Cultural anchors, tag prevalence & demographic indexing"
  },
  {
    id: "compare-audiences",
    label: "Audience Comparison",
    href: "/audience-comparison",
    description: "Cross-market affinity contrast & divergence mapping"
  },
  {
    id: "local-trends",
    label: "Local Trends",
    href: "/local-trends",
    description: "Time-series popularity momentum & neighborhood heatmaps"
  },
  {
    id: "recommendations",
    label: "Recommendations",
    href: "/#recommendations",
    description: "Two-stage candidate discovery & tactical goal ranking"
  }
];
