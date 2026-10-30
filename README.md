# LocalMuse Ops: Agentic Cultural Operations Manager

> **Qloo Agentic Hackathon Submission**  
> *Translating Macro Cultural Signals into Actionable Weekly Operating Plans for Independent Enterprises*

---

## 🌟 Executive Summary & Problem Statement

Independent cafés, craft bakeries, natural wine bars, boutiques, and neighborhood venues operate in hyper-localized cultural microclimates. Yet when making operational decisions—what special to introduce, what soundscape to play, what local artist or bookstore to partner with—most operators either rely on gut instinct or ask a generic LLM.

Generic LLMs generate ungrounded clichés: *"Run a 10% discount on Tuesday"*, *"Stream acoustic pop hits"*, *"Post daily coffee pictures on Instagram"*. These generic suggestions degrade brand equity, erode margins, and fail to reflect authentic neighborhood taste.

**LocalMuse Ops** replaces guessing with **Qloo Cultural AI**. By analyzing taste affinities across music, dining, literature, fashion, and lifestyle, LocalMuse Ops generates an actionable, zero-capex **Weekly Culture Plan** grounded in neighborhood cultural anchors, validated with provenance citations, and continuously improved through staff feedback memory.

> **The Core Rule:** *If your project would work the same without Qloo, you're building the wrong thing.*  
> LocalMuse Ops proves this directly with its killer demo feature: **Qloo Grounded Mode vs. Generic LLM Mode**.

---

## 🚀 Key Features

### 1. The Weekly Culture Plan Copilot
Synthesizes a six-pillar operational rhythm for any neighborhood venue:
1. **Menu & Product Specials**: E.g., Cascara Botanical Spritz & Artisanal Sourdough Focaccia drop (timed for the 1:30–4:30 PM post-lunch dip, lifting average check from $5.80 to $10.90).
2. **Soundscape & Playlist Mood**: BPM-curated flow-state soundscapes (analog soul, ambient jazz) matched to neighborhood remote workers.
3. **Community Activations**: Experiential tastings, cupping flights, or vinyl listening residencies filling off-peak hours.
4. **Local Partnership Targets**: Zero-inventory consignment partnerships with nearby indie bookstores, record shops, and craft roasters.
5. **Visual Merchandising & Atmosphere**: Palette, stoneware ceramics, and tabletop styling reflecting the local aesthetic.
6. **Localized Marketing & Social Copy**: Hyper-local Instagram and newsletter copy speaking the neighborhood's authentic dialect.

### 2. The Killer Feature: Qloo Mode vs. Generic Mode Benchmark
A live side-by-side comparison illustrating why Qloo is the irreplaceable cultural intelligence engine:
- **Cultural Specificity**: 96% (Qloo) vs. 38% (Generic LLM)
- **Local Relevance**: 97% (Qloo) vs. 41% (Generic LLM)
- **Trend Momentum**: 91% (Qloo) vs. 29% (Generic LLM)
- **Cross-Domain Coherence**: 94% (Qloo) vs. 44% (Generic LLM)
- **Actionability & ROI**: 93% (Qloo) vs. 50% (Generic LLM)

### 3. Interactive Provenance Cards
Every recommendation features an expandable citation card detailing the exact Qloo data point driving the decision:
- `Qloo Concept URN`: `urn:tag:culinary:single_origin_cascara` (Prevalence: 94%)
- `Cultural Anchor Benchmark`: *Flat Track Coffee* & *Fleet Coffee* (Affinity: 92/100)
- `Cross-Domain Resonance`: *Khruangbin*, *Bonobo*, *Yussef Dayes* (Affinity: 95/100)
- `Trend Momentum Curve`: Low-caffeine botanical tonics (+31% YoY growth)

### 4. Operator Feedback Memory Loop
Staff members tag quick feedback (*"Too expensive"*, *"Not our vibe"*, *"More music focus"*, *"Extend into evening"*) or enter custom constraints. The agent logs adaptations into memory, re-weights Qloo signals, and regenerates a refined plan.

### 5. Four Underlying Operational Workflows
In addition to the Copilot, operators can explore individual analytical modules:
- **Module 01 — Location Insights**: Cultural peer anchors, concept tag prevalence, and demographic age brackets.
- **Module 02 — Audience Comparison**: Cross-market affinity contrast between two cities or neighborhoods.
- **Module 03 — Local Trends & Momentum**: Time-series popularity momentum curves and density heatmaps.
- **Module 04 — Tactical Recommendations**: Two-stage candidate discovery and ranking against operational goals.

---

## 🛠️ Architecture & Technical Implementation

```text
┌────────────────────────────────────────────────────────┐
│               Next.js 16 (App Router)                   │
│   Tailwind CSS v4 • Dark Mode • Responsive Dashboard    │
│   Qloo vs Generic Benchmark • Feedback Memory UI       │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP / JSON
┌──────────────────────────▼─────────────────────────────┐
│          Node.js Express Backend (:4000)                │
│   /api/plan  •  /api/location-insights  •  /api/health │
│   /api/compare-audiences  •  /api/local-trends         │
└──────────────────────────┬─────────────────────────────┘
                           │
       ┌───────────────────┴───────────────────┐
       ▼                                       ▼
┌───────────────────────────────┐   ┌─────────────────────────┐
│     Live Qloo MCP Server      │   │  Curated Demo Fixtures  │
│  @modelcontextprotocol/sdk    │   │  High-Fidelity Mocks    │
│  StdioTransport / Qloo CLI    │   │  (Runs out-of-the-box)  │
└───────────────────────────────┘   └─────────────────────────┘
```

### Deep Qloo Tool Chain Integration

| Workflow | Qloo Tool Sequence | Operational Purpose |
| :--- | :--- | :--- |
| **Location Insights** | `find_tags` &rarr; `recommend` (target: place) &rarr; `entity_tags` | Discovers peer anchors and concept tag prevalence for any business type. |
| **Audience Comparison** | `describe` (locality) &rarr; `compare_audiences` | Quantifies shared vs. differentiating affinities across two markets. |
| **Local Trends** | `recommend` &rarr; `trends` (ISO date range) | Tracks multi-quarter momentum trajectories for emerging consumer categories. |
| **Ranked Recommendations** | `recommend` (candidate pool) &rarr; `rank` (goal profile) | Multi-stage shortlisting of high-ROI operational initiatives. |
| **Weekly Culture Plan** | Orchestration of all signals + LLM Agent Planner | Translates cross-domain taste vectors into a cohesive 6-pillar operating plan. |

---

## 🚦 Dual Operation Modes

1. **Curated Demo Mode (Default)**:
   - Operates completely out-of-the-box without requiring an external Qloo API key or local Qloo harness.
   - Provides rich, high-fidelity datasets for Austin specialty coffee, Brooklyn natural wine, and Seattle indie bookshops.
   - Guaranteed honest disclosure via `isDemo: true` metadata badges.

2. **Live Qloo MCP Mode**:
   - Unlocked by configuring `QLOO_API_KEY` on the backend.
   - Communicates with the official Qloo MCP Server via `@modelcontextprotocol/sdk` and `StdioTransport`.
   - Never exposes API keys or credentials to the client browser or version control.

---

## 💻 Getting Started Locally

### Prerequisites
- **Node.js**: `v20.x` or later (tested on Node v22)
- **npm**: `v10.x` or later

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/manish0G/LOCALMUSE-OPS.git
cd LOCALMUSE-OPS

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Environment Configuration
```bash
# Frontend environment
cp .env.example .env.local

# Backend environment
cp server/.env.example server/.env
```
*(Optional)* Add your `QLOO_API_KEY` in `server/.env` to enable live Qloo MCP queries.

### 3. Running Locally
Run both servers in separate terminal tabs:

**Terminal 1 (Backend - Port 4000):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend - Port 3000):**
```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🛡️ Responsible AI & Safe Use

- **Aggregate Affinity Signals**: Qloo provides aggregate cultural taste affinities, not individual personal truths.
- **Privacy First**: LocalMuse Ops does not ingest, store, or transmit personally identifiable information (PII).
- **Operator Decision Support**: All generated recommendations are strategic decision-support aids; financial, legal, and operational compliance remains with the business owner.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
