"use client";

import React from "react";
import { AppShell } from "@/components/common/AppShell";
import { CulturePlanView } from "@/components/culture-plan/CulturePlanView";

export default function CulturePlanPage() {
  return (
    <AppShell
      activeNavId="culture-plan"
      title="Weekly Culture Plan Copilot"
      description="Agentic weekly operating rhythm, Qloo vs Generic mode benchmark & feedback memory"
    >
      <CulturePlanView />
    </AppShell>
  );
}
