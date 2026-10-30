"use client";

import React from "react";
import { TextRevealOnScroll } from "@/components/common/TextRevealOnScroll";

export interface GuideViewProps {
  onLaunchLogin?: () => void;
}

export function GuideView({ onLaunchLogin }: GuideViewProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6 px-4 sm:px-6 text-[#202E1D]">
      {/* Top Hero Card */}
      <div className="rounded-2xl border border-[#202E1D]/15 bg-[#FCFBF7] p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] bg-[#8F9A82]/20 text-[#202E1D] px-2.5 py-0.5 rounded-full">
            Platform Documentation &amp; User Manual
          </span>
          <span className="text-xs font-mono text-[#8F9A82]">&bull; Qloo Agentic Framework</span>
        </div>

        <TextRevealOnScroll
          as="h1"
          text="LocalMuse Ops Guide & Operational Manual"
          className="font-serif text-3xl sm:text-4xl text-[#202E1D]"
        />

        <p className="text-sm text-[#202E1D]/80 leading-relaxed max-w-3xl">
          Welcome to LocalMuse Ops. This guide walks you through the core philosophy of taste-driven operational intelligence, how the four Qloo toolchains interact, and how to operate the weekly culture planning copilot.
        </p>

        {onLaunchLogin && (
          <div className="pt-2">
            <button
              onClick={onLaunchLogin}
              className="px-5 py-2.5 rounded-full bg-[#EDD88B] hover:bg-[#E4CD7B] text-[#202E1D] text-xs font-semibold shadow-xs cursor-pointer inline-flex items-center gap-2"
            >
              <span>Sign In to Unlock Full Operational Workspace</span>
              <span>&rarr;</span>
            </button>
          </div>
        )}
      </div>

      {/* Philosophy: The Core Rule */}
      <div className="rounded-2xl bg-[#9BA58C] text-[#202E1D] p-8 space-y-4 border border-[#202E1D]/15">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#202E1D]/80">
          THE FUNDAMENTAL RULE
        </span>
        <TextRevealOnScroll
          as="h2"
          text="“If your project would work the same without Qloo, you're building the wrong thing.”"
          className="font-serif text-2xl sm:text-3xl font-normal leading-tight"
          color="#202E1D"
          mutedColor="rgba(32, 46, 29, 0.35)"
        />
        <p className="text-xs sm:text-sm text-[#202E1D]/85 leading-relaxed max-w-2xl">
          Generic LLMs generate ungrounded advice: discount happy hours, pop radio, stock photo marketing. LocalMuse Ops replaces guessing with empirical cross-domain taste vectors. Every recommendation cites verified cultural anchors, concept URNs, and trend trajectories.
        </p>
      </div>

      {/* The Five Core Modules Breakdown */}
      <div className="space-y-6">
        <TextRevealOnScroll
          as="h3"
          text="The Operational Modules"
          className="font-serif text-2xl text-[#202E1D]"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 rounded-2xl bg-[#FCFBF7] border border-[#202E1D]/15 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8F9A82]">
                Flagship Copilot
              </span>
              <span className="text-xs font-mono font-bold">/culture-plan</span>
            </div>
            <h4 className="font-serif text-lg font-semibold text-[#202E1D]">
              1. Weekly Culture Plan Copilot
            </h4>
            <p className="text-xs text-[#202E1D]/75 leading-relaxed">
              Synthesizes 6 concrete operational pillars: menu specials, vinyl soundscapes, destination events, consignment partnerships, merchandising, and social copy. Includes live generic LLM contrast and staff feedback memory.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FCFBF7] border border-[#202E1D]/15 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8F9A82]">
                Module 01
              </span>
              <span className="text-xs font-mono font-bold">/location-insights</span>
            </div>
            <h4 className="font-serif text-lg font-semibold text-[#202E1D]">
              2. Location Insights &amp; Anchors
            </h4>
            <p className="text-xs text-[#202E1D]/75 leading-relaxed">
              Extracts high-affinity cultural place anchors (peer venues), defining concept tag prevalence, and demographic age distribution for any category in any neighborhood.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FCFBF7] border border-[#202E1D]/15 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8F9A82]">
                Module 02
              </span>
              <span className="text-xs font-mono font-bold">/audience-comparison</span>
            </div>
            <h4 className="font-serif text-lg font-semibold text-[#202E1D]">
              3. Audience Contrast Mapping
            </h4>
            <p className="text-xs text-[#202E1D]/75 leading-relaxed">
              Compares cultural affinities between two markets (e.g. Austin vs. Nashville) to uncover shared baseline passions versus distinguishing local traits.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FCFBF7] border border-[#202E1D]/15 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8F9A82]">
                Module 03
              </span>
              <span className="text-xs font-mono font-bold">/local-trends</span>
            </div>
            <h4 className="font-serif text-lg font-semibold text-[#202E1D]">
              4. Local Trends &amp; Momentum
            </h4>
            <p className="text-xs text-[#202E1D]/75 leading-relaxed">
              Evaluates multi-quarter popularity momentum curves and reveals neighborhood affinity density heatmaps across local zip codes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FCFBF7] border border-[#202E1D]/15 space-y-2.5 md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8F9A82]">
                Module 04
              </span>
              <span className="text-xs font-mono font-bold">/recommendations</span>
            </div>
            <h4 className="font-serif text-lg font-semibold text-[#202E1D]">
              5. Tactical Recommendations &amp; Ranking
            </h4>
            <p className="text-xs text-[#202E1D]/75 leading-relaxed">
              Two-stage candidate discovery and ranking of operational initiatives (co-working passes, seasonal menus, programming) against specific goals with projected check-size impact.
            </p>
          </div>
        </div>
      </div>

      {/* Responsible AI & Privacy */}
      <div className="rounded-2xl border border-[#202E1D]/15 bg-[#FCFBF7] p-6 space-y-3">
        <h4 className="font-serif text-lg font-semibold text-[#202E1D]">
          Responsible AI &amp; Safe-Use Guardrails
        </h4>
        <ul className="space-y-1.5 text-xs text-[#202E1D]/75 list-disc pl-4 leading-relaxed">
          <li><strong>Aggregate Taste Affinities:</strong> Qloo outputs represent aggregate cultural tendencies across neighborhoods, not individual personal truths.</li>
          <li><strong>Zero PII:</strong> LocalMuse Ops never requests, stores, or transmits personal customer data, emails, or biometric identifiers.</li>
          <li><strong>Decision Support:</strong> All plans are strategic decision-support aids; operational safety, pricing compliance, and execution remain with the venue operator.</li>
        </ul>
      </div>
    </div>
  );
}
