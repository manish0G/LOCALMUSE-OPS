"use client";

import React from "react";
import { AppShell } from "@/components/common/AppShell";
import { RecommendationsView } from "@/components/recommendations/RecommendationsView";

export default function RecommendationsPage() {
  return (
    <AppShell
      activeNavId="recommendations"
      title="Tactical Recommendations"
      description="Two-stage candidate discovery and ranking of operational initiatives against strategic goals"
    >
      <RecommendationsView />
    </AppShell>
  );
}
