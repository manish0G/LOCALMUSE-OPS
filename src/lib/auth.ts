"use client";

export interface UserPersona {
  id: string;
  roleTitle: string;
  businessName: string;
  businessType: string;
  location: string;
  neighborhood: string;
  email: string;
  description: string;
  focusObjective: string;
}

export interface UserSession {
  token: string;
  user: UserPersona;
  loginTime: string;
}

export const DEMO_PERSONAS: UserPersona[] = [
  {
    id: "roaster_operator",
    roleTitle: "Specialty Roastery Operator",
    businessName: "Flat Track Coffee & Roasters",
    businessType: "Specialty Coffee & Roastery",
    location: "Austin, TX",
    neighborhood: "East Austin (Cesar Chavez)",
    email: "operator@flattrack.example.com",
    description: "Third-wave roaster with moto-culture aesthetic & vinyl audio appreciation",
    focusObjective: "Increase weekday afternoon footfall (1:30–4:30 PM) and lift check average"
  },
  {
    id: "beverage_director",
    roleTitle: "Hospitality Beverage Director",
    businessName: "Dorsia & Disc Provisions",
    businessType: "Natural Wine Bar & Provisions",
    location: "Brooklyn, NY",
    neighborhood: "North Williamsburg",
    email: "director@dorsiadisc.example.com",
    description: "Minimalist biodynamic wines, small plates & high-fidelity analog listening",
    focusObjective: "Drive midweek Tuesday/Wednesday dining covers & retail bottle sales"
  },
  {
    id: "retail_founder",
    roleTitle: "Bookstore & Retail Founder",
    businessName: "Page & Pour Bookshop",
    businessType: "Independent Bookstore & Café",
    location: "Seattle, WA",
    neighborhood: "Capitol Hill",
    email: "founder@pagepour.example.com",
    description: "Curated literary fiction, specialty espresso & community gathering nooks",
    focusObjective: "Boost weekend evening community attendance and cross-merchandising conversion"
  },
  {
    id: "cultural_analyst",
    roleTitle: "Cultural Intelligence Lead",
    businessName: "LocalMuse Enterprise Group",
    businessType: "Multi-Unit Hospitality Group",
    location: "National / Multi-Market",
    neighborhood: "Austin &bull; Brooklyn &bull; Seattle",
    email: "analyst@localmuse.example.com",
    description: "Regional market benchmarking and cross-city audience contrast",
    focusObjective: "Compare emerging cultural shifts across regional zip codes"
  }
];

const STORAGE_KEY = "localmuse_user_session";

export function getSavedSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

export function saveSession(persona: UserPersona): UserSession {
  const session: UserSession = {
    token: `jwt_localmuse_demo_${persona.id}_${Date.now()}`,
    user: persona,
    loginTime: new Date().toISOString()
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
  return session;
}

export function clearSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}
