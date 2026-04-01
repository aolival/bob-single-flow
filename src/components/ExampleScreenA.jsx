import React, { useState } from 'react';
import { Receipt, CheckCircle, AlertTriangle, Mail, RefreshCw, Menu, ChevronDown, ChevronUp, Send, ArrowLeft } from 'lucide-react';

const MOCK_LOAN = {
  loanNumber: 'RMA00000070380',
  borrowerName: 'John & Jane Smith',
  propertyAddress: '1400 Old Trail Rd, Maumee, OH 43537',
};

const MOCK_SETTLEMENT = {
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
  recordedDeed: 26.00,
  recordedDOT: 64.00,
};

const MISMATCH_FEES = {
  ...MATCH_FEES,
  recordedDOT: 50.00,
};

const RecordingFeeReconScreen = ({ onMenuToggle, onNavigateBack }) => {
  const [isMismatch, setIsMismatch] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [byteProUpdated, setByteProUpdated] = useState(false);
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailBody, setEmailBody] = useState('');
  const [showSettlement, setShowSettlement] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const fees = isMismatch ? MISMATCH_FEES : MATCH_FEES;
  const fssTotal = fees.fssERecording + fees.fssDeed + fees.fssMortgage;
  const deedMatch = fees.recordedDeed === fees.fssDeed;
  const dotMatch = fees.recordedDOT === fees.fssMortgage;
  const allMatch = deedMatch && dotMatch;
  const recordedTotal = fees.recordedDeed + fees.recordedDOT;

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

  const handleReset = () => {
    setIsMismatch(false);
    setResolved(false);
    setByteProUpdated(false);
    setShowEmailComposer(false);
    setEmailSent(false);
    setEmailBody('');
  };

  const handleToggleMismatch = () => {
    setIsMismatch(v => !v);
    setResolved(false);
    setByteProUpdated(false);
    setShowEmailComposer(false);
    setEmailSent(false);
  };

  const handleMarkResolved = () => {
    setByteProUpdated(true);
    setResolved(true);
  };

  const handleOpenEmail = () => {
    setEmailBody(emailTemplate);
    setShowEmailComposer(true);
  };

  const handleSendEmail = () => {
    setEmailSent(true);
    setShowEmailComposer(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Toolbar */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onMenuToggle} className="p-1.5 rounded hover:bg-gray-100 transition text-gray-500">
              <Menu size={18} />
            </button>
            {onNavigateBack && (
              <button
                onClick={onNavigateBack}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-teal-600 transition font-medium"
              >
                <ArrowLeft size={14} />
                Back to BoB
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition text-xs font-medium"
            >
              <RefreshCw size={13} />
              Reset Demo
            </button>
            <button
              onClick={handleToggleMismatch}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded border transition text-xs font-semibold ${
                isMismatch
                  ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100'
                  : 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100'
              }`}
            >
              {isMismatch ? <AlertTriangle size={13} /> : <CheckCircle size={13} />}
              {isMismatch ? 'Demo: Mismatch' : 'Demo: Match'}
            </button>
            <div className="relative ml-1">
              <button
                onClick={() => setShowUserDropdown(v => !v)}
                className="w-9 h-9 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-semibold hover:bg-teal-600 transition"
              >
                AO
              </button>
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button onClick={() => setShowUserDropdown(false)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg">My Account</button>
                  <button onClick={() => setShowUserDropdown(false)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100 rounded-b-lg">Sign Out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-4">

          {/* Header Card */}
          <div className="bg-white rounded-lg shadow-sm p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Receipt className="text-teal-600" size={20} />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900">Recording Fee Reconciliation</h1>
                <p className="text-xs text-gray-500 mt-0.5">Loan {MOCK_LOAN.loanNumber} — {MOCK_LOAN.borrowerName}</p>
              </div>
            </div>
            {resolved && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle size={14} className="text-green-600" />
                <span className="text-xs font-semibold text-green-700">Resolved</span>
              </div>
            )}
          </div>

          {/* Toast: BytePro Updated */}
          {byteProUpdated && (
            <div className="bg-green-50 border border-green-300 rounded-lg px-4 py-3 flex items-center gap-2">
              <CheckCircle size={15} className="text-green-600 flex-shrink-0" />
              <span className="text-sm font-medium text-green-800">BytePro updated — recording fee reconciliation marked complete.</span>
            </div>
          )}

          {/* Toast: Email Sent */}
          {emailSent && (
            <div className="bg-blue-50 border border-blue-300 rounded-lg px-4 py-3 flex items-center gap-2">
              <Send size={15} className="text-blue-600 flex-shrink-0" />
              <span className="text-sm font-medium text-blue-800">Email sent to {MOCK_SETTLEMENT.email}</span>
            </div>
          )}

          {/* Fee Comparison Table */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Government Recording Fee Comparison</h2>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fee Type</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">FSS Amount</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Recorded</th>
                    <th className="text-center px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 text-xs text-gray-600">E-Recording Fee</td>
                    <td className="px-4 py-3 text-right text-xs font-mono text-gray-700">${fees.fssERecording.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-xs font-mono text-gray-400">—</td>
                    <td className="px-4 py-3 text-center"><span className="text-xs text-gray-400">N/A</span></td>
                  </tr>
                  <tr className={!deedMatch ? 'bg-red-50' : ''}>
                    <td className="px-4 py-3 text-xs text-gray-600">Recorded Warranty Deed</td>
                    <td className="px-4 py-3 text-right text-xs font-mono text-gray-700">${fees.fssDeed.toFixed(2)}</td>
                    <td className={`px-4 py-3 text-right text-xs font-mono ${!deedMatch ? 'text-red-700 font-semibold' : 'text-gray-700'}`}>${fees.recordedDeed.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      {deedMatch
                        ? <span className="inline-flex items-center gap-1 text-xs text-green-700 font-semibold"><CheckCircle size={11} />Match</span>
                        : <span className="inline-flex items-center gap-1 text-xs text-red-700 font-semibold"><AlertTriangle size={11} />Mismatch</span>}
                    </td>
                  </tr>
                  <tr className={!dotMatch ? 'bg-red-50' : ''}>
                    <td className="px-4 py-3 text-xs text-gray-600">Recorded Deed of Trust / Security Instrument</td>
                    <td className="px-4 py-3 text-right text-xs font-mono text-gray-700">${fees.fssMortgage.toFixed(2)}</td>
                    <td className={`px-4 py-3 text-right text-xs font-mono ${!dotMatch ? 'text-red-700 font-semibold' : 'text-gray-700'}`}>${fees.recordedDOT.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      {dotMatch
                        ? <span className="inline-flex items-center gap-1 text-xs text-green-700 font-semibold"><CheckCircle size={11} />Match</span>
                        : <span className="inline-flex items-center gap-1 text-xs text-red-700 font-semibold"><AlertTriangle size={11} />Mismatch</span>}
                    </td>
                  </tr>
                  <tr className="bg-gray-50 border-t-2 border-gray-200">
                    <td className="px-4 py-3 text-xs font-bold text-gray-900">Total Government Recording</td>
                    <td className="px-4 py-3 text-right text-xs font-bold font-mono text-gray-900">${fssTotal.toFixed(2)}</td>
                    <td className={`px-4 py-3 text-right text-xs font-bold font-mono ${allMatch ? 'text-green-700' : 'text-red-700'}`}>${recordedTotal.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      {allMatch
                        ? <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-100 rounded text-xs text-green-800 font-bold"><CheckCircle size={11} />ALL CLEAR</span>
                        : <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-100 rounded text-xs text-red-800 font-bold"><AlertTriangle size={11} />REFUND REQUIRED</span>}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Settlement Company */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => setShowSettlement(v => !v)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition text-left"
            >
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Settlement Company — Parties</h2>
              {showSettlement ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
            </button>
            {showSettlement && (
              <div className="px-5 pb-5 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Company</p>
                    <p className="text-sm font-medium text-gray-900">{MOCK_SETTLEMENT.company}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Contact</p>
                    <p className="text-sm font-medium text-gray-900">{MOCK_SETTLEMENT.contact}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Email</p>
                    <p className="text-sm font-medium text-teal-600">{MOCK_SETTLEMENT.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{MOCK_SETTLEMENT.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Address</p>
                    <p className="text-sm font-medium text-gray-900">{MOCK_SETTLEMENT.address}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Required */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Action Required — Steps 8–10</h2>
            {allMatch ? (
              <div className="space-y-3">
                <p className="text-xs text-gray-600">All recording fees match the Final Settlement Statement. Mark this loan resolved and update BytePro.</p>
                <button
                  onClick={handleMarkResolved}
                  disabled={resolved}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold transition ${
                    resolved ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600 text-white'
                  }`}
                >
                  <CheckCircle size={15} />
                  {resolved ? 'Marked Resolved' : 'Mark Resolved — Update BytePro'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-amber-800 mb-1">⚠️ Fee Mismatch — Refund Required</p>
                  <p className="text-xs text-amber-700">
                    Recorded DOT fee (${fees.recordedDOT.toFixed(2)}) does not match FSS Mortgage recording fee (${fees.fssMortgage.toFixed(2)}).
                    A refund request must be sent to the Settlement Agent. The refund will be processed by the Title Company.
                  </p>
                </div>
                <button
                  onClick={handleOpenEmail}
                  disabled={emailSent}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold transition ${
                    emailSent ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <Mail size={15} />
                  {emailSent ? 'Email Sent' : 'Generate Email to Settlement Company'}
                </button>
              </div>
            )}
          </div>

          {/* Email Composer */}
          {showEmailComposer && (
            <div className="bg-white rounded-lg shadow-sm p-5 border-2 border-blue-200">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Email to Settlement Agent</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                  <span className="text-xs text-gray-400 w-14 flex-shrink-0">To:</span>
                  <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded">{MOCK_SETTLEMENT.email}</span>
                </div>
                <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                  <span className="text-xs text-gray-400 w-14 flex-shrink-0">Subject:</span>
                  <span className="text-xs text-gray-700 font-medium">FW: Final docs request-{MOCK_LOAN.borrowerName}-Commitment no {MOCK_LOAN.loanNumber}</span>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1.5">Body:</label>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    rows={12}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-1">
                  <button
                    onClick={() => setShowEmailComposer(false)}
                    className="px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-600 hover:bg-gray-50 transition"
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
