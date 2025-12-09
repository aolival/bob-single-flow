import React from 'react';

const SelfEmploymentIncomeTemplate = () => {
  return (
    <div className="bg-white p-8 max-w-[8.5in] mx-auto font-sans text-xs">
      {/* Header */}
      <div className="border-2 border-black">
        <div className="bg-green-800 text-white p-4">
          <h1 className="text-2xl font-bold">PROFIT AND LOSS STATEMENT</h1>
          <p className="text-sm mt-1">Self-Employment Income Documentation</p>
        </div>

        {/* Business Information */}
        <div className="p-4 bg-gray-50 border-b-2 border-black">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-sm mb-2">BUSINESS INFORMATION</h3>
              <div><span className="font-semibold">Business Name:</span> Johnson Consulting Services LLC</div>
              <div><span className="font-semibold">Owner:</span> Edward J. Johnson</div>
              <div><span className="font-semibold">EIN:</span> 87-6543210</div>
              <div><span className="font-semibold">Business Type:</span> Limited Liability Company (LLC)</div>
            </div>
            <div>
              <h3 className="font-bold text-sm mb-2">STATEMENT PERIOD</h3>
              <div><span className="font-semibold">Period:</span> January 1, 2024 - December 31, 2024</div>
              <div><span className="font-semibold">Prepared By:</span> Edward J. Johnson</div>
              <div><span className="font-semibold">Date Prepared:</span> January 15, 2025</div>
            </div>
          </div>
        </div>

        {/* Income Section */}
        <div className="p-4 border-b-2 border-black">
          <div className="font-bold text-sm mb-3 text-green-800">INCOME / REVENUE</div>

          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-green-100 border">
                <th className="border p-2 text-left">Description</th>
                <th className="border p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Consulting Services Revenue</td>
                <td className="border p-2 text-right font-mono">$185,000.00</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2">Contract Work Revenue</td>
                <td className="border p-2 text-right font-mono">$42,500.00</td>
              </tr>
              <tr>
                <td className="border p-2">Training & Workshop Fees</td>
                <td className="border p-2 text-right font-mono">$18,750.00</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2">Other Income</td>
                <td className="border p-2 text-right font-mono">$3,250.00</td>
              </tr>
              <tr className="bg-green-50 border-2 border-green-600">
                <td className="border-r p-2 font-bold">TOTAL GROSS INCOME</td>
                <td className="border-0 p-2 text-right font-bold text-lg">$249,500.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Expenses Section */}
        <div className="p-4 border-b-2 border-black">
          <div className="font-bold text-sm mb-3 text-red-800">BUSINESS EXPENSES</div>

          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-red-100 border">
                <th className="border p-2 text-left">Expense Category</th>
                <th className="border p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Advertising & Marketing</td>
                <td className="border p-2 text-right font-mono">$8,500.00</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2">Car & Truck Expenses</td>
                <td className="border p-2 text-right font-mono">$6,200.00</td>
              </tr>
              <tr>
                <td className="border p-2">Commissions & Fees</td>
                <td className="border p-2 text-right font-mono">$4,850.00</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2">Contract Labor</td>
                <td className="border p-2 text-right font-mono">$28,000.00</td>
              </tr>
              <tr>
                <td className="border p-2">Insurance (Business)</td>
                <td className="border p-2 text-right font-mono">$3,600.00</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2">Legal & Professional Services</td>
                <td className="border p-2 text-right font-mono">$5,200.00</td>
              </tr>
              <tr>
                <td className="border p-2">Office Expenses</td>
                <td className="border p-2 text-right font-mono">$4,750.00</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2">Rent or Lease (Office Space)</td>
                <td className="border p-2 text-right font-mono">$18,000.00</td>
              </tr>
              <tr>
                <td className="border p-2">Repairs & Maintenance</td>
                <td className="border p-2 text-right font-mono">$1,850.00</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2">Supplies</td>
                <td className="border p-2 text-right font-mono">$3,420.00</td>
              </tr>
              <tr>
                <td className="border p-2">Taxes & Licenses</td>
                <td className="border p-2 text-right font-mono">$4,200.00</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2">Travel</td>
                <td className="border p-2 text-right font-mono">$9,800.00</td>
              </tr>
              <tr>
                <td className="border p-2">Meals & Entertainment (50%)</td>
                <td className="border p-2 text-right font-mono">$3,250.00</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2">Utilities</td>
                <td className="border p-2 text-right font-mono">$2,400.00</td>
              </tr>
              <tr>
                <td className="border p-2">Wages (Employees)</td>
                <td className="border p-2 text-right font-mono">$45,000.00</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2">Depreciation</td>
                <td className="border p-2 text-right font-mono">$8,500.00</td>
              </tr>
              <tr>
                <td className="border p-2">Other Expenses</td>
                <td className="border p-2 text-right font-mono">$5,680.00</td>
              </tr>
              <tr className="bg-red-50 border-2 border-red-600">
                <td className="border-r p-2 font-bold">TOTAL EXPENSES</td>
                <td className="border-0 p-2 text-right font-bold text-lg">$163,200.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Net Profit */}
        <div className="p-4 bg-blue-50 border-b-2 border-black">
          <table className="w-full text-xs">
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-semibold">Gross Income</td>
                <td className="py-2 text-right font-mono">$249,500.00</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-semibold">Less: Total Expenses</td>
                <td className="py-2 text-right font-mono">-$163,200.00</td>
              </tr>
              <tr className="bg-green-100 border-2 border-green-700">
                <td className="p-3 font-bold text-base">NET PROFIT (LOSS)</td>
                <td className="p-3 text-right font-bold text-2xl text-green-800">$86,300.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Monthly Breakdown */}
        <div className="p-4 border-b-2 border-black">
          <div className="font-bold text-sm mb-3 text-blue-900">MONTHLY BREAKDOWN - 2024</div>

          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="border p-2">Month</th>
                <th className="border p-2 text-right">Revenue</th>
                <th className="border p-2 text-right">Expenses</th>
                <th className="border p-2 text-right">Net Profit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">January</td>
                <td className="border p-2 text-right font-mono">$18,250.00</td>
                <td className="border p-2 text-right font-mono">$12,100.00</td>
                <td className="border p-2 text-right font-mono text-green-700">$6,150.00</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2">February</td>
                <td className="border p-2 text-right font-mono">$19,800.00</td>
                <td className="border p-2 text-right font-mono">$13,200.00</td>
                <td className="border p-2 text-right font-mono text-green-700">$6,600.00</td>
              </tr>
              <tr>
                <td className="border p-2">March</td>
                <td className="border p-2 text-right font-mono">$22,500.00</td>
                <td className="border p-2 text-right font-mono">$14,850.00</td>
                <td className="border p-2 text-right font-mono text-green-700">$7,650.00</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2">April</td>
                <td className="border p-2 text-right font-mono">$20,100.00</td>
                <td className="border p-2 text-right font-mono">$13,500.00</td>
                <td className="border p-2 text-right font-mono text-green-700">$6,600.00</td>
              </tr>
              <tr>
                <td className="border p-2">May</td>
                <td className="border p-2 text-right font-mono">$21,750.00</td>
                <td className="border p-2 text-right font-mono">$14,200.00</td>
                <td className="border p-2 text-right font-mono text-green-700">$7,550.00</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2">June</td>
                <td className="border p-2 text-right font-mono">$20,850.00</td>
                <td className="border p-2 text-right font-mono">$13,800.00</td>
                <td className="border p-2 text-right font-mono text-green-700">$7,050.00</td>
              </tr>
              <tr>
                <td className="border p-2">July</td>
                <td className="border p-2 text-right font-mono">$19,500.00</td>
                <td className="border p-2 text-right font-mono">$12,900.00</td>
                <td className="border p-2 text-right font-mono text-green-700">$6,600.00</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2">August</td>
                <td className="border p-2 text-right font-mono">$21,200.00</td>
                <td className="border p-2 text-right font-mono">$13,950.00</td>
                <td className="border p-2 text-right font-mono text-green-700">$7,250.00</td>
              </tr>
              <tr>
                <td className="border p-2">September</td>
                <td className="border p-2 text-right font-mono">$20,400.00</td>
                <td className="border p-2 text-right font-mono">$13,600.00</td>
                <td className="border p-2 text-right font-mono text-green-700">$6,800.00</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2">October</td>
                <td className="border p-2 text-right font-mono">$22,100.00</td>
                <td className="border p-2 text-right font-mono">$14,500.00</td>
                <td className="border p-2 text-right font-mono text-green-700">$7,600.00</td>
              </tr>
              <tr>
                <td className="border p-2">November</td>
                <td className="border p-2 text-right font-mono">$21,550.00</td>
                <td className="border p-2 text-right font-mono">$14,100.00</td>
                <td className="border p-2 text-right font-mono text-green-700">$7,450.00</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2">December</td>
                <td className="border p-2 text-right font-mono">$21,500.00</td>
                <td className="border p-2 text-right font-mono">$12,500.00</td>
                <td className="border p-2 text-right font-mono text-green-700">$9,000.00</td>
              </tr>
              <tr className="bg-blue-100 border-2 border-blue-600 font-bold">
                <td className="border-r p-2">TOTAL</td>
                <td className="border-r p-2 text-right">$249,500.00</td>
                <td className="border-r p-2 text-right">$163,200.00</td>
                <td className="border-0 p-2 text-right text-green-700">$86,300.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Key Ratios */}
        <div className="p-4 border-b-2 border-black bg-yellow-50">
          <div className="font-bold text-sm mb-3">KEY FINANCIAL RATIOS</div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-gray-600">Profit Margin</div>
              <div className="text-2xl font-bold text-green-700">34.6%</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-gray-600">Average Monthly Revenue</div>
              <div className="text-lg font-bold">$20,792</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-gray-600">Average Monthly Profit</div>
              <div className="text-lg font-bold text-green-700">$7,192</div>
            </div>
          </div>
        </div>

        {/* Certification */}
        <div className="p-4 bg-gray-100">
          <div className="font-bold text-sm mb-2">CERTIFICATION</div>
          <div className="text-xs mb-3">
            I certify that the information provided in this Profit and Loss Statement is true, correct, and complete to the best of my knowledge. This statement accurately reflects the income and expenses of Johnson Consulting Services LLC for the period specified.
          </div>
          <div className="border-2 border-gray-400 p-3 rounded mt-3">
            <div className="text-xs mb-2">Business Owner Signature</div>
            <div className="border-b-2 border-gray-400 pb-6 mb-2 italic">Edward J. Johnson</div>
            <div className="text-xs">
              <div><span className="font-semibold">Date:</span> January 15, 2025</div>
              <div><span className="font-semibold">Title:</span> Owner / Managing Member</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfEmploymentIncomeTemplate;
