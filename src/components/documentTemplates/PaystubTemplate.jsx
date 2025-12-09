import React from 'react';

const PaystubTemplate = ({ employeeName = 'Edward Johnson', payPeriodEnd = '06/15/2025' }) => {
  return (
    <div className="bg-white p-6 max-w-[8.5in] mx-auto font-sans text-xs">
      {/* Header */}
      <div className="bg-blue-900 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">TechCorp Solutions</h1>
            <p className="text-sm mt-1">350 N Michigan Avenue, Suite 2200</p>
            <p className="text-sm">Chicago, IL 60601</p>
            <p className="text-sm mt-1">Phone: (312) 555-0100</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">PAYROLL STATEMENT</div>
            <div className="mt-2 text-sm">
              <div>Pay Period: 06/01/2025 - {payPeriodEnd}</div>
              <div>Pay Date: 06/20/2025</div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-2 border-blue-900 border-t-0 rounded-b-lg">
        {/* Employee Information */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 border-b-2 border-blue-900">
          <div>
            <h3 className="font-bold text-sm mb-2 text-blue-900">EMPLOYEE INFORMATION</h3>
            <div className="space-y-1">
              <div><span className="font-semibold">Name:</span> {employeeName}</div>
              <div><span className="font-semibold">Employee ID:</span> TC-2018-456</div>
              <div><span className="font-semibold">Department:</span> Software Engineering</div>
              <div><span className="font-semibold">Position:</span> Senior Software Engineer</div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-2 text-blue-900">PAYMENT INFORMATION</h3>
            <div className="space-y-1">
              <div><span className="font-semibold">Pay Method:</span> Direct Deposit</div>
              <div><span className="font-semibold">Bank Account:</span> ****6789 (Chase)</div>
              <div><span className="font-semibold">Pay Rate:</span> $60.50 /hour</div>
              <div><span className="font-semibold">Pay Type:</span> Salaried</div>
            </div>
          </div>
        </div>

        {/* Earnings Section */}
        <div className="p-4 border-b-2 border-gray-300">
          <h3 className="font-bold text-sm mb-3 text-blue-900">EARNINGS</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-blue-100 border-b border-blue-900">
                <th className="text-left p-2">Description</th>
                <th className="text-center p-2">Hours/Units</th>
                <th className="text-right p-2">Rate</th>
                <th className="text-right p-2">Current</th>
                <th className="text-right p-2">Year-to-Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">Regular Pay</td>
                <td className="text-center p-2">80.00</td>
                <td className="text-right p-2">$60.50</td>
                <td className="text-right p-2 font-semibold">$4,840.00</td>
                <td className="text-right p-2">$58,080.00</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Overtime Pay</td>
                <td className="text-center p-2">5.00</td>
                <td className="text-right p-2">$90.75</td>
                <td className="text-right p-2 font-semibold">$453.75</td>
                <td className="text-right p-2">$2,722.50</td>
              </tr>
              <tr className="border-b bg-blue-50">
                <td className="p-2 font-bold" colSpan="3">TOTAL EARNINGS</td>
                <td className="text-right p-2 font-bold">$5,293.75</td>
                <td className="text-right p-2 font-bold">$60,802.50</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Deductions Section */}
        <div className="p-4 border-b-2 border-gray-300">
          <h3 className="font-bold text-sm mb-3 text-blue-900">DEDUCTIONS</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-red-100 border-b border-red-900">
                <th className="text-left p-2">Description</th>
                <th className="text-center p-2">Type</th>
                <th className="text-right p-2">Current</th>
                <th className="text-right p-2">Year-to-Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">Federal Income Tax</td>
                <td className="text-center p-2">Tax</td>
                <td className="text-right p-2">$952.61</td>
                <td className="text-right p-2">$10,926.04</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Social Security</td>
                <td className="text-center p-2">Tax</td>
                <td className="text-right p-2">$328.21</td>
                <td className="text-center p-2">$3,769.76</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Medicare</td>
                <td className="text-center p-2">Tax</td>
                <td className="text-right p-2">$76.76</td>
                <td className="text-right p-2">$881.64</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">State Income Tax (IL)</td>
                <td className="text-center p-2">Tax</td>
                <td className="text-right p-2">$264.69</td>
                <td className="text-right p-2">$3,040.13</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">State Disability (IL)</td>
                <td className="text-center p-2">Tax</td>
                <td className="text-right p-2">$5.29</td>
                <td className="text-right p-2">$60.80</td>
              </tr>
              <tr className="border-b bg-gray-100">
                <td className="p-2 font-semibold" colSpan="2">TOTAL TAXES</td>
                <td className="text-right p-2 font-semibold">$1,627.56</td>
                <td className="text-right p-2 font-semibold">$18,678.37</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">401(k) Retirement</td>
                <td className="text-center p-2">Pre-Tax</td>
                <td className="text-right p-2">$423.50</td>
                <td className="text-right p-2">$4,864.20</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Health Insurance</td>
                <td className="text-center p-2">Pre-Tax</td>
                <td className="text-right p-2">$185.00</td>
                <td className="text-right p-2">$2,220.00</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Dental Insurance</td>
                <td className="text-center p-2">Pre-Tax</td>
                <td className="text-right p-2">$25.00</td>
                <td className="text-right p-2">$300.00</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Vision Insurance</td>
                <td className="text-center p-2">Pre-Tax</td>
                <td className="text-right p-2">$12.00</td>
                <td className="text-right p-2">$144.00</td>
              </tr>
              <tr className="border-b bg-red-50">
                <td className="p-2 font-bold" colSpan="2">TOTAL DEDUCTIONS</td>
                <td className="text-right p-2 font-bold">$2,273.06</td>
                <td className="text-right p-2 font-bold">$26,206.57</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Net Pay Section */}
        <div className="p-4 bg-green-50 border-b-2 border-green-600">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg text-green-800">NET PAY</h3>
              <p className="text-xs text-gray-600 mt-1">Amount deposited to your account</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-800">$3,020.69</div>
              <div className="text-xs text-gray-600 mt-1">YTD: $34,595.93</div>
            </div>
          </div>
        </div>

        {/* Summary Boxes */}
        <div className="p-4 grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <div className="text-xs text-gray-600">Gross Earnings YTD</div>
            <div className="text-lg font-bold text-blue-900">$60,802.50</div>
          </div>
          <div className="bg-red-50 p-3 rounded border border-red-200">
            <div className="text-xs text-gray-600">Total Deductions YTD</div>
            <div className="text-lg font-bold text-red-900">$26,206.57</div>
          </div>
          <div className="bg-green-50 p-3 rounded border border-green-200">
            <div className="text-xs text-gray-600">Net Pay YTD</div>
            <div className="text-lg font-bold text-green-900">$34,595.93</div>
          </div>
        </div>

        {/* PTO Balance */}
        <div className="p-4 border-t-2 border-gray-300">
          <h3 className="font-bold text-sm mb-3 text-blue-900">PAID TIME OFF (PTO) BALANCE</h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-600">Vacation Hours</div>
              <div className="text-lg font-bold">120.00</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-600">Sick Hours</div>
              <div className="text-lg font-bold">40.00</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-600">Personal Hours</div>
              <div className="text-lg font-bold">16.00</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-xs text-gray-600">Total Available</div>
              <div className="text-lg font-bold">176.00</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-100 text-center text-xs text-gray-600 rounded-b-lg">
          <p>This is an official payroll document. Please retain for your records.</p>
          <p className="mt-1">For questions regarding your paycheck, please contact HR at hr@techcorp.com or (312) 555-0150</p>
        </div>
      </div>
    </div>
  );
};

export default PaystubTemplate;
