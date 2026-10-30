"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { DEMO_PERSONAS, type UserPersona } from "@/lib/auth";

export interface TopNavbarProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  className?: string;
  isLiveAvailable?: boolean;
}

export function TopNavbar({
  activeScreen,
  onNavigate,
  className = "",
  isLiveAvailable = false
}: TopNavbarProps) {
  const { isAuthenticated, currentPersona, openLoginModal, logout, switchPersona } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const allNavItems = [
    { id: "overview", label: "Overview", protected: false },
    { id: "culture-plan", label: "Weekly Culture Plan", protected: true },
    { id: "location-insights", label: "Location Insights", protected: true },
    { id: "compare-audiences", label: "Audience Comparison", protected: true },
    { id: "local-trends", label: "Local Trends", protected: true },
    { id: "recommendations", label: "Recommendations", protected: true },
    { id: "guide", label: "Guide", protected: false },
  ];

  // Gated navigation: unauthenticated users ONLY see Overview and Guide at start
  const visibleNavItems = allNavItems.filter((item) => {
    if (!isAuthenticated) {
      return !item.protected; // Only overview and guide
    }
    return true; // All options when logged in
  });

  const handleNavClick = (item: (typeof allNavItems)[0]) => {
    if (item.protected && !isAuthenticated) {
      openLoginModal();
      return;
    }
    onNavigate(item.id);
  };

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md bg-[#F6F4EB]/90 border-b border-[#202E1D]/10 px-4 sm:px-8 py-3 transition-all ${className}`}>
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity */}
        <div
          onClick={() => onNavigate("overview")}
          className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none"
        >
          <div className="w-9 h-9 rounded-full bg-[#202E1D] flex items-center justify-center text-white shadow-xs hover:scale-105 transition-transform">
            <span className="font-serif italic font-bold text-base text-[#EDD88B]">L</span>
          </div>
          <div className="text-left leading-none">
            <span className="font-serif text-xl tracking-tight text-[#202E1D] font-normal block">
              LocalMuse <span className="italic font-serif">Ops</span>
            </span>
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#8F9A82] font-semibold">
              Taste &bull; Cultural Intelligence
            </span>
          </div>
        </div>

        {/* Center: Glass Bubble Nav — Dynamic Top Navigation */}
        <nav className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium text-[#202E1D]/80 overflow-x-auto py-1 scrollbar-none">
          {visibleNavItems.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`px-3.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer whitespace-nowrap text-xs ${
                  isActive
                    ? "text-[#202E1D] font-bold bg-[#FAF8F2] border-[#202E1D]/30 shadow-xs ring-1 ring-[#202E1D]/20"
                    : "bg-[#FAF8F2]/60 border-transparent hover:bg-[#FAF8F2] hover:border-[#202E1D]/20 text-[#202E1D]/75"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Auth Controls & Operator Status */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Status Indicator */}
          <div className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#202E1D]/10 bg-white/60 text-[#202E1D] text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>Port 4000 Connected</span>
          </div>

          {!isAuthenticated ? (
            /* Unauthenticated: Clean Sign In button (opens Suraksha Login Scene) */
            <button
              onClick={openLoginModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#202E1D] hover:bg-[#172215] text-white text-xs font-medium transition shadow-sm cursor-pointer hover:scale-[1.02]"
            >
              <svg className="w-3.5 h-3.5 text-[#EDD88B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Operator Sign In</span>
            </button>
          ) : (
            /* Authenticated: Active Persona Pill + Dropdown Switcher + Sign Out */
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#202E1D] hover:bg-[#172215] text-white text-xs font-medium transition shadow-sm cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 text-[#EDD88B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-sans text-[11px] text-white/95 truncate max-w-[150px] sm:max-w-[200px]">
                    {currentPersona?.roleTitle ?? "Authorized Operator"}
                  </span>
                  <svg className="w-3 h-3 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {roleMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#F6F4EB] border border-[#202E1D]/20 shadow-2xl p-2.5 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
                    <div className="text-[10px] font-mono uppercase text-[#8F9A82] px-3 py-1 font-bold">
                      Switch Active Persona (Instant)
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
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-start justify-between transition-colors cursor-pointer ${
                              isCurrent
                                ? "bg-white text-[#202E1D] font-bold border border-[#202E1D]/20 shadow-2xs"
                                : "text-[#202E1D]/80 hover:bg-white/60 hover:text-[#202E1D]"
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <div className="font-semibold text-[#202E1D] truncate">
                                {p.businessName}
                              </div>
                              <div className="text-[10px] text-[#8F9A82] truncate font-mono">
                                {p.roleTitle} &bull; {p.location}
                              </div>
                            </div>
                            {isCurrent && (
                              <span className="text-[#8F9A82] font-bold text-sm shrink-0">✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Sign Out Button */}
              <button
                onClick={logout}
                title="Sign Out of Session"
                className="p-2 rounded-full border border-[#202E1D]/20 bg-white/60 hover:bg-[#FAF8F2] text-[#202E1D]/80 hover:text-[#202E1D] transition cursor-pointer"
                aria-label="Sign Out"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
