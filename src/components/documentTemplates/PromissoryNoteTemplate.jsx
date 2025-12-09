import React from 'react';

const PromissoryNoteTemplate = () => {
  return (
    <div className="bg-white p-8 max-w-[8.5in] mx-auto font-serif text-sm">
      <div className="border-4 border-gray-900">
        {/* Header */}
        <div className="bg-gray-900 text-white p-4 text-center">
          <h1 className="text-3xl font-bold">PROMISSORY NOTE</h1>
          <p className="text-sm mt-2">(Fixed Rate)</p>
        </div>

        {/* Note Details Header */}
        <div className="p-4 bg-yellow-50 border-b-2 border-gray-900">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="border-r-2 border-gray-400">
              <div className="text-xs text-gray-600">Note Date</div>
              <div className="text-lg font-bold">March 20, 2025</div>
            </div>
            <div className="border-r-2 border-gray-400">
              <div className="text-xs text-gray-600">Note Number</div>
              <div className="text-lg font-bold">PN-2025-001234</div>
            </div>
            <div>
              <div className="text-xs text-gray-600">Loan Amount</div>
              <div className="text-2xl font-bold text-green-700">$400,000.00</div>
            </div>
          </div>
        </div>

        {/* Parties Information */}
        <div className="p-6 border-b-2 border-gray-400">
          <div className="grid grid-cols-2 gap-6">
            <div className="border-r-2 border-gray-300 pr-6">
              <h3 className="font-bold text-base mb-3 pb-2 border-b-2 border-blue-900">BORROWER</h3>
              <div className="space-y-1">
                <div><span className="font-semibold">Name:</span> Edward J. Johnson</div>
                <div><span className="font-semibold">Co-Borrower:</span> Sarah M. Johnson</div>
                <div><span className="font-semibold">Address:</span></div>
                <div className="ml-4 text-sm">
                  <div>1234 Oak Street</div>
                  <div>Chicago, IL 60614</div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-base mb-3 pb-2 border-b-2 border-blue-900">LENDER</h3>
              <div className="space-y-1">
                <div><span className="font-semibold">Name:</span> Capital Mortgage Group LLC</div>
                <div><span className="font-semibold">Address:</span></div>
                <div className="ml-4 text-sm">
                  <div>3321 N. Broadway</div>
                  <div>Chicago, IL 60657</div>
                </div>
                <div className="mt-2"><span className="font-semibold">NMLS #:</span> 1234567</div>
              </div>
            </div>
          </div>
        </div>

        {/* Property Information */}
        <div className="p-6 bg-blue-50 border-b-2 border-gray-900">
          <h3 className="font-bold text-base mb-3">PROPERTY ADDRESS (Security for this Note)</h3>
          <div className="text-center p-3 bg-white border-2 border-blue-900 rounded">
            <div className="text-lg font-bold">1234 Oak Street</div>
            <div className="text-base">Chicago, Cook County, Illinois 60614</div>
          </div>
        </div>

        {/* Main Terms */}
        <div className="p-6 border-b-2 border-gray-900">
          <h3 className="font-bold text-base mb-4 text-center uppercase bg-gray-200 p-2">PROMISE TO PAY</h3>

          <p className="mb-4 leading-relaxed">
            FOR VALUE RECEIVED, the undersigned Borrower promises to pay to the order of Lender, the principal sum of
            <span className="font-bold"> Four Hundred Thousand and 00/100 Dollars ($400,000.00)</span>, with interest on the unpaid
            principal balance from the date of this Note, until paid in full.
          </p>

          <div className="bg-green-50 border-2 border-green-600 p-4 rounded mb-4">
            <h4 className="font-bold text-sm mb-3">LOAN TERMS</h4>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-semibold w-1/2">Principal Amount:</td>
                  <td className="py-2 text-right font-bold">$400,000.00</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-semibold">Interest Rate (Fixed):</td>
                  <td className="py-2 text-right font-bold">6.750% per annum</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-semibold">Loan Term:</td>
                  <td className="py-2 text-right font-bold">360 months (30 years)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-semibold">First Payment Due:</td>
                  <td className="py-2 text-right font-bold">May 1, 2025</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-semibold">Monthly Payment (P&I):</td>
                  <td className="py-2 text-right font-bold text-lg">$2,594.17</td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold">Maturity Date:</td>
                  <td className="py-2 text-right font-bold">April 1, 2055</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="p-6 border-b-2 border-gray-400">
          <h3 className="font-bold text-base mb-3 pb-2 border-b-2 border-gray-900">1. PAYMENT TERMS</h3>
          <p className="mb-3 leading-relaxed">
            The Borrower will pay principal and interest by making a payment every month of <span className="font-bold">$2,594.17</span>.
            The Borrower will make <span className="font-bold">360 monthly payments</span> beginning on <span className="font-bold">May 1, 2025</span>,
            and continuing on the first day of each month until the principal and interest are paid in full.
          </p>
          <p className="leading-relaxed">
            Each monthly payment will be applied first to accrued interest and then to principal. The Borrower will pay the Lender
            at the address shown above or at a different place if required by the Lender.
          </p>
        </div>

        {/* Interest Calculation */}
        <div className="p-6 border-b-2 border-gray-400 bg-yellow-50">
          <h3 className="font-bold text-base mb-3 pb-2 border-b-2 border-gray-900">2. INTEREST CALCULATION</h3>
          <p className="leading-relaxed">
            Interest will be charged on the unpaid principal balance at the rate of <span className="font-bold">6.750%</span> per year.
            Interest will be calculated on a 360-day year basis (twelve 30-day months). The interest rate will
            <span className="font-bold"> NOT change</span> during the life of this loan.
          </p>
        </div>

        {/* Additional Terms */}
        <div className="p-6 border-b-2 border-gray-400">
          <h3 className="font-bold text-base mb-3 pb-2 border-b-2 border-gray-900">3. PREPAYMENT</h3>
          <p className="mb-4 leading-relaxed">
            The Borrower has the right to prepay the principal amount outstanding in whole or in part at any time without penalty.
            Any partial prepayment will be applied first to accrued unpaid interest and then to principal.
          </p>

          <h3 className="font-bold text-base mb-3 pb-2 border-b-2 border-gray-900">4. LATE CHARGES</h3>
          <p className="mb-4 leading-relaxed">
            If the Lender has not received the full amount of any monthly payment by the end of
            <span className="font-bold"> 15 calendar days</span> after the date it is due, the Borrower will pay a late charge
            to the Lender of <span className="font-bold">5.0%</span> of the overdue amount of the payment.
          </p>

          <h3 className="font-bold text-base mb-3 pb-2 border-b-2 border-gray-900">5. DEFAULT</h3>
          <p className="leading-relaxed">
            The Borrower will be in default if: (a) the Borrower fails to make any payment when due; (b) the Borrower breaks
            any promise made in the Security Instrument (Mortgage or Deed of Trust); or (c) any other default occurs under the
            Security Instrument. If the Borrower is in default, the Lender may require the Borrower to pay immediately the full
            amount of principal and interest that has not been paid.
          </p>
        </div>

        {/* Payment Schedule Summary */}
        <div className="p-6 border-b-2 border-gray-900 bg-blue-50">
          <h3 className="font-bold text-base mb-3 text-center">PAYMENT SCHEDULE SUMMARY</h3>
          <table className="w-full border-collapse border text-xs">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="border p-2">Year</th>
                <th className="border p-2">Beginning Balance</th>
                <th className="border p-2">Annual Payment</th>
                <th className="border p-2">Principal Paid</th>
                <th className="border p-2">Interest Paid</th>
                <th className="border p-2">Ending Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2 text-center font-semibold">1</td>
                <td className="border p-2 text-right">$400,000.00</td>
                <td className="border p-2 text-right">$31,130.04</td>
                <td className="border p-2 text-right">$4,279.26</td>
                <td className="border p-2 text-right">$26,850.78</td>
                <td className="border p-2 text-right font-semibold">$395,720.74</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2 text-center font-semibold">5</td>
                <td className="border p-2 text-right">$379,438.56</td>
                <td className="border p-2 text-right">$31,130.04</td>
                <td className="border p-2 text-right">$5,641.32</td>
                <td className="border p-2 text-right">$25,488.72</td>
                <td className="border p-2 text-right font-semibold">$373,797.24</td>
              </tr>
              <tr>
                <td className="border p-2 text-center font-semibold">10</td>
                <td className="border p-2 text-right">$345,892.18</td>
                <td className="border p-2 text-right">$31,130.04</td>
                <td className="border p-2 text-right">$7,782.56</td>
                <td className="border p-2 text-right">$23,347.48</td>
                <td className="border p-2 text-right font-semibold">$338,109.62</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2 text-center font-semibold">15</td>
                <td className="border p-2 text-right">$301,645.32</td>
                <td className="border p-2 text-right">$31,130.04</td>
                <td className="border p-2 text-right">$10,745.28</td>
                <td className="border p-2 text-right">$20,384.76</td>
                <td className="border p-2 text-right font-semibold">$290,900.04</td>
              </tr>
              <tr>
                <td className="border p-2 text-center font-semibold">20</td>
                <td className="border p-2 text-right">$242,156.44</td>
                <td className="border p-2 text-right">$31,130.04</td>
                <td className="border p-2 text-right">$14,844.16</td>
                <td className="border p-2 text-right">$16,285.88</td>
                <td className="border p-2 text-right font-semibold">$227,312.28</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2 text-center font-semibold">30</td>
                <td className="border p-2 text-right">$31,126.84</td>
                <td className="border p-2 text-right">$33,223.64</td>
                <td className="border p-2 text-right">$31,126.84</td>
                <td className="border p-2 text-right">$2,096.80</td>
                <td className="border p-2 text-right font-semibold text-green-700">$0.00</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-3 text-xs text-center text-gray-600">
            Total of 360 payments: <span className="font-bold">$933,901.20</span> |
            Total Interest: <span className="font-bold">$533,901.20</span>
          </div>
        </div>

        {/* Signatures */}
        <div className="p-6">
          <h3 className="font-bold text-base mb-4 text-center uppercase">BORROWER ACKNOWLEDGMENT</h3>
          <p className="text-sm mb-6 leading-relaxed">
            By signing below, each Borrower acknowledges having read and understood all provisions of this Promissory Note
            and agrees to be bound by its terms. Each Borrower acknowledges receiving a completed copy of this Note.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="border-2 border-gray-800 p-4 rounded">
              <div className="mb-4">
                <div className="text-xs text-gray-600 mb-1">Borrower Signature</div>
                <div className="border-b-2 border-gray-800 pb-8 mb-2 italic text-lg">Edward J. Johnson</div>
                <div className="text-xs">
                  <div><span className="font-semibold">Printed Name:</span> Edward J. Johnson</div>
                  <div><span className="font-semibold">Date:</span> March 20, 2025</div>
                </div>
              </div>
            </div>

            <div className="border-2 border-gray-800 p-4 rounded">
              <div className="mb-4">
                <div className="text-xs text-gray-600 mb-1">Co-Borrower Signature</div>
                <div className="border-b-2 border-gray-800 pb-8 mb-2 italic text-lg">Sarah M. Johnson</div>
                <div className="text-xs">
                  <div><span className="font-semibold">Printed Name:</span> Sarah M. Johnson</div>
                  <div><span className="font-semibold">Date:</span> March 20, 2025</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 text-white p-4 text-center text-xs border-t-4 border-gray-900">
          <p className="font-bold mb-1">THIS IS A LEGALLY BINDING DOCUMENT</p>
          <p>If you do not understand this document, seek competent legal advice before signing.</p>
          <p className="mt-2">Note Number: PN-2025-001234 | Property: 1234 Oak Street, Chicago, IL 60614</p>
        </div>
      </div>
    </div>
  );
};

export default PromissoryNoteTemplate;
