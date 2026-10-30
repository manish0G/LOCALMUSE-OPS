"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { useBackendHealth } from "@/hooks/useBackendHealth";
import { useOperationMode, OperationModeProvider } from "@/hooks/useOperationMode";
import type { OperationMode } from "@/types";

export interface AppShellProps {
  children: React.ReactNode;
  activeNavId?: string;
  onSelectNav?: (id: string) => void;
  title?: string;
  description?: string;
  mode?: OperationMode;
  onToggleMode?: () => void;
  className?: string;
}

function AppShellInner({
  children,
  activeNavId = "overview",
  onSelectNav,
  title,
  description,
  className
}: Omit<AppShellProps, "mode" | "onToggleMode">) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { mode, toggleMode } = useOperationMode();
  const { health, isLiveAvailable, isMcpConnected } = useBackendHealth({ autoFetch: true });

  const isBackendOnline = health?.status === "online";

  const handleSelectNav = (id: string) => {
    if (onSelectNav) {
      onSelectNav(id);
      return;
    }
    if (id === "overview") router.push("/");
    else if (id === "culture-plan") router.push("/culture-plan");
    else if (id === "location-insights") router.push("/location-insights");
    else if (id === "compare-audiences") router.push("/audience-comparison");
    else if (id === "local-trends") router.push("/local-trends");
  };

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <AppSidebar
        activeId={activeNavId}
        onSelectNav={handleSelectNav}
        mode={mode}
        isLiveAvailable={isLiveAvailable}
        className="hidden md:flex"
      />

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 transform transition-transform duration-200 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <AppSidebar
          activeId={activeNavId}
          onSelectNav={(id) => {
            handleSelectNav(id);
            setMobileMenuOpen(false);
          }}
          mode={mode}
          isLiveAvailable={isLiveAvailable}
          className="w-full h-full"
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AppHeader
          title={title}
          description={description}
          mode={mode}
          onToggleMode={toggleMode}
          isBackendOnline={isBackendOnline}
          isMcpConnected={isMcpConnected}
          onMobileMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
        />

        {/* Scrollable Page Body */}
        <main className={cn("flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8", className)}>
          {children}
        </main>
      </div>
    </div>
  );
}

export function AppShell(props: AppShellProps) {
  return (
    <OperationModeProvider
      mode={props.mode}
      onToggleMode={props.onToggleMode}
    >
      <AppShellInner
        activeNavId={props.activeNavId}
        onSelectNav={props.onSelectNav}
        title={props.title}
        description={props.description}
        className={props.className}
      >
        {props.children}
      </AppShellInner>
    </OperationModeProvider>
  );
}
