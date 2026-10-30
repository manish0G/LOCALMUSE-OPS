"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { APP_CONFIG, NAV_ITEMS } from "@/constants";
import { BrandGlyph3D } from "./BrandGlyph3D";
import { Badge } from "@/components/ui/Badge";
import type { OperationMode } from "@/types";

export interface AppSidebarProps {
  activeId?: string;
  onSelectNav?: (id: string) => void;
  mode?: OperationMode;
  isLiveAvailable?: boolean;
  className?: string;
}

export function AppSidebar({
  activeId = "overview",
  onSelectNav,
  mode = "demo",
  isLiveAvailable = false,
  className
}: AppSidebarProps) {
  // SVG Icon mappings for navigation
  const getNavIcon = (id: string, isActive: boolean) => {
    const iconClass = cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-zinc-100" : "text-zinc-400 group-hover:text-zinc-200");

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
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6zm0 4a1 1 0 100 2h5a1 1 0 100-2H6z" clipRule="evenodd" />
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
      default:
        return null;
    }
  };

  return (
    <aside
      className={cn(
        "w-64 bg-zinc-950 border-r border-zinc-800/80 flex flex-col h-full shrink-0 select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-zinc-800/80 flex items-center gap-3">
        <BrandGlyph3D size="sm" />
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-tight text-zinc-100">
            {APP_CONFIG.name}
          </span>
          <span className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase">
            Ops Workbench
          </span>
        </div>
      </div>

      {/* Mode Status Pill */}
      <div className="px-5 py-3 border-b border-zinc-900 bg-zinc-900/30">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400 text-[11px]">Engine Mode:</span>
          {mode === "demo" ? (
            <Badge variant="warning" size="sm" dot>
              Demo Fixtures
            </Badge>
          ) : (
            <Badge variant={isLiveAvailable ? "success" : "danger"} size="sm" dot pulse={isLiveAvailable}>
              {isLiveAvailable ? "Live Qloo MCP" : "Live (No Key)"}
            </Badge>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          Workflows
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectNav?.(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left group cursor-pointer",
                isActive
                  ? "bg-zinc-800/90 text-zinc-100 shadow-xs border border-zinc-700/50"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/70"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {getNavIcon(item.id, isActive)}
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-zinc-800 text-zinc-400 font-mono">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-zinc-900 bg-zinc-950/80 text-[11px] text-zinc-400 space-y-1">
        <div className="flex items-center justify-between">
          <span>Version</span>
          <span className="font-mono text-zinc-400">v{APP_CONFIG.version}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Qloo Protocol</span>
          <span className="text-zinc-400">MCP stdio</span>
        </div>
      </div>
    </aside>
  );
}
