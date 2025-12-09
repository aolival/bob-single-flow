import React from 'react';

const GiftLetterTemplate = () => {
  return (
    <div className="bg-white p-8 max-w-[8.5in] mx-auto font-sans text-sm">
      <div className="border-2 border-gray-800">
        {/* Header */}
        <div className="bg-blue-900 text-white p-4">
          <h1 className="text-2xl font-bold text-center">GIFT LETTER</h1>
          <p className="text-sm mt-1 text-center">Mortgage Loan Gift Funds Documentation</p>
        </div>

        {/* Date and Reference */}
        <div className="p-4 bg-gray-50 border-b-2 border-gray-800">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm"><span className="font-semibold">Date:</span> March 15, 2025</div>
              <div className="text-sm mt-1"><span className="font-semibold">Loan Reference #:</span> BOB-2025-001234</div>
            </div>
            <div className="text-right">
              <div className="text-sm"><span className="font-semibold">Property Address:</span></div>
              <div className="text-sm">1234 Oak Street</div>
              <div className="text-sm">Chicago, IL 60614</div>
            </div>
          </div>
        </div>

        {/* Main Letter Content */}
        <div className="p-6">
          {/* Donor Information */}
          <div className="mb-6">
            <h3 className="font-bold text-base mb-3 pb-2 border-b-2 border-blue-900">DONOR INFORMATION</h3>
            <div className="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded">
              <div>
                <div className="mb-2"><span className="font-semibold">Name:</span> Robert J. Johnson</div>
                <div className="mb-2"><span className="font-semibold">Relationship to Borrower:</span> Father</div>
                <div className="mb-2"><span className="font-semibold">SSN:</span> XXX-XX-1234</div>
              </div>
              <div>
                <div className="mb-2"><span className="font-semibold">Address:</span></div>
                <div className="ml-4 text-sm">
                  <div>5678 Elm Avenue</div>
                  <div>Naperville, IL 60540</div>
                </div>
                <div className="mt-2"><span className="font-semibold">Phone:</span> (630) 555-7890</div>
              </div>
            </div>
          </div>

          {/* Recipient/Borrower Information */}
          <div className="mb-6">
            <h3 className="font-bold text-base mb-3 pb-2 border-b-2 border-blue-900">RECIPIENT / BORROWER INFORMATION</h3>
            <div className="grid grid-cols-2 gap-4 bg-green-50 p-4 rounded">
              <div>
                <div className="mb-2"><span className="font-semibold">Name:</span> Edward J. Johnson</div>
                <div className="mb-2"><span className="font-semibold">SSN:</span> XXX-XX-6789</div>
              </div>
              <div>
                <div className="mb-2"><span className="font-semibold">Current Address:</span></div>
                <div className="ml-4 text-sm">
                  <div>1456 Maple Street</div>
                  <div>Chicago, IL 60614</div>
                </div>
              </div>
            </div>
          </div>

          {/* Gift Amount */}
          <div className="mb-6">
            <h3 className="font-bold text-base mb-3 pb-2 border-b-2 border-blue-900">GIFT AMOUNT</h3>
            <div className="bg-yellow-50 border-2 border-yellow-600 p-6 rounded text-center">
              <div className="text-sm text-gray-600 mb-2">Total Gift Amount</div>
              <div className="text-4xl font-bold text-green-700">$35,000.00</div>
              <div className="text-xs text-gray-500 mt-2">(Thirty-Five Thousand Dollars)</div>
            </div>
          </div>

          {/* Gift Statement */}
          <div className="mb-6">
            <h3 className="font-bold text-base mb-3 pb-2 border-b-2 border-blue-900">GIFT STATEMENT</h3>
            <div className="bg-white border-2 border-gray-300 p-4 rounded leading-relaxed">
              <p className="mb-4">
                I/We, <span className="font-bold underline">Robert J. Johnson</span> (Donor), hereby certify the following:
              </p>

              <div className="ml-6 space-y-3">
                <div className="flex items-start">
                  <span className="mr-2">1.</span>
                  <p>I/We have given a gift of <span className="font-bold">$35,000.00</span> to <span className="font-bold">Edward J. Johnson</span> (Borrower/Recipient) to be applied toward the purchase of the property located at <span className="font-bold">1234 Oak Street, Chicago, IL 60614</span>.</p>
                </div>

                <div className="flex items-start">
                  <span className="mr-2">2.</span>
                  <p>This is a <span className="font-bold">bona fide gift</span>, and there is <span className="font-bold underline">NO expectation or requirement of repayment</span> in any form.</p>
                </div>

                <div className="flex items-start">
                  <span className="mr-2">3.</span>
                  <p>No lien or encumbrance is attached to this gift, and the recipient has <span className="font-bold">full ownership</span> of these funds.</p>
                </div>

                <div className="flex items-start">
                  <span className="mr-2">4.</span>
                  <p>The source of these gift funds is: <span className="font-bold">Personal Savings Account</span></p>
                </div>

                <div className="flex items-start">
                  <span className="mr-2">5.</span>
                  <p>My relationship to the borrower is: <span className="font-bold">Father</span></p>
                </div>

                <div className="flex items-start">
                  <span className="mr-2">6.</span>
                  <p>These funds were transferred/will be transferred on: <span className="font-bold">March 20, 2025</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Transfer Details */}
          <div className="mb-6">
            <h3 className="font-bold text-base mb-3 pb-2 border-b-2 border-blue-900">TRANSFER DETAILS</h3>
            <table className="w-full border-collapse border text-sm">
              <tbody>
                <tr>
                  <td className="border p-3 bg-gray-100 font-semibold w-1/3">Transfer Method:</td>
                  <td className="border p-3">Wire Transfer</td>
                </tr>
                <tr>
                  <td className="border p-3 bg-gray-100 font-semibold">Donor Bank:</td>
                  <td className="border p-3">Chase Bank - Account ending in 4567</td>
                </tr>
                <tr>
                  <td className="border p-3 bg-gray-100 font-semibold">Recipient Bank:</td>
                  <td className="border p-3">Wells Fargo - Account ending in 8901</td>
                </tr>
                <tr>
                  <td className="border p-3 bg-gray-100 font-semibold">Transfer Date:</td>
                  <td className="border p-3">March 20, 2025</td>
                </tr>
                <tr>
                  <td className="border p-3 bg-gray-100 font-semibold">Purpose:</td>
                  <td className="border p-3">Down payment and closing costs for home purchase</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Important Notes */}
          <div className="mb-6">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
              <h4 className="font-bold text-sm mb-2">IMPORTANT NOTES</h4>
              <ul className="text-xs space-y-1 list-disc ml-4">
                <li>This gift will NOT affect my own financial position or ability to meet my financial obligations</li>
                <li>I understand that this letter will be submitted to the lender as part of the mortgage application</li>
                <li>I certify that all information provided is true and accurate to the best of my knowledge</li>
                <li>Documentation of the gift funds may include bank statements showing withdrawal and deposit</li>
              </ul>
            </div>
          </div>

          {/* Donor Signature */}
          <div className="mb-6">
            <div className="border-2 border-gray-800 p-4 rounded">
              <h4 className="font-bold text-sm mb-3">DONOR SIGNATURE</h4>
              <div className="mb-4">
                <div className="text-xs text-gray-600 mb-1">Signature</div>
                <div className="border-b-2 border-gray-800 pb-8 mb-1 italic text-lg">Robert J. Johnson</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-600">Printed Name</div>
                  <div className="font-semibold">Robert J. Johnson</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Date</div>
                  <div className="font-semibold">March 15, 2025</div>
                </div>
              </div>
            </div>
          </div>

          {/* Borrower Acknowledgment */}
          <div className="mb-4">
            <div className="border-2 border-gray-800 p-4 rounded bg-green-50">
              <h4 className="font-bold text-sm mb-3">BORROWER / RECIPIENT ACKNOWLEDGMENT</h4>
              <p className="text-sm mb-3">
                I/We acknowledge receipt of the gift funds described above and confirm that these funds are a gift with no obligation for repayment.
              </p>
              <div className="mb-4">
                <div className="text-xs text-gray-600 mb-1">Signature</div>
                <div className="border-b-2 border-gray-800 pb-8 mb-1 italic text-lg">Edward J. Johnson</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-600">Printed Name</div>
                  <div className="font-semibold">Edward J. Johnson</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Date</div>
                  <div className="font-semibold">March 15, 2025</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-4 text-center text-xs border-t-2 border-gray-800">
          <p className="font-bold mb-1">Gift Letter - Mortgage Documentation</p>
          <p className="text-gray-600">This document must be accompanied by bank statements showing the withdrawal and deposit of gift funds.</p>
          <p className="text-gray-600 mt-1">Retain a copy for your records.</p>
        </div>
      </div>
    </div>
  );
};

export default GiftLetterTemplate;
