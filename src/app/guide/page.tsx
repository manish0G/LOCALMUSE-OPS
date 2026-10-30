"use client";

import React from "react";
import { AppShell } from "@/components/common/AppShell";
import { GuideView } from "@/components/guide/GuideView";

export default function GuidePage() {
  return (
    <AppShell
      activeNavId="guide"
      title="Operator Manual & Cultural Intelligence Guide"
      description="Architecture reference, Qloo MCP protocol specification, and field operational guides"
    >
      <div className="p-4 sm:p-6 lg:p-8">
        <GuideView />
      </div>
    </AppShell>
  );
}
