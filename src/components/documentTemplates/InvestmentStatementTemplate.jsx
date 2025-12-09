import React from 'react';

const InvestmentStatementTemplate = () => {
  return (
    <div className="bg-white p-6 max-w-[8.5in] mx-auto font-sans text-xs">
      {/* Header */}
      <div className="bg-green-700 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Fidelity</h1>
            <p className="text-sm mt-1">Workplace Retirement 401(k) Statement</p>
          </div>
          <div className="text-right">
            <div className="text-sm">Quarter Ending: March 31, 2025</div>
            <div className="text-sm">Account #: ****3421</div>
          </div>
        </div>
      </div>

      <div className="border-2 border-green-700 border-t-0 rounded-b-lg">
        {/* Account Holder Information */}
        <div className="p-4 bg-gray-50 border-b-2 border-green-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-sm mb-2">ACCOUNT HOLDER</h3>
              <div>Edward J. Johnson</div>
              <div>SSN: XXX-XX-6789</div>
              <div className="mt-2">1456 Maple Street</div>
              <div>Chicago, IL 60614</div>
            </div>
            <div>
              <h3 className="font-bold text-sm mb-2">PLAN INFORMATION</h3>
              <div><span className="font-semibold">Employer:</span> TechCorp Solutions, Inc.</div>
              <div><span className="font-semibold">Plan Type:</span> 401(k) Plan</div>
              <div><span className="font-semibold">Account Number:</span> 1234-5678-3421</div>
              <div><span className="font-semibold">Statement Period:</span> 01/01/2025 - 03/31/2025</div>
            </div>
          </div>
        </div>

        {/* Account Summary */}
        <div className="p-4 border-b-2 border-gray-300">
          <h3 className="font-bold text-sm mb-3 text-green-800">ACCOUNT SUMMARY</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <div className="text-xs text-gray-600">Beginning Balance</div>
              <div className="text-lg font-bold text-blue-900">$118,425.50</div>
              <div className="text-xs text-gray-500">01/01/2025</div>
            </div>
            <div className="bg-green-50 p-3 rounded border border-green-200">
              <div className="text-xs text-gray-600">Contributions</div>
              <div className="text-lg font-bold text-green-700">+$3,175.00</div>
              <div className="text-xs text-gray-500">Q1 2025</div>
            </div>
            <div className="bg-purple-50 p-3 rounded border border-purple-200">
              <div className="text-xs text-gray-600">Investment Gain/Loss</div>
              <div className="text-lg font-bold text-purple-700">+$4,000.00</div>
              <div className="text-xs text-gray-500">+3.38%</div>
            </div>
            <div className="bg-green-100 p-3 rounded border-2 border-green-600">
              <div className="text-xs text-gray-600">Ending Balance</div>
              <div className="text-lg font-bold text-green-800">$125,600.50</div>
              <div className="text-xs text-gray-500">03/31/2025</div>
            </div>
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="p-4 border-b-2 border-gray-300 bg-gray-50">
          <h3 className="font-bold text-sm mb-3">ACCOUNT PERFORMANCE (Last 12 Months)</h3>
          <div className="bg-white p-6 rounded border h-32 flex items-end justify-around">
            <div className="w-8 bg-green-400 rounded-t" style={{height: '60%'}}></div>
            <div className="w-8 bg-green-500 rounded-t" style={{height: '75%'}}></div>
            <div className="w-8 bg-green-600 rounded-t" style={{height: '85%'}}></div>
            <div className="w-8 bg-green-500 rounded-t" style={{height: '70%'}}></div>
            <div className="w-8 bg-green-400 rounded-t" style={{height: '65%'}}></div>
            <div className="w-8 bg-green-500 rounded-t" style={{height: '80%'}}></div>
            <div className="w-8 bg-green-600 rounded-t" style={{height: '90%'}}></div>
            <div className="w-8 bg-green-600 rounded-t" style={{height: '95%'}}></div>
            <div className="w-8 bg-green-700 rounded-t" style={{height: '100%'}}></div>
            <div className="w-8 bg-green-600 rounded-t" style={{height: '92%'}}></div>
            <div className="w-8 bg-green-600 rounded-t" style={{height: '88%'}}></div>
            <div className="w-8 bg-green-700 rounded-t" style={{height: '98%'}}></div>
          </div>
          <div className="text-center text-xs text-gray-500 mt-2">12-Month Return: +18.5%</div>
        </div>

        {/* Investment Holdings */}
        <div className="p-4 border-b-2 border-gray-300">
          <h3 className="font-bold text-sm mb-3 text-green-800">INVESTMENT HOLDINGS</h3>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-green-100 border">
                <th className="border p-2 text-left">Fund Name</th>
                <th className="border p-2 text-right">Shares</th>
                <th className="border p-2 text-right">Price</th>
                <th className="border p-2 text-right">Value</th>
                <th className="border p-2 text-right">% of Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Fidelity 500 Index Fund (FXAIX)</td>
                <td className="border p-2 text-right">2,450.125</td>
                <td className="border p-2 text-right">$18.42</td>
                <td className="border p-2 text-right font-semibold">$45,127.30</td>
                <td className="border p-2 text-right">35.9%</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2">Fidelity Contrafund (FCNTX)</td>
                <td className="border p-2 text-right">1,850.500</td>
                <td className="border p-2 text-right">$16.85</td>
                <td className="border p-2 text-right font-semibold">$31,180.93</td>
                <td className="border p-2 text-right">24.8%</td>
              </tr>
              <tr>
                <td className="border p-2">Fidelity Total Market Index (FSKAX)</td>
                <td className="border p-2 text-right">1,205.750</td>
                <td className="border p-2 text-right">$15.25</td>
                <td className="border p-2 text-right font-semibold">$18,387.69</td>
                <td className="border p-2 text-right">14.6%</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2">Fidelity International Index (FSPSX)</td>
                <td className="border p-2 text-right">825.250</td>
                <td className="border p-2 text-right">$12.68</td>
                <td className="border p-2 text-right font-semibold">$10,464.17</td>
                <td className="border p-2 text-right">8.3%</td>
              </tr>
              <tr>
                <td className="border p-2">Fidelity Growth Company Fund (FDGRX)</td>
                <td className="border p-2 text-right">450.625</td>
                <td className="border p-2 text-right">$22.45</td>
                <td className="border p-2 text-right font-semibold">$10,116.53</td>
                <td className="border p-2 text-right">8.1%</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2">Fidelity Bond Index Fund (FXNAX)</td>
                <td className="border p-2 text-right">985.125</td>
                <td className="border p-2 text-right">$10.35</td>
                <td className="border p-2 text-right font-semibold">$10,196.04</td>
                <td className="border p-2 text-right">8.1%</td>
              </tr>
              <tr>
                <td className="border p-2">Cash & Money Market</td>
                <td className="border p-2 text-right">—</td>
                <td className="border p-2 text-right">—</td>
                <td className="border p-2 text-right font-semibold">$127.84</td>
                <td className="border p-2 text-right">0.1%</td>
              </tr>
              <tr className="bg-green-100 border-2 border-green-600">
                <td className="border-r p-2 font-bold" colSpan="3">TOTAL ACCOUNT VALUE</td>
                <td className="border-r p-2 text-right font-bold text-lg">$125,600.50</td>
                <td className="border-0 p-2 text-right font-bold">100.0%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Contribution Summary */}
        <div className="p-4 border-b-2 border-gray-300">
          <h3 className="font-bold text-sm mb-3 text-green-800">CONTRIBUTION SUMMARY - Q1 2025</h3>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-blue-100 border">
                <th className="border p-2 text-left">Type</th>
                <th className="border p-2 text-right">Q1 Total</th>
                <th className="border p-2 text-right">YTD Total</th>
                <th className="border p-2 text-right">Annual Limit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Employee Pre-Tax Contributions</td>
                <td className="border p-2 text-right font-semibold">$1,912.50</td>
                <td className="border p-2 text-right">$1,912.50</td>
                <td className="border p-2 text-right text-gray-500">$23,000</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2">Employer Match</td>
                <td className="border p-2 text-right font-semibold">$1,262.50</td>
                <td className="border p-2 text-right">$1,262.50</td>
                <td className="border p-2 text-right text-gray-500">—</td>
              </tr>
              <tr className="bg-green-50 border-2 border-green-600">
                <td className="border-r p-2 font-bold">Total Contributions</td>
                <td className="border-r p-2 text-right font-bold">$3,175.00</td>
                <td className="border-r p-2 text-right font-bold">$3,175.00</td>
                <td className="border-0 p-2 text-right"></td>
              </tr>
            </tbody>
          </table>
          <div className="mt-2 text-xs text-gray-600">
            <p>* You are contributing 8% of your eligible compensation</p>
            <p>* Your employer matches 50% up to 6% of your eligible compensation</p>
          </div>
        </div>

        {/* Transaction Activity */}
        <div className="p-4 border-b-2 border-gray-300">
          <h3 className="font-bold text-sm mb-3 text-green-800">TRANSACTION ACTIVITY</h3>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100 border">
                <th className="border p-2 text-left">Date</th>
                <th className="border p-2 text-left">Description</th>
                <th className="border p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">01/15/2025</td>
                <td className="border p-2">Employee Contribution + Employer Match</td>
                <td className="border p-2 text-right text-green-700">+$1,058.33</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border p-2">02/15/2025</td>
                <td className="border p-2">Employee Contribution + Employer Match</td>
                <td className="border p-2 text-right text-green-700">+$1,058.33</td>
              </tr>
              <tr>
                <td className="border p-2">03/15/2025</td>
                <td className="border p-2">Employee Contribution + Employer Match</td>
                <td className="border p-2 text-right text-green-700">+$1,058.34</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Asset Allocation */}
        <div className="p-4 border-b-2 border-gray-300 bg-blue-50">
          <h3 className="font-bold text-sm mb-3">ASSET ALLOCATION</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-gray-600">US Stocks</div>
              <div className="text-2xl font-bold text-blue-700">62.8%</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-gray-600">International</div>
              <div className="text-2xl font-bold text-purple-700">8.3%</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-gray-600">Bonds</div>
              <div className="text-2xl font-bold text-green-700">8.1%</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-xs text-gray-600">Other/Cash</div>
              <div className="text-2xl font-bold">20.8%</div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="p-4 bg-yellow-50 border-b-2 border-gray-300">
          <h3 className="font-bold text-sm mb-2">IMPORTANT INFORMATION</h3>
          <div className="text-xs space-y-1">
            <p>• You are currently vested at 100% (4+ years of service)</p>
            <p>• Loans available up to 50% of vested balance or $50,000, whichever is less</p>
            <p>• 2025 contribution limit: $23,000 (under age 50) or $30,500 (age 50+)</p>
            <p>• For beneficiary changes or questions, visit NetBenefits.com or call 1-800-835-5095</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-100 text-center text-xs text-gray-600 rounded-b-lg">
          <p className="font-bold mb-1">Fidelity Investments</p>
          <p>82 Devonshire Street, Boston, MA 02109</p>
          <p className="mt-2">This statement contains important information about your retirement plan. Please review carefully and retain for your records.</p>
          <p className="mt-2">Account Number: ****3421 | Statement Period: Q1 2025</p>
        </div>
      </div>
    </div>
  );
};

export default InvestmentStatementTemplate;
