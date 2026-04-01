# UI Requirements — US-107: Phase 0 Internal Operations Fork — Single Flow BoB

**Title:** UI Spec — Phase 0 Internal Ops Fork + Recording Fee Recon — Single Flow BoB
**Author/Owner:** [aolival]
**Last Updated:** 2026-03-31
**Type:** Add · FE · UI Only
**Companion BRD:** BRD-UserStory_US107__Phase0-InternalOps-Fork-SingleFlow.md

---

## Overview

After loan confirmation, Single Flow BoB presents two parallel dropdowns — External Vendor Packaging and Internal Operations. Selecting from one hides the other. The Recording Fee Reconciliation action screen (hamburger nav) surfaces Steps 8–10 of the fee recon SOP directly in BoB. All sub-pages have working back navigation — no dead ends.

---

## Fork Dropdown UI

### Behavior
- Both dropdowns render simultaneously after `loanValidated === true`
- Labels: "SELECT BUNDLE — EXTERNAL VENDOR PACKAGING" / "SELECT BUNDLE — INTERNAL OPERATIONS"
- Selecting from one hides the other immediately
- Both cleared when loan resets

### Internal Operations Dropdown Structure
```
— Select a bundle —
  Clear to Close Review                      ← live ✅
  Recording Fee Reconciliation               ← live ✅
  — — — Coming Soon — —                     ← disabled separator
  Compliance Checklist — Post-Fund Audit
  Disbursement Ledger Reconciliation
  HMDA Data Integrity Review
  HOI Coverage Verification
  Investor Delivery Package — Audit
  Loan Modification Review
  NOI / Net Tangible Benefit Review
  PCCD Refund Tracking
  Post-Close QC — Final Docs Audit
  Regulatory Audit — Government Loans
  Servicing Transfer Package
  Title Policy Review — Post-Fund
  VOE / Income Verification Audit
  Wire Confirmation & Disbursement Audit
```

Separator is a disabled `<option>` — not selectable.

---

## Hamburger Navigation Panel

| Menu Item | Icon | Screen |
|---|---|---|
| Shipper | Home | ShipperPage (working form + save/back) |
| Recording Fee Reconciliation | Receipt | Full action screen (ExampleScreenA) |
| Clear to Close Review | CheckSquare | Named placeholder (ExampleScreenB) |
| Example Screen C | — | Placeholder |

---

## Recording Fee Recon Action Screen

### Toolbar
- Left: hamburger button + "← Back to BoB" link
- Right: "Demo: Match/Mismatch" toggle (green/red), Reset Demo button, AO avatar

### Fee Comparison Table

| Fee Type | FSS Amount | Recorded | Status |
|---|---|---|---|
| E-Recording Fee | $10.00 | — | N/A |
| Recorded Warranty Deed | $26.00 | $26.00 | ✅ Match |
| Recorded Deed of Trust / Security Instrument | $64.00 | $64.00 | ✅ Match |
| **Total Government Recording** | **$100.00** | **$90.00** | **✅ ALL CLEAR** |

**MISMATCH state:** DOT row → `bg-red-50`, recorded amount in red bold, total row → `⚠️ REFUND REQUIRED`

### Settlement Company Panel
- Collapsible (ChevronUp/Down)
- Fields: Company, Contact, Email (teal link), Phone, Address
- Mock: John Bethell Title Co / Rebecca Spencer / rspencer@johnbtitle.com / (812) 245-0172 / 2625 South Walnut St, Bloomington IN 47401

### Action Required Section

**MATCH state:**
- Gray descriptive text: "All recording fees match..."
- Teal button: "Mark Resolved — Update BytePro" → green toast: "BytePro updated — recording fee reconciliation marked complete."
- Resolved badge appears in page header

**MISMATCH state:**
- Amber warning box: "⚠️ Fee Mismatch — Refund Required" with dollar amounts
- Blue button: "Generate Email to Settlement Company" → opens email composer

### Email Composer
- To: `rspencer@johnbtitle.com` (pre-filled, display only)
- Subject: `FW: Final docs request-[BorrowerName]-Commitment no [LoanNumber]` (pre-filled)
- Body: editable textarea with CMG Step 10 audit template pre-filled
- Buttons: [Cancel] [Send ✈]
- Send → blue toast: "Email sent to rspencer@johnbtitle.com"

---

## Back Navigation — No Dead Ends

| Screen | Exit Path |
|---|---|
| ShipperPage | Cancel → immediate back; Save Changes → 1.5s spinner → back |
| Recording Fee Recon | "← Back to BoB" button; hamburger menu |
| Clear to Close Review | hamburger menu |

---

## Acceptance Criteria

| AC # | Given | When | Then |
|---|---|---|---|
| AC-1 | Loan confirmed | Both dropdowns visible | External and Internal labels render clearly above each select |
| AC-2 | User selects External bundle | — | Internal dropdown disappears; stacking order generates |
| AC-3 | User selects Internal bundle | — | External dropdown disappears; stacking order generates |
| AC-4 | Internal dropdown open | — | Top 2 options active; separator not selectable; 15 placeholders below |
| AC-5 | Recording Fee Recon selected | Stacking order renders | 3 rows: FSS (POST CLSNG), Recorded DOT (POST CLSNG), Recorded Warranty Deed (PROP) |
| AC-6 | Hamburger → Recording Fee Reconciliation | — | Action screen renders; fee table shows MATCH by default |
| AC-7 | MATCH state | Mark Resolved clicked | Green toast; "Resolved" badge in header |
| AC-8 | Toggle to MISMATCH | — | DOT row red; REFUND REQUIRED in total row |
| AC-9 | Generate Email clicked | — | Composer opens; To pre-filled; Subject pre-filled; body has CMG template |
| AC-10 | Send clicked | — | Blue toast: "Email sent to rspencer@johnbtitle.com" |
| AC-11 | Shipper → Save Changes | — | 1.5s spinner; returns to main single flow |
| AC-12 | Any sub-page → Cancel | — | Immediately returns to main single flow |

---
