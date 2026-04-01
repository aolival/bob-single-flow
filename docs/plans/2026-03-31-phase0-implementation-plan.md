# Phase 0: Internal Operations Fork + Recording Fee Recon — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a two-dropdown fork to Single Flow BoB (External Vendor Packaging vs Internal Operations), move C2C to the Internal dropdown as "Clear to Close Review", add "Recording Fee Reconciliation" as a real 3-doc bundle, replace Example Screen A with a fully working Recording Fee Recon action screen (Steps 8–10 from the SOP), and fix any Shipper nav issues.

**Architecture:** All changes are UI-only in the existing React app — no new services, no new API calls. Mock data replaces real EPS/BytePro calls for demo mode. Two state variables drive the fork: `externalBundleName` and `internalBundleName`. Selecting either clears the other and hides that dropdown.

**Tech Stack:** React 18, Tailwind CSS, Lucide React icons, Vite dev server (port 5174)

---

## Task 1: Fork Dropdown State + Logic in BoBSingleFlow.jsx

**Files:**
- Modify: `src/components/BoBSingleFlow.jsx`

**Context:** Currently there is one `bundleName` state driving one dropdown. We need two independent dropdowns that are mutually exclusive.

**Step 1: Add new state variables**

Find the existing state block (around line 21) and add after `const [bundleName, setBundleName] = useState('');`:

```jsx
const [externalBundleName, setExternalBundleName] = useState('');
const [internalBundleName, setInternalBundleName] = useState('');
```

**Step 2: Split bundleOptions into two arrays**

Replace the existing `bundleOptions` array (line ~127) with two arrays:

```jsx
// External Vendor Packaging bundles — remove "C2C - QC Bundle" from here
const externalBundleOptions = [
  "Docs Back - QC Bundle", "Funded - QC Bundle",
  "Agency Due Diligence", "AIG", "Ally", "AmeriHome", "Axos", "Bank of America",
  "Bank of England", "Barclays", "Caliber", "CarringtonMS", "Chase", "Citibank",
  "Citizens", "Comerica", "Community Lending", "Correspondent One", "CrossCountry",
  "Deutsche Bank", "Discover", "Flagstar", "FNMA Audit", "Freedom Mortgage",
  "GMAC", "Goldman Sachs", "Guaranty Bank", "Guild Mortgage", "Harbor",
  "Homebridge", "Homepoint", "HomeStar", "Huntington", "InFirst",
  "JP Morgan Chase", "Keybank", "Lakeview", "Liberty", "LoanCare",
  "M&T Bank", "Matrix", "Merchants", "Morgan Stanley", "Movement Mortgage",
  "Mr. Cooper", "Nations Direct", "Nations Lending", "Nationstar",
  "New Penn Financial", "NewRez", "Norcom", "Northpointe", "Oakmont",
  "Ocwen", "OnQ", "Pennymac", "PHH", "PNC", "Provident", "Quicken Loans",
  "RBS", "Regions", "Rocket Mortgage Bundle", "RoundPoint", "Santander",
  "Select Portfolio", "Shellpoint", "SunTrust", "Suntrust Mortgage",
  "SurePoint", "Synovus", "TCF", "TD Bank", "Texas Capital", "TIAA",
  "Truist", "U.S. Bank", "UBS", "Union Bank", "USAA", "Velocity",
  "Wachovia", "Wells Fargo", "WHEDA (WI Housing)", "Wilmington Trust",
  "Zions", "zFHA EBinder"
];

// Internal Operations bundles — top 2 are live, rest are alphabetical placeholders
const internalBundleOptions = [
  "Clear to Close Review",                          // ✅ Live — Phase 0
  "Recording Fee Reconciliation",                   // ✅ Live — Phase 0
  "— — — — — — — — — — — — — — —",               // visual separator (disabled option)
  "Compliance Checklist — Post-Fund Audit",
  "Disbursement Ledger Reconciliation",
  "HMDA Data Integrity Review",
  "HOI Coverage Verification",
  "Investor Delivery Package — Audit",
  "Loan Modification Review",
  "NOI / Net Tangible Benefit Review",
  "PCCD Refund Tracking",
  "Post-Close QC — Final Docs Audit",
  "Regulatory Audit — Government Loans",
  "Servicing Transfer Package",
  "Title Policy Review — Post-Fund",
  "VOE / Income Verification Audit",
  "Wire Confirmation & Disbursement Audit",
];
```

**Step 3: Update generateStackingOrder to handle new bundle names**

Find the `if (bundle === 'C2C - QC Bundle')` block (~line 153) and rename to:
```jsx
if (bundle === 'Clear to Close Review') {
```

Add a new Recording Fee Recon block right after the C2C block (before the `else`):

```jsx
if (bundle === 'Recording Fee Reconciliation') {
  return [
    {
      category: 'POST CLSNG',
      documentType: 'Final Settlement Statement (FSS)',
      status: 'Found',
      displayOrder: 1,
      foundCount: 1,
      documents: [{ id: 1, name: 'Final-Settlement-Statement.pdf' }],
    },
    {
      category: 'POST CLSNG',
      documentType: 'Recorded Deed of Trust / Security Instrument',
      status: 'Found',
      displayOrder: 2,
      foundCount: 1,
      documents: [{ id: 2, name: 'Recorded-DOT-Security-Instrument.pdf' }],
    },
    {
      category: 'PROP',
      documentType: 'Recorded Warranty Deed',
      status: 'Found',
      displayOrder: 3,
      foundCount: 1,
      documents: [{ id: 3, name: 'Recorded-Warranty-Deed.pdf' }],
    },
  ];
}
```

**Step 4: Update handleRunSummary to use combined bundle name**

Find `handleRunSummary` and wherever it uses `bundleName`, update the logic to pull from whichever dropdown was selected:

```jsx
const activeBundleName = externalBundleName || internalBundleName;
```

Replace `bundleName` references in handleRunSummary with `activeBundleName`.

Also update the loanValidated guard check:
```jsx
if (!loanValidated || (!externalBundleName && !internalBundleName)) {
  setValidationError('Please ensure loan number is validated and bundle is selected');
  return;
}
```

**Step 5: Update pdfBundleName to use activeBundleName**

Find `setPdfBundleName` call and replace `bundleName` with `activeBundleName`.

**Step 6: Commit**

```bash
git add src/components/BoBSingleFlow.jsx
git commit -m "feat: split bundle options into external and internal arrays, add Recording Fee Recon mock data"
```

---

## Task 2: Fork Dropdown UI in BoBSingleFlow.jsx

**Files:**
- Modify: `src/components/BoBSingleFlow.jsx`

**Context:** The existing single dropdown needs to become two dropdowns rendered simultaneously after loan confirmation. Selecting one must hide the other.

**Step 1: Find the existing bundle dropdown JSX**

Search for the existing `<select>` or dropdown element that renders after `loanValidated`. It will be rendering `bundleOptions.map(...)`. This is the element to replace.

**Step 2: Replace with two-dropdown fork**

Replace the existing single bundle dropdown render block with:

```jsx
{loanValidated && (
  <div className="space-y-3 mt-4">
    {/* External Vendor Packaging dropdown — hide when internal is selected */}
    {!internalBundleName && (
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
          Select Bundle — External Vendor Packaging
        </label>
        <select
          value={externalBundleName}
          onChange={(e) => {
            setExternalBundleName(e.target.value);
            setInternalBundleName('');
          }}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <option value="">— Select a bundle —</option>
          {externalBundleOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    )}

    {/* Internal Operations dropdown — hide when external is selected */}
    {!externalBundleName && (
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
          Select Bundle — Internal Operations
        </label>
        <select
          value={internalBundleName}
          onChange={(e) => {
            setInternalBundleName(e.target.value);
            setExternalBundleName('');
          }}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <option value="">— Select a bundle —</option>
          {internalBundleOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    )}
  </div>
)}
```

**Step 3: Also reset both dropdowns when loan resets**

Find wherever `setBundleName('')` is called (loan reset / new search) and replace with:
```jsx
setExternalBundleName('');
setInternalBundleName('');
```

**Step 4: Verify in browser**
- Enter `LOAN0001` → hit Enter → both dropdowns appear
- Select from External → Internal disappears → only External stays
- Select from Internal → External disappears → only Internal stays
- Select "Recording Fee Reconciliation" → stacking order generates with 3 docs

**Step 5: Commit**
```bash
git add src/components/BoBSingleFlow.jsx
git commit -m "feat: add two-dropdown fork UI — external vendor packaging vs internal operations"
```

---

## Task 3: Update NavigationPanel.jsx — Rename Example Screens

**Files:**
- Modify: `src/components/NavigationPanel.jsx`

**Step 1: Update menu items array**

Replace the current menuItems array:
```jsx
const menuItems = [
  { id: 'shipper', label: 'Shipper', icon: Home, type: 'internal' },
  { id: 'example-a', label: 'Example Screen A', icon: null, type: 'internal' },
  { id: 'example-b', label: 'Example Screen B', icon: null, type: 'internal' },
  { id: 'example-c', label: 'Example Screen C', icon: null, type: 'internal' },
];
```

With:
```jsx
const menuItems = [
  { id: 'shipper', label: 'Shipper', icon: Home, type: 'internal' },
  { id: 'example-a', label: 'Recording Fee Reconciliation', icon: Receipt, type: 'internal' },
  { id: 'example-b', label: 'Clear to Close Review', icon: CheckSquare, type: 'internal' },
  { id: 'example-c', label: 'Example Screen C', icon: null, type: 'internal' },
];
```

**Step 2: Add Receipt and CheckSquare to lucide-react import**

Find the existing import line:
```jsx
import { X, Home, Package, FileText, Stethoscope, Activity } from 'lucide-react';
```

Add `Receipt, CheckSquare`:
```jsx
import { X, Home, Package, FileText, Stethoscope, Activity, Receipt, CheckSquare } from 'lucide-react';
```

**Step 3: Commit**
```bash
git add src/components/NavigationPanel.jsx
git commit -m "feat: rename nav items — Recording Fee Reconciliation + Clear to Close Review"
```

---

## Task 4: Build Recording Fee Reconciliation Action Screen (ExampleScreenA.jsx)

**Files:**
- Modify: `src/components/ExampleScreenA.jsx`

**Context:** This is the centerpiece of the Phase 0 demo. It replaces the placeholder with a real working screen that mirrors Steps 8–10 of the Recording Fee Recon SOP. All data is mock — no real API calls.

**Mock data to embed (sourced directly from actual CMG loan docs):**

```
Loan: RMA00000070380 (mock)
Borrower: John & Jane Smith (mock)

Settlement Company (from Byte Parties screen):
  Company: John Bethell Title Company, Inc.
  Contact: Rebecca Spencer
  Email: rspencer@johnbtitle.com
  Phone: (812) 245-0172
  Address: 2625 South Walnut Street, Bloomington, IN 47401

FSS Government Recording Fees:
  E-Recording Fee: $10.00
  Recording Fees: $90.00 (Deed: $26.00 | Mortgage: $64.00)
  Total: $100.00

Recorded Warranty Deed stamp:    $26.00  (matches FSS Deed)
Recorded DOT/Security Instrument: $64.00  (matches FSS Mortgage) — MATCH state
Toggle to MISMATCH: change DOT to $50.00 → triggers email required
```

**Step 1: Full replacement of ExampleScreenA.jsx**

Replace the entire file content with:

```jsx
import React, { useState } from 'react';
import { Receipt, CheckCircle, AlertTriangle, Mail, Save, X, RefreshCw, Menu, ChevronDown, ChevronUp, Send } from 'lucide-react';

// Mock data — sourced from actual CMG loan doc examples
const MOCK_LOAN = {
  loanNumber: 'RMA00000070380',
  borrowerName: 'John & Jane Smith',
  propertyAddress: '1400 Old Trail Rd, Maumee, OH 43537',
};

const MOCK_SETTLEMENT_COMPANY = {
  company: 'John Bethell Title Company, Inc.',
  contact: 'Rebecca Spencer',
  email: 'rspencer@johnbtitle.com',
  phone: '(812) 245-0172',
  address: '2625 South Walnut Street, Bloomington, IN 47401',
};

const MATCH_FEES = {
  fssERecording: 10.00,
  fssDeed: 26.00,
  fssMortgage: 64.00,
  recordedDeed: 26.00,     // matches fssDeed
  recordedDOT: 64.00,      // matches fssMortgage
};

const MISMATCH_FEES = {
  ...MATCH_FEES,
  recordedDOT: 50.00,      // mismatch — FSS says $64.00
};

const RecordingFeeReconScreen = ({ onMenuToggle }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isMismatch, setIsMismatch] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [emailBody, setEmailBody] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [showSettlementDetails, setShowSettlementDetails] = useState(true);
  const [byteProUpdated, setByteProUpdated] = useState(false);

  const fees = isMismatch ? MISMATCH_FEES : MATCH_FEES;
  const fssTotal = fees.fssERecording + fees.fssDeed + fees.fssMortgage;
  const deedMatch = fees.recordedDeed === fees.fssDeed;
  const dotMatch = fees.recordedDOT === fees.fssMortgage;
  const allMatch = deedMatch && dotMatch;

  const emailTemplate = `Good morning,

We are currently under examination. The examiner is requesting the following and has provided a 24-hour turn-time.

File no: ${MOCK_LOAN.loanNumber}
Property Address: ${MOCK_LOAN.propertyAddress}

Please provide the following:
1. Final title and recorded DOT/MTG showing the recording fee and taxes.
2. Recorded Warranty Deed showing recording fee and taxes.
3. Final Settlement Statement or Disbursement Ledger.
4. Proof of any refunds made to buyer for any overages.

If you have any questions, please advise. My contact information is listed below.

Laura Harris | External Auditor
CMG Financial | NMLS# 1820 | 3160 Crow Canyon Road, Suite 400 | San Ramon, CA 94583
Office: 972.893.6376 | Email: lharris@cmgfi.com`;

  const handleOpenEmail = () => {
    setEmailBody(emailTemplate);
    setShowEmailComposer(true);
  };

  const handleSendEmail = () => {
    setEmailSent(true);
    setShowEmailComposer(false);
  };

  const handleMarkResolved = () => {
    setByteProUpdated(true);
    setResolved(true);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Toolbar */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-2.5">
          <div className="flex items-center justify-between">
            <button
              onClick={onMenuToggle}
              className="p-1.5 rounded hover:bg-gray-100 transition text-gray-600"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setResolved(false); setByteProUpdated(false); setEmailSent(false); setShowEmailComposer(false); setIsMismatch(false); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition font-medium text-xs"
              >
                <RefreshCw size={14} />
                Reset Demo
              </button>
              {/* Demo toggle */}
              <button
                onClick={() => { setIsMismatch(!isMismatch); setResolved(false); setByteProUpdated(false); setEmailSent(false); setShowEmailComposer(false); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition font-medium text-xs border ${
                  isMismatch
                    ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100'
                    : 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100'
                }`}
              >
                {isMismatch ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
                {isMismatch ? 'Demo: Mismatch' : 'Demo: Match'}
              </button>
              <div className="relative ml-2">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold shadow-sm hover:bg-teal-600 transition-colors"
                >
                  AO
                </button>
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                    <button onClick={() => setShowUserDropdown(false)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg">My Account</button>
                    <button onClick={() => setShowUserDropdown(false)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-200 rounded-b-lg">Sign Out</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-4">

          {/* Page Header */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <Receipt className="text-teal-600" size={20} />
                </div>
                <div>
                  <h1 className="text-base font-bold text-gray-900">Recording Fee Reconciliation</h1>
                  <p className="text-gray-500 text-xs mt-0.5">Loan {MOCK_LOAN.loanNumber} — {MOCK_LOAN.borrowerName}</p>
                </div>
              </div>
              {resolved && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-300 rounded-lg">
                  <CheckCircle size={14} className="text-green-600" />
                  <span className="text-green-700 text-xs font-semibold">Resolved</span>
                </div>
              )}
            </div>
          </div>

          {/* BytePro Updated Toast */}
          {byteProUpdated && (
            <div className="bg-green-50 border border-green-300 rounded-lg px-4 py-3 flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-green-800 text-sm font-medium">BytePro updated successfully — Recording fee reconciliation marked complete.</span>
            </div>
          )}

          {/* Email Sent Toast */}
          {emailSent && (
            <div className="bg-blue-50 border border-blue-300 rounded-lg px-4 py-3 flex items-center gap-2">
              <Send size={16} className="text-blue-600" />
              <span className="text-blue-800 text-sm font-medium">Email sent to {MOCK_SETTLEMENT_COMPANY.email}</span>
            </div>
          )}

          {/* Fee Comparison Card */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Government Recording Fee Comparison</h2>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">Fee Type</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">FSS Amount</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">Recorded Amount</th>
                    <th className="text-center px-4 py-2.5 text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 text-gray-700 text-xs">E-Recording Fee</td>
                    <td className="px-4 py-3 text-right text-gray-700 text-xs font-mono">${fees.fssERecording.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-gray-400 text-xs font-mono">—</td>
                    <td className="px-4 py-3 text-center"><span className="text-xs text-gray-400">N/A</span></td>
                  </tr>
                  <tr className={!deedMatch ? 'bg-red-50' : ''}>
                    <td className="px-4 py-3 text-gray-700 text-xs">Recorded Warranty Deed</td>
                    <td className="px-4 py-3 text-right text-gray-700 text-xs font-mono">${fees.fssDeed.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-gray-700 text-xs font-mono">${fees.recordedDeed.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      {deedMatch
                        ? <span className="inline-flex items-center gap-1 text-xs text-green-700 font-semibold"><CheckCircle size={12} /> Match</span>
                        : <span className="inline-flex items-center gap-1 text-xs text-red-700 font-semibold"><AlertTriangle size={12} /> Mismatch</span>
                      }
                    </td>
                  </tr>
                  <tr className={!dotMatch ? 'bg-red-50' : ''}>
                    <td className="px-4 py-3 text-gray-700 text-xs">Recorded Deed of Trust / Security Instrument</td>
                    <td className="px-4 py-3 text-right text-gray-700 text-xs font-mono">${fees.fssMortgage.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-xs font-mono" style={{ color: !dotMatch ? '#b91c1c' : undefined }}>
                      ${fees.recordedDOT.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {dotMatch
                        ? <span className="inline-flex items-center gap-1 text-xs text-green-700 font-semibold"><CheckCircle size={12} /> Match</span>
                        : <span className="inline-flex items-center gap-1 text-xs text-red-700 font-semibold"><AlertTriangle size={12} /> Mismatch</span>
                      }
                    </td>
                  </tr>
                  <tr className="bg-gray-50 border-t-2 border-gray-200">
                    <td className="px-4 py-2.5 text-xs font-bold text-gray-900">Total Government Recording</td>
                    <td className="px-4 py-2.5 text-right text-xs font-bold text-gray-900 font-mono">${fssTotal.toFixed(2)}</td>
                    <td className="px-4 py-2.5 text-right text-xs font-bold font-mono" style={{ color: allMatch ? '#166534' : '#b91c1c' }}>
                      ${(fees.recordedDeed + fees.recordedDOT).toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {allMatch
                        ? <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-100 rounded text-xs text-green-800 font-bold"><CheckCircle size={12} /> ALL CLEAR</span>
                        : <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-100 rounded text-xs text-red-800 font-bold"><AlertTriangle size={12} /> REFUND REQUIRED</span>
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Settlement Company Details */}
          <div className="bg-white rounded-lg shadow-sm">
            <button
              onClick={() => setShowSettlementDetails(!showSettlementDetails)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition rounded-lg"
            >
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Settlement Company — Parties</h2>
              {showSettlementDetails ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>
            {showSettlementDetails && (
              <div className="px-5 pb-5 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Company</p>
                    <p className="text-sm font-medium text-gray-900">{MOCK_SETTLEMENT_COMPANY.company}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Contact</p>
                    <p className="text-sm font-medium text-gray-900">{MOCK_SETTLEMENT_COMPANY.contact}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                    <p className="text-sm font-medium text-teal-600">{MOCK_SETTLEMENT_COMPANY.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{MOCK_SETTLEMENT_COMPANY.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Address</p>
                    <p className="text-sm font-medium text-gray-900">{MOCK_SETTLEMENT_COMPANY.address}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Area — Steps 8–10 */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Action Required</h2>

            {allMatch ? (
              <div className="space-y-3">
                <p className="text-xs text-gray-600">All recording fees match. Mark this loan resolved and update BytePro.</p>
                <button
                  onClick={handleMarkResolved}
                  disabled={resolved}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold transition ${
                    resolved
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-teal-500 hover:bg-teal-600 text-white'
                  }`}
                >
                  <CheckCircle size={16} />
                  {resolved ? 'Marked Resolved' : 'Mark Resolved — Update BytePro'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs text-amber-800 font-semibold mb-1">⚠️ Fee Mismatch Detected — Refund Required</p>
                  <p className="text-xs text-amber-700">
                    Recorded DOT fee (${fees.recordedDOT.toFixed(2)}) does not match FSS Mortgage recording fee (${fees.fssMortgage.toFixed(2)}).
                    A refund request must be sent to the Settlement Agent. The refund will be made by the Title Company.
                  </p>
                </div>
                <button
                  onClick={handleOpenEmail}
                  disabled={emailSent}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold transition ${
                    emailSent
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <Mail size={16} />
                  {emailSent ? 'Email Sent' : 'Generate Email to Settlement Company'}
                </button>
              </div>
            )}
          </div>

          {/* Email Composer */}
          {showEmailComposer && (
            <div className="bg-white rounded-lg shadow-sm p-5 border-2 border-blue-200">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Email to Settlement Agent</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-12">To:</span>
                  <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded">{MOCK_SETTLEMENT_COMPANY.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-12">Subject:</span>
                  <span className="text-xs font-medium text-gray-700">FW: Final docs request-{MOCK_LOAN.borrowerName}-Commitment no {MOCK_LOAN.loanNumber}</span>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Body:</label>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono"
                    rows={12}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowEmailComposer(false)}
                    className="px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendEmail}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition"
                  >
                    <Send size={13} />
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default RecordingFeeReconScreen;
```

**Step 2: Verify in browser**
- Navigate to hamburger → "Recording Fee Reconciliation"
- Default state: MATCH — table shows green checkmarks, "Mark Resolved" button active
- Click "Demo: Match" toggle → switches to MISMATCH → DOT row goes red, "Generate Email" button appears
- Click "Generate Email" → email composer opens with settlement company email pre-filled and template body
- Edit body if desired → click Send → success toast appears
- Toggle back to MATCH → click "Mark Resolved" → BytePro success toast appears

**Step 3: Commit**
```bash
git add src/components/ExampleScreenA.jsx
git commit -m "feat: build Recording Fee Reconciliation action screen with fee comparison, settlement party details, email composer"
```

---

## Task 5: Update ExampleScreenB.jsx — Clear to Close Review

**Files:**
- Modify: `src/components/ExampleScreenB.jsx`

**Step 1:** Replace the placeholder header/title with "Clear to Close Review" and update the description to reflect its purpose (QC audit for C2C conditions). Keep the "Under Development" state for now — this is a placeholder that will be built out in a future phase.

Find `Example Screen B` text references and replace with `Clear to Close Review`. Update the description to:
```
QC audit screen for reviewing Clear to Close conditions and final approval checklist.
Phase 0 — Under Development.
```

**Step 2: Commit**
```bash
git add src/components/ExampleScreenB.jsx
git commit -m "feat: rename Example Screen B to Clear to Close Review"
```

---

## Task 6: Check and Fix Shipper Nav Item

**Files:**
- Read: `src/components/ShipperPage.jsx`
- Modify if needed: `src/components/ShipperPage.jsx`

**Step 1:** Open the app in browser, click hamburger → click "Shipper". Observe if it renders or fails.

**Step 2:** If ShipperPage renders blank or has an error, check the browser console for errors. The most common issue is the `onMenuToggle` prop not being wired to a hamburger button inside ShipperPage.

**Step 3:** In `ShipperPage.jsx`, confirm there is a hamburger/menu button in the toolbar that calls `onMenuToggle`. If the Menu button exists but has no handler, add `onClick={onMenuToggle}` to it.

**Step 4:** Verify the Shipper nav item navigates properly and the page renders the shipping form.

**Step 5: Commit if changed**
```bash
git add src/components/ShipperPage.jsx
git commit -m "fix: wire onMenuToggle to hamburger button in ShipperPage"
```

---

## Task 7: Final Demo Run-Through

**Verify the complete demo path end-to-end:**

1. Open `http://localhost:5174`
2. Enter `LOAN0001` → Enter → both dropdowns render
3. Select "Recording Fee Reconciliation" from Internal Operations → External dropdown disappears → stacking order generates with 3 docs (FSS, Recorded DOT, Recorded Warranty Deed)
4. Open hamburger → navigate to "Recording Fee Reconciliation"
5. MATCH state: green table, "Mark Resolved" → click → BytePro toast ✓
6. Click "Demo: Match" → switches to MISMATCH → red row on DOT
7. "Generate Email" → composer opens → settlement company email pre-filled → edit body → Send → toast ✓
8. Reset → all clear

**Final commit:**
```bash
git add -A
git commit -m "feat: Phase 0 complete — internal ops fork, recording fee recon bundle + action screen"
```
