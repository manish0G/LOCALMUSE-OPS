"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { APP_CONFIG, NAV_ITEMS } from "@/constants";
import { Badge } from "@/components/ui/Badge";
import type { OperationMode } from "@/types";
import type { UserSession } from "@/lib/auth";

export interface AppSidebarProps {
  activeId?: string;
  onSelectNav?: (id: string) => void;
  mode?: OperationMode;
  isLiveAvailable?: boolean;
  isAuthenticated?: boolean;
  userSession?: UserSession | null;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  className?: string;
}

export function AppSidebar({
  activeId = "overview",
  onSelectNav,
  mode = "demo",
  isLiveAvailable = false,
  isAuthenticated = false,
  userSession,
  onLoginClick,
  onLogoutClick,
  className
}: AppSidebarProps) {
  // SVG Icon mappings for navigation
  const getNavIcon = (id: string, isActive: boolean) => {
    const iconClass = cn(
      "w-4 h-4 shrink-0 transition-colors",
      isActive ? "text-[#202E1D]" : "text-[#8F9A82] group-hover:text-[#202E1D]"
    );

    switch (id) {
      case "overview":
        return (
          <svg className={iconClass} viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        );
      case "culture-plan":
        return (
          <svg className={iconClass} viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6zm0 4a1 1 0 100 2h5a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "location-insights":
        return (
          <svg className={iconClass} viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433 1.244-.77 2.92-1.996 4.348-3.66 1.427-1.663 2.28-3.488 2.28-5.192C18 4.418 14.418 1 10 1S2 4.418 2 9.5c0 1.704.853 3.529 2.28 5.192 1.428 1.664 3.104 2.89 4.348 3.66.311.193.571.337.757.433a5.74 5.74 0 00.28.14l.019.008.006.003zM10 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "compare-audiences":
        return (
          <svg className={iconClass} viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
        );
      case "local-trends":
        return (
          <svg className={iconClass} viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M12 3a1 1 0 011 1v3.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0L8 7.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 8.586V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "recommendations":
        return (
          <svg className={iconClass} viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      case "guide":
        return (
          <svg className={iconClass} viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // When not authenticated, show only Overview and Guide!
  const visibleNavItems = isAuthenticated
    ? NAV_ITEMS
    : NAV_ITEMS.filter((item) => item.id === "overview" || item.id === "guide");

  return (
    <aside
      className={cn(
        "w-64 bg-[#FAF8F2] border-r border-[#202E1D]/10 text-[#202E1D] flex flex-col h-full shrink-0 select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div
        onClick={() => onSelectNav?.("overview")}
        className="p-5 border-b border-[#202E1D]/10 flex items-center gap-3 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-[#202E1D] flex items-center justify-center text-white shadow-2xs">
          <span className="font-serif italic font-bold text-sm text-[#EDD88B]">L</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="font-serif text-lg font-normal tracking-tight text-[#202E1D] leading-none">
            LocalMuse <span className="italic font-serif">Ops</span>
          </span>
          <span className="text-[9px] text-[#8F9A82] font-mono tracking-wider uppercase mt-0.5">
            Workbench
          </span>
        </div>
      </div>

      {/* Mode Status Pill */}
      <div className="px-5 py-3 border-b border-[#202E1D]/10 bg-[#8F9A82]/10">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#202E1D]/70 text-[11px] font-mono">Engine:</span>
          {mode === "demo" ? (
            <Badge variant="warning" size="sm" dot>
              Demo Fixtures
            </Badge>
          ) : (
            <Badge variant={isLiveAvailable ? "success" : "danger"} size="sm" dot pulse={isLiveAvailable}>
              {isLiveAvailable ? "Live Qloo" : "No Key"}
            </Badge>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-[#8F9A82] uppercase tracking-wider font-mono">
          {isAuthenticated ? "Workflows" : "Public Pages"}
        </div>
        {visibleNavItems.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectNav?.(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left group cursor-pointer",
                isActive
                  ? "bg-[#EDD88B] text-[#202E1D] font-bold border border-[#202E1D]/15 shadow-2xs"
                  : "text-[#202E1D]/75 hover:text-[#202E1D] hover:bg-[#8F9A82]/10"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {getNavIcon(item.id, isActive)}
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/70 text-[#202E1D] font-mono border border-[#202E1D]/10">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Not authenticated CTA box */}
        {!isAuthenticated && onLoginClick && (
          <div className="pt-4 px-1">
            <div className="p-3.5 rounded-2xl bg-white/80 border border-[#202E1D]/15 text-[#202E1D] space-y-2 text-left shadow-2xs">
              <span className="text-xs font-semibold text-[#202E1D] block">
                Operator Workspace
              </span>
              <p className="text-[11px] text-[#202E1D]/70 leading-relaxed font-sans">
                Sign in with a demo persona to unlock the Weekly Culture Plan and all operational modules.
              </p>
              <button
                type="button"
                onClick={onLoginClick}
                className="w-full py-1.5 rounded-full bg-[#EDD88B] hover:bg-[#E4CD7B] text-[#202E1D] text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
              >
                Sign In &rarr;
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* User Session Footer or Standard Footer */}
      {isAuthenticated && userSession ? (
        <div className="p-4 border-t border-[#202E1D]/10 bg-[#FCFBF7] text-[11px] space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-[#8F9A82] font-semibold truncate">
              {userSession.user.roleTitle}
            </span>
            <button
              onClick={onLogoutClick}
              className="text-[10px] text-rose-700 hover:text-rose-900 transition-colors cursor-pointer font-medium"
            >
              Sign Out
            </button>
          </div>
          <div className="text-xs font-semibold text-[#202E1D] truncate font-serif">
            {userSession.user.businessName}
          </div>
          <div className="text-[10px] text-[#202E1D]/60 font-mono">
            {userSession.user.location}
          </div>
        </div>
      ) : (
        <div className="p-4 border-t border-[#202E1D]/10 bg-[#FAF8F2] text-[11px] text-[#202E1D]/70 space-y-1 text-left">
          <div className="flex items-center justify-between">
            <span>Version</span>
            <span className="font-mono text-[#202E1D]">v{APP_CONFIG.version}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Protocol</span>
            <span className="font-mono text-[#8F9A82]">Qloo MCP stdio</span>
          </div>
        </div>
      )}
    </aside>
  );
}
