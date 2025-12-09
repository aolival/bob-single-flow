import React from 'react';

const CreditReportTemplate = ({ borrowerName = 'Edward Johnson' }) => {
  return (
    <div className="bg-white p-6 max-w-[8.5in] mx-auto font-sans text-xs">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">TRI-MERGE CREDIT REPORT</h1>
            <p className="text-sm mt-1">Residential Mortgage Credit Report</p>
          </div>
          <div className="text-right">
            <div className="text-sm">Report Date: 06/27/2025</div>
            <div className="text-sm">File #: X#_77349726_06-27</div>
            <div className="text-sm font-bold mt-1">Expiration: 10/27/2025</div>
          </div>
        </div>
      </div>

      <div className="border-2 border-blue-900 border-t-0">
        {/* Borrower Information */}
        <div className="p-4 bg-gray-50 border-b-2 border-blue-900">
          <h3 className="font-bold text-sm mb-2 text-blue-900">BORROWER INFORMATION</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div><span className="font-semibold">Name:</span> {borrowerName}</div>
              <div><span className="font-semibold">SSN:</span> XXX-XX-6789</div>
              <div><span className="font-semibold">Date of Birth:</span> 03/15/1985</div>
            </div>
            <div>
              <div><span className="font-semibold">Current Address:</span></div>
              <div>1456 Maple Street</div>
              <div>Chicago, IL 60614</div>
            </div>
          </div>
        </div>

        {/* Credit Scores */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-b-2 border-blue-900">
          <h3 className="font-bold text-sm mb-3 text-blue-900">CREDIT SCORES</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-lg shadow text-center border-2 border-green-500">
              <div className="text-xs font-semibold text-gray-600 mb-1">EQUIFAX</div>
              <div className="text-3xl font-bold text-green-700">762</div>
              <div className="text-xs text-gray-500 mt-1">FICO Score 5</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow text-center border-2 border-blue-500">
              <div className="text-xs font-semibold text-gray-600 mb-1">EXPERIAN</div>
              <div className="text-3xl font-bold text-blue-700">758</div>
              <div className="text-xs text-gray-500 mt-1">FICO Score 2</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow text-center border-2 border-purple-500">
              <div className="text-xs font-semibold text-gray-600 mb-1">TRANSUNION</div>
              <div className="text-3xl font-bold text-purple-700">765</div>
              <div className="text-xs text-gray-500 mt-1">FICO Score 4</div>
            </div>
          </div>
          <div className="mt-3 p-2 bg-yellow-50 border-l-4 border-yellow-500">
            <div className="font-bold text-sm">Representative Credit Score: <span className="text-lg text-green-700">762</span> (Middle Score)</div>
            <div className="text-xs text-gray-600 mt-1">The middle score is used for mortgage underwriting purposes</div>
          </div>
        </div>

        {/* Credit Summary */}
        <div className="p-4 border-b-2 border-gray-300">
          <h3 className="font-bold text-sm mb-3 text-blue-900">CREDIT PROFILE SUMMARY</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-600">Total Accounts</div>
              <div className="text-lg font-bold">24</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-600">Open Accounts</div>
              <div className="text-lg font-bold">15</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-600">Closed Accounts</div>
              <div className="text-lg font-bold">9</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-600">Delinquent</div>
              <div className="text-lg font-bold text-green-700">0</div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 mt-3">
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-600">Total Balance</div>
              <div className="text-lg font-bold">$38,450</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-600">Monthly Payment</div>
              <div className="text-lg font-bold">$1,245</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-600">Available Credit</div>
              <div className="text-lg font-bold">$61,550</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-600">Credit Utilization</div>
              <div className="text-lg font-bold text-green-700">12%</div>
            </div>
          </div>
        </div>

        {/* Trade Lines */}
        <div className="p-4 border-b-2 border-gray-300">
          <h3 className="font-bold text-sm mb-3 text-blue-900">TRADE LINES (CREDIT ACCOUNTS)</h3>

          {/* Revolving Accounts */}
          <div className="mb-4">
            <h4 className="font-semibold text-xs mb-2 bg-gray-100 p-2">REVOLVING ACCOUNTS</h4>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border p-1 text-left">Creditor</th>
                  <th className="border p-1">Account #</th>
                  <th className="border p-1">Status</th>
                  <th className="border p-1">Limit</th>
                  <th className="border p-1">Balance</th>
                  <th className="border p-1">Payment</th>
                  <th className="border p-1">Opened</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-1">Chase Sapphire Preferred</td>
                  <td className="border p-1 text-center">****8745</td>
                  <td className="border p-1 text-center text-green-700 font-semibold">Current</td>
                  <td className="border p-1 text-right">$25,000</td>
                  <td className="border p-1 text-right">$2,450</td>
                  <td className="border p-1 text-right">$125</td>
                  <td className="border p-1 text-center">03/2019</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-1">American Express Blue</td>
                  <td className="border p-1 text-center">****3421</td>
                  <td className="border p-1 text-center text-green-700 font-semibold">Current</td>
                  <td className="border p-1 text-right">$15,000</td>
                  <td className="border p-1 text-right">$1,200</td>
                  <td className="border p-1 text-right">$85</td>
                  <td className="border p-1 text-center">07/2020</td>
                </tr>
                <tr>
                  <td className="border p-1">Discover Card</td>
                  <td className="border p-1 text-center">****9876</td>
                  <td className="border p-1 text-center text-green-700 font-semibold">Current</td>
                  <td className="border p-1 text-right">$10,000</td>
                  <td className="border p-1 text-right">$0</td>
                  <td className="border p-1 text-right">$0</td>
                  <td className="border p-1 text-center">01/2018</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-1">Citi Diamond Preferred</td>
                  <td className="border p-1 text-center">****5432</td>
                  <td className="border p-1 text-center text-green-700 font-semibold">Current</td>
                  <td className="border p-1 text-right">$12,000</td>
                  <td className="border p-1 text-right">$800</td>
                  <td className="border p-1 text-right">$35</td>
                  <td className="border p-1 text-center">11/2019</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Installment Loans */}
          <div className="mb-4">
            <h4 className="font-semibold text-xs mb-2 bg-gray-100 p-2">INSTALLMENT LOANS</h4>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border p-1 text-left">Creditor</th>
                  <th className="border p-1">Account #</th>
                  <th className="border p-1">Status</th>
                  <th className="border p-1">Original</th>
                  <th className="border p-1">Balance</th>
                  <th className="border p-1">Payment</th>
                  <th className="border p-1">Opened</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-1">Toyota Financial - Auto Loan</td>
                  <td className="border p-1 text-center">****2341</td>
                  <td className="border p-1 text-center text-green-700 font-semibold">Current</td>
                  <td className="border p-1 text-right">$32,000</td>
                  <td className="border p-1 text-right">$18,500</td>
                  <td className="border p-1 text-right">$545</td>
                  <td className="border p-1 text-center">08/2022</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-1">Wells Fargo Student Loan</td>
                  <td className="border p-1 text-center">****8901</td>
                  <td className="border p-1 text-center text-green-700 font-semibold">Current</td>
                  <td className="border p-1 text-right">$25,000</td>
                  <td className="border p-1 text-right">$15,500</td>
                  <td className="border p-1 text-right">$255</td>
                  <td className="border p-1 text-center">09/2010</td>
                </tr>
                <tr>
                  <td className="border p-1">Best Buy - Personal Loan</td>
                  <td className="border p-1 text-center">****4567</td>
                  <td className="border p-1 text-center text-gray-600 font-semibold">Paid/Closed</td>
                  <td className="border p-1 text-right">$3,500</td>
                  <td className="border p-1 text-right">$0</td>
                  <td className="border p-1 text-right">$0</td>
                  <td className="border p-1 text-center">04/2021</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment History */}
        <div className="p-4 border-b-2 border-gray-300">
          <h3 className="font-bold text-sm mb-3 text-blue-900">PAYMENT HISTORY (Last 24 Months)</h3>
          <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
            <div className="flex items-center gap-2">
              <div className="text-2xl">✓</div>
              <div>
                <div className="font-bold text-green-800">EXCELLENT PAYMENT HISTORY</div>
                <div className="text-xs text-gray-600 mt-1">No late payments, delinquencies, or derogatory marks in the past 24 months</div>
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="bg-white p-2 rounded border">
              <div className="text-xs text-gray-600">30-Day Late</div>
              <div className="text-2xl font-bold text-green-700">0</div>
            </div>
            <div className="bg-white p-2 rounded border">
              <div className="text-xs text-gray-600">60-Day Late</div>
              <div className="text-2xl font-bold text-green-700">0</div>
            </div>
            <div className="bg-white p-2 rounded border">
              <div className="text-xs text-gray-600">90+ Day Late</div>
              <div className="text-2xl font-bold text-green-700">0</div>
            </div>
          </div>
        </div>

        {/* Public Records */}
        <div className="p-4 border-b-2 border-gray-300">
          <h3 className="font-bold text-sm mb-3 text-blue-900">PUBLIC RECORDS</h3>
          <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
            <div className="flex items-center gap-2">
              <div className="text-2xl">✓</div>
              <div>
                <div className="font-bold text-green-800">NO PUBLIC RECORDS FOUND</div>
                <div className="text-xs text-gray-600 mt-1">No bankruptcies, liens, judgments, or collections</div>
              </div>
            </div>
          </div>
        </div>

        {/* Inquiries */}
        <div className="p-4 border-b-2 border-gray-300">
          <h3 className="font-bold text-sm mb-3 text-blue-900">CREDIT INQUIRIES (Last 12 Months)</h3>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="border p-1 text-left">Date</th>
                <th className="border p-1 text-left">Creditor</th>
                <th className="border p-1">Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-1">06/27/2025</td>
                <td className="border p-1">CMG Mortgage, Inc.</td>
                <td className="border p-1 text-center">Hard Inquiry</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-1">03/15/2025</td>
                <td className="border p-1">Chase Bank</td>
                <td className="border p-1 text-center">Hard Inquiry</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-2 text-xs text-gray-600">
            Total Hard Inquiries (12 months): <span className="font-bold">2</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-100 rounded-b-lg">
          <div className="text-xs text-gray-600">
            <p className="font-bold mb-1">IMPORTANT NOTICE:</p>
            <p>This credit report was prepared for CMG Mortgage, Inc. for use in connection with a credit transaction involving the named consumer. This report contains information obtained from Equifax, Experian, and TransUnion.</p>
            <p className="mt-2">Credit report expires: <span className="font-bold">10/27/2025</span> (120 days from pull date)</p>
            <p className="mt-2 text-center font-semibold">For questions or disputes, contact the credit bureaus directly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditReportTemplate;
