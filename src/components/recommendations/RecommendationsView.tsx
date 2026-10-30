"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useBackendHealth } from "@/hooks/useBackendHealth";
import { useOperationMode } from "@/hooks/useOperationMode";
import { ApiClientError } from "@/services/api-client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import type {
  OperationMode,
  RankedOpportunityItem,
  BusinessProfileInput,
  BusinessGoalInput
} from "@/types";

const GOAL_OPTIONS = [
  {
    value: "Increase weekday midday footfall (11:00 AM – 3:00 PM) while upholding craft credibility",
    label: "Increase weekday midday footfall (11 AM – 3 PM)"
  },
  {
    value: "Increase average patron check size and dwell time through evening artisanal drops",
    label: "Increase average patron spend & ticket size"
  },
  {
    value: "Attract young creative professionals, knowledge workers, and neighborhood remote workers",
    label: "Attract a new demographic / patron segment"
  },
  {
    value: "Strengthen neighborhood third-place community identity and customer loyalty",
    label: "Strengthen community third-place identity"
  },
  {
    value: "Discover high-affinity local brand collaborations and limited-edition product drops",
    label: "Discover local brand collaborations & pop-up events"
  },
  {
    value: "custom",
    label: "Custom strategic objective..."
  }
];

const CATEGORY_OPTIONS = [
  { value: "Specialty Coffee & Modern Café", label: "Specialty Coffee & Modern Café" },
  { value: "Artisanal Bakery & Bistro", label: "Artisanal Bakery & Bistro" },
  { value: "Craft Beer & Natural Wine Lounge", label: "Craft Beer & Natural Wine Lounge" },
  { value: "Boutique Wellness & Matcha Bar", label: "Boutique Wellness & Matcha Bar" },
  { value: "Independent Bookstore & Third Place", label: "Independent Bookstore & Third Place" },
  { value: "Farm-to-Table Casual Dining", label: "Farm-to-Table Casual Dining" },
  { value: "custom", label: "Custom Business Category..." }
];

export interface RecommendationsViewProps {
  initialMode?: OperationMode;
}

export function RecommendationsView({ initialMode }: RecommendationsViewProps) {
  const { mode, setMode } = useOperationMode(initialMode ?? "demo");

  // Form State
  const [businessName, setBusinessName] = useState<string>("Solstice Craft Coffee Lab");
  const [selectedCategory, setSelectedCategory] = useState<string>("Specialty Coffee & Modern Café");
  const [customCategory, setCustomCategory] = useState<string>("");
  const [city, setCity] = useState<string>("Austin, TX");
  const [neighborhood, setNeighborhood] = useState<string>("East Austin (78702)");
  const [selectedGoal, setSelectedGoal] = useState<string>(
    "Increase weekday midday footfall (11:00 AM – 3:00 PM) while upholding craft credibility"
  );
  const [customGoal, setCustomGoal] = useState<string>("");
  const [targetDemographic, setTargetDemographic] = useState<string>(
    "Creative freelancers, tech knowledge workers & designers"
  );
  const [vibeContext, setVibeContext] = useState<string>(
    "Third-wave micro-roastery, vinyl patio, natural wine bar & communal work tables"
  );
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [validationError, setValidationError] = useState<string | null>(null);

  const { data, loading, error, execute, reset } = useRecommendations();
  const { isLiveAvailable } = useBackendHealth({ autoFetch: true });

  const effectiveCategory = selectedCategory === "custom" ? customCategory : selectedCategory;
  const effectiveGoal = selectedGoal === "custom" ? customGoal : selectedGoal;

  // Invalidate previous results when switching modes so stale results are never shown
  const prevModeRef = useRef<OperationMode>(mode);
  useEffect(() => {
    if (prevModeRef.current !== mode) {
      prevModeRef.current = mode;
      reset();
      setValidationError(null);
    }
  }, [mode, reset]);

  // Preset 1: Austin Café (Solstice Craft Coffee Lab)
  const handleLoadAustinPreset = () => {
    setBusinessName("Solstice Craft Coffee Lab");
    setSelectedCategory("Specialty Coffee & Modern Café");
    setCustomCategory("");
    setCity("Austin, TX");
    setNeighborhood("East Austin (78702)");
    setSelectedGoal("Increase weekday midday footfall (11:00 AM – 3:00 PM) while upholding craft credibility");
    setCustomGoal("");
    setTargetDemographic("Creative freelancers, tech knowledge workers & designers");
    setVibeContext("Third-wave micro-roastery, vinyl patio, natural wine bar & communal work tables");
    setTypeFilter("all");
    setValidationError(null);
    reset();
  };

  // Preset 2: South Delhi Bistro (Kaffi Craft Roastery)
  const handleLoadDelhiPreset = () => {
    setBusinessName("Kaffi Craft Roastery & Kitchen");
    setSelectedCategory("Artisanal Bakery & Bistro");
    setCustomCategory("");
    setCity("South Delhi");
    setNeighborhood("Hauz Khas & Greater Kailash");
    setSelectedGoal("Increase average patron check size and dwell time through evening artisanal drops");
    setCustomGoal("");
    setTargetDemographic("Urban professionals & specialty culinary enthusiasts");
    setVibeContext("Artisanal sourdough bakery, specialty filter bar & intimate evening lighting");
    setTypeFilter("all");
    setValidationError(null);
    reset();
  };

  // Preset 3: Gurgaon Wellness (Prana Fitness & Matcha)
  const handleLoadGurgaonPreset = () => {
    setBusinessName("Prana Fitness & Matcha Hub");
    setSelectedCategory("Boutique Wellness & Matcha Bar");
    setCustomCategory("");
    setCity("Gurgaon");
    setNeighborhood("CyberHub & Golf Course Road");
    setSelectedGoal("Attract young creative professionals, knowledge workers, and neighborhood remote workers");
    setCustomGoal("");
    setTargetDemographic("Young corporate executives, fitness enthusiasts & remote founders");
    setVibeContext("Ceremonial grade matcha bar, clean energy snacks & recovery lounge");
    setTypeFilter("all");
    setValidationError(null);
    reset();
  };

  // Handle Form Submission
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);

    const cleanName = businessName.trim();
    const cleanCategory = effectiveCategory.trim();
    const cleanCity = city.trim();
    const cleanGoal = effectiveGoal.trim();

    if (!cleanName) {
      setValidationError("Business Name is required. Please provide the enterprise or concept name.");
      return;
    }

    if (!cleanCategory) {
      setValidationError("Business Category is required. Select or type a business category.");
      return;
    }

    if (!cleanCity) {
      setValidationError("City / Location is required. Specify the primary market.");
      return;
    }

    if (!cleanGoal) {
      setValidationError("Business Goal / Objective is required. Select or type an operational goal.");
      return;
    }

    const fullLocation = neighborhood.trim()
      ? `${neighborhood.trim()}, ${cleanCity}`
      : cleanCity;

    // Parse vibe keywords from comma-separated string if present
    const vibeKeywords = vibeContext
      .split(/[,;]+/)
      .map((k) => k.trim())
      .filter((k) => k.length > 0)
      .slice(0, 10);

    const profilePayload: BusinessProfileInput = {
      name: cleanName,
      location: fullLocation,
      category: cleanCategory,
      ...(vibeKeywords.length > 0 ? { vibeKeywords } : {})
    };

    const goalPayload: BusinessGoalInput = {
      objective: cleanGoal,
      ...(targetDemographic.trim() ? { targetDemographic: targetDemographic.trim() } : {})
    };

    await execute({
      mode,
      businessProfile: profilePayload,
      goal: goalPayload
    });
  };

  // Extract result item from envelope
  const result = data?.results?.[0];
  const isDemoResponse = Boolean(data?.metadata?.isDemo);

  // Extract ranked opportunities (supporting both demo format and live shortlist)
  const rankedItems: RankedOpportunityItem[] = useMemo(() => {
    if (!result) return [];
    if (Array.isArray(result.ranked_opportunities) && result.ranked_opportunities.length > 0) {
      return result.ranked_opportunities;
    }
    if (Array.isArray(result.rankedShortlist) && result.rankedShortlist.length > 0) {
      return result.rankedShortlist;
    }
    return [];
  }, [result]);

  // Filter ranked opportunities by initiative type
  const filteredItems = useMemo(() => {
    if (typeFilter === "all") return rankedItems;
    return rankedItems.filter((item) => {
      const itemType = (item.type || "").toLowerCase();
      return itemType === typeFilter.toLowerCase();
    });
  }, [rankedItems, typeFilter]);

  // Unique initiative types for filtering
  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    rankedItems.forEach((item) => {
      if (item.type) types.add(item.type);
    });
    return Array.from(types);
  }, [rankedItems]);

  // Check if error is authentication failure (missing QLOO_API_KEY)
  const isAuthError =
    (error instanceof ApiClientError && (error.code === "QLOO_AUTH" || error.statusCode === 401)) ||
    error?.message?.includes("QLOO_AUTH") ||
    error?.message?.includes("401");

  // Helper for effort badge styling
  const getEffortBadgeVariant = (effort?: string) => {
    switch (effort?.toLowerCase()) {
      case "low":
        return "success" as const;
      case "medium":
        return "warning" as const;
      case "high":
        return "danger" as const;
      default:
        return "neutral" as const;
    }
  };

  // Helper for type badge styling
  const getTypeBadgeColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case "programming":
        return "bg-[#8F9A82]/20 text-[#202E1D] border-[#8F9A82]/30";
      case "partnership":
        return "bg-purple-500/10 text-purple-300 border-purple-500/30";
      case "product":
        return "bg-emerald-100 text-emerald-300 border-emerald-300";
      case "atmosphere":
        return "bg-[#EDD88B]/30 text-[#202E1D] font-mono border-[#EDD88B]/60";
      default:
        return "bg-[#8F9A82]/15 text-[#202E1D]/85 border-[#202E1D]/15";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 text-[#202E1D]">
      {/* View Header */}
      <SectionHeader
        badge={
          <div className="flex items-center gap-2">
            <Badge variant="info" size="sm">
              Workflow Module 04
            </Badge>
            <Badge variant={mode === "demo" ? "warning" : isLiveAvailable ? "success" : "danger"} size="sm" dot>
              {mode === "demo" ? "Demo Fixtures" : isLiveAvailable ? "Live Qloo Connected" : "Live (Requires Key)"}
            </Badge>
          </div>
        }
        title="Recommendations & Ranking"
        description="Two-stage candidate discovery and contextual ranking of tactical business initiatives against your specific operational goal."
        action={
          <div className="flex items-center gap-1.5 bg-[#FCFBF7] border border-[#202E1D]/12 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setMode("demo")}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1.5",
                mode === "demo"
                  ? "bg-[#EDD88B] text-[#202E1D] border border-[#EDD88B]/60 shadow-xs"
                  : "text-[#202E1D]/70 hover:text-[#202E1D]"
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full", mode === "demo" ? "bg-amber-400" : "bg-zinc-500")} />
              Demo Mode
            </button>
            <button
              type="button"
              onClick={() => setMode("live")}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer flex items-center gap-1.5",
                mode === "live"
                  ? "bg-emerald-600 text-emerald-950 border border-emerald-300 shadow-xs"
                  : "text-[#202E1D]/70 hover:text-[#202E1D]"
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  mode === "live" ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"
                )}
              />
              Live Qloo Mode
            </button>
          </div>
        }
      />

      {/* Mode Clarity Banner */}
      <div
        className={cn(
          "rounded-xl border p-4 sm:p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left transition-colors",
          mode === "demo"
            ? "border-[#EDD88B]/60 bg-[#EDD88B]/20 text-[#202E1D]"
            : "border-emerald-200 bg-emerald-50 text-emerald-950"
        )}
      >
        <div className="flex items-start sm:items-center gap-3">
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 sm:mt-0",
              mode === "demo"
                ? "bg-[#EDD88B]/30 text-[#202E1D] border border-[#EDD88B]/60"
                : "bg-emerald-100 text-emerald-400 border border-emerald-200"
            )}
          >
            {mode === "demo" ? (
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                {mode === "demo" ? "Active: Curated Benchmark Fixtures" : "Active: Live Qloo MCP Engine"}
              </span>
              <Badge variant={mode === "demo" ? "warning" : "success"} size="sm">
                {mode === "demo" ? "Simulation" : "Authentic MCP Pipeline"}
              </Badge>
            </div>
            <p className="text-xs text-[#202E1D]/70 mt-0.5">
              {mode === "demo"
                ? "Generates curated operational opportunities with realistic implementation milestones and fit scores (e.g. Austin café weekday footfall pass, savoury lunch drops)."
                : "Executes a live two-stage Qloo pipeline: qloo_recommend (candidate discovery) followed by qloo_rank (contextual prioritization against goal). Requires QLOO_API_KEY."}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <span className="text-[11px] font-mono text-[#202E1D]/70">
            Pipeline: <code className="text-[#8F9A82] font-semibold">recommend &rarr; rank</code>
          </span>
        </div>
      </div>

      {/* Input Section & Profile Form */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle>Business Profile & Strategic Goal</CardTitle>
              <CardDescription>
                Configure your enterprise profile and define the operational challenge you wish to address.
              </CardDescription>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-[#202E1D]/70 font-medium mr-1">Presets:</span>
              <button
                type="button"
                onClick={handleLoadAustinPreset}
                className="text-xs px-2.5 py-1 rounded-md bg-[#8F9A82]/15 hover:bg-zinc-700 text-[#202E1D] border border-[#202E1D]/15 transition-colors cursor-pointer"
              >
                Austin Café (Footfall)
              </button>
              <button
                type="button"
                onClick={handleLoadDelhiPreset}
                className="text-xs px-2.5 py-1 rounded-md bg-[#8F9A82]/15 hover:bg-zinc-700 text-[#202E1D] border border-[#202E1D]/15 transition-colors cursor-pointer"
              >
                South Delhi Bistro
              </button>
              <button
                type="button"
                onClick={handleLoadGurgaonPreset}
                className="text-xs px-2.5 py-1 rounded-md bg-[#8F9A82]/15 hover:bg-zinc-700 text-[#202E1D] border border-[#202E1D]/15 transition-colors cursor-pointer"
              >
                Gurgaon Wellness
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Business Name (Required) */}
              <div className="space-y-1.5">
                <Input
                  label="Business Name * (Required)"
                  placeholder="e.g., Solstice Craft Coffee Lab"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  helperText="Name of your enterprise or retail concept"
                  required
                />
              </div>

              {/* Business Category (Required) */}
              <div className="space-y-1.5">
                <Select
                  label="Business Category * (Required)"
                  options={CATEGORY_OPTIONS}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  helperText="Primary industry and operational classification"
                />
                {selectedCategory === "custom" && (
                  <Input
                    label="Custom Category"
                    placeholder="e.g., Specialty Coffee & Modern Café Culture"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>

              {/* City / Primary Location (Required) */}
              <div className="space-y-1.5">
                <Input
                  label="City / Market * (Required)"
                  placeholder="e.g., Austin, TX or South Delhi"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  helperText="Metropolitan area or primary city market"
                  required
                />
              </div>

              {/* Neighborhood / Micro-location (Optional) */}
              <div className="space-y-1.5">
                <Input
                  label="Neighborhood / District (Optional)"
                  placeholder="e.g., East Austin (78702) or Hauz Khas"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  helperText="Specific neighborhood boundary for hyper-local calibration"
                />
              </div>

              {/* Business Goal / Strategic Objective (Required) */}
              <div className="space-y-1.5 md:col-span-2">
                <Select
                  label="Strategic Business Goal / Objective * (Required)"
                  options={GOAL_OPTIONS}
                  value={selectedGoal}
                  onChange={(e) => setSelectedGoal(e.target.value)}
                  helperText="The specific commercial or operational outcome you want to unlock"
                />
                {selectedGoal === "custom" && (
                  <Input
                    label="Custom Strategic Goal"
                    placeholder="e.g., Boost off-peak weekday revenue through curated lunch programming"
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>

              {/* Target Demographic / Patron Segment (Optional) */}
              <div className="space-y-1.5">
                <Input
                  label="Target Patron Segment (Optional)"
                  placeholder="e.g., Creative freelancers, remote workers & designers"
                  value={targetDemographic}
                  onChange={(e) => setTargetDemographic(e.target.value)}
                  helperText="Customer demographic targeted for the initiative"
                />
              </div>

              {/* Operational Context & Vibe Keywords (Optional) */}
              <div className="space-y-1.5">
                <Input
                  label="Atmosphere & Vibe Keywords (Optional)"
                  placeholder="e.g., Vinyl patio, third-wave roastery, natural wine"
                  value={vibeContext}
                  onChange={(e) => setVibeContext(e.target.value)}
                  helperText="Comma-separated cultural descriptors of your space"
                />
              </div>
            </div>

            {/* Validation Message */}
            {validationError && (
              <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Action Buttons Footer */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#202E1D]/10 mt-4">
              <div className="text-xs text-[#202E1D]/70">
                {mode === "demo" ? (
                  <span className="text-[#202E1D]/90 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Querying curated operational initiatives & fit scores
                  </span>
                ) : (
                  <span className="text-emerald-400/90 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Calling live Qloo MCP recommend & rank pipeline
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {data && (
                  <Button variant="outline" size="md" onClick={reset} type="button" disabled={loading}>
                    Clear Results
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  className="w-full sm:w-auto px-6 font-semibold"
                >
                  {loading
                    ? mode === "demo"
                      ? "Ranking Tactical Initiatives..."
                      : "Executing Qloo Recommend & Rank..."
                    : mode === "demo"
                      ? "Generate Ranked Initiatives"
                      : "Execute Live Ranking"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Dynamic Loading State */}
      {loading && (
        <LoadingState
          message={
            mode === "demo"
              ? `Evaluating candidate initiatives and scoring operational fit for '${businessName}'...`
              : `Executing live two-stage Qloo MCP pipeline (qloo_recommend &rarr; qloo_rank) for '${businessName}'...`
          }
        />
      )}

      {/* Dynamic Error & Auth Recovery States */}
      {error && !loading && (
        isAuthError ? (
          <div className="rounded-xl border border-[#EDD88B]/60 bg-[#EDD88B]/20 p-5 sm:p-6 text-left space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-[#EDD88B]/30 border border-[#EDD88B]/60 flex items-center justify-center text-[#202E1D] shrink-0 mt-0.5">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-[#202E1D]">
                    Authentication Required (QLOO_AUTH)
                  </h4>
                  <Badge variant="warning" size="sm">
                    HTTP 401
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-[#202E1D]/85 leading-relaxed">
                  Live Qloo recommendations require an event-issued API key. Configure <code className="text-[#202E1D] font-mono font-mono text-xs px-1.5 py-0.5 rounded bg-[#FCFBF7] border border-[#202E1D]/12">QLOO_API_KEY</code> in <code className="text-[#202E1D] font-mono font-mono text-xs px-1.5 py-0.5 rounded bg-[#FCFBF7] border border-[#202E1D]/12">server/.env</code>, or switch to Demo Mode to explore curated initiative fixtures.
                </p>
                {error instanceof ApiClientError && error.message && (
                  <p className="text-xs text-[#202E1D]/70 font-mono bg-[#FAF8F2] p-2.5 rounded border border-[#202E1D]/12">
                    Backend detail: {error.message}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#202E1D]/10">
              <span className="text-xs text-[#202E1D]/70">
                Switch back to Demo Mode to test full tactical ranking functionality with benchmark data.
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void handleSubmit()}
                  type="button"
                >
                  Retry Live Query
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setMode("demo")}
                  type="button"
                >
                  Switch to Demo Mode
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <ErrorState
            title={error instanceof ApiClientError && error.code ? `Error (${error.code})` : "Recommendation Query Failed"}
            message={error.message}
            code={error instanceof ApiClientError ? error.code : undefined}
            recovery={
              error instanceof ApiClientError && error.recovery
                ? error.recovery
                : "Check your profile parameters and ensure the backend service is running on port 4000."
            }
            onRetry={() => void handleSubmit()}
          />
        )
      )}

      {/* Empty State Prompt */}
      {!data && !loading && !error && (
        <EmptyState
          title="No Initiatives Generated Yet"
          description="Select a business preset above or enter your enterprise details and strategic goal, then click 'Generate Ranked Initiatives' to explore prioritized tactical concepts."
          action={
            <Button variant="primary" size="md" onClick={() => void handleSubmit()}>
              Generate Demo Initiatives for {businessName}
            </Button>
          }
        />
      )}

      {/* Results Dashboard */}
      {data && !loading && (
        <div className="space-y-6">
          {/* Strategy Overview Card */}
          <Card className="border-[#8F9A82]/20 bg-gradient-to-br from-zinc-900/90 via-zinc-900/50 to-zinc-950">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={isDemoResponse ? "warning" : "success"} size="sm">
                      {isDemoResponse ? "Demo Benchmark Results" : "Live Qloo MCP Results"}
                    </Badge>
                    <span className="text-xs font-mono text-[#202E1D]/70">
                      {result?.business_name || result?.businessName || businessName}
                    </span>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl pt-1">
                    Tactical Strategy & Opportunity Ranking
                  </CardTitle>
                  <CardDescription className="text-[#202E1D]/85">
                    Prioritized operational initiatives tailored for <strong className="text-[#202E1D]">{city}</strong> to achieve: &ldquo;{result?.strategic_goal || result?.goalObjective || effectiveGoal}&rdquo;
                  </CardDescription>
                </div>

                <div className="shrink-0 flex items-center gap-2 bg-[#FAF8F2] p-2.5 rounded-xl border border-[#202E1D]/12">
                  <div className="text-center px-3 border-r border-[#202E1D]/12">
                    <div className="text-lg font-bold text-[#8F9A82] font-semibold font-mono">
                      {rankedItems.length}
                    </div>
                    <div className="text-[10px] text-[#202E1D]/70 uppercase tracking-wider">Ranked Options</div>
                  </div>
                  <div className="text-center px-3">
                    <div className="text-lg font-bold text-emerald-400 font-mono">
                      {rankedItems.filter((i) => i.operational_effort?.toLowerCase() === "low").length || "—"}
                    </div>
                    <div className="text-[10px] text-[#202E1D]/70 uppercase tracking-wider">Low Effort</div>
                  </div>
                </div>
              </div>
            </CardHeader>

            {/* Strategic Rationale / Projected Impact Callout */}
            {(result?.projected_impact_summary || result?.strategyRationale) && (
              <CardContent className="pt-0">
                <div className="rounded-xl border border-[#8F9A82]/30 bg-[#8F9A82]/20/15 p-4 sm:p-4.5 space-y-1.5 text-left">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#8F9A82] font-semibold shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6z" />
                    </svg>
                    <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">
                      {isDemoResponse ? "Projected Operational Impact Summary" : "Live Strategy Rationale"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#202E1D]/85 leading-relaxed pl-6">
                    {result.projected_impact_summary || result.strategyRationale}
                  </p>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Filtering & Ranking Controls */}
          {availableTypes.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#FCFBF7] border border-[#202E1D]/12">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#202E1D]/70 font-medium">Filter by Type:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTypeFilter("all")}
                    className={cn(
                      "px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer",
                      typeFilter === "all"
                        ? "bg-indigo-600 text-white font-medium"
                        : "bg-[#8F9A82]/15 text-[#202E1D]/70 hover:text-[#202E1D]"
                    )}
                  >
                    All ({rankedItems.length})
                  </button>
                  {availableTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTypeFilter(type)}
                      className={cn(
                        "px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer",
                        typeFilter.toLowerCase() === type.toLowerCase()
                          ? "bg-indigo-600 text-white font-medium"
                          : "bg-[#8F9A82]/15 text-[#202E1D]/70 hover:text-[#202E1D]"
                      )}
                    >
                      {type} ({rankedItems.filter((i) => i.type?.toLowerCase() === type.toLowerCase()).length})
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-xs text-[#202E1D]/70">
                Sorted by <span className="text-[#202E1D]/85 font-mono">Qloo Relative Affinity Rank &darr;</span>
              </div>
            </div>
          )}

          {/* Ranked Opportunities List */}
          <div className="space-y-4">
            {filteredItems.map((item, index) => {
              const displayRank = item.rank || index + 1;
              const displayTitle = item.title || item.option || `Tactical Opportunity #${displayRank}`;
              const score = item.illustrative_fit_score ?? (typeof item.score === "number" ? Math.round(item.score * 100) : undefined);
              const scoreLabel = item.illustrative_fit_score !== undefined
                ? "Illustrative Fit Score"
                : "Qloo Affinity Score";

              return (
                <Card
                  key={item.id || `opportunity-${displayRank}`}
                  className={cn(
                    "transition-all border-[#202E1D]/12 bg-[#FCFBF7] hover:border-[#202E1D]/15",
                    displayRank === 1 && "border-indigo-500/40 bg-[#FCFBF7] ring-1 ring-indigo-500/20"
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {/* Rank Badge */}
                        <div
                          className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0",
                            displayRank === 1
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                              : displayRank === 2
                              ? "bg-[#8F9A82]/15 text-[#202E1D] border border-[#202E1D]/15"
                              : "bg-zinc-850 text-[#202E1D]/70 border border-[#202E1D]/12"
                          )}
                        >
                          #{displayRank}
                        </div>

                        {/* Title and Tags */}
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            {displayRank === 1 && (
                              <Badge variant="info" size="sm">
                                Top Ranked Initiative
                              </Badge>
                            )}
                            {item.type && (
                              <span
                                className={cn(
                                  "text-[11px] font-medium px-2 py-0.5 rounded-full border",
                                  getTypeBadgeColor(item.type)
                                )}
                              >
                                {item.type}
                              </span>
                            )}
                            {item.operational_effort && (
                              <Badge variant={getEffortBadgeVariant(item.operational_effort)} size="sm">
                                {item.operational_effort} Effort
                              </Badge>
                            )}
                          </div>

                          <h3 className="text-base sm:text-lg font-bold text-[#202E1D]">
                            {displayTitle}
                          </h3>
                        </div>
                      </div>

                      {/* Score Indicator */}
                      {score !== undefined && (
                        <div className="shrink-0 flex items-center gap-3 bg-[#FAF8F2] p-2.5 rounded-xl border border-[#202E1D]/12 sm:self-start">
                          <div className="text-right">
                            <div className="text-xs font-mono text-[#202E1D]/70">{scoreLabel}</div>
                            <div className="text-base font-bold font-mono text-[#8F9A82] font-semibold">
                              {score}
                              <span className="text-xs text-[#8F9A82] font-normal">/100</span>
                            </div>
                          </div>
                          {/* Mini Progress Bar */}
                          <div className="w-16 h-2 bg-[#8F9A82]/15 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full"
                              style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-1">
                    {/* Target Segment Callout */}
                    {item.target_segment && (
                      <div className="flex items-center gap-2 text-xs text-[#202E1D]/70 bg-white/80 px-3 py-1.5 rounded-lg border border-[#202E1D]/10">
                        <span className="text-[#8F9A82] font-medium">Target Patron Segment:</span>
                        <span className="text-[#202E1D] font-medium">{item.target_segment}</span>
                      </div>
                    )}

                    {/* Strategic Rationale */}
                    {item.strategic_rationale && (
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-[#202E1D]/70 uppercase tracking-wider">
                          Strategic Rationale
                        </span>
                        <p className="text-xs sm:text-sm text-[#202E1D]/85 leading-relaxed">
                          {item.strategic_rationale}
                        </p>
                      </div>
                    )}

                    {/* Implementation Milestones */}
                    {Array.isArray(item.implementation_milestones) && item.implementation_milestones.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-[#202E1D]/10">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#202E1D]/70 uppercase tracking-wider">
                            Actionable Implementation Milestones
                          </span>
                          <span className="text-[11px] font-mono text-[#8F9A82]">
                            {item.implementation_milestones.length} operational steps
                          </span>
                        </div>
                        <ol className="space-y-2 text-xs text-[#202E1D]/85">
                          {item.implementation_milestones.map((milestone, mIdx) => (
                            <li
                              key={`milestone-${mIdx}`}
                              className="flex items-start gap-2.5 p-2 rounded-lg bg-white/80 border border-[#202E1D]/12/50"
                            >
                              <span className="w-5 h-5 rounded-full bg-[#8F9A82]/15 text-[#202E1D] flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                                {mIdx + 1}
                              </span>
                              <span className="leading-relaxed flex-1">{milestone}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Live Stage 1 Candidate Pool Disclosure (when available) */}
          {Array.isArray(result?.candidateOptionsDiscovered) && result.candidateOptionsDiscovered.length > 0 && (
            <Card className="border-[#202E1D]/12 bg-[#FCFBF7]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="neutral" size="sm">
                    Stage 1 Pipeline Output
                  </Badge>
                  <span className="text-[11px] font-mono text-[#8F9A82] font-semibold">qloo_recommend</span>
                </div>
                <CardTitle className="text-base pt-1">
                  Candidate Discovery Pool ({result.candidateOptionsDiscovered.length} options evaluated)
                </CardTitle>
                <CardDescription>
                  Raw candidates discovered during Stage 1 prior to Stage 2 contextual ranking against your goal profile.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.candidateOptionsDiscovered.map((opt, idx) => (
                    <span
                      key={`candidate-${idx}`}
                      className="px-2.5 py-1 text-xs rounded-lg bg-white border border-[#202E1D]/12 text-[#202E1D]/85 font-mono"
                    >
                      {opt}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Two-Stage MCP Pipeline Provenance Strip */}
          <div className="rounded-xl border border-[#202E1D]/12 bg-[#FCFBF7] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#202E1D]">
                  Tool Chaining Provenance
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#8F9A82]/15 text-[#202E1D]">
                  qloo_recommend &rarr; qloo_rank
                </span>
              </div>
              <p className="text-xs text-[#202E1D]/70">
                {isDemoResponse
                  ? "Demonstration mode uses curated benchmark fixtures. Ranking scores illustrate algorithmic prioritization."
                  : "Live Mode executes two-stage MCP orchestration: candidate generation via taste vectors followed by multi-attribute scoring."}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span className="text-xs font-mono text-[#8F9A82]">
                {data.metadata?.timestamp
                  ? new Date(data.metadata.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : "Live"}
              </span>
              <Badge variant={isDemoResponse ? "warning" : "success"} size="sm">
                {isDemoResponse ? "Curated Fixture" : "Live Qloo MCP"}
              </Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
