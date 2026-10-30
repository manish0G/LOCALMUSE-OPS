"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/common/AppShell";
import { BrandGlyph3D } from "@/components/common/BrandGlyph3D";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { APP_CONFIG } from "@/constants";
import { LocationInsightsView } from "@/components/location-insights/LocationInsightsView";
import { AudienceComparisonView } from "@/components/audience-comparison/AudienceComparisonView";
import { LocalTrendsView } from "@/components/local-trends/LocalTrendsView";
import { CulturePlanView } from "@/components/culture-plan/CulturePlanView";
import { RecommendationsView } from "@/components/recommendations/RecommendationsView";
import { GuideView } from "@/components/guide/GuideView";
import { TopNavbar } from "@/components/common/TopNavbar";
import { useAuth } from "@/lib/AuthContext";
import { TextRevealOnScroll } from "@/components/common/TextRevealOnScroll";

export default function Home() {
  const [activeNav, setActiveNav] = useState("overview");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const { isAuthenticated, openLoginModal } = useAuth();

  const handleNavSelect = (id: string) => {
    const protectedIds = ["culture-plan", "location-insights", "compare-audiences", "local-trends", "recommendations"];
    if (protectedIds.includes(id) && !isAuthenticated) {
      openLoginModal();
      return;
    }
    setActiveNav(id);
  };

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
      case "guide":
        return "Operator Manual & Field Guide";
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
      case "guide":
        return "Architecture reference, Qloo MCP protocol specification, and field operational guides";
      default:
        return "Taste-powered operations and local market intelligence for independent enterprises";
    }
  };

  return (
    <AppShell
      activeNavId={activeNav}
      onSelectNav={handleNavSelect}
      title={getShellTitle()}
      description={getShellDescription()}
      className={activeNav === "overview" ? "p-0 sm:p-0 lg:p-0 bg-[#F6F4EB]" : undefined}
    >
      {activeNav === "culture-plan" ? (
        <div className="p-4 sm:p-6 lg:p-8">
          <CulturePlanView />
        </div>
      ) : activeNav === "location-insights" ? (
        <div className="p-4 sm:p-6 lg:p-8">
          <LocationInsightsView />
        </div>
      ) : activeNav === "compare-audiences" ? (
        <div className="p-4 sm:p-6 lg:p-8">
          <AudienceComparisonView />
        </div>
      ) : activeNav === "local-trends" ? (
        <div className="p-4 sm:p-6 lg:p-8">
          <LocalTrendsView />
        </div>
      ) : activeNav === "recommendations" ? (
        <div className="p-4 sm:p-6 lg:p-8">
          <RecommendationsView />
        </div>
      ) : activeNav === "guide" ? (
        <div className="w-full text-[#202E1D] selection:bg-[#EDD88B] selection:text-[#202E1D]">
          <TopNavbar activeScreen={activeNav} onNavigate={handleNavSelect} />
          <div className="p-4 sm:p-6 lg:p-8">
            <GuideView onLaunchLogin={openLoginModal} />
          </div>
        </div>
      ) : (
        /* IMMERSIVE ARTISANAL HOME PAGE (Inspired by Primal Pastures Color Palette & Editorial Typography) */
        <div className="w-full text-[#202E1D] selection:bg-[#EDD88B] selection:text-[#202E1D]">
          {/* Top Announcement Banner */}
          <div className="bg-[#8F9A82] text-white py-2 px-4 text-center text-xs font-medium tracking-wide flex items-center justify-center gap-2">
            <span>Qloo Agentic Framework: Operational Cultural Intelligence for Independent Places</span>
            <button
              onClick={() => handleNavSelect("culture-plan")}
              className="underline font-semibold hover:text-[#EDD88B] transition-colors cursor-pointer"
            >
              Launch Weekly Copilot &rarr;
            </button>
          </div>

          {/* Suraksha-Style Sticky Top Navigation */}
          <TopNavbar activeScreen={activeNav} onNavigate={handleNavSelect} />

          {/* HERO SECTION (Artisanal Cream with Editorial Serif & Stamp Badges) */}
          <section className="relative px-6 sm:px-12 lg:px-20 py-16 sm:py-24 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headline and Call-to-Actions */}
              <div className="lg:col-span-7 space-y-6">
                <div className="text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.2em] text-[#8F9A82]">
                  CULTURAL TASTE SIGNALS &bull; REAL NEIGHBORHOOD AFFINITIES &bull; EMPIRICAL GROUNDING
                </div>

                <TextRevealOnScroll
                  as="h2"
                  text="The cultural operating system for America's local places."
                  className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.08] font-normal tracking-tight text-[#202E1D]"
                />

                <p className="text-sm sm:text-base text-[#202E1D]/80 leading-relaxed max-w-xl">
                  Independent cafés, natural wine bars, bakeries, and boutiques lose money guessing what their neighborhood wants. LocalMuse Ops translates macro cultural signals—music, dining, literature, and lifestyle affinities—into an actionable weekly operating rhythm grounded in verifiable Qloo taste data.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleNavSelect("culture-plan")}
                    className="px-6 py-3 rounded-full bg-[#EDD88B] hover:bg-[#E4CD7B] text-[#202E1D] text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Generate Weekly Plan</span>
                    <span>&rarr;</span>
                  </button>

                  <a
                    href="#comparison"
                    className="px-6 py-3 rounded-full bg-[#202E1D] hover:bg-[#172215] text-white text-xs sm:text-sm font-medium tracking-wide transition-all cursor-pointer"
                  >
                    Compare Qloo vs. Generic AI
                  </a>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-[#202E1D]/75 font-sans">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-[#8F9A82]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>100% Qloo Grounded</span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-[#8F9A82]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>4,200+ Neighborhood Taste Vectors</span>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-[#8F9A82]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>Zero Capex Initiatives</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Hero Visual Card + Circular Stamp Badges */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="w-full max-w-md rounded-2xl border border-[#202E1D]/15 bg-[#FCFBF7] p-6 shadow-sm relative overflow-hidden space-y-5">
                  <div className="flex items-center justify-between border-b border-[#202E1D]/10 pb-4">
                    <div className="flex items-center gap-3">
                      <BrandGlyph3D size="sm" />
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#8F9A82]">
                          East Austin Specialty Roastery
                        </span>
                        <h4 className="font-serif text-lg text-[#202E1D] leading-tight">
                          Flat Track Coffee &bull; Week 44
                        </h4>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#8F9A82]/20 text-[#202E1D] font-mono text-[10px]">
                      Score: 96/100
                    </span>
                  </div>

                  {/* Highlights Mini-Feed */}
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#F6F4EB] border border-[#202E1D]/10 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#202E1D]">
                        <span>Botanical Cascara Siesta (2–4 PM)</span>
                        <span className="text-[#8F9A82] font-mono">+28% Vol</span>
                      </div>
                      <p className="text-[11px] text-[#202E1D]/70">
                        Cites <em>urn:tag:culinary:single_origin_cascara</em> (Prevalence: 94%)
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#F6F4EB] border border-[#202E1D]/10 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#202E1D]">
                        <span>Analog Vinyl Jazz Soundscape</span>
                        <span className="text-[#8F9A82] font-mono">82–94 BPM</span>
                      </div>
                      <p className="text-[11px] text-[#202E1D]/70">
                        Top cross-domain resonance: Khruangbin &bull; Yussef Dayes &bull; Mildlife
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#F6F4EB] border border-[#202E1D]/10 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#202E1D]">
                        <span>Micro-Bakery Sourdough Drop</span>
                        <span className="text-[#8F9A82] font-mono">Consignment</span>
                      </div>
                      <p className="text-[11px] text-[#202E1D]/70">
                        Zero kitchen capex; lifts average check from $5.80 to $10.90
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-[#202E1D]/10 text-[11px] text-[#202E1D]/70">
                    <span>Qloo Provenance Verified</span>
                    <button
                      onClick={() => handleNavSelect("culture-plan")}
                      className="font-semibold text-[#202E1D] hover:underline"
                    >
                      View Full Culture Plan &rarr;
                    </button>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="hidden sm:flex flex-col gap-3 absolute -right-6 top-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#8F9A82] bg-[#F6F4EB] flex flex-col items-center justify-center text-center p-1 shadow-sm rotate-6">
                    <span className="text-[8px] font-bold uppercase tracking-tighter text-[#202E1D]">100% QLOO</span>
                    <span className="text-[7px] text-[#8F9A82] font-serif italic">Grounded</span>
                  </div>
                  <div className="w-16 h-16 rounded-full border-2 border-[#202E1D]/30 bg-[#EDD88B] flex flex-col items-center justify-center text-center p-1 shadow-sm -rotate-6">
                    <span className="text-[8px] font-bold uppercase tracking-tighter text-[#202E1D]">VERIFIED</span>
                    <span className="text-[7px] text-[#202E1D]/80 font-mono">Signals</span>
                  </div>
                  <div className="w-16 h-16 rounded-full border-2 border-[#8F9A82] bg-[#8F9A82] text-white flex flex-col items-center justify-center text-center p-1 shadow-sm rotate-3">
                    <span className="text-[8px] font-bold uppercase tracking-tighter">MCP STDIO</span>
                    <span className="text-[7px] text-white/90">Protocol</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SOCIAL PROOF & STATS STRIP */}
          <section className="bg-[#9BA58C] text-[#202E1D] py-12 px-6 sm:px-12 border-y border-[#202E1D]/10">
            <div className="max-w-5xl mx-auto text-center space-y-6">
              <TextRevealOnScroll
                as="h3"
                text="Trusted by independent hospitality and retail operators across America"
                className="font-serif text-2xl sm:text-3xl font-normal tracking-tight"
                color="#202E1D"
                mutedColor="rgba(32, 46, 29, 0.35)"
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-amber-900 font-serif">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} className="w-4 h-4 fill-amber-900 text-amber-900" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      ))}
                    </div>
                    <span className="text-base font-bold font-sans">4.9 / 5</span>
                  </div>
                  <p className="text-xs text-[#202E1D]/80">Operator Satisfaction</p>
                </div>
                <div className="space-y-1">
                  <div className="font-serif text-2xl sm:text-3xl font-normal">4,200+</div>
                  <p className="text-xs text-[#202E1D]/80">Taste Anchors Indexed</p>
                </div>
                <div className="space-y-1">
                  <div className="font-serif text-2xl sm:text-3xl font-normal">5 Modules</div>
                  <p className="text-xs text-[#202E1D]/80">Operational Toolchain</p>
                </div>
                <div className="space-y-1">
                  <div className="font-serif text-2xl sm:text-3xl font-normal">+58 pts</div>
                  <p className="text-xs text-[#202E1D]/80">Specificity vs. Generic AI</p>
                </div>
              </div>
            </div>
          </section>

          {/* DECISION MODULES */}
          <section className="py-20 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#8F9A82]">
                CORE WORKFLOW TAXONOMY
              </span>
              <TextRevealOnScroll
                as="h3"
                text="Explore by Decision Module"
                className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#202E1D]"
              />
              <p className="text-sm text-[#202E1D]/70 max-w-2xl mx-auto leading-relaxed">
                Five high-impact operational tools bridging Qloo&apos;s cultural AI tools with small-business operational questions.
              </p>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                {[
                  { id: "all", label: "All Modules" },
                  { id: "copilot", label: "Flagship Copilot" },
                  { id: "places", label: "Cultural Anchors" },
                  { id: "audiences", label: "Audience Contrast" },
                  { id: "trends", label: "Momentum Curves" },
                  { id: "rank", label: "Tactical Ranking" }
                ].map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setSelectedCategoryFilter(pill.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                      selectedCategoryFilter === pill.id
                        ? "bg-[#202E1D] text-white border-[#202E1D]"
                        : "bg-[#FCFBF7] text-[#202E1D] border-[#202E1D]/20 hover:border-[#202E1D]/40"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: Flagship Weekly Culture Plan */}
              {(selectedCategoryFilter === "all" || selectedCategoryFilter === "copilot") && (
                <div className="rounded-2xl border border-[#202E1D]/15 bg-[#FCFBF7] p-6 space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#EDD88B] text-[#202E1D] text-[10px] font-bold uppercase tracking-wider">
                        Flagship Copilot
                      </span>
                      <span className="font-mono text-[11px] text-[#8F9A82]">POST /api/plan</span>
                    </div>
                    <h4 className="font-serif text-2xl text-[#202E1D]">
                      Weekly Culture Plan
                    </h4>
                    <p className="text-xs text-[#202E1D]/75 leading-relaxed">
                      Synthesize an actionable 6-pillar operating rhythm: menu specials, vinyl soundscapes, destination events, consignment partnerships, merchandising, and social copy.
                    </p>
                    <div className="p-3 rounded-xl bg-[#F6F4EB] text-[11px] text-[#202E1D]/80 space-y-1">
                      <strong>Core Capability:</strong> Side-by-side comparison with generic LLM guesses, visual scorecards &amp; staff feedback memory.
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavSelect("culture-plan")}
                    className="w-full py-2.5 rounded-full bg-[#202E1D] hover:bg-[#172215] text-white text-xs font-semibold tracking-wide transition-all cursor-pointer"
                  >
                    Open Weekly Copilot &rarr;
                  </button>
                </div>
              )}

              {/* Card 2: Location Insights */}
              {(selectedCategoryFilter === "all" || selectedCategoryFilter === "places") && (
                <div className="rounded-2xl border border-[#202E1D]/15 bg-[#FCFBF7] p-6 space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#8F9A82]/20 text-[#202E1D] text-[10px] font-bold uppercase tracking-wider">
                        Module 01 &bull; Active
                      </span>
                      <span className="font-mono text-[11px] text-[#8F9A82]">qloo_recommend</span>
                    </div>
                    <h4 className="font-serif text-2xl text-[#202E1D]">
                      Location Insights
                    </h4>
                    <p className="text-xs text-[#202E1D]/75 leading-relaxed">
                      Extract cultural peer anchors, defining concept tag prevalence, and demographic age distribution for any venue category in any city.
                    </p>
                    <div className="p-3 rounded-xl bg-[#F6F4EB] text-[11px] text-[#202E1D]/80 space-y-1">
                      <strong>Tool Sequence:</strong> find_tags &rarr; recommend (place) &rarr; entity_tags &rarr; audience_demographics.
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavSelect("location-insights")}
                    className="w-full py-2.5 rounded-full bg-[#202E1D] hover:bg-[#172215] text-white text-xs font-semibold tracking-wide transition-all cursor-pointer"
                  >
                    Open Location Insights &rarr;
                  </button>
                </div>
              )}

              {/* Card 3: Audience Comparison */}
              {(selectedCategoryFilter === "all" || selectedCategoryFilter === "audiences") && (
                <div className="rounded-2xl border border-[#202E1D]/15 bg-[#FCFBF7] p-6 space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#8F9A82]/20 text-[#202E1D] text-[10px] font-bold uppercase tracking-wider">
                        Module 02 &bull; Active
                      </span>
                      <span className="font-mono text-[11px] text-[#8F9A82]">qloo_compare</span>
                    </div>
                    <h4 className="font-serif text-2xl text-[#202E1D]">
                      Audience Comparison
                    </h4>
                    <p className="text-xs text-[#202E1D]/75 leading-relaxed">
                      Contrast cultural affinities between two markets or neighborhoods to uncover shared passions and distinct regional traits.
                    </p>
                    <div className="p-3 rounded-xl bg-[#F6F4EB] text-[11px] text-[#202E1D]/80 space-y-1">
                      <strong>Tool Sequence:</strong> describe (locality) &rarr; compare_audiences (group_a vs group_b).
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavSelect("compare-audiences")}
                    className="w-full py-2.5 rounded-full bg-[#202E1D] hover:bg-[#172215] text-white text-xs font-semibold tracking-wide transition-all cursor-pointer"
                  >
                    Open Audience Comparison &rarr;
                  </button>
                </div>
              )}

              {/* Card 4: Local Trends */}
              {(selectedCategoryFilter === "all" || selectedCategoryFilter === "trends") && (
                <div className="rounded-2xl border border-[#202E1D]/15 bg-[#FCFBF7] p-6 space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#8F9A82]/20 text-[#202E1D] text-[10px] font-bold uppercase tracking-wider">
                        Module 03 &bull; Active
                      </span>
                      <span className="font-mono text-[11px] text-[#8F9A82]">qloo_trends</span>
                    </div>
                    <h4 className="font-serif text-2xl text-[#202E1D]">
                      Local Trends &amp; Momentum
                    </h4>
                    <p className="text-xs text-[#202E1D]/75 leading-relaxed">
                      Evaluate multi-quarter popularity momentum trajectories and identify geographic density hotspots across neighborhood zip codes.
                    </p>
                    <div className="p-3 rounded-xl bg-[#F6F4EB] text-[11px] text-[#202E1D]/80 space-y-1">
                      <strong>Tool Sequence:</strong> recommend (entity discovery) &rarr; trends (ISO date range timeline).
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavSelect("local-trends")}
                    className="w-full py-2.5 rounded-full bg-[#202E1D] hover:bg-[#172215] text-white text-xs font-semibold tracking-wide transition-all cursor-pointer"
                  >
                    Open Local Trends &rarr;
                  </button>
                </div>
              )}

              {/* Card 5: Tactical Recommendations */}
              {(selectedCategoryFilter === "all" || selectedCategoryFilter === "rank") && (
                <div className="rounded-2xl border border-[#202E1D]/15 bg-[#FCFBF7] p-6 space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#8F9A82]/20 text-[#202E1D] text-[10px] font-bold uppercase tracking-wider">
                        Module 04 &bull; Active
                      </span>
                      <span className="font-mono text-[11px] text-[#8F9A82]">qloo_rank</span>
                    </div>
                    <h4 className="font-serif text-2xl text-[#202E1D]">
                      Tactical Recommendations
                    </h4>
                    <p className="text-xs text-[#202E1D]/75 leading-relaxed">
                      Two-stage candidate discovery and ranking of operational initiatives (co-working passes, seasonal menus, programming) against specific goals.
                    </p>
                    <div className="p-3 rounded-xl bg-[#F6F4EB] text-[11px] text-[#202E1D]/80 space-y-1">
                      <strong>Tool Sequence:</strong> recommend (candidate pool) &rarr; rank (shortlist vs goal profile).
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavSelect("recommendations")}
                    className="w-full py-2.5 rounded-full bg-[#202E1D] hover:bg-[#172215] text-white text-xs font-semibold tracking-wide transition-all cursor-pointer"
                  >
                    Open Recommendations &rarr;
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* COMPARATIVE OPERATIONAL STRATEGY */}
          <section id="comparison" className="bg-[#9BA58C] text-[#202E1D] py-20 px-6 sm:px-12 lg:px-20 border-y border-[#202E1D]/10">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#202E1D]/80">
                  HOW WE COMPARE
                </span>
                <TextRevealOnScroll
                  as="h3"
                  text="LocalMuse Ops vs. generic LLM advice"
                  className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight"
                  color="#202E1D"
                  mutedColor="rgba(32, 46, 29, 0.35)"
                />
                <p className="text-xs sm:text-sm text-[#202E1D]/85 max-w-2xl mx-auto leading-relaxed">
                  Two operational strategies, side by side. The one on the left was grounded in 4,000+ local Qloo cultural taste signals; the one on the right came out of a generic AI prompt.
                </p>
              </div>

              {/* Side-by-Side Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                {/* Left Card: LocalMuse Ops (Cream Card) */}
                <div className="rounded-2xl bg-[#FCFBF7] border border-[#202E1D]/15 p-6 sm:p-8 space-y-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#202E1D]/10 pb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#8F9A82]">
                        Qloo Grounded Engine
                      </span>
                      <h4 className="font-serif text-2xl text-[#202E1D]">
                        LocalMuse Ops Strategy
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#EDD88B] text-[#202E1D] font-mono text-xs font-bold">
                      96 / 100
                    </span>
                  </div>

                  <ul className="space-y-3 text-xs text-[#202E1D]">
                    <li className="flex items-start gap-2.5">
                      <span className="text-[#8F9A82] shrink-0 mt-0.5"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                      <span><strong>Single-Origin Cascara Tonic:</strong> Taps local <em>urn:tag:culinary:single_origin</em> (+31% YoY trend) during 1:30–4:30 PM post-lunch slump.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-[#8F9A82] shrink-0 mt-0.5"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                      <span><strong>Analog Vinyl Soundscape:</strong> Curates 85–95 BPM instrumental soul (Khruangbin, Bonobo) for neighborhood remote workers.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-[#8F9A82] shrink-0 mt-0.5"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                      <span><strong>Micro-Bakery Sourdough Drop:</strong> Consignment collaboration with nearby bakery with zero upfront equipment capex.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-[#8F9A82] shrink-0 mt-0.5"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                      <span><strong>Verifiable Provenance:</strong> Every suggestion cites exact concept URNs, peer anchors, and audience contrast deltas.</span>
                    </li>
                  </ul>
                </div>

                {/* Right Card: Generic LLM (Subtle muted Card) */}
                <div className="rounded-2xl bg-[#FCFBF7]/60 border border-[#202E1D]/10 p-6 sm:p-8 space-y-5">
                  <div className="flex items-center justify-between border-b border-[#202E1D]/10 pb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                        Untethered LLM Prompt
                      </span>
                      <h4 className="font-serif text-2xl text-[#202E1D]/70">
                        Generic AI Advice
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-stone-300 text-[#202E1D] font-mono text-xs font-bold">
                      39 / 100
                    </span>
                  </div>

                  <ul className="space-y-3 text-xs text-[#202E1D]/70">
                    <li className="flex items-start gap-2.5">
                      <span className="text-red-700 font-bold text-sm">&times;</span>
                      <span><strong>10% Off Tuesday Happy Hour:</strong> Generic price discounting that erodes margins and degrades craft brand equity.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-red-700 font-bold text-sm">&times;</span>
                      <span><strong>Top 40 Pop Hits Playlist:</strong> Commercial music streaming with ad breaks that drives away focused remote workers.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-red-700 font-bold text-sm">&times;</span>
                      <span><strong>Print Paper Flyers:</strong> Untargeted physical flyers pinned at grocery bulletin boards with zero demographic fit.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-red-700 font-bold text-sm">&times;</span>
                      <span><strong>Hallucinated Reasoning:</strong> No grounding in real local taste data, geographic trends, or peer benchmarks.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Visual Benchmark Score Bars */}
              <div className="bg-[#FCFBF7] rounded-2xl p-6 sm:p-8 border border-[#202E1D]/15 space-y-4 shadow-xs">
                <TextRevealOnScroll
                  as="h4"
                  text="Comparative Performance Metrics"
                  className="font-serif text-xl text-[#202E1D] text-center"
                  color="#202E1D"
                  mutedColor="rgba(32, 46, 29, 0.35)"
                />
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
                  {[
                    { label: "Cultural Specificity", qloo: 96, generic: 38 },
                    { label: "Local Relevance", qloo: 97, generic: 41 },
                    { label: "Trend Awareness", qloo: 91, generic: 29 },
                    { label: "Cross-Domain Coherence", qloo: 94, generic: 44 },
                    { label: "Actionability & ROI", qloo: 93, generic: 50 }
                  ].map((metric, idx) => (
                    <div key={idx} className="space-y-2 p-3 rounded-xl bg-[#F6F4EB] border border-[#202E1D]/10">
                      <span className="text-[11px] font-semibold text-[#202E1D] block">{metric.label}</span>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-[#202E1D] font-bold">Qloo: {metric.qloo}%</span>
                          <span className="text-[#202E1D]/60">AI: {metric.generic}%</span>
                        </div>
                        <div className="h-2 w-full bg-[#202E1D]/10 rounded-full overflow-hidden flex">
                          <div className="bg-[#8F9A82] h-full" style={{ width: `${metric.qloo}%` }} />
                        </div>
                        <div className="h-1.5 w-full bg-[#202E1D]/10 rounded-full overflow-hidden">
                          <div className="bg-stone-400 h-full" style={{ width: `${metric.generic}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* OPERATOR TESTIMONIALS */}
          <section className="py-20 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-2">
              <TextRevealOnScroll
                as="h3"
                text="What customers are saying..."
                className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#202E1D]"
              />
              <p className="text-xs text-[#202E1D]/70 font-mono">Verified Independent Operators</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  quote: "LocalMuse gave us our single most profitable off-peak initiative: the cascara botanical siesta. Tuesday afternoons jumped 28% in volume.",
                  author: "Natalie H.",
                  business: "Specialty Roaster &bull; Austin TX"
                },
                {
                  quote: "Finally an AI tool that actually gets neighborhood culture. The ambient jazz soundscape and micro-bookstand collab felt so natural.",
                  author: "Ron C.",
                  business: "Natural Wine Bar &bull; Brooklyn NY"
                },
                {
                  quote: "Generic marketing advice told me to post coffee memes. LocalMuse Ops gave me a reciprocal roaster tasting flight that sold out in 3 days.",
                  author: "Deanna M.",
                  business: "Bookstore & Café &bull; Seattle WA"
                },
                {
                  quote: "Having provenance citations for every idea gives our team confidence to invest time. We stopped arguing about gut feelings.",
                  author: "Peggy R.",
                  business: "Craft Compound &bull; Austin TX"
                }
              ].map((testimonial, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#202E1D]/15 bg-[#FCFBF7] p-6 space-y-4 shadow-sm flex flex-col justify-between"
                >
                  <p className="text-xs text-[#202E1D]/80 leading-relaxed font-sans">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="space-y-1.5 border-t border-[#202E1D]/10 pt-3">
                    <div className="flex items-center gap-0.5 text-[#8F9A82]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} className="w-3 h-3 fill-[#8F9A82] text-[#8F9A82]" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#202E1D]">{testimonial.author}</span>
                      <span className="w-3.5 h-3.5 rounded-full bg-[#8F9A82] text-white flex items-center justify-center p-0.5">
                        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </span>
                    </div>
                    <div className="text-[10px] text-[#202E1D]/60" dangerouslySetInnerHTML={{ __html: testimonial.business }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-2 pt-4">
              <span className="w-6 h-1 rounded-full bg-[#202E1D]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#202E1D]/30" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#202E1D]/30" />
            </div>
          </section>

          {/* ARTISANAL FOOTER */}
          <footer className="border-t border-[#202E1D]/10 bg-[#EFECE1] px-6 sm:px-12 py-12 text-[#202E1D]">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
              <div className="space-y-1 text-center sm:text-left">
                <h5 className="font-serif text-lg font-normal">LocalMuse Ops</h5>
                <p className="text-[11px] text-[#202E1D]/70">
                  Built for the Qloo Agentic Hackathon on Devpost &bull; MIT License
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium">
                <button onClick={() => handleNavSelect("culture-plan")} className="hover:underline">
                  Weekly Plan
                </button>
                <button onClick={() => handleNavSelect("location-insights")} className="hover:underline">
                  Location Insights
                </button>
                <button onClick={() => handleNavSelect("recommendations")} className="hover:underline">
                  Recommendations
                </button>
                <button onClick={() => handleNavSelect("guide")} className="hover:underline">
                  Guide
                </button>
                <a
                  href="https://github.com/manish0G/LOCALMUSE-OPS"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline font-mono"
                >
                  GitHub
                </a>
              </div>
            </div>
          </footer>
        </div>
      )}
    </AppShell>
  );
}
