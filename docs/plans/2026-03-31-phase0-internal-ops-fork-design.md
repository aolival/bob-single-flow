# Design — Phase 0: Internal Operations Fork + Recording Fee Reconciliation
**Date:** 2026-03-31
**Author:** Aza Olival
**App:** Single Flow BoB (bob-single-flow)
**Status:** Approved — Ready for Implementation

---

## Context

Phase 0 extends Single Flow BoB beyond its current "Shipper" (external vendor packaging) use case into **Internal Operations** — a new user path for CMG post-close ops teams (auditors, QC reviewers, funders) who today execute dozens of manual SOP-driven step processes using Byte tabs, spreadsheets, and stare-and-compare workflows.

The anchor Phase 0 use case is **Recording Fee Reconciliation** — a 9+ manual step process across 3 Byte tabs that happens for every funded loan, every business day. Phase 0 converts this into a 3-doc BoB bundle + action screen. No new infrastructure. No AI required yet. Immediate ROI.

This demo is designed to pair with the Dr. BoB executive summary deck as a live, interactive concept UI — more persuasive to C-Suite than any slide or Figma flow.

---

## Strategic Framing

- **Phase 0** = BoB bundle output replaces manual stare-and-compare (human still acts)
- **Phase 1 Dr. BoB** = AI OCR agent reads the bundle output and acts automatically
- Every Internal Ops bundle built today is a Dr. BoB feed spec for tomorrow
- No new headcount needed to scale — BoB + Dr. BoB multiplies existing ops team output

---

## Design

### Part 1 — Fork in the Road (Main Flow Change)

**Current:** Loan confirmed → single "Select Bundle" dropdown appears

**New:** Loan confirmed → **two dropdowns** appear simultaneously

| Dropdown | Label | Contents |
|---|---|---|
| Top | Select Bundle — External Vendor Packaging | All existing bundles (minus C2C - QC Bundle) |
| Bottom | Select Bundle — Internal Operations | Clear to Close Review + Recording Fee Reconciliation |

**Interaction behavior:**
- Both dropdowns render at the same time after loan confirmation
- User selects from one → the other dropdown **disappears immediately**
- Selected dropdown stays visible with the chosen value
- Stacking order generates below — UI looks identical from this point forward regardless of which path was taken
- Demo mode: format-valid loan number passes through (no BytePro gate)

**Bundle changes:**
- "C2C - QC Bundle" removed from External Vendor Packaging dropdown
- "C2C - QC Bundle" → renamed "Clear to Close Review" in Internal Operations dropdown
- Existing C2C mock data / stacking order logic preserved, just rehomed
- "Recording Fee Reconciliation" added as new Internal Operations bundle with dedicated 3-doc mock stacking order

---

### Part 2 — Recording Fee Reconciliation Bundle Output

**Trigger:** User selects "Recording Fee Reconciliation" from Internal Operations dropdown

**Stacking order — 3 documents ("The Big 3"):**

| # | Document Name | Tab in Byte | Notes |
|---|---|---|---|
| 1 | Government Recording Fees (FSS) | POST CLSNG | Fee schedule — source of truth for expected recording fees |
| 2 | Recorded Deed of Trust | DOCS | Stamped recorded doc — actual fee charged |
| 3 | Recorded Deed | DOCS | Stamped recorded doc — actual fee charged |

**Mock data behavior:**
- Same stacking order grid as all other bundles
- Documents show Found/Missing status using existing mock logic
- Bundle name: "Recording Fee Reconciliation"
- PDF name format: `borrowername-loannumber-recordingfeerecon.pdf`

---

### Part 3 — Hamburger Nav: Recording Fee Reconciliation Action Screen

**Navigation Panel change:**
- "Example Screen A" → renamed **"Recording Fee Reconciliation"** with receipt/dollar icon
- "Example Screen B" → renamed **"Clear to Close Review"** (placeholder — future build)
- "Example Screen C" → unchanged or relabeled as needed

**Recording Fee Reconciliation Screen — Layout:**

```
┌─────────────────────────────────────────────────────┐
│  Toolbar: [Refresh] [Cancel] [Save Changes] [AO]    │
├─────────────────────────────────────────────────────┤
│  ⚕️ Recording Fee Reconciliation                     │
│  Review government recording fees against recorded  │
│  documents and take action on any discrepancies.    │
├──────────────────┬──────────────────────────────────┤
│  SETTLEMENT      │  FEE COMPARISON                  │
│  COMPANY DETAILS │                                  │
│                  │  FSS Expected Fee: $XXX.XX       │
│  Company: [name] │  Recorded Deed of Trust: $XXX.XX │
│  Contact: [name] │  Recorded Deed: $XXX.XX          │
│  Email: [email]  │                                  │
│  Phone: [phone]  │  Status: ✅ MATCH / ⚠️ MISMATCH  │
├──────────────────┴──────────────────────────────────┤
│  ACTION REQUIRED (Steps 8–10)                       │
│                                                     │
│  IF MATCH:                                          │
│  [✅ Mark Resolved — Update BytePro]                │
│                                                     │
│  IF MISMATCH:                                       │
│  [📧 Generate Email to Settlement Company]          │
│   → Pre-populates: To: [settlement email]           │
│   → Subject: Recording Fee Discrepancy — [Loan #]  │
│   → Body: template with fee details                 │
│   → User adds notes inline before sending          │
└─────────────────────────────────────────────────────┘
```

**Mock data fields (settlement company):**
- Company Name: "First American Title"
- Contact: "Sarah Martinez"
- Email: "svc-recording@firstam.com"
- Phone: "(800) 555-0192"

**Fee comparison mock data:**
- FSS Expected Fee: $125.00
- Recorded Deed of Trust stamp: $125.00 → MATCH (default demo state)
- Toggle/button to simulate MISMATCH for demo purposes

**Steps 8–10 action behavior:**
- **Mark Resolved:** Mock BytePro update via EPS (success toast — "BytePro updated successfully")
- **Generate Email:** Opens inline email composer in the screen (not a new tab) — settlement company email pre-filled, subject pre-filled, body template pre-filled with loan number + fee details — user types additional notes + clicks Send (mock — success toast)

---

## Files to Create/Modify

| File | Change |
|---|---|
| `BoBSingleFlow.jsx` | Add second dropdown state; fork logic; disappear behavior on selection |
| `BoBSingleFlow.jsx` | Add "Recording Fee Reconciliation" to `generateStackingOrder` with 3-doc mock data |
| `BoBSingleFlow.jsx` | Remove "C2C - QC Bundle" from `bundleOptions` array |
| `NavigationPanel.jsx` | Rename Example Screen A → "Recording Fee Reconciliation" (receipt icon); Example Screen B → "Clear to Close Review" |
| `ExampleScreenA.jsx` | Replace placeholder content with full Recording Fee Recon action screen |
| `ExampleScreenB.jsx` | Replace placeholder with Clear to Close Review screen (or styled placeholder with real label) |

---

## Demo Flow (Exec Presentation Path)

1. Open Single Flow BoB → enter loan number (e.g. `LOAN0001`) → Enter
2. Two dropdowns appear → point out the fork: *"External for shippers, Internal for ops"*
3. Select "Recording Fee Reconciliation" from Internal Operations → other dropdown disappears
4. Stacking order generates with 3 docs → *"These are the only 3 docs you need — not 3 tabs in Byte"*
5. Open hamburger menu → navigate to "Recording Fee Reconciliation"
6. Show settlement company details already pulled in
7. Show fee comparison — MATCH state → click "Mark Resolved" → BytePro update toast
8. Toggle to MISMATCH → click "Generate Email" → email composer opens with settlement company pre-filled
9. *"This is what Dr. BoB automates — today a human reviews it, tomorrow the AI flags it before you even open it"*

---

## Out of Scope (Phase 0)

- Real EPS API calls for settlement company data (mock only)
- Real BytePro field writes (mock toast only)
- Real email send (mock composer only)
- Bulk Bundle Manager path (Phase 0 Part 2 — next)
- Dr. BoB OCR agent (Phase 1)
- CSV upload path
- Auth/role-based dropdown visibility

---

## Success Criteria

- Fork renders cleanly — two dropdowns appear on loan confirmation
- Selecting one hides the other with no layout shift
- Recording Fee Recon generates 3-doc stacking order
- C2C removed from external dropdown; Clear to Close Review appears in internal
- Nav panel shows "Recording Fee Reconciliation" linking to real action screen
- Fee comparison shows MATCH/MISMATCH state with visual indicator
- "Mark Resolved" shows success toast
- "Generate Email" opens inline composer with settlement company email pre-populated
- Demo runs end-to-end without errors on localhost and Vercel
