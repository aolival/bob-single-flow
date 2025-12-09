import React from 'react';

const TaxReturnTemplate = ({ year = '2024' }) => {
  return (
    <div className="bg-white p-8 max-w-[8.5in] mx-auto font-sans text-xs">
      {/* Form 1040 */}
      <div className="border-2 border-black">
        {/* Header */}
        <div className="bg-gray-200 p-3 border-b-2 border-black">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold">Form 1040</div>
              <div className="text-sm">U.S. Individual Income Tax Return</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">{year}</div>
              <div className="text-xs">Department of the Treasury—Internal Revenue Service</div>
              <div className="text-xs mt-1">OMB No. 1545-0074</div>
            </div>
          </div>
        </div>

        {/* Filing Status */}
        <div className="p-3 border-b border-black">
          <div className="font-bold mb-2">Filing Status</div>
          <div className="grid grid-cols-3 gap-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" disabled className="w-3 h-3" />
              <span>Single</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" disabled checked className="w-3 h-3" />
              <span>Married filing jointly</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" disabled className="w-3 h-3" />
              <span>Married filing separately</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" disabled className="w-3 h-3" />
              <span>Head of household</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" disabled className="w-3 h-3" />
              <span>Qualifying surviving spouse</span>
            </label>
          </div>
        </div>

        {/* Personal Information */}
        <div className="p-3 border-b border-black">
          <div className="font-bold mb-2">Your Personal Information</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="bg-gray-50 p-2 rounded border mb-2">
                <div className="text-xs text-gray-600 mb-1">Your first name and middle initial</div>
                <div className="font-semibold">Edward J.</div>
              </div>
              <div className="bg-gray-50 p-2 rounded border mb-2">
                <div className="text-xs text-gray-600 mb-1">Last name</div>
                <div className="font-semibold">Johnson</div>
              </div>
              <div className="bg-gray-50 p-2 rounded border">
                <div className="text-xs text-gray-600 mb-1">Your social security number</div>
                <div className="font-mono">XXX-XX-6789</div>
              </div>
            </div>
            <div>
              <div className="bg-gray-50 p-2 rounded border mb-2">
                <div className="text-xs text-gray-600 mb-1">Spouse's first name and middle initial</div>
                <div className="font-semibold">Sarah M.</div>
              </div>
              <div className="bg-gray-50 p-2 rounded border mb-2">
                <div className="text-xs text-gray-600 mb-1">Last name</div>
                <div className="font-semibold">Johnson</div>
              </div>
              <div className="bg-gray-50 p-2 rounded border">
                <div className="text-xs text-gray-600 mb-1">Spouse's social security number</div>
                <div className="font-mono">XXX-XX-4321</div>
              </div>
            </div>
          </div>
          <div className="mt-3 bg-gray-50 p-2 rounded border">
            <div className="text-xs text-gray-600 mb-1">Home address</div>
            <div>1456 Maple Street, Chicago, IL 60614</div>
          </div>
        </div>

        {/* Income Section */}
        <div className="p-3 border-b-2 border-black bg-blue-50">
          <div className="font-bold mb-2 text-blue-900">Income</div>

          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="py-2 pr-2">1</td>
                <td className="py-2 flex-1">Wages, salaries, tips, etc. Attach Form(s) W-2</td>
                <td className="py-2 text-right font-mono font-semibold">$150,000</td>
              </tr>
              <tr className="border-b bg-white">
                <td className="py-2 pr-2">2a</td>
                <td className="py-2">Tax-exempt interest</td>
                <td className="py-2 text-right font-mono">$0</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-2">2b</td>
                <td className="py-2">Taxable interest</td>
                <td className="py-2 text-right font-mono">$1,245</td>
              </tr>
              <tr className="border-b bg-white">
                <td className="py-2 pr-2">3a</td>
                <td className="py-2">Qualified dividends</td>
                <td className="py-2 text-right font-mono">$3,580</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-2">3b</td>
                <td className="py-2">Ordinary dividends</td>
                <td className="py-2 text-right font-mono">$3,580</td>
              </tr>
              <tr className="border-b bg-white">
                <td className="py-2 pr-2">4a</td>
                <td className="py-2">IRA distributions</td>
                <td className="py-2 text-right font-mono">$0</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-2">5a</td>
                <td className="py-2">Pensions and annuities</td>
                <td className="py-2 text-right font-mono">$0</td>
              </tr>
              <tr className="border-b bg-white">
                <td className="py-2 pr-2">6a</td>
                <td className="py-2">Social security benefits</td>
                <td className="py-2 text-right font-mono">$0</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-2">7</td>
                <td className="py-2">Capital gain or (loss)</td>
                <td className="py-2 text-right font-mono">$8,420</td>
              </tr>
              <tr className="border-b bg-white">
                <td className="py-2 pr-2">8</td>
                <td className="py-2">Additional income from Schedule 1</td>
                <td className="py-2 text-right font-mono">$0</td>
              </tr>
              <tr className="bg-yellow-100 border-2 border-yellow-500">
                <td className="py-2 pr-2 font-bold">9</td>
                <td className="py-2 font-bold">Total income</td>
                <td className="py-2 text-right font-mono font-bold text-lg">$163,245</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Adjusted Gross Income */}
        <div className="p-3 border-b-2 border-black bg-orange-50">
          <div className="font-bold mb-2 text-orange-900">Adjusted Gross Income</div>

          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="py-2 pr-2">10</td>
                <td className="py-2">Adjustments to income from Schedule 1</td>
                <td className="py-2 text-right font-mono">$2,500</td>
              </tr>
              <tr className="bg-orange-100 border-2 border-orange-500">
                <td className="py-2 pr-2 font-bold">11</td>
                <td className="py-2 font-bold">Adjusted gross income</td>
                <td className="py-2 text-right font-mono font-bold text-lg">$160,745</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Standard Deduction / Itemized Deductions */}
        <div className="p-3 border-b-2 border-black bg-green-50">
          <div className="font-bold mb-2 text-green-900">Standard Deduction and Taxable Income</div>

          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="py-2 pr-2">12</td>
                <td className="py-2">Standard deduction or itemized deductions</td>
                <td className="py-2 text-right font-mono font-semibold">$29,200</td>
              </tr>
              <tr className="border-b bg-white">
                <td className="py-2 pr-2">13</td>
                <td className="py-2">Qualified business income deduction</td>
                <td className="py-2 text-right font-mono">$0</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-2">14</td>
                <td className="py-2">Add lines 12 and 13</td>
                <td className="py-2 text-right font-mono">$29,200</td>
              </tr>
              <tr className="bg-green-100 border-2 border-green-600">
                <td className="py-2 pr-2 font-bold">15</td>
                <td className="py-2 font-bold">Taxable income</td>
                <td className="py-2 text-right font-mono font-bold text-lg">$131,545</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tax and Credits */}
        <div className="p-3 border-b-2 border-black bg-red-50">
          <div className="font-bold mb-2 text-red-900">Tax and Credits</div>

          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="py-2 pr-2">16</td>
                <td className="py-2">Tax (from Tax Table or Tax Computation Worksheet)</td>
                <td className="py-2 text-right font-mono font-semibold">$22,847</td>
              </tr>
              <tr className="border-b bg-white">
                <td className="py-2 pr-2">17</td>
                <td className="py-2">Amount from Schedule 2</td>
                <td className="py-2 text-right font-mono">$0</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-2">18</td>
                <td className="py-2">Add lines 16 and 17</td>
                <td className="py-2 text-right font-mono">$22,847</td>
              </tr>
              <tr className="border-b bg-white">
                <td className="py-2 pr-2">19</td>
                <td className="py-2">Child tax credit and credit for other dependents</td>
                <td className="py-2 text-right font-mono">$0</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-2">20</td>
                <td className="py-2">Amount from Schedule 3</td>
                <td className="py-2 text-right font-mono">$0</td>
              </tr>
              <tr className="border-b bg-white">
                <td className="py-2 pr-2">21</td>
                <td className="py-2">Add lines 19 and 20</td>
                <td className="py-2 text-right font-mono">$0</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-2">22</td>
                <td className="py-2">Subtract line 21 from line 18</td>
                <td className="py-2 text-right font-mono font-semibold">$22,847</td>
              </tr>
              <tr className="border-b bg-white">
                <td className="py-2 pr-2">23</td>
                <td className="py-2">Other taxes from Schedule 2</td>
                <td className="py-2 text-right font-mono">$0</td>
              </tr>
              <tr className="bg-red-100 border-2 border-red-600">
                <td className="py-2 pr-2 font-bold">24</td>
                <td className="py-2 font-bold">Total tax</td>
                <td className="py-2 text-right font-mono font-bold text-lg">$22,847</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payments */}
        <div className="p-3 border-b-2 border-black bg-purple-50">
          <div className="font-bold mb-2 text-purple-900">Payments</div>

          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="py-2 pr-2">25</td>
                <td className="py-2">Federal income tax withheld</td>
                <td className="py-2 text-right font-mono font-semibold">$24,500</td>
              </tr>
              <tr className="border-b bg-white">
                <td className="py-2 pr-2">26</td>
                <td className="py-2">2024 estimated tax payments</td>
                <td className="py-2 text-right font-mono">$0</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-2">27</td>
                <td className="py-2">Earned income credit (EIC)</td>
                <td className="py-2 text-right font-mono">$0</td>
              </tr>
              <tr className="border-b bg-white">
                <td className="py-2 pr-2">28</td>
                <td className="py-2">Additional child tax credit from Schedule 8812</td>
                <td className="py-2 text-right font-mono">$0</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-2">29</td>
                <td className="py-2">American opportunity credit from Form 8863</td>
                <td className="py-2 text-right font-mono">$0</td>
              </tr>
              <tr className="border-b bg-white">
                <td className="py-2 pr-2">30</td>
                <td className="py-2">Amount from Schedule 3</td>
                <td className="py-2 text-right font-mono">$0</td>
              </tr>
              <tr className="bg-purple-100 border-2 border-purple-600">
                <td className="py-2 pr-2 font-bold">31</td>
                <td className="py-2 font-bold">Total payments</td>
                <td className="py-2 text-right font-mono font-bold text-lg">$24,500</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Refund / Amount You Owe */}
        <div className="p-4 bg-green-100 border-b-2 border-black">
          <div className="font-bold mb-3 text-green-900 text-sm">Refund or Amount You Owe</div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded border-2 border-green-600">
              <div className="text-xs text-gray-600 mb-1">If line 31 is more than line 24</div>
              <div className="font-bold text-sm">REFUND</div>
              <div className="text-3xl font-bold text-green-700 mt-2">$1,653</div>
            </div>
            <div className="bg-gray-50 p-3 rounded border">
              <div className="text-xs text-gray-600 mb-1">If line 24 is more than line 31</div>
              <div className="font-bold text-sm">AMOUNT YOU OWE</div>
              <div className="text-3xl font-bold text-gray-400 mt-2">$0</div>
            </div>
          </div>

          <div className="mt-3 p-2 bg-blue-50 border border-blue-300 rounded text-xs">
            <div className="font-semibold mb-1">Direct Deposit Information (Refund)</div>
            <div>Routing Number: 123456789 (Chase Bank)</div>
            <div>Account Number: ****6789 (Checking)</div>
          </div>
        </div>

        {/* Signatures */}
        <div className="p-4">
          <div className="font-bold mb-3">Sign Here - Joint return? Both spouses must sign.</div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border-2 border-gray-400 p-3 rounded">
              <div className="text-xs text-gray-600 mb-2">Your signature</div>
              <div className="border-b-2 border-gray-400 pb-8 mb-2 italic">Edward J. Johnson</div>
              <div className="text-xs">
                <div><span className="font-semibold">Date:</span> 04/15/{year}</div>
                <div><span className="font-semibold">Occupation:</span> Software Engineer</div>
              </div>
            </div>
            <div className="border-2 border-gray-400 p-3 rounded">
              <div className="text-xs text-gray-600 mb-2">Spouse's signature</div>
              <div className="border-b-2 border-gray-400 pb-8 mb-2 italic">Sarah M. Johnson</div>
              <div className="text-xs">
                <div><span className="font-semibold">Date:</span> 04/15/{year}</div>
                <div><span className="font-semibold">Occupation:</span> Registered Nurse</div>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-gray-300 pt-3">
            <div className="font-bold mb-2">Paid Preparer Use Only</div>
            <div className="bg-gray-50 p-3 rounded border">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div><span className="font-semibold">Preparer's name:</span> Michael Chen, CPA</div>
                  <div><span className="font-semibold">Firm's name:</span> Chen & Associates Tax Services</div>
                </div>
                <div>
                  <div><span className="font-semibold">PTIN:</span> P00123456</div>
                  <div><span className="font-semibold">EIN:</span> 12-3456789</div>
                  <div><span className="font-semibold">Phone:</span> (312) 555-0199</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-3 text-center text-xs text-gray-600">
          <p>Form 1040 ({year}) | U.S. Individual Income Tax Return</p>
          <p className="mt-1">Department of the Treasury—Internal Revenue Service</p>
        </div>
      </div>
    </div>
  );
};

export default TaxReturnTemplate;
