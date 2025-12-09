import React from 'react';

const Application1003Template = () => {
  return (
    <div className="bg-white p-6 max-w-[8.5in] mx-auto font-sans text-xs">
      {/* Header */}
      <div className="border-2 border-black">
        <div className="bg-gray-200 p-3 border-b-2 border-black">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-bold">Uniform Residential Loan Application</h1>
              <div className="text-xs mt-1">Fannie Mae Form 1003 | Freddie Mac Form 65</div>
            </div>
            <div className="text-right text-xs">
              <div>Effective 1/2021</div>
              <div className="font-bold mt-1">File #: 2025-MTG-77349</div>
            </div>
          </div>
        </div>

        {/* Section 1a: Borrower Information */}
        <div className="p-3 border-b-2 border-black">
          <div className="bg-blue-900 text-white p-2 mb-2 font-bold">Section 1a. Borrower Information</div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <div className="text-xs font-semibold mb-1">1a. Personal Information</div>
              <div className="border p-2 bg-gray-50">
                <div><span className="font-semibold">Name:</span> Edward J. Johnson</div>
                <div className="mt-1"><span className="font-semibold">Suffix:</span> —</div>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold mb-1">Alternate Names</div>
              <div className="border p-2 bg-gray-50">
                <div>None</div>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold mb-1">Type of Credit</div>
              <div className="border p-2 bg-gray-50">
                <div>☑ Individual</div>
                <div>☐ Joint</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-3">
            <div className="border p-2 bg-gray-50">
              <div className="font-semibold text-xs mb-1">Social Security Number</div>
              <div className="font-mono">XXX-XX-6789</div>
            </div>
            <div className="border p-2 bg-gray-50">
              <div className="font-semibold text-xs mb-1">Date of Birth</div>
              <div>03/15/1985</div>
            </div>
            <div className="border p-2 bg-gray-50">
              <div className="font-semibold text-xs mb-1">Citizenship</div>
              <div>☑ U.S. Citizen</div>
            </div>
            <div className="border p-2 bg-gray-50">
              <div className="font-semibold text-xs mb-1">Marital Status</div>
              <div>☑ Married</div>
            </div>
          </div>

          <div className="border p-2 bg-gray-50 mb-3">
            <div className="font-semibold text-xs mb-1">Contact Information</div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="font-semibold">Home:</span> (312) 555-7890
              </div>
              <div>
                <span className="font-semibold">Cell:</span> (312) 555-7891
              </div>
              <div>
                <span className="font-semibold">Email:</span> edward.johnson@email.com
              </div>
            </div>
          </div>

          <div className="border p-2 bg-gray-50">
            <div className="font-semibold text-xs mb-1">Current Address</div>
            <div>1456 Maple Street, Chicago, IL 60614</div>
            <div className="grid grid-cols-3 gap-3 mt-2">
              <div><span className="font-semibold">Housing:</span> ☑ Own ☐ Rent</div>
              <div><span className="font-semibold">Years:</span> 3 years 2 months</div>
              <div><span className="font-semibold">Monthly Payment:</span> $2,100</div>
            </div>
          </div>
        </div>

        {/* Section 1b: Co-Borrower Information */}
        <div className="p-3 border-b-2 border-black">
          <div className="bg-blue-900 text-white p-2 mb-2 font-bold">Section 1b. Co-Borrower Information</div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <div className="text-xs font-semibold mb-1">1b. Personal Information</div>
              <div className="border p-2 bg-gray-50">
                <div><span className="font-semibold">Name:</span> Sarah M. Johnson</div>
                <div className="mt-1"><span className="font-semibold">Suffix:</span> —</div>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold mb-1">Alternate Names</div>
              <div className="border p-2 bg-gray-50">
                <div>Sarah Miller (Maiden Name)</div>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold mb-1">Type of Credit</div>
              <div className="border p-2 bg-gray-50">
                <div>☐ Individual</div>
                <div>☑ Joint</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-3">
            <div className="border p-2 bg-gray-50">
              <div className="font-semibold text-xs mb-1">Social Security Number</div>
              <div className="font-mono">XXX-XX-4321</div>
            </div>
            <div className="border p-2 bg-gray-50">
              <div className="font-semibold text-xs mb-1">Date of Birth</div>
              <div>07/22/1987</div>
            </div>
            <div className="border p-2 bg-gray-50">
              <div className="font-semibold text-xs mb-1">Citizenship</div>
              <div>☑ U.S. Citizen</div>
            </div>
            <div className="border p-2 bg-gray-50">
              <div className="font-semibold text-xs mb-1">Marital Status</div>
              <div>☑ Married</div>
            </div>
          </div>

          <div className="border p-2 bg-gray-50 mb-3">
            <div className="font-semibold text-xs mb-1">Contact Information</div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="font-semibold">Home:</span> (312) 555-7890
              </div>
              <div>
                <span className="font-semibold">Cell:</span> (312) 555-7892
              </div>
              <div>
                <span className="font-semibold">Email:</span> sarah.johnson@email.com
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Financial Information - Income */}
        <div className="p-3 border-b-2 border-black">
          <div className="bg-blue-900 text-white p-2 mb-2 font-bold">Section 2a. Financial Information - Income</div>

          <div className="mb-3">
            <div className="font-semibold text-xs mb-2">Borrower Income</div>
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-1 text-left">Source</th>
                  <th className="border p-1">Monthly Income</th>
                  <th className="border p-1 text-left">Employer/Source Name</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-1">Base Employment Income</td>
                  <td className="border p-1 text-right font-semibold">$10,479.17</td>
                  <td className="border p-1">TechCorp Solutions, Inc.</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-1">Overtime</td>
                  <td className="border p-1 text-right">$453.75</td>
                  <td className="border p-1">TechCorp Solutions, Inc.</td>
                </tr>
                <tr>
                  <td className="border p-1">Bonus</td>
                  <td className="border p-1 text-right">$1,666.67</td>
                  <td className="border p-1">TechCorp Solutions, Inc.</td>
                </tr>
                <tr className="bg-blue-50 font-bold">
                  <td className="border p-1">TOTAL BORROWER INCOME</td>
                  <td className="border p-1 text-right">$12,599.59</td>
                  <td className="border p-1"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <div className="font-semibold text-xs mb-2">Co-Borrower Income</div>
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-1 text-left">Source</th>
                  <th className="border p-1">Monthly Income</th>
                  <th className="border p-1 text-left">Employer/Source Name</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-1">Base Employment Income</td>
                  <td className="border p-1 text-right font-semibold">$6,250.00</td>
                  <td className="border p-1">City Health System</td>
                </tr>
                <tr className="bg-blue-50 font-bold">
                  <td className="border p-1">TOTAL CO-BORROWER INCOME</td>
                  <td className="border p-1 text-right">$6,250.00</td>
                  <td className="border p-1"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-3 p-2 bg-green-50 border-l-4 border-green-600">
            <div className="font-bold">TOTAL MONTHLY INCOME: $18,849.59</div>
          </div>
        </div>

        {/* Section 2b: Financial Information - Assets */}
        <div className="p-3 border-b-2 border-black">
          <div className="bg-blue-900 text-white p-2 mb-2 font-bold">Section 2b. Financial Information - Assets</div>

          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-1 text-left">Account Type</th>
                <th className="border p-1 text-left">Financial Institution</th>
                <th className="border p-1">Account Number</th>
                <th className="border p-1 text-right">Cash or Market Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-1">Checking</td>
                <td className="border p-1">Chase Bank</td>
                <td className="border p-1 text-center">****6789</td>
                <td className="border p-1 text-right">$12,450.00</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-1">Savings</td>
                <td className="border p-1">Chase Bank</td>
                <td className="border p-1 text-center">****6790</td>
                <td className="border p-1 text-right">$45,800.00</td>
              </tr>
              <tr>
                <td className="border p-1">401(k)</td>
                <td className="border p-1">Fidelity Investments</td>
                <td className="border p-1 text-center">****3421</td>
                <td className="border p-1 text-right">$125,600.00</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-1">IRA</td>
                <td className="border p-1">Vanguard</td>
                <td className="border p-1 text-center">****8765</td>
                <td className="border p-1 text-right">$78,200.00</td>
              </tr>
              <tr>
                <td className="border p-1">Gift Funds</td>
                <td className="border p-1">Parents</td>
                <td className="border p-1 text-center">—</td>
                <td className="border p-1 text-right">$25,000.00</td>
              </tr>
              <tr className="bg-green-50 font-bold">
                <td className="border p-1" colSpan="3">TOTAL ASSETS</td>
                <td className="border p-1 text-right">$287,050.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 3: Loan and Property Information */}
        <div className="p-3 border-b-2 border-black">
          <div className="bg-blue-900 text-white p-2 mb-2 font-bold">Section 3. Loan and Property Information</div>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="border p-2 bg-gray-50">
              <div className="font-semibold text-xs mb-2">Loan Information</div>
              <div><span className="font-semibold">Loan Amount:</span> $340,000.00</div>
              <div><span className="font-semibold">Loan Purpose:</span> ☑ Purchase ☐ Refinance</div>
              <div><span className="font-semibold">Loan Type:</span> ☑ Conventional ☐ FHA ☐ VA ☐ USDA</div>
              <div><span className="font-semibold">Amortization:</span> ☑ Fixed Rate ☐ ARM</div>
              <div><span className="font-semibold">Term:</span> 30 years</div>
            </div>
            <div className="border p-2 bg-gray-50">
              <div className="font-semibold text-xs mb-2">Property Information</div>
              <div><span className="font-semibold">Address:</span> 1456 Maple Street</div>
              <div>Chicago, IL 60614</div>
              <div className="mt-2"><span className="font-semibold">Units:</span> 1</div>
              <div><span className="font-semibold">Property Value:</span> $425,000.00</div>
              <div><span className="font-semibold">Occupancy:</span> ☑ Primary ☐ Second ☐ Investment</div>
            </div>
          </div>

          <div className="border p-2 bg-yellow-50">
            <div className="font-semibold text-xs mb-1">Transaction Details</div>
            <div className="grid grid-cols-3 gap-2">
              <div><span className="font-semibold">Purchase Price:</span> $425,000.00</div>
              <div><span className="font-semibold">Down Payment:</span> $85,000.00 (20%)</div>
              <div><span className="font-semibold">LTV Ratio:</span> 80%</div>
            </div>
          </div>
        </div>

        {/* Section 4: Declarations */}
        <div className="p-3 border-b-2 border-black">
          <div className="bg-blue-900 text-white p-2 mb-2 font-bold">Section 4. Declarations</div>

          <div className="text-xs mb-2">Please answer the following questions:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="border p-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-3 h-3" disabled />
                <span>Outstanding judgments?</span>
              </label>
            </div>
            <div className="border p-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-3 h-3" disabled />
                <span>Declared bankruptcy past 7 years?</span>
              </label>
            </div>
            <div className="border p-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-3 h-3" disabled />
                <span>Foreclosure past 7 years?</span>
              </label>
            </div>
            <div className="border p-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-3 h-3" disabled />
                <span>Party to lawsuit?</span>
              </label>
            </div>
            <div className="border p-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-3 h-3" disabled />
                <span>Obligated on other loans?</span>
              </label>
            </div>
            <div className="border p-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-3 h-3" disabled />
                <span>Delinquent on federal debt?</span>
              </label>
            </div>
          </div>
          <div className="mt-2 p-2 bg-green-50 border-l-4 border-green-600 text-xs">
            <div className="font-semibold">All declarations answered in the negative (NO) ✓</div>
          </div>
        </div>

        {/* Signatures */}
        <div className="p-3">
          <div className="bg-blue-900 text-white p-2 mb-3 font-bold">Acknowledgments and Agreements</div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border-2 border-gray-400 p-3">
              <div className="font-semibold text-xs mb-2">Borrower's Signature</div>
              <div className="border-b-2 border-gray-400 pb-8 mb-2 italic">Edward J. Johnson</div>
              <div className="text-xs">
                <div><span className="font-semibold">Date:</span> 06/27/2025</div>
              </div>
            </div>
            <div className="border-2 border-gray-400 p-3">
              <div className="font-semibold text-xs mb-2">Co-Borrower's Signature</div>
              <div className="border-b-2 border-gray-400 pb-8 mb-2 italic">Sarah M. Johnson</div>
              <div className="text-xs">
                <div><span className="font-semibold">Date:</span> 06/27/2025</div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-100 text-xs text-center">
            <p className="font-bold mb-1">NOTICE TO BORROWER</p>
            <p>This loan application must be signed by you and your co-borrower. The lender will not discriminate on the basis of race, color, religion, national origin, sex, marital status, age, or source of income.</p>
            <p className="mt-2">Fannie Mae Form 1003 | Freddie Mac Form 65 | Effective 1/2021</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Application1003Template;
