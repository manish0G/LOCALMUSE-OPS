"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { LoginPage } from "@/components/auth/LoginPage";
import { useAuth } from "@/lib/AuthContext";
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
  const {
    isAuthenticated,
    userSession,
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    login,
    logout
  } = useAuth();

  const isBackendOnline = health?.status === "online";

  const handleSelectNav = (id: string) => {
    // Protected workflow gating: prompt Suraksha login modal if unauthenticated
    const protectedIds = ["culture-plan", "location-insights", "compare-audiences", "local-trends", "recommendations"];
    if (protectedIds.includes(id) && !isAuthenticated) {
      openLoginModal();
      return;
    }

    if (onSelectNav) {
      onSelectNav(id);
      return;
    }

    if (id === "overview") router.push("/");
    else if (id === "guide") router.push("/guide");
    else if (id === "culture-plan") router.push("/culture-plan");
    else if (id === "location-insights") router.push("/location-insights");
    else if (id === "compare-audiences") router.push("/audience-comparison");
    else if (id === "local-trends") router.push("/local-trends");
    else if (id === "recommendations") router.push("/recommendations");
  };

  if (activeNavId === "overview") {
    return (
      <div className="min-h-screen w-full bg-[#F6F4EB] text-[#202E1D] font-sans">
        <main className={cn("w-full bg-[#F6F4EB] text-[#202E1D]", className)}>
          {children}
        </main>

        {/* Suraksha-Style Login Scene Modal */}
        {isLoginModalOpen && (
          <LoginPage
            onLoginSuccess={(session) => {
              login(session.user);
            }}
            onCancel={closeLoginModal}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-[#F6F4EB] text-[#202E1D] font-sans">
      {/* Desktop Sidebar (pinned sticky while main scrolls) */}
      <AppSidebar
        activeId={activeNavId}
        onSelectNav={handleSelectNav}
        mode={mode}
        isLiveAvailable={isLiveAvailable}
        isAuthenticated={isAuthenticated}
        userSession={userSession}
        onLoginClick={openLoginModal}
        onLogoutClick={logout}
        className="hidden md:flex sticky top-0 h-screen shrink-0"
      />

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[#FAF8F2] transform transition-transform duration-200 ease-in-out md:hidden shadow-2xl",
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
          isAuthenticated={isAuthenticated}
          userSession={userSession}
          onLoginClick={openLoginModal}
          onLogoutClick={logout}
          className="w-full h-full"
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 bg-[#F6F4EB]">
        <AppHeader
          title={title}
          description={description}
          mode={mode}
          onToggleMode={toggleMode}
          isBackendOnline={isBackendOnline}
          isMcpConnected={isMcpConnected}
          onMobileMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
        />

        {/* Page Body */}
        <main className={cn("flex-1 p-4 sm:p-6 lg:p-8 bg-[#F6F4EB] text-[#202E1D]", className)}>
          {children}
        </main>
      </div>

      {/* Suraksha-Style Login Scene Modal */}
      {isLoginModalOpen && (
        <LoginPage
          onLoginSuccess={(session) => {
            login(session.user);
          }}
          onCancel={closeLoginModal}
        />
      )}
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
