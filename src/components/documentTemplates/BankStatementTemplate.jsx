import React from 'react';

const BankStatementTemplate = () => {
  return (
    <div className="bg-white p-6 max-w-[8.5in] mx-auto font-sans text-xs">
      {/* Header */}
      <div className="bg-blue-900 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">CHASE</h1>
            <p className="text-sm mt-1">JPMorgan Chase Bank, N.A.</p>
          </div>
          <div className="text-right">
            <div className="text-sm">CHECKING ACCOUNT STATEMENT</div>
            <div className="text-lg font-bold mt-1">May 2025</div>
          </div>
        </div>
      </div>

      <div className="border-2 border-blue-900 border-t-0 rounded-b-lg">
        {/* Account Information */}
        <div className="p-4 bg-gray-50 border-b-2 border-blue-900">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-sm mb-2">ACCOUNT HOLDER</h3>
              <div>Edward J. Johnson</div>
              <div>Sarah M. Johnson</div>
              <div className="mt-2">1456 Maple Street</div>
              <div>Chicago, IL 60614</div>
            </div>
            <div>
              <h3 className="font-bold text-sm mb-2">ACCOUNT DETAILS</h3>
              <div><span className="font-semibold">Account Number:</span> ****6789</div>
              <div><span className="font-semibold">Account Type:</span> Chase Total Checking®</div>
              <div><span className="font-semibold">Statement Period:</span> 05/01/2025 - 05/31/2025</div>
              <div><span className="font-semibold">Page:</span> 1 of 3</div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 border-b-2 border-gray-300">
          <h3 className="font-bold text-sm mb-3">ACCOUNT SUMMARY</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <div className="text-xs text-gray-600">Beginning Balance</div>
              <div className="text-lg font-bold text-blue-900">$11,245.68</div>
              <div className="text-xs text-gray-500">05/01/2025</div>
            </div>
            <div className="bg-green-50 p-3 rounded border border-green-200">
              <div className="text-xs text-gray-600">Deposits & Credits</div>
              <div className="text-lg font-bold text-green-700">+$12,850.00</div>
              <div className="text-xs text-gray-500">15 transactions</div>
            </div>
            <div className="bg-red-50 p-3 rounded border border-red-200">
              <div className="text-xs text-gray-600">Withdrawals & Debits</div>
              <div className="text-lg font-bold text-red-700">-$11,645.68</div>
              <div className="text-xs text-gray-500">42 transactions</div>
            </div>
            <div className="bg-green-100 p-3 rounded border-2 border-green-600">
              <div className="text-xs text-gray-600">Ending Balance</div>
              <div className="text-lg font-bold text-green-800">$12,450.00</div>
              <div className="text-xs text-gray-500">05/31/2025</div>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="p-4 border-b-2 border-gray-300">
          <h3 className="font-bold text-sm mb-3">TRANSACTION DETAILS</h3>

          {/* Deposits */}
          <div className="mb-4">
            <div className="bg-green-50 p-2 font-semibold text-xs mb-2">DEPOSITS & CREDITS</div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Description</th>
                  <th className="text-right p-2">Amount</th>
                  <th className="text-right p-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">05/05/2025</td>
                  <td className="p-2">Direct Deposit - TECHCORP SOLUTIONS PAYROLL</td>
                  <td className="p-2 text-right text-green-700 font-semibold">+$5,293.75</td>
                  <td className="p-2 text-right">$16,539.43</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">05/12/2025</td>
                  <td className="p-2">Mobile Deposit - Check #3421</td>
                  <td className="p-2 text-right text-green-700 font-semibold">+$2,500.00</td>
                  <td className="p-2 text-right">$14,875.22</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">05/20/2025</td>
                  <td className="p-2">Direct Deposit - TECHCORP SOLUTIONS PAYROLL</td>
                  <td className="p-2 text-right text-green-700 font-semibold">+$5,293.75</td>
                  <td className="p-2 text-right">$12,450.00</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">05/25/2025</td>
                  <td className="p-2">Zelle Transfer from John Smith</td>
                  <td className="p-2 text-right text-green-700 font-semibold">+$150.00</td>
                  <td className="p-2 text-right">$13,105.88</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Withdrawals */}
          <div className="mb-4">
            <div className="bg-red-50 p-2 font-semibold text-xs mb-2">WITHDRAWALS & DEBITS</div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Description</th>
                  <th className="text-right p-2">Amount</th>
                  <th className="text-right p-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">05/01/2025</td>
                  <td className="p-2">ACH Withdrawal - MORTGAGE PAYMENT</td>
                  <td className="p-2 text-right text-red-700">-$2,100.00</td>
                  <td className="p-2 text-right">$9,145.68</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">05/03/2025</td>
                  <td className="p-2">Online Payment - AMEX ****3421</td>
                  <td className="p-2 text-right text-red-700">-$1,200.00</td>
                  <td className="p-2 text-right">$7,945.68</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">05/06/2025</td>
                  <td className="p-2">Debit Card Purchase - WHOLE FOODS #456</td>
                  <td className="p-2 text-right text-red-700">-$245.82</td>
                  <td className="p-2 text-right">$16,293.61</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">05/08/2025</td>
                  <td className="p-2">Online Payment - COMMONWEALTH EDISON</td>
                  <td className="p-2 text-right text-red-700">-$185.45</td>
                  <td className="p-2 text-right">$16,108.16</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">05/10/2025</td>
                  <td className="p-2">ATM Withdrawal - CHASE ATM #5678</td>
                  <td className="p-2 text-right text-red-700">-$200.00</td>
                  <td className="p-2 text-right">$15,908.16</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">05/15/2025</td>
                  <td className="p-2">Debit Card Purchase - SHELL GAS STATION</td>
                  <td className="p-2 text-right text-red-700">-$68.50</td>
                  <td className="p-2 text-right">$14,806.72</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">05/18/2025</td>
                  <td className="p-2">Check #1234 - DAYCARE PAYMENT</td>
                  <td className="p-2 text-right text-red-700">-$1,250.00</td>
                  <td className="p-2 text-right">$13,556.72</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">05/22/2025</td>
                  <td className="p-2">Debit Card Purchase - TARGET #2345</td>
                  <td className="p-2 text-right text-red-700">-$156.72</td>
                  <td className="p-2 text-right">$12,744.88</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">05/28/2025</td>
                  <td className="p-2">Online Payment - COMCAST CABLE</td>
                  <td className="p-2 text-right text-red-700">-$145.88</td>
                  <td className="p-2 text-right">$12,599.00</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">05/30/2025</td>
                  <td className="p-2">Debit Card Purchase - JEWEL-OSCO #789</td>
                  <td className="p-2 text-right text-red-700">-$149.00</td>
                  <td className="p-2 text-right">$12,450.00</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-2 text-xs text-gray-500 text-right">
              * Showing 10 of 42 transactions. See additional pages for complete details.
            </div>
          </div>
        </div>

        {/* Daily Balance */}
        <div className="p-4 border-b-2 border-gray-300">
          <h3 className="font-bold text-sm mb-3">DAILY BALANCE SUMMARY</h3>
          <div className="bg-gray-50 p-3 rounded">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-xs text-gray-600">Average Daily Balance</div>
                <div className="text-lg font-bold">$12,847.45</div>
              </div>
              <div>
                <div className="text-xs text-gray-600">Lowest Balance</div>
                <div className="text-lg font-bold">$7,945.68</div>
                <div className="text-xs text-gray-500">05/03/2025</div>
              </div>
              <div>
                <div className="text-xs text-gray-600">Highest Balance</div>
                <div className="text-lg font-bold">$16,539.43</div>
                <div className="text-xs text-gray-500">05/05/2025</div>
              </div>
            </div>
          </div>
        </div>

        {/* Fees & Interest */}
        <div className="p-4 border-b-2 border-gray-300">
          <h3 className="font-bold text-sm mb-3">FEES & INTEREST</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded border border-green-200">
              <div className="text-xs text-gray-600 mb-1">Interest Earned (0.01% APY)</div>
              <div className="text-lg font-bold text-green-700">+$1.05</div>
            </div>
            <div className="bg-gray-50 p-3 rounded border">
              <div className="text-xs text-gray-600 mb-1">Service Charges</div>
              <div className="text-lg font-bold">$0.00</div>
              <div className="text-xs text-gray-500">Minimum balance maintained</div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="p-4 bg-blue-50">
          <h3 className="font-bold text-sm mb-2">IMPORTANT INFORMATION</h3>
          <div className="text-xs space-y-1">
            <p>• Keep this statement for your records and tax preparation</p>
            <p>• Report any discrepancies within 60 days</p>
            <p>• Overdraft protection is active on this account</p>
            <p>• For questions, visit chase.com or call 1-800-935-9935</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-100 text-center text-xs text-gray-600 rounded-b-lg">
          <p>JPMorgan Chase Bank, N.A. | Member FDIC | Equal Housing Lender</p>
          <p className="mt-1">P.O. Box 36520, Louisville, KY 40233-6520</p>
          <p className="mt-2">This is an official bank statement. Please retain for your records.</p>
        </div>
      </div>
    </div>
  );
};

export default BankStatementTemplate;
