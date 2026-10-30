"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLocationInsights } from "@/hooks/useLocationInsights";
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
import type { OperationMode, QlooPlaceRecord, QlooTagRecord } from "@/types";

const BUSINESS_TYPE_OPTIONS = [
  { value: "Specialty Coffee & Roastery", label: "Specialty Coffee & Roastery" },
  { value: "Third-Wave Café & Bakery", label: "Third-Wave Café & Bakery" },
  { value: "Artisanal Craft Pizzeria", label: "Artisanal Craft Pizzeria" },
  { value: "Independent Bookstore & Café", label: "Independent Bookstore & Café" },
  { value: "Natural Wine Bar & Provisions", label: "Natural Wine Bar & Provisions" },
  { value: "Boutique Fitness & Yoga Studio", label: "Boutique Fitness & Yoga Studio" },
  { value: "custom", label: "Custom Business Type..." }
];

export interface LocationInsightsViewProps {
  initialMode?: OperationMode;
}

export function LocationInsightsView({ initialMode }: LocationInsightsViewProps) {
  const { mode, setMode } = useOperationMode(initialMode ?? "demo");
  const [selectedType, setSelectedType] = useState<string>("Specialty Coffee & Roastery");
  const [customType, setCustomType] = useState<string>("");
  const [city, setCity] = useState<string>("Austin, TX");
  const [neighborhood, setNeighborhood] = useState<string>("East Austin");
  const [description, setDescription] = useState<string>("Independent third-wave espresso bar with patio and vinyl audio focus");
  const [validationError, setValidationError] = useState<string | null>(null);

  const { data, loading, error, execute, reset } = useLocationInsights();
  const { isLiveAvailable } = useBackendHealth({ autoFetch: true });

  const effectiveBusinessType = selectedType === "custom" ? customType : selectedType;

  // Clear results and validation errors when switching modes so stale results are never shown
  const prevModeRef = useRef<OperationMode>(mode);
  useEffect(() => {
    if (prevModeRef.current !== mode) {
      prevModeRef.current = mode;
      reset();
      setValidationError(null);
    }
  }, [mode, reset]);

  // Handle Preset Load
  const handleLoadPreset = () => {
    setSelectedType("Specialty Coffee & Roastery");
    setCity("Austin, TX");
    setNeighborhood("East Austin");
    setDescription("Independent third-wave espresso bar with patio and vinyl audio focus");
    setValidationError(null);
  };

  // Handle Form Submission
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);

    if (!city.trim()) {
      setValidationError("City / Market is required. Please specify a geographic location (e.g., Austin, TX).");
      return;
    }

    if (!effectiveBusinessType.trim()) {
      setValidationError("Business Category is required. Please select or enter a business concept.");
      return;
    }

    const fullLocation = neighborhood.trim()
      ? `${neighborhood.trim()}, ${city.trim()}`
      : city.trim();

    await execute({
      mode,
      location: fullLocation,
      businessType: effectiveBusinessType.trim()
    });
  };

  // Extract result item from envelope
  const result = data?.results?.[0];
  const isDemoResponse = Boolean(data?.metadata?.isDemo);

  // Cultural place anchors (handles both mock and live result structures)
  const places: QlooPlaceRecord[] = (result?.top_cultural_anchors || result?.places || []) as QlooPlaceRecord[];

  // Concept tags (handles both mock defining_concept_tags and live resolvedTags)
  const definingTags = result?.defining_concept_tags || [];
  const liveTags: QlooTagRecord[] = result?.resolvedTags || [];

  // Check if error is an authentication failure (missing QLOO_API_KEY)
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
              Workflow Module 01
            </Badge>
            <Badge variant={mode === "demo" ? "warning" : isLiveAvailable ? "success" : "danger"} size="sm" dot>
              {mode === "demo" ? "Demo Fixtures" : isLiveAvailable ? "Live Qloo Connected" : "Live (Requires Key)"}
            </Badge>
          </div>
        }
        title="Location Insights"
        description="Discover cultural peer anchors, taste concept tags, and demographic indexing for any local enterprise."
        action={
          <div className="flex items-center gap-1.5 bg-white border border-[#202E1D]/15 p-1 rounded-full shadow-2xs">
            <button
              type="button"
              onClick={() => setMode("demo")}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-full transition-all cursor-pointer flex items-center gap-1.5",
                mode === "demo"
                  ? "bg-[#EDD88B] text-[#202E1D] font-bold shadow-2xs"
                  : "text-[#202E1D]/70 hover:text-[#202E1D]"
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full", mode === "demo" ? "bg-[#202E1D]" : "bg-zinc-400")} />
              Demo Mode
            </button>
            <button
              type="button"
              onClick={() => setMode("live")}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-full transition-all cursor-pointer flex items-center gap-1.5",
                mode === "live"
                  ? "bg-[#202E1D] text-white font-bold shadow-2xs"
                  : "text-[#202E1D]/70 hover:text-[#202E1D]"
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  mode === "live" ? "bg-emerald-400 animate-pulse" : "bg-zinc-400"
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
          "rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left transition-colors shadow-2xs",
          mode === "demo"
            ? "border-[#EDD88B]/60 bg-[#EDD88B]/20 text-[#202E1D]"
            : "border-emerald-200 bg-emerald-50 text-emerald-950"
        )}
      >
        <div className="flex items-start sm:items-center gap-3">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 font-bold",
              mode === "demo"
                ? "bg-[#EDD88B] text-[#202E1D]"
                : "bg-emerald-600 text-white"
            )}
          >
            {mode === "demo" ? "✨" : "⚡"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider font-mono">
                {mode === "demo" ? "Demo Mode Active" : "Live Qloo Mode Active"}
              </span>
              <Badge variant={mode === "demo" ? "warning" : isLiveAvailable ? "success" : "danger"} size="sm">
                {mode === "demo" ? "Curated Austin Coffee Fixture" : isLiveAvailable ? "Qloo Connected" : "Requires Key"}
              </Badge>
            </div>
            <p className="text-xs text-[#202E1D]/75 mt-0.5 font-sans">
              {mode === "demo"
                ? "Uses curated benchmark sample datasets. Does not require an API key or make external network calls."
                : "Executes live Qloo MCP tools (qloo_find_tags, qloo_recommend, qloo_entity_tags). Requires an event-issued QLOO_API_KEY."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMode(mode === "demo" ? "live" : "demo")}
            className="text-xs font-semibold"
            type="button"
          >
            Switch to {mode === "demo" ? "Live Qloo Mode" : "Demo Mode"} &rarr;
          </Button>
        </div>
      </div>

      {/* Input Parameters Form Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <CardTitle>Enterprise Query Parameters</CardTitle>
              <CardDescription className="mt-1">
                Configure your business concept and target geographic market to run cultural affinity analysis.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleLoadPreset} type="button" className="shrink-0 font-mono text-xs">
              Load Austin Coffee Preset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#202E1D]/80 mb-1.5">
                  Business Category / Concept <span className="text-rose-600">*</span>
                </label>
                <Select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  options={BUSINESS_TYPE_OPTIONS}
                />
              </div>

              {selectedType === "custom" && (
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#202E1D]/80 mb-1.5">
                    Custom Concept Name <span className="text-rose-600">*</span>
                  </label>
                  <Input
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    placeholder="e.g. Natural Cider House & Provisions"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#202E1D]/80 mb-1.5">
                  City / Market <span className="text-rose-600">*</span>
                </label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Austin, TX or Brooklyn, NY"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#202E1D]/80 mb-1.5">
                  Neighborhood / District (Optional)
                </label>
                <Input
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="e.g. East Austin or Williamsburg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#202E1D]/80 mb-1.5">
                  Venue Concept &amp; Brand Character Description (Optional)
                </label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Specialty single-origin espresso with vintage vinyl listening corner and courtyard"
                />
              </div>
            </div>

            {/* Validation Message */}
            {validationError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <span>⚠</span>
                <span>{validationError}</span>
              </div>
            )}

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#202E1D]/10 mt-4">
              <div className="text-xs text-[#202E1D]/70 font-sans">
                {mode === "demo" ? (
                  <span>Using curated benchmark fixture for Austin Eastside Coffee.</span>
                ) : (
                  <span>Will query live Qloo MCP tools (qloo_find_tags, qloo_recommend, qloo_entity_tags).</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {data && (
                  <Button variant="ghost" size="sm" onClick={() => reset()} type="button">
                    Clear Results
                  </Button>
                )}
                <Button type="submit" variant="primary" disabled={loading} className="px-6">
                  {loading ? "Analyzing Culture..." : "Generate Insights →"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <LoadingState
          message={`Executing Qloo intelligence pipeline for ${effectiveBusinessType} in ${neighborhood ? `${neighborhood}, ${city}` : city}...`}
        />
      )}

      {/* Error State */}
      {error && !loading && (
        <ErrorState
          title={isAuthError ? "Qloo Authentication Required" : "Location Intelligence Query Failed"}
          message={error instanceof Error ? error.message : String(error)}
          code={error instanceof ApiClientError ? error.code : undefined}
          recovery={
            isAuthError
              ? "Live Qloo queries require an event-issued API key. Switch to Demo Mode above to view curated sample datasets."
              : "Verify that the backend Express server on port 4000 is running and that the parameters are valid."
          }
          onRetry={handleSubmit}
        />
      )}

      {/* Results View */}
      {result && !loading && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Mode Attribution Alert */}
          {isDemoResponse && (
            <div className="rounded-2xl border border-[#EDD88B]/60 bg-[#EDD88B]/20 p-3.5 sm:p-4 text-xs text-[#202E1D] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span>✨</span>
                <span className="font-medium font-sans">
                  Curated Demo Mode: Showing illustrative results for product evaluation. Grounded in Austin Eastside coffee taste graph.
                </span>
              </div>
              <Badge variant="warning" size="sm">
                Curated Fixture
              </Badge>
            </div>
          )}

          {/* Overview & Provenance Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#8F9A82] uppercase tracking-wider font-semibold">
                      Location Intelligence Summary
                    </span>
                    {isDemoResponse ? (
                      <Badge variant="warning" size="sm">
                        Curated Demo Dataset
                      </Badge>
                    ) : (
                      <Badge variant="success" size="sm">
                        Live Qloo MCP Data
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl sm:text-2xl">
                    {result.target_location || result.location || city} &bull; {result.business_type || result.businessType || effectiveBusinessType}
                  </CardTitle>
                </div>
                <div className="text-right text-xs text-[#202E1D]/60 font-mono">
                  Status: <span className="text-emerald-700 font-semibold">{data.status}</span>
                </div>
              </div>
              <CardDescription className="pt-2 text-sm text-[#202E1D]/80 leading-relaxed font-sans">
                {result.cultural_overview || result.analysisSummary || data.summary}
              </CardDescription>
            </CardHeader>
            {data.metadata?.disclosure && (
              <div className="px-6 pb-4 text-[11px] text-[#8F9A82] font-mono">
                Disclosure: {data.metadata.disclosure}
              </div>
            )}
          </Card>

          {/* Section: Cultural Concept Tags */}
          <div className="space-y-3 text-left">
            <h3 className="font-serif text-lg font-normal text-[#202E1D] flex items-center gap-2">
              <span>Defining Cultural Concept Tags</span>
              <Badge variant="neutral" size="sm">
                {definingTags.length > 0 ? definingTags.length : liveTags.length} tags
              </Badge>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {definingTags.map((tag, idx) => (
                <div
                  key={tag.urn || idx}
                  className="p-4 rounded-2xl border border-[#202E1D]/12 bg-white space-y-1 text-left shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-sm font-semibold text-[#202E1D] truncate">{tag.label}</span>
                    <Badge variant="info" size="sm">
                      {tag.prevalence}
                    </Badge>
                  </div>
                  <p className="text-[10px] font-mono text-[#8F9A82] truncate">{tag.urn}</p>
                </div>
              ))}

              {liveTags.map((tag, idx) => (
                <div
                  key={tag.urn || tag.id || idx}
                  className="p-4 rounded-2xl border border-[#202E1D]/12 bg-white space-y-1 text-left shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-sm font-semibold text-[#202E1D] truncate">
                      {String(tag.name || tag.label || "Cultural Concept")}
                    </span>
                    {typeof tag.score === "number" && (
                      <span className="text-[10px] font-mono text-[#8F9A82] font-bold">
                        score: {tag.score.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-[#8F9A82] truncate">
                    {String(tag.urn || tag.tag_id || tag.id || "")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Cultural Peer Anchors / Recommended Places */}
          <div className="space-y-3 text-left">
            <h3 className="font-serif text-lg font-normal text-[#202E1D] flex items-center gap-2">
              <span>Cultural Peer Anchors &amp; Recommended Places</span>
              <Badge variant="neutral" size="sm">
                {places.length} places identified
              </Badge>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {places.map((place, idx) => (
                <Card key={place.id || idx}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base sm:text-lg">{place.name}</CardTitle>
                        <p className="text-xs text-[#202E1D]/65 mt-0.5 font-sans">
                          {place.category} &bull; <span className="text-[#8F9A82] font-mono">{String(place.neighborhood || place.address || place.location || city)}</span>
                        </p>
                      </div>
                      {typeof place.illustrative_affinity_score === "number" && (
                        <div className="shrink-0 text-right">
                          <span className="text-xs font-bold text-emerald-800 font-mono">
                            {place.illustrative_affinity_score}/100
                          </span>
                          <p className="text-[9px] text-[#8F9A82] uppercase font-mono">Demo Index</p>
                        </div>
                      )}
                      {typeof place.score === "number" && typeof place.illustrative_affinity_score !== "number" && (
                        <div className="shrink-0 text-right">
                          <span className="text-xs font-bold text-[#8F9A82] font-mono">
                            {place.score.toFixed(2)}
                          </span>
                          <p className="text-[9px] text-[#8F9A82] uppercase font-mono">Qloo Score</p>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {place.description && (
                      <p className="text-xs text-[#202E1D]/80 leading-relaxed font-sans">
                        {place.description}
                      </p>
                    )}

                    {/* Vibe Keywords / Tags */}
                    {Array.isArray(place.vibe_keywords) && place.vibe_keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {place.vibe_keywords.map((kw, kIdx) => (
                          <span
                            key={kIdx}
                            className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#8F9A82]/15 text-[#202E1D] border border-[#8F9A82]/30 font-medium font-sans"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}

                    {Array.isArray(place.tags) && place.tags.length > 0 && !place.vibe_keywords && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {place.tags.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-0.5 rounded-full text-[10px] bg-white border border-[#202E1D]/15 text-[#202E1D]/75 font-mono"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Section: Demographic Breakdown (if present in fixture or result) */}
          {result.demographic_breakdown && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="info" size="sm">Audience Profile</Badge>
                  <CardTitle className="text-base sm:text-lg">Target Demographic Indexing</CardTitle>
                </div>
                <CardDescription>
                  Aggregate demographic segments and lifestyle overlap associated with this venue profile.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-[#202E1D]/12 space-y-1 shadow-2xs">
                    <span className="text-[10px] font-mono text-[#8F9A82] uppercase font-semibold">Primary Age Bracket</span>
                    <p className="text-sm font-semibold text-[#202E1D] font-serif">
                      {result.demographic_breakdown.primary_age_bracket}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#202E1D]/12 space-y-1 sm:col-span-2 shadow-2xs">
                    <span className="text-[10px] font-mono text-[#8F9A82] uppercase font-semibold">Primary Audience Segments</span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {result.demographic_breakdown.target_segments?.map((seg, sIdx) => (
                        <span key={sIdx} className="px-2.5 py-0.5 rounded-full text-xs bg-[#8F9A82]/15 text-[#202E1D] font-sans">
                          {seg}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {Array.isArray(result.demographic_breakdown.lifestyle_interests) && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono uppercase text-[#8F9A82] tracking-wider block font-semibold">
                      Defining Lifestyle Affinities
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.demographic_breakdown.lifestyle_interests.map((item, iIdx) => (
                        <span
                          key={iIdx}
                          className="px-3 py-1 rounded-full text-xs bg-white border border-[#202E1D]/15 text-[#202E1D] shadow-2xs font-sans"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Evidence, Provenance & Workflow Trace Strip */}
          <div className="p-4 rounded-2xl border border-[#202E1D]/12 bg-[#FCFBF7] text-xs text-[#202E1D]/75 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="space-y-0.5 text-left">
              <span className="text-[#202E1D] font-serif font-semibold">Qloo Tool Chaining Trace:</span>
              <p className="text-[11px] font-mono text-[#8F9A82]">
                qloo_find_tags &rarr; qloo_recommend (place) &rarr; qloo_entity_tags
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="font-mono text-[#202E1D]/60">
                Source: {data.metadata?.source || "qloo_mcp"}
              </span>
              <a
                href="https://docs.qloo.com"
                target="_blank"
                rel="noreferrer"
                className="text-[#202E1D] hover:underline font-medium font-sans"
              >
                Qloo Docs Reference &rarr;
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Initial Empty State (When no query has been run yet) */}
      {!data && !loading && !error && (
        <EmptyState
          title="Ready to Analyze Local Culture"
          description="Select a business concept and enter a city market above, then click 'Generate Insights' to evaluate local cultural peer anchors, concept tags, and demographic indexing."
          action={
            <Button variant="secondary" size="sm" onClick={handleLoadPreset} type="button">
              Load Austin Specialty Coffee Demo
            </Button>
          }
        />
      )}
    </div>
  );
}
