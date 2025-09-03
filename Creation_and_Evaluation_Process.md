---
template_name: startup_creation_evaluation_process
template_version: 1.0.0
last_updated: 2025-08-25
---

> Startup Creation & Evaluation Process • Template v1.0.0

## 🎯 Purpose
A lightweight, repeatable process to create, stress‑test, and evolve startup ideas using agent panels. This codifies how briefs become full ideas and how we decide to iterate, pivot, or close.

## 🌱 Creation Modes (what we create)
- New idea
- Improvement of an existing idea
- Niching an existing idea (focused ICP/use case)
- Parallel idea (adjacent angle to an existing thesis)
- Pivot from an existing idea (substantive change in customer/solution/GT)

## 📦 Artifacts (simplified)
- Idea Stream (idea_streams/): pure free‑flow text; no fields to fill
- Startup Idea (startup_ideas/): standardized 17‑section template generated on promotion
- Evaluation entries (Startup_evaluation_report.md): brief agent summaries + verdicts
- Optional: Idea Briefs (idea_briefs/) only if you want a short structured one‑pager (not required)

## 🔖 Versioning & Promotion (fewer steps)
- Streams are unversioned drafts by default (no YAML needed)
- Promote directly from Idea Stream → Startup Idea (skip briefs). On promotion, create startup_ideas/<Name>.md with YAML header and idea_version: 1.0.0
- Single‑file mode (optional): start directly in startup_ideas/<Name>.md with a top “Freeform Brief” section; the agent appends the 17 sections below when you say “Structure this below”
- Bump idea_version when the thesis materially changes (e.g., 1.1.0); evaluations reference the current version

## 🧠 Agent Panels (how we evaluate)
We use 2–6 cooperating agents per idea in three roles:

1) 👤 Customer Panel (1–3 agents)
- Goal: Assess pain severity, willingness to pay (WTP), urgency, and switching costs
- Outputs: Top pains (ranked), WTP ranges, adoption barriers, buying unit/budget owner
- Prompts: “As a [ICP], is this a must‑solve? Why now? What would you pay? What would stop you?”

2) 💼 Investor Panel (1–2 agents)
- Goal: Poke holes and surface risks; assess market size, moats, unit economics, GTM realism
- Outputs: Red flags, critical assumptions to test, competitive threats, suggested milestones
- Prompts: “As a ruthless VC, what breaks? What’s the fastest path to kill or de‑risk this?”

3) 🧩 Synthesis Agent (1 agent)
- Goal: Reconcile signals; propose improvements, pivots, or closure
- Outputs: Decision (iterate/pivot/promote/close), prioritized action items, updated thesis
- Prompts: “Given the panels’ feedback, what concrete changes maximize odds of PMF?”

## 🧮 Scoring Rubric (1–5 each)
- Desirability (customer pain/WTP)
- Feasibility (tech/data/ops)
- Viability (unit economics/pricing)
- Defensibility (moat/advantage)
- Timing (why now/cultural/tech tailwinds)
- GTM Clarity (wedge/channels)

Guidance:
- Promote to full idea when average ≥3.5 and no score <3, or a single 5 with a credible path to lift low scores within 30–60 days.
- Pivot if Desirability <3 but adjacent ICP/niche shows ≥4 potential.
- Close if average ≤2.5 and no immediate path to raise ≥1.0 in 30 days.

## 🗺️ Process Flow (streamlined)
1) Create an Idea Stream in idea_streams/ and write freely (or start a new startup_ideas/<Name>.md in single‑file mode with a “Freeform Brief” at the top)

2) Quick Agent Pass (on demand)
- Add a line: “Agent: TL;DR + Top 3 risks + 5 questions + 3 next steps” → agent appends a short response under your stream

3) Promote when ready (one step)
- Say: “Promote → idea” (or “Structure this below” in single‑file mode)
- Agent generates the full 17‑section template and adds YAML with idea_version: 1.0.0
- Append a link back to the original stream for provenance

4) Optional Round 2 (when iterating)
- Re‑run panels after changes; bump idea_version if thesis changes materially

## ✅ Action Items & SLAs
- Round 1 turnaround: ≤72 hours from brief
- Synthesis decision memo: ≤24 hours after panels
- Case studies/citations: optional; link sources where relevant

## 📚 Evidence & Data Inputs
- Market sizing proxies (public reports), competitor scans, pricing comps
- Pilot KPIs targets where applicable (conversion, CAC/LTV, payback, NRR)

## 🗂️ Storage Conventions
- Streams: idea_streams/<short_name>.md (free‑flow)
- Ideas: startup_ideas/<Name>.md (structured; versioned)
- Evaluations: Startup_evaluation_report.md (append per idea; include idea_version)
- Commits: use concise prefixes (stream:, idea:, eval:, chore:)

## 📏 Quality Bar (before Promote)
- Clear ICP and pain ranked by severity
- One GTM wedge with first channel and early proof plan
- Back‑of‑napkin pricing and unit economics
- Risks and mitigations acknowledged (top 3)

## 🧰 Using Agents Effectively (prompt tips)
- Keep the stream freeform; don’t fill fields
- Use a single line to request quick feedback: “Agent: TL;DR + 3 risks + 5 questions + 3 next steps”
- When you’re ready, say “Promote → idea” or “Structure this below” to generate the full template
- Ask for counter‑arguments and concrete numbers (WTP, CAC, margins) when needed

## 🏛️ Governance & Updates
- This process doc is versioned. Propose edits via PR with rationale and examples
- Template_version bumps on structural changes; reference in new briefs/ideas

## 📎 Appendix A: Example Panel Outputs (abbreviated)
- Customer Panel: “Top pains: onboarding time (5/5), tool sprawl (4/5); WTP: $49–$99/mo; blockers: data privacy, ROI proof”
- Investor Panel: “Risks: distribution dependency, moats shallow; Milestones: 3 pilots with +15% conversion; unit economics within 90 days”
- Synthesis: “Niche to finance ops in mid‑market; add SOC2 pipeline; target procurement champions; 60‑day pilot plan”

## 📎 Appendix B: Decision Codes
- IMPROVE, NICHE, PARALLEL, PIVOT, PROMOTE, CLOSE

## 🔗 Appendix C: Links
- idea_brief_template.md
- startup_ideas_template.md
- Startup_evaluation_report.md
