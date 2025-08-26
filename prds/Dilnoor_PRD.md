---
template_name: prd_template
template_version: 1.0.0
last_updated: 2025-08-26
linked_idea: startup_ideas/Dilnoor.md
status: Draft
owner: Product Strategist
---

# PRD — Dilnoor (Heart Health, South Asia) — Prototype

## 1. Overview
- One-liner: “Light for your heart’s health.” An AI‑powered heart companion for South Asia with mobile PPG + wearables, easy reports (English for alpha), and doctor‑mediated guidance.
- Objective: Build a functional prototype that covers onboarding, continuous monitoring, anomaly notifications, shareable reports, and doctor‑advice UX.
- Target launch: Alpha in 8–10 weeks.

## 2. Problem & Goals
- Problem: South Asians face the world’s highest burden of CVD/diabetes with limited access to preventive diagnostics; current tools are costly, Western‑centric, and reactive.
- Prototype goals (MVP):
  - G1: Capture HR/HRV via mobile PPG (Android first) and via connected wearable (Xiaomi/Oppo/Samsung when available).
  - G2: Show simple daily heart dashboard (score + trend) with anomaly alerts and doctor‑mediated recommendations.
  - G3: Generate a shareable PDF report in English (alpha); Urdu/Hindi planned post‑alpha.
  - G4: Onboard with culturally adapted flow; support diaspora family linkage (read‑only) post‑MVP.

## 3. Users & Use Cases
- Primary user: Adults 30–60 in urban South Asia with family history of CVD/diabetes.
- Secondary: Diaspora family members monitoring parents (view/report share).
- Tertiary: Clinics/insurers (risk and wellness programs).
- Top use cases:
  1) Daily check-in → view heart score, see actionable tip.
  2) Receive notification on anomaly (e.g., stress, arrhythmia signal) → take suggested action.
  3) Share monthly report with doctor and family.
  4) (Optional) Select a doctor tier (Virtual Doctor vs. Premium Doctor mediation).

## 4. Requirements
### 4.1 User Stories (MVP)
- As a user, I want to measure HR/HRV with my phone camera so I can start without a wearable.
- As a user, I want a simple heart score with colored trend bars so I can understand changes at a glance.
- As a user, I want specific, text‑based recommendations and the option to ask “Why?” for education and trust.
- As a user, I want a PDF report I can share on WhatsApp/Email with my doctor and family.
- As a user, I want clear English UI for alpha and culturally adapted guidance (diet, sleep, fasting), with localization deferred.
- As a landlord/insurer partner (future), I want aggregate, anonymized insights to reduce risk/costs.

### 4.2 Functional Requirements (MVP)
- Mobile PPG capture (HR, HRV proxy) with quality gate (lighting, finger position), retry flow.
- Wearable ingestion (phase‑gated; use Health Connect/Google Fit for P0 if OEM SDKs are not ready).
- Heart Dashboard: score (0–100), daily bar graph, tab navigation (Steps, Heart, Sleep), and share action.
- Advice Card: message from “Virtual Doctor” (default) or premium doctor persona; CTA buttons: “Why?” and “Yes, I will”.
- Notifications: anomaly detection (e.g., HRV drop) triggers in‑app card + push.
- Report Generator: PDF with graphs, key metrics, AI summary, and English‑only recommendations for alpha.
- Settings: doctor tier selection, data consent/sharing; language toggle deferred.

### 4.3 Non-Functional Requirements
- Privacy: end‑to‑end encryption in transit and at rest; on‑device processing where practical.
- Performance: PPG analysis under 8s on mid‑tier Android devices.
- Reliability: graceful degradation on low‑light/older cameras; display confidence level.
- Compliance posture: screening/education tool (not a medical diagnosis) for MVP; disclaimers in app and reports.

## 5. UX & Content
### 5.1 Onboarding UX (based on provided screenshots — first 3 screens)
- S1 Value Proposition: Soft gradient background; brand mark; headline metric (“77% of users improved within 3 months”); single CTA button (“Yes! Upgrade my health for $9.99”). Use as optional paywall screen for premium doctor mediation in prototype (text may change for a non‑paywalled alpha).
- S2 Social Proof: Brand + testimonial card (photo avatar, quote) and CTA (“Invest Now To Live Longer”). This reinforces trust before data capture; keep copy simple in English for alpha; localized variants later.
- S3 Choose Your Doctor: List of cards — Virtual Doctor (algorithm, included) plus premium doctor personas below with “Get with Gold Plan” buttons. Selecting Virtual Doctor continues to data consent + PPG calibration; selecting premium shows paywall stub.

### 5.2 Core UX (based on provided screenshots — last 2 screens with graph + doctor recs)
- Heart Dashboard: Central circular score (e.g., 81/62), horizontal bar graph beneath, left/right arrows to swipe days, share icon. Bottom tab bar (Profile, Metrics, Training) for navigation.
- Advice Card: Doctor avatar + message bubble with friendly tone. Two CTAs: “Why?” opens a rationale modal (data‑driven explanation, links to tips); “Yes, I will” records commitment and sets reminder.
- Micro‑interactions: Subtle pulse animation on score when new data arrives; snackbar confirmation after actions.

### 5.3 Content/Copy Guidelines
- Tone: warm, respectful, culturally aware; avoid fear‑based messaging.
- Localization: English‑only for alpha; design copy and components to be localization‑ready; keep lines under 70 characters for small screens.
- Education: Every recommendation has a “Why?” rationale (science + cultural framing).

## 6. Visual Design
- Brand: “Dilnoor” = light of the heart. Use soft mint/teal backgrounds with warm gradient halos for key screens.
- Sample palette: Mint #DFF5EC, Teal #79C9BB, Warm Coral #FFA97A, Gold #F7C948, Charcoal #2C2C2C.
- Typography: Headings — Inter/Baloo (friendly), Body — Inter/Noto Sans; minimum 16pt body.
- Components:
  - Score Ring (0–100) with concentric glow states (Good/Okay/Concern).
  - Bar Graph with daily bars and a horizontal threshold slider.
  - Advice Card with avatar, message, and dual CTAs (primary confirm; secondary “Why?”).
  - Doctor Selection Cards with badge (“Included” vs “Gold”).
- Accessibility: 4.5:1 contrast for text; button hit area ≥44px; supports Dynamic Type.

## 7. Data & Metrics
- Events: ppg_capture_start/success/fail, wearable_sync, dashboard_view, advice_shown, advice_ack, why_open, pdf_export, language_set (deferred).
- KPIs (prototype): daily active sessions, PPG success rate, advice acknowledgement rate, report shares, anomaly notification CTR.
- North Star (later): % of at‑risk users with improved HRV/resting HR over 90 days.

## 8. Tech & Architecture
- App: Android (Kotlin) for MVP; iOS later. Modular PPG module; repository pattern; offline cache.
- AI: Signal processing + anomaly detection (on‑device if possible); LLM prompt layer for advice localization (future, server‑side with safety filters).
- Integrations: Google Health Connect; OEM SDKs (Xiaomi/Oppo/Samsung) phase‑gated.
- Backend: FastAPI/Node, Postgres, object storage for PDFs; push notifications (FCM).

## 9. Privacy, Security, Compliance
- Data types: HR/HRV, sleep/workouts (if available), language, consent flags.
- Consent: explicit opt‑in for data capture and sharing; share controls per contact (doctor/family).
- Positioning: screening/education; not diagnostic. Add disclaimers in app/report.
- Residency: Prefer regional hosting; encrypt at rest; audit logs.

## 10. Rollout Plan
- Week 0–2: UX flows, design system, PPG prototype, baseline English copy.
- Week 3–5: Dashboard + Advice Card + notifications; PDF generator; language toggle deferred.
- Week 6–8: Wearable sync stub; premium doctor selection stub; closed alpha (N=50) in Karachi/Delhi.
- Exit criteria: PPG success rate ≥75%; advice ack ≥40%; report share ≥25% of weekly actives.

## 11. Risks & Mitigations
- PPG accuracy variability → quality gate, multi‑sample, conservative thresholds; show confidence.
- Medical claims risk → strict copy; physician review for templates; legal review.
- Data trust → local language consent, transparent settings, no surprise sharing.
- Device fragmentation → targeted device list; QA matrix with low‑end Androids.

## 12. Decisions for Alpha and Open Questions

- Wearable OEM priority: Start with Xiaomi via Google Health Connect where possible; explore native Xiaomi/Zepp APIs next. Oppo is secondary.
- Premium doctor mediation pricing (alpha): Free stub during alpha to reduce friction; run a $0.99 A/B price test in closed beta.
- Next languages after English: Urdu and Hindi.
- Clinic interoperability: PDF only for alpha; evaluate FHIR R4 export in later phases.

## 13. Appendices
- A1: Links — startup_ideas/Dilnoor.md (idea), research notes TBA.
- A2: Screenshot mapping — S1 Value Prop, S2 Testimonial, S3 Choose Doctor, S4–S5 Heart Dashboard with Advice.

