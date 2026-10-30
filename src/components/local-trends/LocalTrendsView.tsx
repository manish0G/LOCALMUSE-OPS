"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLocalTrends } from "@/hooks/useLocalTrends";
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
  TrendTimelinePoint,
  EmergingCulturalShift,
  NeighborhoodHeatmapItem
} from "@/types";

const CATEGORY_OPTIONS = [
  { value: "Food & Dining", label: "Food & Dining (Culinary, Specialty Coffee, Bistro)" },
  { value: "Music", label: "Music & Performing Arts (Live Venues, Vinyl, Indie)" },
  { value: "Fashion", label: "Fashion & Apparel (Sustainable Activewear, Boutiques)" },
  { value: "Entertainment", label: "Entertainment & Cinema (Screenings, Cultural Events)" },
  { value: "Lifestyle", label: "Lifestyle & Wellness (Fitness, Co-Working, Green Living)" },
  { value: "All Categories", label: "All Categories & Cultural Lifestyle" },
  { value: "custom", label: "Custom Concept / Category..." }
];

export interface LocalTrendsViewProps {
  initialMode?: OperationMode;
}

export function LocalTrendsView({ initialMode }: LocalTrendsViewProps) {
  const { mode, setMode } = useOperationMode(initialMode ?? "demo");
  const [city, setCity] = useState<string>("Austin, TX");
  const [neighborhood, setNeighborhood] = useState<string>("East Austin");
  const [selectedCategory, setSelectedCategory] = useState<string>("Food & Dining");
  const [customCategory, setCustomCategory] = useState<string>("");
  const [businessContext, setBusinessContext] = useState<string>("Specialty coffee roastery, natural wine bar & vinyl patio");
  const [startDate, setStartDate] = useState<string>("2025-01-01");
  const [endDate, setEndDate] = useState<string>("2026-06-30");
  const [validationError, setValidationError] = useState<string | null>(null);

  const { data, loading, error, execute, reset } = useLocalTrends();
  const { isLiveAvailable } = useBackendHealth({ autoFetch: true });

  const effectiveCategory = selectedCategory === "custom" ? customCategory : selectedCategory;

  // Invalidate previous results when switching modes so stale results are never shown
  const prevModeRef = useRef<OperationMode>(mode);
  useEffect(() => {
    if (prevModeRef.current !== mode) {
      prevModeRef.current = mode;
      reset();
      setValidationError(null);
    }
  }, [mode, reset]);

  // Preset 1: South Delhi — Food & Dining
  const handleLoadDelhiPreset = () => {
    setCity("South Delhi");
    setNeighborhood("Hauz Khas & Greater Kailash");
    setSelectedCategory("Food & Dining");
    setCustomCategory("");
    setBusinessContext("Artisanal craft bistro, specialty roastery & culinary provisions");
    setStartDate("2025-01-01");
    setEndDate("2026-06-30");
    setValidationError(null);
    reset();
  };

  // Preset 2: Gurgaon — Lifestyle
  const handleLoadGurgaonPreset = () => {
    setCity("Gurgaon");
    setNeighborhood("CyberHub & Golf Course Road");
    setSelectedCategory("Lifestyle");
    setCustomCategory("");
    setBusinessContext("Boutique wellness, activewear retail, and co-working spaces");
    setStartDate("2025-01-01");
    setEndDate("2026-06-30");
    setValidationError(null);
    reset();
  };

  // Preset 3: Austin — Music
  const handleLoadAustinMusicPreset = () => {
    setCity("Austin, TX");
    setNeighborhood("East Austin (78702)");
    setSelectedCategory("Music");
    setCustomCategory("");
    setBusinessContext("Live performance lounge, vinyl listening bar & craft patio");
    setStartDate("2025-01-01");
    setEndDate("2026-06-30");
    setValidationError(null);
    reset();
  };

  // Preset 4: Austin — Coffee & Café Culture
  const handleLoadAustinCoffeePreset = () => {
    setCity("Austin, TX");
    setNeighborhood("East Austin");
    setSelectedCategory("custom");
    setCustomCategory("Specialty Coffee & Modern Café Culture");
    setBusinessContext("Third-wave micro-roastery & cold-brew innovation bar");
    setStartDate("2025-01-01");
    setEndDate("2026-06-30");
    setValidationError(null);
    reset();
  };

  // Handle Form Submission
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);

    const cleanCity = city.trim();
    const cleanCategory = effectiveCategory.trim();
    const cleanStart = startDate.trim();
    const cleanEnd = endDate.trim();

    if (!cleanCity) {
      setValidationError("City / Market is required. Please specify a geographic location (e.g., South Delhi or Austin, TX).");
      return;
    }

    if (!cleanCategory) {
      setValidationError("Trend Category is required. Please select or enter a cultural category.");
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(cleanStart)) {
      setValidationError("Start Date must be in YYYY-MM-DD format (e.g., 2025-01-01).");
      return;
    }

    if (!dateRegex.test(cleanEnd)) {
      setValidationError("End Date must be in YYYY-MM-DD format (e.g., 2026-06-30).");
      return;
    }

    const fullLocation = neighborhood.trim()
      ? `${neighborhood.trim()}, ${cleanCity}`
      : cleanCity;

    await execute({
      mode,
      location: fullLocation,
      category: cleanCategory,
      startDate: cleanStart,
      endDate: cleanEnd
    });
  };

  // Extract result item from envelope
  const result = data?.results?.[0];
  const isDemoResponse = Boolean(data?.metadata?.isDemo);

  // Timeline points
  const timeline: TrendTimelinePoint[] = (result?.historical_timeline || []) as TrendTimelinePoint[];

  // Emerging cultural shifts
  const shifts: EmergingCulturalShift[] = (result?.emerging_cultural_shifts || []) as EmergingCulturalShift[];

  // Neighborhood heatmaps
  const heatmaps: NeighborhoodHeatmapItem[] = (result?.neighborhood_heatmaps || []) as NeighborhoodHeatmapItem[];

  // Check if error is authentication failure (missing QLOO_API_KEY)
  const isAuthError =
    (error instanceof ApiClientError && (error.code === "QLOO_AUTH" || error.statusCode === 401)) ||
    error?.message?.includes("QLOO_AUTH") ||
    error?.message?.includes("401");

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 text-[#202E1D]">
      {/* View Header */}
      <SectionHeader
        badge={
          <div className="flex items-center gap-2">
            <Badge variant="info" size="sm">
              Workflow Module 03
            </Badge>
            <Badge variant={mode === "demo" ? "warning" : isLiveAvailable ? "success" : "danger"} size="sm" dot>
              {mode === "demo" ? "Demo Fixtures" : isLiveAvailable ? "Live Qloo Connected" : "Live (Requires Key)"}
            </Badge>
          </div>
        }
        title="Local Trends & Momentum"
        description="Track multi-quarter cultural momentum curves, emerging consumer shifts, and neighborhood-level affinity density."
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
              <span className="text-xs font-semibold uppercase tracking-wider">
                {mode === "demo" ? "Demo Mode Active" : "Live Qloo Mode Active"}
              </span>
              <Badge variant={mode === "demo" ? "warning" : isLiveAvailable ? "success" : "danger"} size="sm">
                {mode === "demo" ? "Curated Trend Datasets" : isLiveAvailable ? "Qloo Connected" : "Requires Key"}
              </Badge>
            </div>
            <p className="text-xs text-[#202E1D]/70 mt-0.5">
              {mode === "demo"
                ? "Uses curated benchmark trend datasets (Austin café culture, South Delhi dining, Gurgaon lifestyle). Does not require an API key."
                : "Executes live Qloo MCP pipeline (qloo_recommend entity discovery, qloo_trends time-series). Requires QLOO_API_KEY."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMode(mode === "demo" ? "live" : "demo")}
            className="text-xs text-[#202E1D]/85 hover:text-[#202E1D]"
            type="button"
          >
            Switch to {mode === "demo" ? "Live Qloo Mode" : "Demo Mode"}
          </Button>
        </div>
      </div>

      {/* Input Parameters Form Card */}
      <Card className="border-[#202E1D]/12 bg-[#FCFBF7] text-left">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <CardTitle>Local Trend Parameters</CardTitle>
              <CardDescription className="mt-1">
                Configure your geographic market, cultural industry domain, and date range to query momentum curves and emerging local shifts.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              <Button variant="ghost" size="sm" onClick={handleLoadDelhiPreset} type="button" className="text-xs">
                South Delhi Dining
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLoadGurgaonPreset} type="button" className="text-xs">
                Gurgaon Lifestyle
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLoadAustinMusicPreset} type="button" className="text-xs">
                Austin Music
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLoadAustinCoffeePreset} type="button" className="text-xs">
                Austin Coffee
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* City / Primary Market (Required) */}
              <div className="space-y-1.5">
                <Input
                  label="City / Market * (Required)"
                  placeholder="e.g., South Delhi or Austin, TX"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  helperText="Primary metropolitan or municipal boundary"
                />
              </div>

              {/* Trend Category (Required) */}
              <div className="space-y-1.5">
                <Select
                  label="Trend Category * (Required)"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  options={CATEGORY_OPTIONS}
                  helperText="Cultural domain to track momentum and shifts across"
                />
                {selectedCategory === "custom" && (
                  <Input
                    placeholder="e.g., Specialty Coffee & Modern Café Culture"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>

              {/* Neighborhood / Micro-location (Optional) */}
              <div className="space-y-1.5">
                <Input
                  label="Neighborhood / Micro-district (Optional)"
                  placeholder="e.g., East Austin (78702) or Hauz Khas"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  helperText="Optional neighborhood boundary to focus density heatmaps"
                />
              </div>

              {/* Business Description / Operational Profile (Optional) */}
              <div className="space-y-1.5">
                <Input
                  label="Business Concept / Operational Profile (Optional)"
                  placeholder="e.g., Third-wave roastery with vinyl patio"
                  value={businessContext}
                  onChange={(e) => setBusinessContext(e.target.value)}
                  helperText="Context used to frame operational interpretations"
                />
              </div>

              {/* Start Date (Required by backend API) */}
              <div className="space-y-1.5">
                <Input
                  label="Start Date (YYYY-MM-DD) * (Required)"
                  placeholder="2025-01-01"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  helperText="Beginning of the 6-quarter time-series evaluation window"
                />
              </div>

              {/* End Date (Required by backend API) */}
              <div className="space-y-1.5">
                <Input
                  label="End Date (YYYY-MM-DD) * (Required)"
                  placeholder="2026-06-30"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  helperText="Conclusion of the trend evaluation range"
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
                    Querying curated local trend benchmark fixtures
                  </span>
                ) : (
                  <span className="text-emerald-400/90 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Calling live Qloo MCP trends pipeline (requires QLOO_API_KEY)
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
                      ? "Evaluating Trend Momentum..."
                      : "Querying Live Qloo Engine..."
                    : mode === "demo"
                      ? "Discover Demo Trends"
                      : "Discover Live Trends"}
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
              ? `Evaluating curated trend momentum curves for '${effectiveCategory}' in '${city}'...`
              : `Executing live Qloo MCP trends pipeline for '${effectiveCategory}' in '${city}'...`
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
                  Live Qloo queries require an event-issued API key. Configure <code className="text-[#202E1D] font-mono font-mono text-xs px-1.5 py-0.5 rounded bg-[#FCFBF7] border border-[#202E1D]/12">QLOO_API_KEY</code> in <code className="text-[#202E1D] font-mono font-mono text-xs px-1.5 py-0.5 rounded bg-[#FCFBF7] border border-[#202E1D]/12">server/.env</code>, or switch to Demo Mode to explore curated trend fixtures.
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
                Switch back to Demo Mode to test full trend analysis functionality with benchmark data.
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
            title={error instanceof ApiClientError && error.code ? `Error (${error.code})` : "Trend Query Failed"}
            message={error.message}
            code={error instanceof ApiClientError ? error.code : undefined}
            recovery={
              error instanceof ApiClientError && error.recovery
                ? error.recovery
                : mode === "live"
                ? "Ensure QLOO_API_KEY is configured in server/.env, or switch to Demo Mode to view curated sample data."
                : "Check input arguments and retry."
            }
            onRetry={() => void handleSubmit()}
          />
        )
      )}

      {/* Results Dashboard */}
      {data && !loading && !error && result && (
        <div className="space-y-6">
          {/* Explicit Demo Disclaimer Banner */}
          {isDemoResponse && (
            <div className="rounded-xl border border-[#EDD88B]/60 bg-[#EDD88B]/30 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-[#202E1D] text-left">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span className="font-medium">
                  Curated Demo Mode: Showing illustrative results for product evaluation. Not official live Qloo API data.
                </span>
              </div>
              <Badge variant="warning" size="sm">
                Curated Fixture
              </Badge>
            </div>
          )}

          {/* Section 1: Trend Overview Card */}
          <Card className="border-[#202E1D]/12 bg-[#FCFBF7] text-left">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#202E1D]/70 uppercase tracking-wider">
                      Cultural Momentum Analysis
                    </span>
                    {isDemoResponse ? (
                      <Badge variant="warning" size="sm">
                        Curated Trend Dataset
                      </Badge>
                    ) : (
                      <Badge variant="success" size="sm">
                        Live Qloo MCP Data
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="font-serif text-lg sm:text-xl font-normal">
                    {result.location || city} &bull; {result.category || effectiveCategory}
                  </CardTitle>
                </div>
                <div className="text-right text-xs text-[#202E1D]/70 font-mono">
                  Range: <span className="text-[#202E1D] font-semibold">{startDate} &rarr; {endDate}</span>
                </div>
              </div>
              <CardDescription className="pt-2 text-sm text-[#202E1D]/85 leading-relaxed">
                {data.summary}
              </CardDescription>
            </CardHeader>
            {data.metadata?.disclosure && (
              <div className="px-5 pb-4 text-[11px] text-[#202E1D]/80 font-medium">
                Disclosure: {data.metadata.disclosure}
              </div>
            )}
          </Card>

          {/* Section 2: Historical Timeline & Momentum Curves (Data from API) */}
          {timeline.length > 0 && (
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#202E1D] uppercase tracking-wider flex items-center gap-2">
                  <span>Multi-Quarter Momentum Timeline</span>
                  <Badge variant="info" size="sm">{timeline.length} Quarters</Badge>
                </h3>
                <span className="text-[11px] font-mono text-[#202E1D]/70">
                  Metric: Relative Cultural Index (0–100)
                </span>
              </div>

              <Card className="border-[#202E1D]/12 bg-[#FCFBF7] p-4 sm:p-5">
                <div className="space-y-3.5">
                  {timeline.map((point, idx) => {
                    const score = point.illustrative_momentum_index ?? point.momentum_index ?? 0;
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold text-[#202E1D]">{point.period}</span>
                            {point.sample_volume_indicator && (
                              <span className="text-[11px] text-[#202E1D]/70 truncate hidden sm:inline">
                                &bull; {point.sample_volume_indicator}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-emerald-400">{score}/100</span>
                          </div>
                        </div>

                        {/* Relative Momentum Visual Bar */}
                        <div className="h-2 w-full rounded-full bg-[#8F9A82]/15 overflow-hidden flex">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              score >= 90
                                ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                                : score >= 75
                                ? "bg-gradient-to-r from-teal-500 to-cyan-400"
                                : "bg-gradient-to-r from-cyan-600 to-indigo-500"
                            )}
                            style={{ width: `${Math.min(Math.max(score, 5), 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}

          {/* Section 3: Emerging Cultural Shifts & Pioneering Spots */}
          {shifts.length > 0 && (
            <div className="space-y-3 text-left">
              <h3 className="text-sm font-semibold text-[#202E1D] uppercase tracking-wider flex items-center gap-2">
                <span>Emerging Cultural Shifts & Pioneering Formats</span>
                <Badge variant="success" size="sm">{shifts.length} Shifts Identified</Badge>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shifts.map((shift, idx) => (
                  <Card key={idx} className="border-[#202E1D]/12 bg-[#FCFBF7] text-left flex flex-col justify-between">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm font-semibold text-[#202E1D]">
                          {shift.shift_name}
                        </CardTitle>
                        {shift.momentum_growth && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 shrink-0 font-bold">
                            {shift.momentum_growth}
                          </span>
                        )}
                      </div>
                      <CardDescription className="pt-1.5 text-xs text-[#202E1D]/85 leading-relaxed">
                        {shift.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-2">
                      {Array.isArray(shift.pioneering_local_spots) && shift.pioneering_local_spots.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-[#202E1D]/70 uppercase tracking-wider">
                            Pioneering Local Anchors
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {shift.pioneering_local_spots.map((spot, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2 py-0.5 rounded text-[11px] bg-[#FAF8F2] text-[#202E1D]/85 border border-[#202E1D]/12"
                              >
                                {spot}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Operational Implication Interpretation Callout */}
                      <div className="p-2.5 rounded-lg bg-white/50 border border-[#202E1D]/10 text-[11px] text-[#202E1D]/70 leading-relaxed">
                        <span className="font-semibold text-[#202E1D]/85">Operational Implication: </span>
                        Consider introducing seasonal offerings, cross-category collaborations, or evening formats aligned with this shift to capture early-adopter patronage before local saturation.
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Neighborhood Affinity Density Heatmaps */}
          {heatmaps.length > 0 && (
            <div className="space-y-3 text-left">
              <h3 className="text-sm font-semibold text-[#202E1D] uppercase tracking-wider flex items-center gap-2">
                <span>Neighborhood Affinity Density</span>
                <Badge variant="neutral" size="sm">{heatmaps.length} Clusters</Badge>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {heatmaps.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[#202E1D]/12 bg-[#FCFBF7] text-left space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-[#202E1D] truncate">
                          {item.neighborhood}
                        </span>
                        <Badge
                          variant={
                            item.affinity_density === "Peak"
                              ? "success"
                              : item.affinity_density === "High"
                              ? "info"
                              : "warning"
                          }
                          size="sm"
                        >
                          {item.affinity_density} Density
                        </Badge>
                      </div>
                      {item.primary_patron_profile && (
                        <p className="text-xs text-[#202E1D]/70 mt-2 leading-relaxed">
                          {item.primary_patron_profile}
                        </p>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-[#8F9A82] pt-1 border-t border-[#202E1D]/12/50">
                      Geographic Micro-Cluster
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Seed Entities Discovered by Qloo (if present in Live MCP mode) */}
          {Array.isArray(result.seedEntities) && result.seedEntities.length > 0 && (
            <Card className="border-[#202E1D]/12 bg-[#FCFBF7] text-left">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-[#202E1D]">Live Qloo Seed Entities</CardTitle>
                  <Badge variant="success" size="sm">{result.seedEntities.length} seeds</Badge>
                </div>
                <CardDescription>
                  Local candidate entities discovered via Qloo recommend tool to seed time-series trend extraction.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.seedEntities.map((entity, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs bg-[#8F9A82]/15 text-[#202E1D] border border-[#202E1D]/15 font-mono"
                    >
                      {entity.name || entity.id || `Entity ${idx + 1}`}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 6: Evidence, Provenance & Workflow Trace Strip */}
          <div className="p-4 rounded-xl border border-[#202E1D]/10 bg-[#FAF8F2] text-xs text-[#202E1D]/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
            <div className="space-y-0.5">
              <span className="text-[#202E1D]/85 font-medium">Qloo Tool Chaining Trace:</span>
              <p className="text-[11px] font-mono text-[#202E1D]/70">
                qloo_recommend (seed entities) &rarr; qloo_trends (time-series metrics)
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="font-mono text-[#202E1D]/70">
                Source: {data.metadata?.source || "qloo_mcp"}
              </span>
              <a
                href="https://docs.qloo.com"
                target="_blank"
                rel="noreferrer"
                className="text-[#8F9A82] font-semibold hover:text-[#202E1D] underline font-medium"
              >
                Qloo Docs Reference &rarr;
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Initial Empty State (When no trend query has been run yet) */}
      {!data && !loading && !error && (
        <EmptyState
          title="Ready to Track Local Cultural Trends"
          description="Select a geographic market, cultural industry category, and evaluation window above, then click 'Discover Trends' to evaluate momentum curves, emerging consumer shifts, and neighborhood density heatmaps."
          action={
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button variant="secondary" size="sm" onClick={handleLoadDelhiPreset}>
                Load South Delhi Dining
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLoadGurgaonPreset}>
                Load Gurgaon Lifestyle
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLoadAustinMusicPreset}>
                Load Austin Music
              </Button>
            </div>
          }
        />
      )}
    </div>
  );
}
