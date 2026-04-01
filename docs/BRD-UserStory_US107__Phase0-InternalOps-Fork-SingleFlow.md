# Business and System Requirements Specifications

**Title:** Phase 0 — Internal Operations Fork + Recording Fee Reconciliation — Single Flow BoB
**Author/Owner:** [aolival]
**Reviewers/Approvers:** TBD
**Review/Approved Date:** TBD
**Last Updated:** 2026-03-31

**Type:** Add

---

## Summary

### Initiative Overview

Phase 0 extends Single Flow BoB beyond its current Shipper (external vendor packaging) use case into a new **Internal Operations** path for CMG post-close ops teams — auditors, QC reviewers, funders — who today execute dozens of manual SOP-driven step processes using Byte tabs, spreadsheets, and stare-and-compare workflows.

The anchor Phase 0 use case is **Recording Fee Reconciliation** — a 9+ manual step process across 3 Byte tabs that occurs for every funded loan, every business day. Phase 0 converts this into a 3-doc BoB bundle + an action screen (Steps 8–10) that surfaces settlement company contact details, a fee comparison table, and an email composer — all without leaving BoB.

A second live bundle, **Clear to Close Review** (formerly "C2C - QC Bundle"), is moved from the external dropdown into the Internal Operations path where it belongs.

### Strategic Context

- CMG is scaling funded loan volume year-over-year without proportional headcount growth
- Post-close ops teams execute manual SOPs for 150–250 funded loans per business day
- BoB already has PROD trust and a proven stacking order engine — extending it to internal ops requires no new infrastructure
- Phase 0 delivers immediate ROI (minutes → seconds per loan on manual fee recon) while establishing the bundle output spec that Dr. BoB Phase 1 will use for AI-powered automation

### Current State Issues

- All internal ops bundle types are mixed into the same external vendor dropdown
- Fee reconciliation requires 9+ manual steps across 3 Byte tabs for every funded loan
- Settlement company contact info requires navigating Byte's Parties screen manually
- No email composer — ops users must switch to Outlook, copy contact info, draft from scratch
- No audit trail in BoB for ops review actions

### Operational Bottlenecks

- 150–250 loans funded daily × 9+ manual steps per loan = significant daily ops burden
- Staff must stare-and-compare FSS fee amounts against recorded document fee stamps across multiple Byte tabs
- Mismatch detection requires manual calculation; refund emails require manual drafting

### Value Propositions

- **Fork UX:** Clean separation of shipper and ops user journeys — no mixed dropdown clutter
- **Bundle output:** 3 docs in one view replaces navigation across 3 Byte tabs
- **Fee comparison:** Visual MATCH/MISMATCH table replaces manual stare-and-compare
- **Settlement company panel:** Parties screen data surfaced directly — no Byte navigation
- **Email composer:** Step 10 email template pre-populated with settlement company email + loan details
- **Dr. BoB runway:** Every internal ops bundle is a future AI agent feed spec

---End of Section---

---

## Proposed Process

### Future-State MVP

After loan confirmation in Single Flow BoB, two dropdowns render simultaneously:

1. **Select Bundle — External Vendor Packaging** — all existing bundles (minus C2C, which moves to Internal)
2. **Select Bundle — Internal Operations** — 2 live bundles + 15 alphabetical placeholder library

Selecting from one dropdown hides the other. From this point forward the UX is identical regardless of path.

The **Recording Fee Reconciliation action screen** (hamburger nav → "Recording Fee Reconciliation") serves as the Step 8–10 workspace.

### Phased Rollout

| Phase | User Story | Description |
|---|---|---|
| US-105 (Complete) | Single Flow — No Matches Found | Loan existence gate on Select Subject Loan field |
| US-106 (Complete) | Bulk Bundle Manager — No Matches Found | Soft warning for not-found loans in bulk path |
| **US-107 (Current)** | **Phase 0 — Internal Ops Fork + Fee Recon** | **Two-dropdown fork + Recording Fee Recon bundle + action screen** |

### Technical Dependencies

| Dependency | Detail |
|---|---|
| BoBSingleFlow.jsx | New states `externalBundleName`, `internalBundleName`; two bundle arrays; Recording Fee Recon mock in `generateStackingOrder`; two-dropdown fork JSX; `onNavigateBack` prop on all sub-pages |
| NavigationPanel.jsx | Renamed: Example Screen A → "Recording Fee Reconciliation" (Receipt icon); Example Screen B → "Clear to Close Review" (CheckSquare icon) |
| ExampleScreenA.jsx | Full Recording Fee Recon action screen replaces placeholder |
| ExampleScreenB.jsx | Renamed to Clear to Close Review |
| ShipperPage.jsx | Save spinner + `onNavigateBack` wired; Cancel navigates back |

---End of Section---

---

## Software Development Implementation Specs

### Requirement Statement

> As a **loan operations specialist**, I need Single Flow BoB to present a clean fork between external vendor packaging bundles and internal operations bundles after loan confirmation, with a Recording Fee Reconciliation bundle and action screen that replaces the 9+ manual steps I currently perform in Byte — so that I can complete fee reconciliation in seconds instead of minutes, directly in BoB.

---

### Functional & Technical Requirements

**1. Two-Dropdown Fork**

After loan confirmation (`loanValidated === true`), render two dropdowns simultaneously:
- `externalBundleName` state drives External Vendor Packaging dropdown
- `internalBundleName` state drives Internal Operations dropdown
- Selecting from either sets the other to `''` and hides that dropdown
- `activeBundleName = externalBundleName || internalBundleName` used in `handleRunSummary`

**2. Bundle Arrays**

`externalBundleOptions`: All existing bundles minus "C2C - QC Bundle"

`internalBundleOptions`:
- "Clear to Close Review" ✅ Live — Phase 0
- "Recording Fee Reconciliation" ✅ Live — Phase 0
- Disabled separator + 15 alphabetical placeholder bundles (Coming Soon)

**3. Recording Fee Reconciliation Bundle Output**

`generateStackingOrder('Recording Fee Reconciliation')` returns 3 documents:

| # | Document Type | Category |
|---|---|---|
| 1 | Final Settlement Statement (FSS) | POST CLSNG |
| 2 | Recorded Deed of Trust / Security Instrument | POST CLSNG |
| 3 | Recorded Warranty Deed | PROP |

**4. Clear to Close Review**

`'C2C - QC Bundle'` renamed to `'Clear to Close Review'` in `generateStackingOrder`. Same mock data logic preserved.

**5. Recording Fee Recon Action Screen (ExampleScreenA.jsx)**

Accessible via hamburger nav → "Recording Fee Reconciliation". Contains:
- Fee comparison table: FSS amounts vs recorded document amounts (MATCH/MISMATCH per row)
- Settlement company details panel (mock EPS/Parties data — John Bethell Title Co)
- Demo toggle: switch between MATCH and MISMATCH state
- MATCH action: "Mark Resolved — Update BytePro" → mock success toast
- MISMATCH action: "Generate Email to Settlement Company" → inline email composer pre-populated with CMG Step 10 template
- `onNavigateBack` prop → "← Back to BoB" + post-action navigation

**Mock Data (sourced from actual CMG loan docs):**
- FSS fees: E-Recording $10.00 | Deed $26.00 | Mortgage $64.00 | Total $100.00
- Settlement Company: John Bethell Title Co / Rebecca Spencer / rspencer@johnbtitle.com / (812) 245-0172
- MATCH state: Recorded Deed $26.00 + Recorded DOT $64.00 = ALL CLEAR
- MISMATCH state: Recorded DOT $50.00 vs FSS $64.00 = REFUND REQUIRED

**6. Navigation — No Dead Ends**

All sub-pages receive `onNavigateBack` prop → `() => setCurrentPage('single-flow')`.
- Save Changes: 1.5s spinner → navigate back
- Cancel: immediate navigate back
- "← Back to BoB": immediate navigate back

### Files Modified

| File | Change |
|---|---|
| `src/components/BoBSingleFlow.jsx` | Fork dropdown state + UI + bundle arrays + Recording Fee Recon mock + onNavigateBack wiring |
| `src/components/NavigationPanel.jsx` | Renamed Example Screen A/B to real screen names with icons |
| `src/components/ExampleScreenA.jsx` | Full Recording Fee Recon action screen |
| `src/components/ExampleScreenB.jsx` | Renamed to Clear to Close Review |
| `src/components/ShipperPage.jsx` | Save spinner + back navigation |
| `docs/plans/2026-03-31-phase0-internal-ops-fork-design.md` | Design doc |
| `docs/plans/2026-03-31-phase0-implementation-plan.md` | Implementation plan |

---End of Section---

---

## Acceptance Criteria

| AC # | Given | When | Then |
|---|---|---|---|
| AC-1 | Loan confirmed | User views single flow | Two dropdowns render: External Vendor Packaging and Internal Operations |
| AC-2 | User selects from External Vendor Packaging | — | Internal Operations dropdown disappears; stacking order generates normally |
| AC-3 | User selects from Internal Operations | — | External Vendor Packaging dropdown disappears; stacking order generates |
| AC-4 | User selects "Recording Fee Reconciliation" | Stacking order renders | Exactly 3 docs: FSS (POST CLSNG), Recorded DOT (POST CLSNG), Recorded Warranty Deed (PROP) |
| AC-5 | User selects "Clear to Close Review" | Stacking order renders | Same mock docs as former "C2C - QC Bundle" |
| AC-6 | User opens hamburger → Recording Fee Reconciliation | — | Action screen renders with fee comparison table and settlement company details |
| AC-7 | Fee comparison is MATCH | User clicks Mark Resolved | BytePro update toast appears |
| AC-8 | Fee comparison is MISMATCH | User clicks Generate Email | Inline email composer opens with settlement company email and loan details pre-filled |
| AC-9 | Email composer is open | User clicks Send | Success toast: "Email sent to rspencer@johnbtitle.com" |
| AC-10 | User is on any sub-page | User clicks Cancel or Save Changes | Returns to main single flow — no dead ends |
| AC-11 | Internal Operations dropdown renders | User opens it | Top 2 live options; disabled separator; 15 placeholder options below |
| AC-12 | User on Shipper page | Clicks Save Changes | 1.5s spinner shown; returns to main single flow |

---End of Section---
