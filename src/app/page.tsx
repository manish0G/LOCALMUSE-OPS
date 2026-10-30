"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/common/AppShell";
import { BrandGlyph3D } from "@/components/common/BrandGlyph3D";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { APP_CONFIG } from "@/constants";
import { LocationInsightsView } from "@/components/location-insights/LocationInsightsView";
import { AudienceComparisonView } from "@/components/audience-comparison/AudienceComparisonView";
import { LocalTrendsView } from "@/components/local-trends/LocalTrendsView";
import { CulturePlanView } from "@/components/culture-plan/CulturePlanView";
import { RecommendationsView } from "@/components/recommendations/RecommendationsView";

export default function Home() {
  const [activeNav, setActiveNav] = useState("overview");

  const getShellTitle = () => {
    switch (activeNav) {
      case "culture-plan":
        return "Weekly Culture Plan Copilot";
      case "location-insights":
        return "Location Insights";
      case "compare-audiences":
        return "Audience Comparison";
      case "local-trends":
        return "Local Trends & Momentum";
      case "recommendations":
        return "Tactical Recommendations & Ranking";
      default:
        return "Cultural Intelligence Workbench";
    }
  };

  const getShellDescription = () => {
    switch (activeNav) {
      case "culture-plan":
        return "Agentic weekly operating rhythm, Qloo vs Generic mode benchmark & feedback memory";
      case "location-insights":
        return "Taste-powered peer anchors and cultural concept indexing for local enterprises";
      case "compare-audiences":
        return "Cross-market taste contrast, shared passions, and distinguishing lifestyle traits";
      case "local-trends":
        return "Time-series popularity momentum curves and neighborhood density heatmaps";
      case "recommendations":
        return "Two-stage candidate discovery and ranking of operational initiatives against business goals";
      default:
        return "Taste-powered operations and local market intelligence for independent enterprises";
    }
  };

  return (
    <AppShell
      activeNavId={activeNav}
      onSelectNav={setActiveNav}
      title={getShellTitle()}
      description={getShellDescription()}
    >
      {activeNav === "culture-plan" ? (
        <CulturePlanView />
      ) : activeNav === "location-insights" ? (
        <LocationInsightsView />
      ) : activeNav === "compare-audiences" ? (
        <AudienceComparisonView />
      ) : activeNav === "local-trends" ? (
        <LocalTrendsView />
      ) : activeNav === "recommendations" ? (
        <RecommendationsView />
      ) : (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
          {/* Top Hero / Platform Introduction */}
          <div className="relative rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/80 via-zinc-900/40 to-zinc-950 p-6 sm:p-8 overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2">
                  <Badge variant="info" size="sm">
                    Qloo Hackathon Foundation
                  </Badge>
                  <span className="text-[11px] text-zinc-400 font-mono">v{APP_CONFIG.version}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                  Operational Intelligence Powered by Taste AI
                </h2>

                <p className="text-sm text-zinc-400 leading-relaxed">
                  LocalMuse Ops translates macro cultural signals—music, dining, literature, and lifestyle affinities—into actionable business decisions for independent hospitality and retail operators.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-zinc-400">Supported surfaces:</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">qloo mcp</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">StdioTransport</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">Next.js 16 App Router</span>
                </div>
              </div>

              {/* 3D Geometric Brand Prism */}
              <div className="shrink-0 flex flex-col items-center p-4 rounded-xl border border-zinc-800/60 bg-zinc-950/60">
                <BrandGlyph3D size="lg" animate />
                <span className="text-[10px] font-mono text-zinc-400 mt-2 uppercase tracking-wider">
                  Cultural Prism
                </span>
              </div>
            </div>
          </div>

          {/* Demo Mode & Provenance Disclosure Alert */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5 flex items-start gap-3.5 text-left">
            <div className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                  Curated Demo Mode Active
                </span>
                <Badge variant="warning" size="sm">
                  Sample Datasets
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                All results and scores currently shown in demo scenarios (Austin specialty coffee, Austin vs Nashville audience comparison) are curated illustrative fixtures. They are designed for product evaluation and do not represent live empirical research. Connect an event-issued <code className="text-amber-300 font-mono text-xs">QLOO_API_KEY</code> on the persistent Node.js backend to unlock live multi-signal MCP queries.
              </p>
            </div>
          </div>

          {/* Flagship Module 05: Weekly Culture Plan Copilot */}
          <div className="rounded-2xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950/50 via-zinc-900/60 to-zinc-900/80 p-6 sm:p-7 relative overflow-hidden space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <Badge variant="info" size="sm">Flagship Module &bull; Agentic Copilot</Badge>
                  <span className="text-xs text-indigo-300 font-mono">Qloo vs Generic Benchmark</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-100">
                  Weekly Culture Plan Copilot
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Synthesize an actionable 6-pillar operational operating rhythm (specials, soundscapes, programming, partnerships, visual merchandising, localized copy). Includes side-by-side generic LLM comparison and staff feedback memory loop.
                </p>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => setActiveNav("culture-plan")}
                className="shrink-0 px-5 shadow-lg shadow-indigo-500/20"
              >
                Launch Culture Plan Copilot →
              </Button>
            </div>
          </div>

          {/* The Four Core Workflows Section */}
          <div className="space-y-5">
            <SectionHeader
              badge={<Badge variant="neutral" size="sm">Core Architecture</Badge>}
              title="Operational Workflows"
              description="Underlying Qloo cultural AI modules powering the weekly operations engine."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Workflow 1: Location Insights (Interactive & Live) */}
              <Card className="hover:border-zinc-700/80 transition-colors border-indigo-500/30 bg-zinc-900/70">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="info" size="sm">Module 01 &bull; Active</Badge>
                    <span className="text-[11px] font-mono text-indigo-400">qloo_recommend</span>
                  </div>
                  <CardTitle className="pt-1">Location Insights</CardTitle>
                  <CardDescription>
                    Extract cultural peer anchors, defining concept tag prevalence, and demographic age distribution for any local venue or category.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/60 text-xs text-zinc-400 space-y-1">
                    <div className="flex items-center justify-between text-zinc-300 font-medium">
                      <span>Tool Sequence</span>
                      <span className="font-mono text-[10px] text-indigo-400">3 tools chained</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      find_tags &rarr; recommend (target_type: place) &rarr; entity_tags
                    </p>
                  </div>
                  <div className="pt-1">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setActiveNav("location-insights")}
                      className="w-full sm:w-auto"
                    >
                      Open Location Insights &rarr;
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Workflow 2: Audience Comparison (Interactive & Live) */}
              <Card className="hover:border-zinc-700/80 transition-colors border-indigo-500/30 bg-zinc-900/70">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="info" size="sm">Module 02 &bull; Active</Badge>
                    <span className="text-[11px] font-mono text-indigo-400">qloo_compare_audiences</span>
                  </div>
                  <CardTitle className="pt-1">Audience Comparison</CardTitle>
                  <CardDescription>
                    Contrast cultural affinities between two markets or neighborhoods to uncover shared passions and distinct regional traits.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/60 text-xs text-zinc-400 space-y-1">
                    <div className="flex items-center justify-between text-zinc-300 font-medium">
                      <span>Tool Sequence</span>
                      <span className="font-mono text-[10px] text-indigo-400">2 tools chained</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      describe (type: locality) &rarr; compare_audiences (group_a vs group_b)
                    </p>
                  </div>
                  <div className="pt-1">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setActiveNav("compare-audiences")}
                      className="w-full sm:w-auto"
                    >
                      Open Audience Comparison &rarr;
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Workflow 3: Local Trends (Interactive & Live) */}
              <Card className="hover:border-zinc-700/80 transition-colors border-indigo-500/30 bg-zinc-900/70">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="info" size="sm">Module 03 &bull; Active</Badge>
                    <span className="text-[11px] font-mono text-indigo-400">qloo_trends</span>
                  </div>
                  <CardTitle className="pt-1">Local Trends & Momentum</CardTitle>
                  <CardDescription>
                    Evaluate multi-quarter popularity momentum curves and identify geographic density hotspots across neighborhood zip codes.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/60 text-xs text-zinc-400 space-y-1">
                    <div className="flex items-center justify-between text-zinc-300 font-medium">
                      <span>Tool Sequence</span>
                      <span className="font-mono text-[10px] text-indigo-400">2 tools chained</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      recommend (entity discovery) &rarr; trends (ISO date range)
                    </p>
                  </div>
                  <div className="pt-1">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setActiveNav("local-trends")}
                      className="w-full sm:w-auto"
                    >
                      Open Local Trends &rarr;
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Workflow 4: Recommendations & Rank (Interactive & Live) */}
              <Card className="hover:border-zinc-700/80 transition-colors border-indigo-500/30 bg-zinc-900/70">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="info" size="sm">Module 04 &bull; Active</Badge>
                    <span className="text-[11px] font-mono text-indigo-400">qloo_rank</span>
                  </div>
                  <CardTitle className="pt-1">Tactical Recommendations</CardTitle>
                  <CardDescription>
                    Two-stage candidate discovery and ranking of operational initiatives (co-working passes, seasonal menus, programming) against specific goals.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/60 text-xs text-zinc-400 space-y-1">
                    <div className="flex items-center justify-between text-zinc-300 font-medium">
                      <span>Tool Sequence</span>
                      <span className="font-mono text-[10px] text-indigo-400">2-stage pipeline</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      recommend (candidate pool) &rarr; rank (shortlist vs goal profile)
                    </p>
                  </div>
                  <div className="pt-1">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setActiveNav("recommendations")}
                      className="w-full sm:w-auto"
                    >
                      Open Tactical Recommendations &rarr;
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Technical Architecture Strip */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-zinc-200">
                All 4 Core Cultural Workflow Modules Active
              </span>
              <p className="text-xs text-zinc-400">
                Location Insights, Audience Comparison, Local Trends & Tactical Recommendations are fully mounted in Demo and Live modes.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActiveNav("recommendations")}
              >
                Launch Module 04
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
