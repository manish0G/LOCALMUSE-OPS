"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/AuthContext";
import { DEMO_PERSONAS } from "@/lib/auth";
import type { OperationMode } from "@/types";

export interface AppHeaderProps {
  title?: string;
  description?: string;
  mode?: OperationMode;
  onToggleMode?: () => void;
  isBackendOnline?: boolean;
  isMcpConnected?: boolean;
  onMobileMenuToggle?: () => void;
  className?: string;
}

export function AppHeader({
  title = "Operations & Cultural Intelligence",
  description = "Taste-powered local market intelligence for independent enterprises",
  mode = "demo",
  onToggleMode,
  isBackendOnline = true,
  isMcpConnected = true,
  onMobileMenuToggle,
  className
}: AppHeaderProps) {
  const { isAuthenticated, currentPersona, openLoginModal, logout, switchPersona } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "h-16 border-b border-[#202E1D]/10 bg-[#FAF8F2]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 z-10 text-[#202E1D]",
        className
      )}
    >
      {/* Left: Mobile trigger & view title */}
      <div className="flex items-center gap-3 min-w-0 text-left">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 -ml-2 rounded-lg text-[#202E1D]/70 hover:text-[#202E1D] hover:bg-[#8F9A82]/10 transition-colors cursor-pointer"
          aria-label="Toggle Navigation Drawer"
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div className="flex flex-col truncate">
          <h1 className="font-serif text-base sm:text-lg font-normal text-[#202E1D] truncate tracking-tight">
            {title}
          </h1>
          <p className="hidden sm:block text-xs text-[#202E1D]/65 truncate font-sans">
            {description}
          </p>
        </div>
      </div>

      {/* Right: Connection status & Mode toggle & Auth */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Backend health status pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#202E1D]/12 bg-white/70 text-[11px] font-mono text-[#202E1D]/80">
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full shrink-0",
              isBackendOnline && isMcpConnected ? "bg-emerald-600 animate-pulse" : "bg-zinc-400"
            )}
          />
          <span>{isBackendOnline ? "Backend Connected (Port 4000)" : "Connecting..."}</span>
        </div>

        {/* Mode switcher button */}
        <button
          onClick={onToggleMode}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#202E1D]/15 bg-white/80 hover:bg-white transition-colors text-xs text-[#202E1D] font-medium cursor-pointer shadow-2xs"
          title="Switch between Demo Curated Fixtures and Live Qloo MCP Mode"
        >
          <span className="text-[11px] text-[#202E1D]/65 hidden sm:inline font-mono">Mode:</span>
          {mode === "demo" ? (
            <Badge variant="warning" size="sm" dot>
              Demo Fixtures
            </Badge>
          ) : (
            <Badge variant="success" size="sm" dot pulse>
              Live Qloo
            </Badge>
          )}
        </button>

        {/* Auth status & role controls */}
        {!isAuthenticated ? (
          <button
            onClick={openLoginModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EDD88B] hover:bg-[#E4CD7B] text-[#202E1D] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-[#202E1D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Sign In</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#202E1D]/15 bg-white/90 text-xs text-[#202E1D] hover:bg-white transition-colors cursor-pointer shadow-2xs"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="font-sans text-[11px] font-medium truncate max-w-[120px] sm:max-w-[160px]">
                  {currentPersona?.roleTitle ?? "Operator"}
                </span>
                <svg className="w-3 h-3 text-[#202E1D]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#F6F4EB] border border-[#202E1D]/20 shadow-2xl p-2 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[10px] font-mono uppercase text-[#8F9A82] px-3 py-1 font-bold">
                    Switch Active Persona
                  </div>
                  <div className="space-y-1 mt-1">
                    {DEMO_PERSONAS.map((p) => {
                      const isCurrent = currentPersona?.id === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            switchPersona(p);
                            setRoleMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                            isCurrent
                              ? "bg-white text-[#202E1D] font-bold border border-[#202E1D]/20 shadow-2xs"
                              : "text-[#202E1D]/80 hover:bg-white/60 hover:text-[#202E1D]"
                          }`}
                        >
                          <div className="truncate">
                            <div className="truncate font-serif font-semibold">{p.businessName}</div>
                            <div className="text-[10px] text-[#8F9A82] truncate font-mono">{p.roleTitle}</div>
                          </div>
                          {isCurrent && (
                            <svg className="w-3.5 h-3.5 text-[#8F9A82] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-full border border-[#202E1D]/15 bg-white/80 text-[#202E1D]/70 hover:text-rose-700 hover:bg-white transition-colors cursor-pointer shadow-2xs"
              aria-label="Sign Out"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
