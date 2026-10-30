"use client";

import React, { useState } from "react";
import { useCulturePlan } from "@/hooks/useCulturePlan";
import { useOperationMode } from "@/hooks/useOperationMode";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TextRevealOnScroll } from "@/components/common/TextRevealOnScroll";
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

  const { data, loading, error, execute } = useCulturePlan();

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
    <div className="max-w-6xl mx-auto space-y-8 pb-16 text-[#202E1D] selection:bg-[#EDD88B]">
      {/* Top Banner / Hero */}
      <div className="relative rounded-3xl border border-[#202E1D]/12 bg-[#FCFBF7] p-6 sm:p-8 overflow-hidden shadow-2xs text-left">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <Badge variant="warning" size="sm">
                Flagship Copilot
              </Badge>
              <span className="text-[11px] text-[#8F9A82] font-mono">Module 05 &bull; Agentic Planner</span>
            </div>
            <TextRevealOnScroll
              as="h1"
              text="Weekly Culture Plan Copilot"
              className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#202E1D]"
            />
            <p className="text-xs sm:text-sm text-[#202E1D]/75 leading-relaxed font-sans">
              Transforms macro cultural taste data into an actionable weekly operating rhythm for independent hospitality & retail. Every recommendation is verified against Qloo signals, contrasted with generic AI, and refined through staff feedback memory.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {PRESET_SCENARIOS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadPreset(preset)}
                className="px-3.5 py-1.5 rounded-full border border-[#202E1D]/15 bg-white hover:bg-[#FAF8F2] text-[#202E1D] text-xs font-mono transition-colors shadow-2xs cursor-pointer"
              >
                Preset {idx + 1}: {preset.label.split(":")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Onboarding & Input Form Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Business Onboarding &amp; Cultural Context</CardTitle>
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
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#202E1D]/80 mb-1.5">Business Name</label>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Flat Track Coffee"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#202E1D]/80 mb-1.5">Business Type</label>
                <Input
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  placeholder="e.g. Specialty Coffee & Roastery"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#202E1D]/80 mb-1.5">City / Market</label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Austin, TX"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#202E1D]/80 mb-1.5">Neighborhood / District</label>
                <Input
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="e.g. East Austin (Cesar Chavez)"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#202E1D]/80 mb-1.5">Price Band</label>
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
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#202E1D]/80 mb-1.5">Target Demographic</label>
                <Input
                  value={targetCustomer}
                  onChange={(e) => setTargetCustomer(e.target.value)}
                  placeholder="e.g. Remote creatives & young professionals"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#202E1D]/80 mb-1.5">Aesthetic Vibe &amp; Current Style</label>
                <Input
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  placeholder="e.g. Minimalist design-forward with analog audio appreciation"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#202E1D]/80 mb-1.5">Primary Operational Goal</label>
                <Input
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Increase weekday afternoon footfall and boost average ticket size"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#202E1D]/10">
              <span className="text-xs text-[#202E1D]/65 font-mono">
                Mode: <strong className="text-[#202E1D] uppercase font-bold">{mode}</strong> (Curated demo fixtures active)
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
        <div className="space-y-8 animate-in fade-in duration-300 text-left">
          {/* Header Controls Strip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-[#202E1D]/12 bg-[#FCFBF7]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#202E1D] font-mono uppercase tracking-wider">
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
              <p className="text-xs text-[#202E1D]/70 font-sans">
                Operating rhythm for <strong>{planData.business.name}</strong> ({planData.business.neighborhood})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyPlanMarkdown}>
                {copiedPlan ? "Copied Markdown" : "Export Plan (Markdown)"}
              </Button>
            </div>
          </div>

          {/* Mode Comparison: Qloo Cultural AI vs. Generic Baseline */}
          <div className="rounded-3xl border border-[#8F9A82]/30 bg-[#8F9A82]/15 p-6 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#202E1D]/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="warning" size="sm">
                    Empirical Benchmark
                  </Badge>
                  <span className="font-serif text-lg font-normal text-[#202E1D]">
                    Qloo Cultural AI vs. Generic LLM Baseline
                  </span>
                </div>
                <p className="text-xs text-[#202E1D]/75 mt-1 font-sans">
                  &ldquo;If your project would work the same without Qloo, you&apos;re building the wrong thing.&rdquo; Contrast Qloo&apos;s grounded signals against a generic LLM prompt guess.
                </p>
              </div>

              {/* View Switcher Pills */}
              <div className="flex items-center bg-white/80 p-1 rounded-full border border-[#202E1D]/15 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("side_by_side")}
                  className={cn(
                    "px-3.5 py-1.5 text-xs rounded-full font-medium transition-colors cursor-pointer",
                    activeTab === "side_by_side"
                      ? "bg-[#EDD88B] text-[#202E1D] font-bold shadow-2xs"
                      : "text-[#202E1D]/70 hover:text-[#202E1D]"
                  )}
                >
                  Side-by-Side View
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("qloo")}
                  className={cn(
                    "px-3.5 py-1.5 text-xs rounded-full font-medium transition-colors cursor-pointer",
                    activeTab === "qloo"
                      ? "bg-[#202E1D] text-white font-bold shadow-2xs"
                      : "text-[#202E1D]/70 hover:text-[#202E1D]"
                  )}
                >
                  Qloo Mode (Grounded)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("generic")}
                  className={cn(
                    "px-3.5 py-1.5 text-xs rounded-full font-medium transition-colors cursor-pointer",
                    activeTab === "generic"
                      ? "bg-[#202E1D] text-white font-bold shadow-2xs"
                      : "text-[#202E1D]/70 hover:text-[#202E1D]"
                  )}
                >
                  Generic AI (Guessing)
                </button>
              </div>
            </div>

            {/* Comparative Radar/Bar Scorecard */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-1">
              {planData.comparativeScores.map((score, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white border border-[#202E1D]/12 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#202E1D]">{score.metric}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[#8F9A82] font-bold">Qloo: {score.qlooScore}%</span>
                      <span className="text-[#202E1D]/60">Generic: {score.genericScore}%</span>
                    </div>
                    {/* Visual Progress Bars */}
                    <div className="h-1.5 w-full bg-[#8F9A82]/20 rounded-full overflow-hidden flex">
                      <div
                        className="bg-[#8F9A82] h-full rounded-l-full"
                        style={{ width: `${score.qlooScore}%` }}
                      />
                    </div>
                    <div className="h-1 w-full bg-[#202E1D]/10 rounded-full overflow-hidden">
                      <div
                        className="bg-[#202E1D]/40 h-full rounded-full"
                        style={{ width: `${score.genericScore}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-[#202E1D]/70 line-clamp-2 leading-relaxed font-sans">
                    {score.advantageAnalysis}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Thesis Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-[#8F9A82]/30 bg-white">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="info" size="sm">Qloo Strategic Thesis</Badge>
                  <span className="text-xs font-mono text-[#8F9A82] font-bold">Grounded Engine</span>
                </div>
                <CardTitle className="text-base text-[#202E1D] pt-1">Targeted Cultural Rationale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-[#202E1D]/80 leading-relaxed font-sans">
                <p>{planData.qlooPlan.strategicThesis}</p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {planData.qlooPlan.demographicFocus.topAffinities.map((aff, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-full bg-[#8F9A82]/15 border border-[#8F9A82]/30 text-[10px] text-[#202E1D] font-mono">
                      {aff}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#202E1D]/12 bg-[#FCFBF7]">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="neutral" size="sm">Generic LLM Guess</Badge>
                  <span className="text-xs font-mono text-[#202E1D]/50">Untethered Advice</span>
                </div>
                <CardTitle className="text-base text-[#202E1D]/75 pt-1">Standard Small-Business Playbook</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-[#202E1D]/70 leading-relaxed font-sans">
                <p>{planData.genericPlan.strategicThesis}</p>
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800 mt-2">
                  <strong>Flaw:</strong> Lacks neighborhood taste awareness. Assumes price discounting and generic social posting will resolve structural footfall issues.
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section Header */}
          <SectionHeader
            badge={<Badge variant="warning" size="sm">Actionable Weekly Cadence</Badge>}
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
                  className="rounded-2xl border border-[#202E1D]/12 bg-[#FCFBF7] overflow-hidden transition-all shadow-2xs hover:border-[#202E1D]/25"
                >
                  {/* Pillar Top Header */}
                  <div
                    className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer bg-[#FAF8F2]/60 select-none hover:bg-[#FAF8F2]"
                    onClick={() => setExpandedPillarId(isExpanded ? null : pillar.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#EDD88B]/40 border border-[#EDD88B] flex items-center justify-center text-xs font-bold text-[#202E1D] shrink-0 font-mono">
                        0{idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-[#8F9A82] uppercase tracking-wider">
                            Pillar: {pillar.category}
                          </span>
                          <span className="text-xs text-[#202E1D]/30">&bull;</span>
                          <span className="text-xs text-[#202E1D]/70 font-mono">{pillar.timing}</span>
                        </div>
                        <h3 className="font-serif text-base sm:text-lg font-normal text-[#202E1D] leading-snug">
                          {pillar.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="success" size="sm">
                        {pillar.projectedImpact.split(";")[0]}
                      </Badge>
                      <button
                        type="button"
                        className="text-xs text-[#202E1D]/75 hover:text-[#202E1D] px-3 py-1 rounded-full border border-[#202E1D]/15 bg-white shadow-2xs font-sans"
                      >
                        {isExpanded ? "Collapse ▲" : "View Details & Provenance ▼"}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Body Content */}
                  {isExpanded && (
                    <div className="p-4 sm:p-6 border-t border-[#202E1D]/10 space-y-5 bg-white/70">
                      {/* Comparison Columns if side_by_side or specific tab */}
                      {(activeTab === "side_by_side" || activeTab === "qloo") && (
                        <div className="space-y-4">
                          <div className="p-4 sm:p-5 rounded-2xl bg-[#FCFBF7] border border-[#202E1D]/12 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#8F9A82] font-mono uppercase tracking-wider">
                                Qloo Recommended Action &amp; Implementation
                              </span>
                              <span className="text-[11px] font-mono text-[#202E1D]/70">
                                Projected: {pillar.projectedImpact}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-[#202E1D]/80 leading-relaxed font-sans">
                              {pillar.description}
                            </p>
                            <div className="space-y-1.5 pt-1">
                              <span className="text-xs font-semibold text-[#202E1D]">Action Steps:</span>
                              <ul className="space-y-1.5">
                                {pillar.actionItems.map((step, sIdx) => (
                                  <li key={sIdx} className="text-xs text-[#202E1D]/80 flex items-start gap-2 font-sans">
                                    <span className="text-[#8F9A82] shrink-0 font-bold">&bull;</span>
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Social Copy Quick Action if Marketing */}
                            {pillar.category === "marketing" && (
                              <div className="mt-3 p-3.5 rounded-xl bg-white border border-[#202E1D]/12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                                <span className="text-xs font-mono text-[#202E1D]/80 truncate">
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
                          <div className="rounded-2xl border border-[#202E1D]/12 bg-[#FCFBF7] p-4 sm:p-5 space-y-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="neutral" size="sm">Qloo Provenance Card</Badge>
                              <span className="font-serif text-sm font-semibold text-[#202E1D]">
                                Signals Driving This Recommendation
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                              {pillar.qlooSignals.map((sig, sigIdx) => (
                                <div
                                  key={sigIdx}
                                  className="p-3.5 rounded-xl bg-white border border-[#202E1D]/10 space-y-1 text-xs shadow-2xs"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] uppercase font-mono text-[#8F9A82] font-semibold">
                                      Signal: {sig.signalType.replace("_", " ")}
                                    </span>
                                    {sig.scoreOrPrevalence && (
                                      <span className="text-[10px] font-mono text-[#202E1D]/60">
                                        {sig.scoreOrPrevalence}
                                      </span>
                                    )}
                                  </div>
                                  <div className="font-serif font-semibold text-[#202E1D] text-sm truncate">
                                    {sig.citation}
                                  </div>
                                  <p className="text-[11px] text-[#202E1D]/70 leading-relaxed font-sans">
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
                        <div className="p-4 sm:p-5 rounded-2xl bg-[#FCFBF7] border border-rose-200/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#202E1D]/70 font-mono uppercase tracking-wider">
                              Generic LLM Guess (Without Qloo Data)
                            </span>
                            <Badge variant="danger" size="sm">
                              Untethered
                            </Badge>
                          </div>
                          <div className="font-serif text-base font-semibold text-[#202E1D]">
                            {genericMatch.title}
                          </div>
                          <p className="text-xs text-[#202E1D]/75 font-sans">
                            {genericMatch.description}
                          </p>
                          <div className="text-[11px] text-rose-900 bg-rose-50 p-3 rounded-xl border border-rose-200 font-sans">
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
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="warning" size="sm">Staff Feedback Loop</Badge>
                  <CardTitle className="text-base sm:text-lg">Operator Feedback &amp; Agent Memory</CardTitle>
                </div>
                <span className="text-xs font-mono text-[#8F9A82]">
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
                <span className="text-xs font-mono uppercase text-[#202E1D]/80 block">Tag Quick Feedback:</span>
                <div className="flex flex-wrap gap-2">
                  {FEEDBACK_TAG_OPTIONS.map((tag) => {
                    const isSelected = selectedFeedbackTags.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleToggleTag(tag.id)}
                        className={cn(
                          "px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer border shadow-2xs",
                          isSelected
                            ? "bg-[#202E1D] text-white border-[#202E1D]"
                            : "bg-white text-[#202E1D] border-[#202E1D]/15 hover:bg-[#FAF8F2]"
                        )}
                      >
                        <span>{tag.label}</span>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white ml-1 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Feedback Notes */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#202E1D]/80 mb-1.5">
                  Custom Operator Notes / Constraints
                </label>
                <textarea
                  value={customFeedbackNote}
                  onChange={(e) => setCustomFeedbackNote(e.target.value)}
                  placeholder="e.g. We have limited cold-storage for fresh items, but we love the vinyl music concept and want to lean more into low-cost beverage infusions."
                  rows={2}
                  className="w-full rounded-xl bg-white border border-[#202E1D]/20 p-3 text-xs text-[#202E1D] placeholder:text-[#202E1D]/40 focus:outline-hidden focus:ring-1 focus:ring-[#8F9A82] shadow-2xs font-sans"
                />
              </div>

              {/* Active Memory Log Trail */}
              {planData.feedbackMemory?.agentMemoryLog && (
                <div className="p-3.5 rounded-xl bg-white border border-[#202E1D]/12 space-y-1.5 shadow-2xs">
                  <span className="text-[10px] font-mono uppercase text-[#8F9A82] font-semibold">
                    Agent Memory Audit Trail:
                  </span>
                  <div className="space-y-1">
                    {planData.feedbackMemory.agentMemoryLog.map((log, lIdx) => (
                      <div key={lIdx} className="text-[11px] font-mono text-[#202E1D]/80 flex items-start gap-1.5">
                        <span className="text-[#8F9A82] font-bold">&rarr;</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#202E1D]/70 font-sans">
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
          <div className="rounded-2xl border border-[#202E1D]/12 bg-[#FCFBF7] p-5 text-xs text-[#202E1D]/75 space-y-2">
            <span className="font-serif text-sm font-semibold text-[#202E1D]">Responsible AI &amp; Implementation Guardrails:</span>
            <ul className="space-y-1 list-disc pl-4 text-[11px] text-[#202E1D]/70 font-sans">
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
