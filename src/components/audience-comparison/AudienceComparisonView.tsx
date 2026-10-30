"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCompareAudiences } from "@/hooks/useCompareAudiences";
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
import type { OperationMode, SharedAffinityItem, DifferentiatingTraitItem } from "@/types";

const CATEGORY_OPTIONS = [
  { value: "brand", label: "Brand & Lifestyle Retail (brand)" },
  { value: "place", label: "Hospitality & Venue Concepts (place)" },
  { value: "artist", label: "Music & Performing Arts (artist)" },
  { value: "movie", label: "Film & Entertainment (movie)" },
  { value: "book", label: "Literature & Editorial (book)" }
];

export interface AudienceComparisonViewProps {
  initialMode?: OperationMode;
}

export function AudienceComparisonView({ initialMode }: AudienceComparisonViewProps) {
  const { mode, setMode } = useOperationMode(initialMode ?? "demo");
  const [locationA, setLocationA] = useState<string>("South Delhi");
  const [locationB, setLocationB] = useState<string>("Gurgaon");
  const [targetCategory, setTargetCategory] = useState<string>("brand");
  const [businessContext, setBusinessContext] = useState<string>("Specialty Coffee & Roastery");
  const [validationError, setValidationError] = useState<string | null>(null);

  const { data, loading, error, execute, reset } = useCompareAudiences();
  const { isLiveAvailable } = useBackendHealth({ autoFetch: true });

  // Invalidate previous results when switching modes so stale results are never shown
  const prevModeRef = useRef<OperationMode>(mode);
  useEffect(() => {
    if (prevModeRef.current !== mode) {
      prevModeRef.current = mode;
      reset();
      setValidationError(null);
    }
  }, [mode, reset]);

  // Preset 1: South Delhi vs Gurgaon
  const handleLoadDelhiGurgaonPreset = () => {
    setLocationA("South Delhi");
    setLocationB("Gurgaon");
    setBusinessContext("Specialty Coffee & Roastery");
    setTargetCategory("brand");
    setValidationError(null);
    reset();
  };

  // Preset 2: Austin vs Nashville
  const handleLoadAustinNashvillePreset = () => {
    setLocationA("Austin, TX");
    setLocationB("Nashville, TN");
    setBusinessContext("Specialty Coffee & Roastery");
    setTargetCategory("brand");
    setValidationError(null);
    reset();
  };

  // Swap Locations A and B
  const handleSwapLocations = () => {
    const temp = locationA;
    setLocationA(locationB);
    setLocationB(temp);
    reset();
    setValidationError(null);
  };

  // Handle Form Submission
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);

    const cleanA = locationA.trim();
    const cleanB = locationB.trim();

    if (!cleanA) {
      setValidationError("Location A is required. Please specify the first market (e.g., South Delhi).");
      return;
    }

    if (!cleanB) {
      setValidationError("Location B is required. Please specify the second market (e.g., Gurgaon).");
      return;
    }

    if (cleanA.toLowerCase() === cleanB.toLowerCase()) {
      setValidationError("Location A and Location B must be distinct geographic markets to compare cultural divergence.");
      return;
    }

    await execute({
      mode,
      locationA: cleanA,
      locationB: cleanB,
      targetCategory: targetCategory as "brand" | "place" | "artist" | "movie" | "book"
    });
  };

  // Extract result item from envelope
  const result = data?.results?.[0];
  const isDemoResponse = Boolean(data?.metadata?.isDemo);

  // Resolved Market Names
  const marketAName = result?.market_a?.name || result?.marketA?.name || locationA;
  const marketBName = result?.market_b?.name || result?.marketB?.name || locationB;

  // Shared Affinities
  const sharedAffinities: SharedAffinityItem[] = result?.shared_affinities || [];

  // Differentiating Traits
  const marketAExclusive: DifferentiatingTraitItem[] = result?.differentiating_affinities?.market_a_exclusive || [];
  const marketBExclusive: DifferentiatingTraitItem[] = result?.differentiating_affinities?.market_b_exclusive || [];

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
              Workflow Module 02
            </Badge>
            <Badge variant={mode === "demo" ? "warning" : isLiveAvailable ? "success" : "danger"} size="sm" dot>
              {mode === "demo" ? "Demo Fixtures" : isLiveAvailable ? "Live Qloo Connected" : "Live (Requires Key)"}
            </Badge>
          </div>
        }
        title="Audience Comparison"
        description="Contrast cultural audience characteristics, shared consumer affinities, and distinguishing lifestyle traits between two local markets."
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
                {mode === "demo" ? "Curated Market Fixtures" : isLiveAvailable ? "Qloo Connected" : "Requires Key"}
              </Badge>
            </div>
            <p className="text-xs text-[#202E1D]/70 mt-0.5">
              {mode === "demo"
                ? "Uses curated benchmark comparative fixtures (South Delhi vs Gurgaon, Austin vs Nashville). Does not require an API key."
                : "Resolves localities via qloo_describe and contrasts audience signals via qloo_compare_audiences. Requires QLOO_API_KEY."}
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
              <CardTitle>Cross-Market Comparison Parameters</CardTitle>
              <CardDescription className="mt-1">
                Specify two markets to contrast their cultural audience profiles and identify distinct vs shared preferences.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Button variant="ghost" size="sm" onClick={handleLoadDelhiGurgaonPreset} type="button" className="text-xs">
                Load South Delhi vs Gurgaon
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLoadAustinNashvillePreset} type="button" className="text-xs">
                Load Austin vs Nashville
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
              {/* Location A (Required) */}
              <div className="space-y-1.5">
                <Input
                  label="Location A / Primary Market * (Required)"
                  placeholder="e.g., South Delhi or Austin, TX"
                  value={locationA}
                  onChange={(e) => setLocationA(e.target.value)}
                  helperText="First locality or baseline market"
                />
              </div>

              {/* Location B (Required) */}
              <div className="space-y-1.5">
                <Input
                  label="Location B / Comparison Market * (Required)"
                  placeholder="e.g., Gurgaon or Nashville, TN"
                  value={locationB}
                  onChange={(e) => setLocationB(e.target.value)}
                  helperText="Second locality or expansion target"
                />
              </div>

              {/* Target Signal Category */}
              <div className="space-y-1.5">
                <Select
                  label="Target Affinity Dimension (Optional)"
                  value={targetCategory}
                  onChange={(e) => setTargetCategory(e.target.value)}
                  options={CATEGORY_OPTIONS}
                  helperText="Qloo entity domain to evaluate comparative divergence across"
                />
              </div>

              {/* Business Category Context */}
              <div className="space-y-1.5">
                <Input
                  label="Business Category / Concept Lens (Optional)"
                  placeholder="e.g., Specialty Coffee & Roastery"
                  value={businessContext}
                  onChange={(e) => setBusinessContext(e.target.value)}
                  helperText="Operational lens used to frame comparative takeaways"
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

            {/* Form Actions Footer */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#202E1D]/10 mt-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSwapLocations}
                  type="button"
                  title="Swap Location A and Location B"
                  className="flex items-center gap-1.5 text-xs text-[#202E1D]/85 hover:text-[#202E1D]"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M8 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 5zm4 10a.75.75 0 01-.75-.75v-3.5a.75.75 0 011.5 0v3.5A.75.75 0 0112 15zm-7.78-7.22a.75.75 0 011.06 0L8 10.44l2.72-2.66a.75.75 0 111.04 1.08l-3.25 3.18a.75.75 0 01-1.04 0L4.22 8.86a.75.75 0 010-1.08zm11.56 4.44a.75.75 0 01-1.06 0L12 9.56l-2.72 2.66a.75.75 0 01-1.04-1.08l3.25-3.18a.75.75 0 011.04 0l3.25 3.18a.75.75 0 010 1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Swap Locations</span>
                </Button>

                <div className="text-xs text-[#202E1D]/70 hidden sm:block">
                  {mode === "demo" ? (
                    <span className="text-[#202E1D]/90 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      Evaluating curated comparative fixtures
                    </span>
                  ) : (
                    <span className="text-emerald-400/90 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Calling live Qloo MCP comparative pipeline
                    </span>
                  )}
                </div>
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
                      ? "Comparing Demo Audiences..."
                      : "Querying Live Qloo Engine..."
                    : mode === "demo"
                      ? "Compare Demo Audiences"
                      : "Compare Live Audiences"}
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
              ? `Evaluating comparative affinity profiles for '${locationA}' vs '${locationB}'...`
              : `Executing live Qloo MCP comparative analysis for '${locationA}' vs '${locationB}'...`
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
                  Live Qloo queries require an event-issued API key. Configure <code className="text-[#202E1D] font-mono font-mono text-xs px-1.5 py-0.5 rounded bg-[#FCFBF7] border border-[#202E1D]/12">QLOO_API_KEY</code> in <code className="text-[#202E1D] font-mono font-mono text-xs px-1.5 py-0.5 rounded bg-[#FCFBF7] border border-[#202E1D]/12">server/.env</code>, or switch to Demo Mode to explore curated comparative fixtures.
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
                Switch back to Demo Mode to test full audience comparison functionality with curated benchmark data.
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
            title={error instanceof ApiClientError && error.code ? `Error (${error.code})` : "Comparison Failed"}
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

      {/* Comparison Results Dashboard */}
      {data && !loading && !error && result && (
        <div className="space-y-6">
          {/* Explicit Demo Disclaimer Banner */}
          {isDemoResponse && (
            <div className="rounded-xl border border-[#EDD88B]/60 bg-[#EDD88B]/30 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-[#202E1D]">
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

          {/* Section A: Comparison Overview Card */}
          <Card className="border-[#202E1D]/12 bg-[#FCFBF7] text-left">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#202E1D]/70 uppercase tracking-wider">
                      Cross-Market Audience Contrast
                    </span>
                    {isDemoResponse ? (
                      <Badge variant="warning" size="sm">
                        Curated Comparative Dataset
                      </Badge>
                    ) : (
                      <Badge variant="success" size="sm">
                        Live Qloo MCP Data
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="font-serif text-lg sm:text-xl font-normal">
                    {marketAName} <span className="text-[#8F9A82] font-normal">vs</span> {marketBName}
                  </CardTitle>
                </div>
                <div className="text-right text-xs text-[#202E1D]/70 font-mono">
                  Status: <span className="text-emerald-400 font-semibold">{data.status}</span>
                </div>
              </div>
              <CardDescription className="pt-2 text-sm text-[#202E1D]/85 leading-relaxed">
                {result.divergenceSummary || data.summary}
              </CardDescription>
            </CardHeader>
            {data.metadata?.disclosure && (
              <div className="px-5 pb-4 text-[11px] text-[#202E1D]/80 font-medium">
                Disclosure: {data.metadata.disclosure}
              </div>
            )}
          </Card>

          {/* Operational Takeaway Callout (if present) */}
          {result.operational_takeaway && (
            <div className="rounded-xl border border-[#8F9A82]/30 bg-[#8F9A82]/15 p-5 text-left flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-[#8F9A82]/20 border border-[#8F9A82]/30 flex items-center justify-center text-[#8F9A82] font-semibold shrink-0 mt-0.5">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14H8a4 4 0 01-.828-7.914 4 4 0 017.656 0A4 4 0 0112 14z" />
                </svg>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#202E1D] uppercase tracking-wider">
                  Operational Strategic Takeaway
                </span>
                <p className="text-xs sm:text-sm text-[#202E1D] leading-relaxed">
                  {result.operational_takeaway}
                </p>
              </div>
            </div>
          )}

          {/* Side-by-Side Market Profiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Market A Card */}
            <Card className="border-[#202E1D]/12 bg-[#FCFBF7] text-left">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="info" size="sm">Market A Profile</Badge>
                  <span className="text-[10px] font-mono text-[#202E1D]/70">Baseline Locality</span>
                </div>
                <CardTitle className="text-base text-[#202E1D] mt-1">{marketAName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.market_a?.dominant_lifestyle_themes && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-[#202E1D]/70 uppercase tracking-wider">
                      Dominant Lifestyle Themes
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.market_a.dominant_lifestyle_themes.map((theme, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-xs bg-[#8F9A82]/15 text-[#202E1D] border border-[#202E1D]/12 font-medium"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {result.market_a?.cultural_anchor_signals && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono text-[#202E1D]/70 uppercase tracking-wider">
                      Cultural Anchor Signals
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.market_a.cultural_anchor_signals.map((sig, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[11px] bg-[#FAF8F2] text-[#202E1D]/70 border border-[#202E1D]/12"
                        >
                          {sig}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Market B Card */}
            <Card className="border-[#202E1D]/12 bg-[#FCFBF7] text-left">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="neutral" size="sm">Market B Profile</Badge>
                  <span className="text-[10px] font-mono text-[#202E1D]/70">Comparison Target</span>
                </div>
                <CardTitle className="text-base text-[#202E1D] mt-1">{marketBName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.market_b?.dominant_lifestyle_themes && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-[#202E1D]/70 uppercase tracking-wider">
                      Dominant Lifestyle Themes
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.market_b.dominant_lifestyle_themes.map((theme, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-xs bg-[#8F9A82]/15 text-[#202E1D] border border-[#202E1D]/12 font-medium"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {result.market_b?.cultural_anchor_signals && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono text-[#202E1D]/70 uppercase tracking-wider">
                      Cultural Anchor Signals
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.market_b.cultural_anchor_signals.map((sig, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[11px] bg-[#FAF8F2] text-[#202E1D]/70 border border-[#202E1D]/12"
                        >
                          {sig}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Section B: Shared Cultural Interests */}
          {sharedAffinities.length > 0 && (
            <div className="space-y-3 text-left">
              <h3 className="text-sm font-semibold text-[#202E1D] uppercase tracking-wider flex items-center gap-2">
                <span>Shared Cultural Interests & Common Affinities</span>
                <Badge variant="success" size="sm">
                  {sharedAffinities.length} Shared Vectors
                </Badge>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sharedAffinities.map((item, idx) => (
                  <Card key={idx} className="border-[#202E1D]/12 bg-[#FCFBF7] text-left">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          {item.category && (
                            <span className="text-[10px] font-mono text-[#8F9A82] font-semibold uppercase tracking-wider">
                              {item.category}
                            </span>
                          )}
                          <CardTitle className="text-sm font-semibold text-[#202E1D] mt-0.5">
                            {item.concept}
                          </CardTitle>
                        </div>
                        {typeof item.illustrative_index === "number" && (
                          <div className="shrink-0 text-right">
                            <span className="text-xs font-bold text-emerald-400 font-mono">
                              {item.illustrative_index}/100
                            </span>
                            <p className="text-[9px] text-[#202E1D]/70 uppercase font-mono">Overlap</p>
                          </div>
                        )}
                        {typeof item.shared_affinity_index === "number" && typeof item.illustrative_index !== "number" && (
                          <div className="shrink-0 text-right">
                            <span className="text-xs font-bold text-[#8F9A82] font-semibold font-mono">
                              {item.shared_affinity_index.toFixed(2)}
                            </span>
                            <p className="text-[9px] text-[#202E1D]/70 uppercase font-mono">Affinity</p>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-[#202E1D]/85 leading-relaxed">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Section C: Differences & Divergent Signals */}
          {(marketAExclusive.length > 0 || marketBExclusive.length > 0) && (
            <div className="space-y-3 text-left">
              <h3 className="text-sm font-semibold text-[#202E1D] uppercase tracking-wider flex items-center gap-2">
                <span>Distinct Cultural Signals & Divergent Traits</span>
                <Badge variant="neutral" size="sm">Market Contrast</Badge>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Column 1: Market A Distinct Traits */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <h4 className="text-xs font-semibold text-[#202E1D]/85 uppercase tracking-wider truncate">
                      Distinct to {marketAName}
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {marketAExclusive.map((trait, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-[#202E1D]/12 bg-[#FCFBF7] text-left space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-xs font-semibold text-[#202E1D]">{trait.trait}</h5>
                          {trait.affinity_divergence && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 shrink-0">
                              {trait.affinity_divergence}
                            </span>
                          )}
                        </div>
                        {trait.context && (
                          <p className="text-xs text-[#202E1D]/70 leading-relaxed">{trait.context}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Market B Distinct Traits */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <h4 className="text-xs font-semibold text-[#202E1D]/85 uppercase tracking-wider truncate">
                      Distinct to {marketBName}
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {marketBExclusive.map((trait, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-[#202E1D]/12 bg-[#FCFBF7] text-left space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-xs font-semibold text-[#202E1D]">{trait.trait}</h5>
                          {trait.affinity_divergence && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/60 text-[#202E1D] font-mono border border-amber-800/40 shrink-0">
                              {trait.affinity_divergence}
                            </span>
                          )}
                        </div>
                        {trait.context && (
                          <p className="text-xs text-[#202E1D]/70 leading-relaxed">{trait.context}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section D: Live Comparison Results (if returned from live Qloo MCP) */}
          {Array.isArray(result.comparisonResults) && result.comparisonResults.length > 0 && (
            <Card className="border-[#202E1D]/12 bg-[#FCFBF7] text-left">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-[#202E1D]">Live Qloo Comparison Entities</CardTitle>
                  <Badge variant="success" size="sm">{result.comparisonResults.length} entities</Badge>
                </div>
                <CardDescription>
                  Empirical entity rankings from the persistent Qloo MCP comparison tool.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-zinc-800/60">
                  {result.comparisonResults.map((item, idx) => {
                    const record = item as Record<string, unknown>;
                    return (
                      <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                        <span className="font-medium text-[#202E1D]">
                          {String(record.name || record.title || record.entity || `Entity ${idx + 1}`)}
                        </span>
                        {typeof record.score === "number" && (
                          <span className="font-mono text-[#8F9A82] font-semibold">{record.score.toFixed(3)}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section E: Evidence, Provenance & Workflow Trace Strip */}
          <div className="p-4 rounded-xl border border-[#202E1D]/10 bg-[#FAF8F2] text-xs text-[#202E1D]/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
            <div className="space-y-0.5">
              <span className="text-[#202E1D]/85 font-medium">Qloo Tool Chaining Trace:</span>
              <p className="text-[11px] font-mono text-[#202E1D]/70">
                qloo_describe (locality A & B) &rarr; qloo_compare_audiences (group_a vs group_b)
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

      {/* Initial Empty State (When no comparison has been run yet) */}
      {!data && !loading && !error && (
        <EmptyState
          title="Ready to Compare Local Audiences"
          description="Enter two markets above or choose a preset, then click 'Compare Audiences' to evaluate shared cultural vectors, consumer affinities, and divergent regional lifestyle traits."
          action={
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button variant="secondary" size="sm" onClick={handleLoadDelhiGurgaonPreset}>
                Load South Delhi vs Gurgaon
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLoadAustinNashvillePreset}>
                Load Austin vs Nashville
              </Button>
            </div>
          }
        />
      )}
    </div>
  );
}
