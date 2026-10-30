"use client";

import React, { useState } from "react";
import { DEMO_PERSONAS, saveSession, type UserPersona, type UserSession } from "@/lib/auth";

export interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
  onCancel?: () => void;
}

export function LoginPage({ onLoginSuccess, onCancel }: LoginPageProps) {
  const [selectedPersona, setSelectedPersona] = useState<UserPersona>(DEMO_PERSONAS[0]);
  const [email, setEmail] = useState(DEMO_PERSONAS[0].email);
  const [password, setPassword] = useState("demo-operator-access");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleSelectPersona = (persona: UserPersona) => {
    setSelectedPersona(persona);
    setEmail(persona.email);
    setLoginError("");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError("");
    setTimeout(() => {
      try {
        const session = saveSession(selectedPersona);
        setLoading(false);
        onLoginSuccess(session);
      } catch (err) {
        setLoading(false);
        setLoginError("Failed to authenticate session. Please try again.");
      }
    }, 250);
  };

  const handleInstantPersonaLogin = (persona: UserPersona) => {
    setLoading(true);
    setTimeout(() => {
      const session = saveSession(persona);
      setLoading(false);
      onLoginSuccess(session);
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#F6F4EB] text-[#202E1D] shadow-2xl border border-[#202E1D]/15 overflow-hidden my-auto">
        
        {/* Top Header / Branding Bar */}
        <div className="border-b border-[#202E1D]/10 bg-[#FAF8F2] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#202E1D] flex items-center justify-center text-white shadow-xs">
              <svg className="w-4 h-4 text-[#EDD88B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-normal tracking-tight text-[#202E1D]">
                  LocalMuse <span className="italic">Ops</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider bg-[#8F9A82]/20 text-[#202E1D] px-2 py-0.5 rounded-full font-semibold">
                  Operator Access Flow
                </span>
              </div>
              <span className="text-[10px] text-[#8F9A82] font-mono">
                Cultural Intelligence Control Tower
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Backend Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#202E1D]/10 bg-white/70 text-xs font-mono text-[#202E1D]/80">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Backend 4000 Connected</span>
            </div>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="text-xs font-medium text-[#202E1D]/70 hover:text-[#202E1D] px-3 py-1.5 rounded-lg hover:bg-black/5 transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                <span>Close</span>
              </button>
            )}
          </div>
        </div>

        {/* Dual-Column Suraksha Presentation */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Persona Selector & Instructions */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#8F9A82]/30 bg-[#8F9A82]/10 text-[#202E1D] text-xs font-mono font-medium">
              <span>Select an Operator Persona to Continue</span>
            </div>

            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#202E1D] tracking-tight leading-tight">
                Sign in to <span className="italic font-serif">LocalMuse Ops</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#202E1D]/70 mt-1 leading-relaxed">
                Choose an authorized operator profile to unlock the full workbench—including the Weekly Culture Plan, Location Insights, and Cross-Market Audience contrast.
              </p>
            </div>

            {/* Persona Cards Grid */}
            <div className="space-y-2 pt-2">
              <div className="text-[11px] font-mono uppercase text-[#8F9A82] font-bold tracking-wider">
                Authorized Demo Personas (1-Click Switch)
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DEMO_PERSONAS.map((p) => {
                  const isSelected = selectedPersona.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectPersona(p)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                        isSelected
                          ? "bg-white border-[#202E1D] shadow-sm ring-1.5 ring-[#202E1D]"
                          : "bg-white/60 border-[#202E1D]/15 hover:bg-white hover:border-[#202E1D]/35"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8F9A82] font-medium">
                            {p.location}
                          </span>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-[#202E1D] text-white flex items-center justify-center p-0.5">
                              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </span>
                          )}
                        </div>

                        <div className="font-serif text-base font-semibold text-[#202E1D] leading-tight">
                          {p.businessName}
                        </div>

                        <div className="text-[11px] font-medium text-[#202E1D]/80">
                          {p.roleTitle}
                        </div>

                        <p className="text-[10px] text-[#202E1D]/65 line-clamp-2 leading-normal">
                          {p.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInstantPersonaLogin(p);
                        }}
                        className="w-full py-1.5 rounded-xl bg-[#EDD88B] hover:bg-[#E4CD7B] text-[#202E1D] text-[11px] font-semibold transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span>1-Click Sign In</span>
                        <span>&rarr;</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Credentials Form */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#202E1D]/15 shadow-sm text-left space-y-5">
              <div>
                <h3 className="font-serif text-2xl font-normal text-[#202E1D]">
                  Control Tower Access
                </h3>
                <p className="text-xs text-[#202E1D]/70 mt-0.5">
                  Authenticate your operator session credentials.
                </p>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <svg className="w-4 h-4 text-rose-700 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-[#202E1D]/80 mb-1">
                    Operator Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#202E1D]/20 bg-[#FAF8F2] text-xs font-mono text-[#202E1D] focus:outline-none focus:ring-2 focus:ring-[#202E1D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-[#202E1D]/80 mb-1">
                    Passkey / Security Access
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#202E1D]/20 bg-[#FAF8F2] text-xs font-mono text-[#202E1D] focus:outline-none focus:ring-2 focus:ring-[#202E1D]"
                  />
                </div>

                {/* Selected Persona Summary Pill */}
                <div className="p-2.5 rounded-xl bg-[#8F9A82]/10 border border-[#8F9A82]/20 text-[11px] text-[#202E1D]/80 space-y-1">
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#8F9A82] uppercase">
                    <span>Target Profile</span>
                    <span>Ready</span>
                  </div>
                  <div className="font-semibold text-[#202E1D]">
                    {selectedPersona.businessName} &bull; {selectedPersona.location}
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-full bg-[#202E1D] hover:bg-[#172215] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 transition shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <span>Authenticating...</span>
                      </span>
                    ) : (
                      <span>Sign In & Unlock Workspace &rarr;</span>
                    )}
                  </button>

                  {onCancel && (
                    <button
                      type="button"
                      onClick={onCancel}
                      className="w-full py-2 text-center text-xs text-[#202E1D]/60 hover:text-[#202E1D] cursor-pointer"
                    >
                      &larr; Back to Public Overview
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
