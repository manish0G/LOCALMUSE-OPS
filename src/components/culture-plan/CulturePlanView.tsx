"use client";

import React, { useState, useEffect } from "react";
import { useCulturePlan } from "@/hooks/useCulturePlan";
import { useOperationMode } from "@/hooks/useOperationMode";
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
import type { OperationMode, CulturePlanData, CulturePlanPillar } from "@/types";

const PRESET_SCENARIOS = [
  {
    label: "Austin Eastside: Specialty Roastery",
    name: "Flat Track Coffee & Roasters",
    type: "Specialty Coffee & Roastery",
    location: "Austin, TX",
    neighborhood: "East Austin (Cesar Chavez)",
    style: "Artisan single-origin espresso with moto-culture aesthetic and vinyl audio focus",
    priceBand: "$$",
    targetCustomer: "Remote tech freelancers, creative agency designers & craft culinary enthusiasts",
    goal: "Increase weekday afternoon footfall (1:30 PM - 4:30 PM) and lift check average"
  },
  {
    label: "Brooklyn Williamsburg: Natural Wine & Vinyl Bar",
    name: "Dorsia & Disc Provisions",
    type: "Natural Wine Bar & Provisions",
    location: "Brooklyn, NY",
    neighborhood: "North Williamsburg",
    style: "Minimalist biodynamic wines, small plates & high-fidelity analog listening",
    priceBand: "$$$",
    targetCustomer: "Neighborhood creative professionals & evening audio enthusiasts",
    goal: "Drive midweek Tuesday/Wednesday covers and encourage retail bottle sales"
  },
  {
    label: "Seattle Capitol Hill: Indie Bookstore & Espresso",
    name: "Page & Pour Bookshop",
    type: "Independent Bookstore & Café",
    location: "Seattle, WA",
    neighborhood: "Capitol Hill",
    style: "Curated literary fiction, specialty espresso & community gathering nooks",
    priceBand: "$$",
    targetCustomer: "Students, literature enthusiasts & remote writers",
    goal: "Boost weekend evening community attendance and cross-merchandising conversion"
  }
];

const FEEDBACK_TAG_OPTIONS = [
  { id: "too_expensive", label: "Too expensive to implement" },
  { id: "not_our_vibe", label: "Not our neighborhood vibe" },
  { id: "more_music", label: "More music & soundscape focus" },
  { id: "more_family", label: "More family & all-ages friendly" },
  { id: "nightlife_focus", label: "Extend into twilight/evening" }
];

export interface CulturePlanViewProps {
  initialMode?: OperationMode;
}

export function CulturePlanView({ initialMode }: CulturePlanViewProps) {
  const { mode } = useOperationMode(initialMode ?? "demo");

  // Form State
  const [businessName, setBusinessName] = useState("Flat Track Coffee & Roasters");
  const [businessType, setBusinessType] = useState("Specialty Coffee & Roastery");
  const [location, setLocation] = useState("Austin, TX");
  const [neighborhood, setNeighborhood] = useState("East Austin (Cesar Chavez)");
  const [style, setStyle] = useState("Artisan single-origin espresso with moto-culture aesthetic and vinyl audio focus");
  const [priceBand, setPriceBand] = useState("$$");
  const [targetCustomer, setTargetCustomer] = useState("Remote tech freelancers, creative agency designers & craft culinary enthusiasts");
  const [goal, setGoal] = useState("Increase weekday afternoon footfall (1:30 PM - 4:30 PM) and lift check average");

  // View & Comparison State
  const [activeTab, setActiveTab] = useState<"qloo" | "generic" | "side_by_side">("side_by_side");
  const [expandedPillarId, setExpandedPillarId] = useState<string | null>("pillar-specials");
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedPlan, setCopiedPlan] = useState(false);

  // Feedback State
  const [selectedFeedbackTags, setSelectedFeedbackTags] = useState<string[]>([]);
  const [customFeedbackNote, setCustomFeedbackNote] = useState("");
  const [iterationCount, setIterationCount] = useState(0);

  const { data, loading, error, execute, reset } = useCulturePlan();

  // Load preset scenario
  const handleLoadPreset = (scenario: typeof PRESET_SCENARIOS[0]) => {
    setBusinessName(scenario.name);
    setBusinessType(scenario.type);
    setLocation(scenario.location);
    setNeighborhood(scenario.neighborhood);
    setStyle(scenario.style);
    setPriceBand(scenario.priceBand);
    setTargetCustomer(scenario.targetCustomer);
    setGoal(scenario.goal);
    setSelectedFeedbackTags([]);
    setCustomFeedbackNote("");
    setIterationCount(0);
  };

  // Execute initial generation
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await execute({
      mode,
      businessName,
      businessType,
      location,
      neighborhood,
      style,
      priceBand,
      targetCustomer,
      goal,
      feedback: {
        tags: selectedFeedbackTags,
        notes: customFeedbackNote,
        iteration: iterationCount
      }
    });
  };

  // Execute regeneration with feedback memory
  const handleRegenerateWithMemory = async () => {
    const nextIteration = iterationCount + 1;
    setIterationCount(nextIteration);
    await execute({
      mode,
      businessName,
      businessType,
      location,
      neighborhood,
      style,
      priceBand,
      targetCustomer,
      goal,
      feedback: {
        tags: selectedFeedbackTags,
        notes: customFeedbackNote,
        iteration: nextIteration
      }
    });
  };

  const handleToggleTag = (tagId: string) => {
    setSelectedFeedbackTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const planData: CulturePlanData | undefined = data?.results?.[0];

  // Copy social caption
  const handleCopyCaption = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  // Copy entire plan as Markdown
  const handleCopyPlanMarkdown = () => {
    if (!planData) return;
    const q = planData.qlooPlan;
    const md = `# Weekly Culture Plan: ${planData.business.name}
**Location:** ${planData.business.neighborhood}, ${planData.business.location}
**Objective:** ${planData.business.goal}
**Generated Week:** ${planData.generatedWeek}

## Strategic Thesis
${q.strategicThesis}

## Operational Pillars
${q.pillars
  .map(
    (p, idx) => `### ${idx + 1}. [${p.category.toUpperCase()}] ${p.title}
*${p.subtitle}*
- **Timing:** ${p.timing}
- **Projected Impact:** ${p.projectedImpact}
- **Action Items:**
${p.actionItems.map((a) => `  * ${a}`).join("\n")}
- **Qloo Signals:**
${p.qlooSignals.map((s) => `  * ${s.citation} (${s.scoreOrPrevalence}): ${s.explanation}`).join("\n")}
`
  )
  .join("\n")}

## Comparative Benchmark (Qloo AI vs Generic LLM)
${planData.comparativeScores
  .map((s) => `- **${s.metric}:** Qloo ${s.qlooScore}/100 vs Generic ${s.genericScore}/100 — ${s.advantageAnalysis}`)
  .join("\n")}
`;
    navigator.clipboard.writeText(md);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Banner / Hero */}
      <div className="relative rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-zinc-900/60 to-zinc-950 p-6 sm:p-8 overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <Badge variant="info" size="sm">
                Flagship Copilot
              </Badge>
              <span className="text-[11px] text-zinc-400 font-mono">Module 05 &bull; Agentic Planner</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
              Weekly Culture Plan Copilot
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Transforms macro cultural taste data into an actionable weekly operating rhythm for independent hospitality & retail. Every recommendation is verified against Qloo signals, contrasted with generic AI, and refined through staff feedback memory.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {PRESET_SCENARIOS.map((preset, idx) => (
              <Button
                key={idx}
                variant="secondary"
                size="sm"
                onClick={() => handleLoadPreset(preset)}
                className="text-xs"
              >
                Preset {idx + 1}: {preset.label.split(":")[0]}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Onboarding & Input Form Card */}
      <Card className="border-zinc-800/80 bg-zinc-900/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Business Onboarding & Cultural Context</CardTitle>
            <Badge variant="neutral" size="sm">
              Input Form
            </Badge>
          </div>
          <CardDescription>
            Provide your business attributes and operational goal. The agent queries Qloo to ground its weekly strategy in neighborhood-level taste affinities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Business Name</label>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Flat Track Coffee"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Business Type</label>
                <Input
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  placeholder="e.g. Specialty Coffee & Roastery"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">City / Market</label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Austin, TX"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Neighborhood / District</label>
                <Input
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="e.g. East Austin (Cesar Chavez)"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Price Band</label>
                <Select
                  value={priceBand}
                  onChange={(e) => setPriceBand(e.target.value)}
                  options={[
                    { value: "$", label: "$ - Accessible / Casual" },
                    { value: "$$", label: "$$ - Moderate / Artisan" },
                    { value: "$$$", label: "$$$ - Premium / Elevated" },
                    { value: "$$$$", label: "$$$$ - Luxury / Tasting" }
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Target Demographic</label>
                <Input
                  value={targetCustomer}
                  onChange={(e) => setTargetCustomer(e.target.value)}
                  placeholder="e.g. Remote creatives & young professionals"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Aesthetic Vibe & Current Style</label>
                <Input
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  placeholder="e.g. Minimalist design-forward with analog audio appreciation"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Primary Operational Goal</label>
                <Input
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Increase weekday afternoon footfall and boost average ticket size"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
              <span className="text-xs text-zinc-400">
                Mode: <strong className="text-zinc-200 uppercase">{mode}</strong> (Curated demo fixtures active)
              </span>
              <Button type="submit" variant="primary" disabled={loading} className="px-6">
                {loading ? "Synthesizing Culture Plan..." : "Generate Weekly Culture Plan →"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <LoadingState
          message="Synthesizing Cultural Operating Plan... Grounding decisions in Qloo taste anchors, querying cross-domain affinities, and assembling comparative benchmark."
        />
      )}

      {/* Error State */}
      {error && !loading && (
        <ErrorState
          title="Plan Generation Failed"
          message={error instanceof Error ? error.message : String(error)}
          onRetry={() => handleGenerate()}
        />
      )}

      {/* Empty State */}
      {!planData && !loading && !error && (
        <EmptyState
          title="No Culture Plan Generated Yet"
          description="Click 'Generate Weekly Culture Plan' or choose one of the preset business scenarios above to see LocalMuse Ops in action."
          action={
            <Button variant="primary" size="sm" onClick={() => handleGenerate()}>
              Generate Austin Coffee Plan
            </Button>
          }
        />
      )}

      {/* Plan Results Presentation */}
      {planData && !loading && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Header Controls Strip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
                  {planData.generatedWeek}
                </span>
                <Badge variant="success" size="sm">
                  Plan Ready
                </Badge>
                {iterationCount > 0 && (
                  <Badge variant="info" size="sm">
                    Iteration #{iterationCount + 1} (Feedback Adapted)
                  </Badge>
                )}
              </div>
              <p className="text-xs text-zinc-400">
                Operating rhythm for <strong>{planData.business.name}</strong> ({planData.business.neighborhood})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={handleCopyPlanMarkdown}>
                {copiedPlan ? "✓ Copied Markdown" : "Export Plan (Markdown)"}
              </Button>
            </div>
          </div>

          {/* THE KILLER FEATURE: Mode Toggle & Comparison Strip */}
          <div className="rounded-xl border border-amber-500/30 bg-zinc-900/80 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="warning" size="sm">
                    Hackathon Proof Point
                  </Badge>
                  <span className="text-sm font-bold text-zinc-100">
                    Qloo Cultural AI vs. Generic LLM Baseline
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  “If your project would work the same without Qloo, you’re building the wrong thing.” Contrast Qloo’s grounded signals against a generic LLM prompt guess.
                </p>
              </div>

              {/* View Switcher Pills */}
              <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setActiveTab("side_by_side")}
                  className={cn(
                    "px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer",
                    activeTab === "side_by_side"
                      ? "bg-zinc-800 text-zinc-100 shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  Side-by-Side View
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("qloo")}
                  className={cn(
                    "px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer",
                    activeTab === "qloo"
                      ? "bg-indigo-600/80 text-white shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  Qloo Mode (Grounded)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("generic")}
                  className={cn(
                    "px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer",
                    activeTab === "generic"
                      ? "bg-zinc-800 text-zinc-100 shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  Generic AI (Guessing)
                </button>
              </div>
            </div>

            {/* Comparative Radar/Bar Scorecard */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-1">
              {planData.comparativeScores.map((score, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-zinc-300">{score.metric}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-indigo-400 font-mono">Qloo: {score.qlooScore}%</span>
                      <span className="text-zinc-500 font-mono">Generic: {score.genericScore}%</span>
                    </div>
                    {/* Visual Progress Bars */}
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                      <div
                        className="bg-indigo-500 h-full rounded-l-full"
                        style={{ width: `${score.qlooScore}%` }}
                      />
                    </div>
                    <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="bg-zinc-600 h-full rounded-full"
                        style={{ width: `${score.genericScore}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {score.advantageAnalysis}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Thesis Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-indigo-500/30 bg-indigo-950/20">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="info" size="sm">Qloo Strategic Thesis</Badge>
                  <span className="text-xs font-mono text-indigo-400">Grounded Engine</span>
                </div>
                <CardTitle className="text-base text-zinc-100 pt-1">Targeted Cultural Rationale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-zinc-300 leading-relaxed">
                <p>{planData.qlooPlan.strategicThesis}</p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {planData.qlooPlan.demographicFocus.topAffinities.map((aff, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-indigo-900/40 border border-indigo-700/40 text-[11px] text-indigo-300 font-mono">
                      {aff}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900/30">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="neutral" size="sm">Generic LLM Guess</Badge>
                  <span className="text-xs font-mono text-zinc-500">Untethered Advice</span>
                </div>
                <CardTitle className="text-base text-zinc-300 pt-1">Standard Small-Business Playbook</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-zinc-400 leading-relaxed">
                <p>{planData.genericPlan.strategicThesis}</p>
                <div className="p-2 rounded bg-red-950/20 border border-red-900/30 text-[11px] text-red-300/90 mt-2">
                  <strong>Flaw:</strong> Lacks neighborhood taste awareness. Assumes price discounting and generic social posting will resolve structural footfall issues.
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section Header */}
          <SectionHeader
            badge={<Badge variant="info" size="sm">Actionable Weekly Cadence</Badge>}
            title="The Six Operational Pillars"
            description="Concrete, zero-capex interventions addressing specials, soundscape, programming, partnerships, and localized storytelling."
          />

          {/* THE SIX PILLARS GRID / SIDE-BY-SIDE */}
          <div className="space-y-4">
            {planData.qlooPlan.pillars.map((pillar, idx) => {
              const genericMatch = planData.genericPlan.pillars.find((g) => g.category === pillar.category);
              const isExpanded = expandedPillarId === pillar.id;

              return (
                <div
                  key={pillar.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/70 overflow-hidden transition-colors hover:border-zinc-700"
                >
                  {/* Pillar Top Header */}
                  <div
                    className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer bg-zinc-900/40 select-none"
                    onClick={() => setExpandedPillarId(isExpanded ? null : pillar.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">
                        0{idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                            Pillar: {pillar.category}
                          </span>
                          <span className="text-xs text-zinc-500">&bull;</span>
                          <span className="text-xs text-zinc-400 font-mono">{pillar.timing}</span>
                        </div>
                        <h3 className="text-base font-semibold text-zinc-100">{pillar.title}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="success" size="sm">
                        {pillar.projectedImpact.split(";")[0]}
                      </Badge>
                      <button
                        type="button"
                        className="text-xs text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded bg-zinc-800"
                      >
                        {isExpanded ? "Collapse ▲" : "View Details & Provenance ▼"}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Body Content */}
                  {isExpanded && (
                    <div className="p-4 sm:p-6 border-t border-zinc-800/80 space-y-5 bg-zinc-950/40">
                      {/* Comparison Columns if side_by_side or specific tab */}
                      {(activeTab === "side_by_side" || activeTab === "qloo") && (
                        <div className="space-y-4">
                          <div className="p-4 rounded-xl bg-zinc-900/60 border border-indigo-500/20 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                                Qloo Recommended Action & Implementation
                              </span>
                              <span className="text-[11px] font-mono text-zinc-400">
                                Projected: {pillar.projectedImpact}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                              {pillar.description}
                            </p>
                            <div className="space-y-1.5 pt-1">
                              <span className="text-xs font-semibold text-zinc-300">Action Steps:</span>
                              <ul className="space-y-1">
                                {pillar.actionItems.map((step, sIdx) => (
                                  <li key={sIdx} className="text-xs text-zinc-300 flex items-start gap-2">
                                    <span className="text-indigo-400 shrink-0 font-bold">&bull;</span>
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Social Copy Quick Action if Marketing */}
                            {pillar.category === "marketing" && (
                              <div className="mt-3 p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
                                <span className="text-xs font-mono text-zinc-300 truncate">
                                  &ldquo;Your 2 PM reset shouldn&apos;t feel like a fluorescent conference room...&rdquo;
                                </span>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => handleCopyCaption("Your 2 PM reset shouldn't feel like a fluorescent conference room. New cascara spritz is on bar. #EastAustinEats #AustinCoffeeScene")}
                                  className="shrink-0 text-xs"
                                >
                                  {copiedCaption ? "Copied!" : "Copy Caption"}
                                </Button>
                              </div>
                            )}
                          </div>

                          {/* PROVENANCE CARDS: Why this recommendation? */}
                          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="neutral" size="sm">Qloo Provenance Card</Badge>
                              <span className="text-xs font-semibold text-zinc-300">
                                Signals Driving This Recommendation
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                              {pillar.qlooSignals.map((sig, sigIdx) => (
                                <div
                                  key={sigIdx}
                                  className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 space-y-1 text-xs"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] uppercase font-mono text-indigo-400">
                                      Signal: {sig.signalType.replace("_", " ")}
                                    </span>
                                    {sig.scoreOrPrevalence && (
                                      <span className="text-[10px] font-mono text-zinc-400">
                                        {sig.scoreOrPrevalence}
                                      </span>
                                    )}
                                  </div>
                                  <div className="font-semibold text-zinc-200 text-xs truncate">
                                    {sig.citation}
                                  </div>
                                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                                    {sig.explanation}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Generic LLM Baseline Contrast */}
                      {(activeTab === "side_by_side" || activeTab === "generic") && genericMatch && (
                        <div className="p-4 rounded-xl bg-zinc-950 border border-red-900/20 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                              Generic LLM Guess (Without Qloo Data)
                            </span>
                            <Badge variant="danger" size="sm">
                              Untethered
                            </Badge>
                          </div>
                          <div className="text-xs font-semibold text-zinc-300">
                            {genericMatch.title}
                          </div>
                          <p className="text-xs text-zinc-400">
                            {genericMatch.description}
                          </p>
                          <div className="text-[11px] text-red-400/90 bg-red-950/20 p-2.5 rounded border border-red-900/30">
                            <strong>Why it fails:</strong> {genericMatch.critique}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* STAFF FEEDBACK & MEMORY REGENERATION LOOP */}
          <Card className="border-indigo-500/30 bg-zinc-900/70">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="info" size="sm">Staff Feedback Loop</Badge>
                  <CardTitle className="text-base">Operator Feedback & Agent Memory</CardTitle>
                </div>
                <span className="text-xs font-mono text-zinc-400">
                  {iterationCount === 0 ? "Initial Plan" : `Iteration #${iterationCount + 1}`}
                </span>
              </div>
              <CardDescription>
                Provide direct operational feedback to guide the agent. The agent logs adjustments in memory and re-weights Qloo signals for the regenerated plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Feedback Chips */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-zinc-300">Tag Quick Feedback:</span>
                <div className="flex flex-wrap gap-2">
                  {FEEDBACK_TAG_OPTIONS.map((tag) => {
                    const isSelected = selectedFeedbackTags.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleToggleTag(tag.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border",
                          isSelected
                            ? "bg-indigo-600 text-white border-indigo-500"
                            : "bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700"
                        )}
                      >
                        {tag.label} {isSelected && "✓"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Feedback Notes */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Custom Operator Notes / Constraints
                </label>
                <textarea
                  value={customFeedbackNote}
                  onChange={(e) => setCustomFeedbackNote(e.target.value)}
                  placeholder="e.g. We have limited cold-storage for fresh items, but we love the vinyl music concept and want to lean more into low-cost beverage infusions."
                  rows={2}
                  className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Active Memory Log Trail */}
              {planData.feedbackMemory?.agentMemoryLog && (
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-zinc-400">
                    Agent Memory Audit Trail:
                  </span>
                  <div className="space-y-1">
                    {planData.feedbackMemory.agentMemoryLog.map((log, lIdx) => (
                      <div key={lIdx} className="text-[11px] font-mono text-zinc-300 flex items-start gap-1.5">
                        <span className="text-indigo-400">&rarr;</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-zinc-400">
                  {selectedFeedbackTags.length > 0 || customFeedbackNote
                    ? "Feedback parameters ready to apply."
                    : "Select a feedback chip or type a note to update memory."}
                </span>
                <Button
                  variant="primary"
                  onClick={handleRegenerateWithMemory}
                  disabled={loading}
                >
                  Regenerate Plan with Memory →
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Responsible AI & Limitations Accordion */}
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-4 text-xs text-zinc-400 space-y-2">
            <span className="font-semibold text-zinc-300">Responsible AI & Implementation Guardrails:</span>
            <ul className="space-y-1 list-disc pl-4 text-[11px] text-zinc-400">
              {planData.responsibleAiLimitations.map((lim, idx) => (
                <li key={idx}>{lim}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
