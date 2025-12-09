import React from 'react';

const ClosingDisclosureTemplate = () => {
  return (
    <div className="bg-white p-6 max-w-[8.5in] mx-auto font-sans text-xs">
      {/* Header */}
      <div className="border-2 border-black">
        <div className="bg-blue-900 text-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Closing Disclosure</h1>
              <p className="text-sm mt-1">This form is a statement of final loan terms and closing costs.</p>
            </div>
            <div className="text-right">
              <div className="text-sm">Issued: 07/02/2025</div>
              <div className="text-sm">Closing: 07/05/2025</div>
              <div className="text-sm">Disbursement: 07/05/2025</div>
            </div>
          </div>
        </div>

        {/* Closing Information */}
        <div className="p-4 bg-gray-50 border-b-2 border-black">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="font-bold text-sm mb-2">Closing Information</div>
              <div className="text-xs space-y-1">
                <div><span className="font-semibold">Date Issued:</span> 07/02/2025</div>
                <div><span className="font-semibold">Closing Date:</span> 07/05/2025</div>
                <div><span className="font-semibold">Disbursement Date:</span> 07/05/2025</div>
                <div><span className="font-semibold">Settlement Agent:</span> Chicago Title Company</div>
                <div><span className="font-semibold">File #:</span> CT-2025-77349</div>
                <div><span className="font-semibold">Property:</span> 1456 Maple St, Chicago, IL 60614</div>
              </div>
            </div>
            <div>
              <div className="font-bold text-sm mb-2">Transaction Information</div>
              <div className="text-xs space-y-1">
                <div><span className="font-semibold">Borrower:</span> Edward J. Johnson & Sarah M. Johnson</div>
                <div><span className="font-semibold">Seller:</span> John & Mary Seller</div>
                <div><span className="font-semibold">Lender:</span> CMG Mortgage, Inc.</div>
              </div>
            </div>
            <div>
              <div className="font-bold text-sm mb-2">Loan Information</div>
              <div className="text-xs space-y-1">
                <div><span className="font-semibold">Loan Term:</span> 30 years</div>
                <div><span className="font-semibold">Purpose:</span> Purchase</div>
                <div><span className="font-semibold">Product:</span> Fixed Rate</div>
                <div><span className="font-semibold">Loan Type:</span> ☑ Conventional ☐ FHA ☐ VA</div>
                <div><span className="font-semibold">Loan ID #:</span> 2025077349</div>
                <div><span className="font-semibold">MIC #:</span> N/A</div>
              </div>
            </div>
          </div>
        </div>

        {/* Loan Terms */}
        <div className="p-4 border-b-2 border-black">
          <div className="font-bold text-sm mb-3 text-blue-900">Loan Terms</div>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-blue-100 border">
                <th className="border p-2 text-left">Loan Amount</th>
                <th className="border p-2 text-left">Interest Rate</th>
                <th className="border p-2 text-left">Monthly Principal & Interest</th>
                <th className="border p-2 text-left">Prepayment Penalty</th>
                <th className="border p-2 text-left">Balloon Payment</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2 font-bold text-lg">$340,000</td>
                <td className="border p-2 font-bold text-lg">6.5%</td>
                <td className="border p-2 font-bold text-lg">$2,149.00</td>
                <td className="border p-2 text-center">NO</td>
                <td className="border p-2 text-center">NO</td>
              </tr>
              <tr className="text-xs">
                <td className="border p-2"></td>
                <td className="border p-2">Your interest rate can ☐ increase ☑ never change</td>
                <td className="border p-2">Principal and Interest payment only. Does not include taxes, insurance, or other escrow items.</td>
                <td className="border p-2"></td>
                <td className="border p-2"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Projected Payments */}
        <div className="p-4 border-b-2 border-black">
          <div className="font-bold text-sm mb-3 text-blue-900">Projected Payments</div>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="border p-2 text-left">Payment Calculation</th>
                <th className="border p-2 text-center">Years 1-30</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Principal & Interest</td>
                <td className="border p-2 text-center font-semibold">$2,149.00</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2">Mortgage Insurance</td>
                <td className="border p-2 text-center">$0</td>
              </tr>
              <tr>
                <td className="border p-2">Estimated Escrow</td>
                <td className="border p-2 text-center font-semibold">$950.00</td>
              </tr>
              <tr className="bg-gray-100">
                <td className="border p-2 text-xs pl-6">- Property Taxes</td>
                <td className="border p-2 text-center text-xs">$704.17</td>
              </tr>
              <tr className="bg-gray-100">
                <td className="border p-2 text-xs pl-6">- Homeowner's Insurance</td>
                <td className="border p-2 text-center text-xs">$208.33</td>
              </tr>
              <tr className="bg-gray-100">
                <td className="border p-2 text-xs pl-6">- Other: HOA Dues</td>
                <td className="border p-2 text-center text-xs">$37.50</td>
              </tr>
              <tr className="bg-yellow-100 border-2 border-yellow-600">
                <td className="border-r p-2 font-bold">Estimated Total Monthly Payment</td>
                <td className="border-0 p-2 text-center font-bold text-xl text-green-800">$3,099.00</td>
              </tr>
              <tr>
                <td className="border p-2 text-xs" colSpan="2">
                  This estimate includes ☑ Property Taxes ☑ Homeowner's Insurance ☑ Other: HOA Dues
                  <div className="mt-1">See Escrow Account on page 4 for details. See page 2 for details on what is included in insurance.</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Costs at Closing */}
        <div className="p-4 border-b-2 border-black">
          <div className="font-bold text-sm mb-3 text-blue-900">Costs at Closing</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <table className="w-full text-xs border-collapse">
                <tbody>
                  <tr className="bg-blue-50">
                    <td className="border p-2 font-semibold">Closing Costs</td>
                    <td className="border p-2 text-right font-bold">$12,850.00</td>
                  </tr>
                  <tr>
                    <td className="border p-2 pl-4 text-xs">Includes $8,350 in Loan Costs + $4,500 in Other Costs – $0 in Lender Credits. See page 2 for details.</td>
                    <td className="border p-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <table className="w-full text-xs border-collapse">
                <tbody>
                  <tr className="bg-green-50">
                    <td className="border p-2 font-semibold">Cash to Close</td>
                    <td className="border p-2 text-right font-bold text-lg text-green-800">$97,850.00</td>
                  </tr>
                  <tr>
                    <td className="border p-2 pl-4 text-xs">Includes Closing Costs. See Calculating Cash to Close on page 3 for details.</td>
                    <td className="border p-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Closing Cost Details - Page 2 */}
        <div className="p-4 border-b-2 border-black bg-gray-50">
          <div className="font-bold text-sm mb-3 text-blue-900">Closing Cost Details</div>

          {/* Loan Costs */}
          <div className="mb-4">
            <div className="font-bold text-xs mb-2 bg-blue-100 p-2">A. Origination Charges</div>
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="p-2">.25% of Loan Amount (Points)</td>
                  <td className="p-2 text-right">$850.00</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Application Fee</td>
                  <td className="p-2 text-right">$400.00</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Underwriting Fee</td>
                  <td className="p-2 text-right">$795.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-4">
            <div className="font-bold text-xs mb-2 bg-blue-100 p-2">B. Services Borrower Did Not Shop For</div>
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="p-2">Appraisal Fee (to Premier Appraisal Services)</td>
                  <td className="p-2 text-right">$625.00</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Credit Report Fee (to Experian)</td>
                  <td className="p-2 text-right">$45.00</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Flood Certification (to FloodCert, Inc.)</td>
                  <td className="p-2 text-right">$15.00</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Tax Service Fee (to CoreLogic)</td>
                  <td className="p-2 text-right">$85.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-4">
            <div className="font-bold text-xs mb-2 bg-blue-100 p-2">C. Services Borrower Did Shop For</div>
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="p-2">Pest Inspection (to ABC Pest Control)</td>
                  <td className="p-2 text-right">$125.00</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Survey Fee (to Precision Survey Co.)</td>
                  <td className="p-2 text-right">$450.00</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Title - Owner's Title Insurance (to First American)</td>
                  <td className="p-2 text-right">$1,680.00</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Title - Lender's Title Insurance (to First American)</td>
                  <td className="p-2 text-right">$700.00</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Title - Settlement Agent Fee (to Chicago Title)</td>
                  <td className="p-2 text-right">$550.00</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Title - Title Search (to First American)</td>
                  <td className="p-2 text-right">$250.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-4">
            <div className="font-bold text-xs mb-2 bg-orange-100 p-2">E. Taxes and Other Government Fees</div>
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="p-2">Recording Fees: Deed $50.00 Mortgage $75.00</td>
                  <td className="p-2 text-right">$125.00</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Transfer Tax</td>
                  <td className="p-2 text-right">$2,125.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-4">
            <div className="font-bold text-xs mb-2 bg-green-100 p-2">F. Prepaids</div>
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="p-2">Homeowner's Insurance Premium (12 months to State Farm)</td>
                  <td className="p-2 text-right">$2,500.00</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Mortgage Insurance Premium (  months)</td>
                  <td className="p-2 text-right">$0.00</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Prepaid Interest ($61.11 per day from 07/05/25 to 08/01/25)</td>
                  <td className="p-2 text-right">$1,650.00</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Property Taxes (6 months)</td>
                  <td className="p-2 text-right">$4,225.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-100 border-2 border-yellow-600 p-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-bold">Total Loan Costs (A + B + C + D)</div>
                <div className="text-xs text-gray-600">Borrower-Paid at Closing</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xl">$8,350.00</div>
              </div>
            </div>
          </div>

          <div className="bg-green-100 border-2 border-green-600 p-3 mt-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-bold">Total Other Costs (E + F + G + H)</div>
                <div className="text-xs text-gray-600">Borrower-Paid at Closing</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xl">$10,625.00</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-100 border-2 border-blue-600 p-3 mt-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-bold text-lg">Total Closing Costs (J + K)</div>
                <div className="text-xs text-gray-600">Borrower-Paid at Closing</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-2xl text-blue-900">$18,975.00</div>
              </div>
            </div>
          </div>
        </div>

        {/* Calculating Cash to Close */}
        <div className="p-4 border-b-2 border-black">
          <div className="font-bold text-sm mb-3 text-blue-900">Calculating Cash to Close</div>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="border p-2 text-left"></th>
                <th className="border p-2 text-right">Loan Estimate</th>
                <th className="border p-2 text-right">Final</th>
                <th className="border p-2 text-right">Did this change?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Total Closing Costs (J)</td>
                <td className="border p-2 text-right">$18,850.00</td>
                <td className="border p-2 text-right font-semibold">$18,975.00</td>
                <td className="border p-2 text-right text-xs">YES • See Total Loan Costs (A) and Total Other Costs (B)</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2">Closing Costs Financed (Paid from your Loan Amount)</td>
                <td className="border p-2 text-right">$0</td>
                <td className="border p-2 text-right">$0</td>
                <td className="border p-2 text-right">NO</td>
              </tr>
              <tr>
                <td className="border p-2">Down Payment/Funds from Borrower</td>
                <td className="border p-2 text-right">$85,000.00</td>
                <td className="border p-2 text-right font-semibold">$85,000.00</td>
                <td className="border p-2 text-right">NO</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2">Deposit</td>
                <td className="border p-2 text-right">-$5,000.00</td>
                <td className="border p-2 text-right">-$5,000.00</td>
                <td className="border p-2 text-right">NO</td>
              </tr>
              <tr>
                <td className="border p-2">Funds for Borrower</td>
                <td className="border p-2 text-right">$0</td>
                <td className="border p-2 text-right">$0</td>
                <td className="border p-2 text-right">NO</td>
              </tr>
              <tr>
                <td className="border p-2">Seller Credits</td>
                <td className="border p-2 text-right">$0</td>
                <td className="border p-2 text-right">$0</td>
                <td className="border p-2 text-right">NO</td>
              </tr>
              <tr>
                <td className="border p-2">Adjustments and Other Credits</td>
                <td className="border p-2 text-right">-$150.00</td>
                <td className="border p-2 text-right">-$125.00</td>
                <td className="border p-2 text-right text-xs">YES</td>
              </tr>
              <tr className="bg-green-100 border-2 border-green-600">
                <td className="border-r p-2 font-bold">Cash to Close</td>
                <td className="border-r p-2 text-right">$98,700.00</td>
                <td className="border-r p-2 text-right font-bold text-2xl text-green-800">$98,850.00</td>
                <td className="border-0 p-2 text-right text-xs">YES</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Confirmation */}
        <div className="p-4 bg-yellow-50 border-b-2 border-black">
          <div className="font-bold text-sm mb-2">Important: By signing, you are only confirming that you have received this form. You do not have to accept this loan because you have signed or received this form.</div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="border-2 border-gray-400 p-3 rounded">
              <div className="text-xs mb-2">Borrower</div>
              <div className="border-b-2 border-gray-400 pb-6 mb-2 italic">Edward J. Johnson</div>
              <div className="text-xs">Date: 07/02/2025</div>
            </div>
            <div className="border-2 border-gray-400 p-3 rounded">
              <div className="text-xs mb-2">Co-Borrower</div>
              <div className="border-b-2 border-gray-400 pb-6 mb-2 italic">Sarah M. Johnson</div>
              <div className="text-xs">Date: 07/02/2025</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-100 text-center text-xs text-gray-600">
          <p className="font-bold">CLOSING DISCLOSURE | PAGE 1 OF 5</p>
          <p className="mt-2">LOAN ID # 2025077349</p>
        </div>
      </div>
    </div>
  );
};

export default ClosingDisclosureTemplate;
