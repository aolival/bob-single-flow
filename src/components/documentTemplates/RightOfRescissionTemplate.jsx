import React from 'react';

const RightOfRescissionTemplate = () => {
  return (
    <div className="bg-white p-8 max-w-[8.5in] mx-auto font-sans text-sm">
      <div className="border-4 border-red-700">
        {/* Header */}
        <div className="bg-red-700 text-white p-4">
          <h1 className="text-2xl font-bold text-center">NOTICE OF RIGHT TO CANCEL</h1>
          <p className="text-sm mt-2 text-center">(Truth in Lending Act - Regulation Z)</p>
        </div>

        {/* Important Notice Banner */}
        <div className="bg-yellow-100 border-4 border-yellow-500 p-4 m-4">
          <div className="flex items-start">
            <div className="mr-3 text-3xl">⚠️</div>
            <div>
              <h2 className="font-bold text-lg mb-2">IMPORTANT: READ THIS DOCUMENT CAREFULLY</h2>
              <p className="text-sm leading-relaxed">
                You have a legal right to cancel this transaction, without cost, within three business days from whichever
                of the following events occurs last:
              </p>
              <ul className="list-disc ml-6 mt-2 text-sm">
                <li>The date of the transaction, which is <span className="font-bold">March 20, 2025</span>; or</li>
                <li>The date you received your Truth in Lending disclosures; or</li>
                <li>The date you received this notice of your right to cancel.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Transaction Information */}
        <div className="p-6 border-b-2 border-gray-400">
          <h3 className="font-bold text-base mb-3 pb-2 border-b-2 border-red-700">TRANSACTION INFORMATION</h3>
          <table className="w-full border-collapse border text-sm">
            <tbody>
              <tr>
                <td className="border p-3 bg-gray-100 font-semibold w-1/3">Transaction Date:</td>
                <td className="border p-3 font-bold">March 20, 2025</td>
              </tr>
              <tr>
                <td className="border p-3 bg-gray-100 font-semibold">Loan Number:</td>
                <td className="border p-3">BOB-2025-001234</td>
              </tr>
              <tr>
                <td className="border p-3 bg-gray-100 font-semibold">Borrower(s):</td>
                <td className="border p-3">Edward J. Johnson & Sarah M. Johnson</td>
              </tr>
              <tr>
                <td className="border p-3 bg-gray-100 font-semibold">Property Address:</td>
                <td className="border p-3">1234 Oak Street, Chicago, IL 60614</td>
              </tr>
              <tr>
                <td className="border p-3 bg-gray-100 font-semibold">Lender:</td>
                <td className="border p-3">Capital Mortgage Group LLC</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Rescission Period */}
        <div className="p-6 bg-red-50 border-b-2 border-red-700">
          <h3 className="font-bold text-base mb-3 text-center uppercase text-red-800">YOUR CANCELLATION DEADLINE</h3>
          <div className="bg-white border-4 border-red-700 p-6 text-center rounded-lg">
            <div className="text-sm text-gray-600 mb-2">If you decide to cancel this transaction, you must do so by:</div>
            <div className="text-3xl font-bold text-red-700 mb-2">11:59 PM</div>
            <div className="text-2xl font-bold mb-3">March 23, 2025</div>
            <div className="text-xs text-gray-500">(Midnight of the Third Business Day)</div>
          </div>
          <div className="mt-4 text-xs text-center text-gray-600">
            <p className="font-semibold">Note: Saturdays are included. Sundays and Federal holidays are NOT included.</p>
          </div>
        </div>

        {/* How to Cancel */}
        <div className="p-6 border-b-2 border-gray-400">
          <h3 className="font-bold text-base mb-3 pb-2 border-b-2 border-red-700">HOW TO CANCEL</h3>

          <p className="mb-4 leading-relaxed">
            If you wish to cancel this transaction, you may do so by <span className="font-bold">mailing, faxing, emailing, or delivering</span> a
            written notice to the lender. The notice must state that you do not wish to proceed with the transaction.
          </p>

          <div className="bg-blue-50 border-2 border-blue-600 p-4 rounded mb-4">
            <h4 className="font-bold text-sm mb-3">LENDER CONTACT INFORMATION</h4>
            <div className="space-y-2 text-sm">
              <div><span className="font-semibold">Name:</span> Capital Mortgage Group LLC</div>
              <div><span className="font-semibold">Address:</span> 3321 N. Broadway, Chicago, IL 60657</div>
              <div><span className="font-semibold">Phone:</span> (312) 555-0100</div>
              <div><span className="font-semibold">Fax:</span> (312) 555-0101</div>
              <div><span className="font-semibold">Email:</span> cancellations@capitalmortgagegroup.com</div>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-600 p-4 rounded">
            <h4 className="font-bold text-sm mb-2">IMPORTANT TIMING RULES:</h4>
            <ul className="text-xs space-y-1 list-disc ml-4">
              <li>You may use <span className="font-bold">any written method</span> to notify the lender of cancellation</li>
              <li>If you <span className="font-bold">mail</span> your cancellation notice, it must be <span className="font-bold">postmarked</span> by midnight of the deadline date</li>
              <li>If you <span className="font-bold">hand-deliver, fax, or email</span> your notice, it must be received by midnight of the deadline date</li>
              <li>Keep a copy of your cancellation notice for your records</li>
            </ul>
          </div>
        </div>

        {/* Sample Cancellation Form */}
        <div className="p-6 border-b-2 border-gray-900 bg-gray-50">
          <h3 className="font-bold text-base mb-3 pb-2 border-b-2 border-red-700 text-center">SAMPLE CANCELLATION NOTICE</h3>
          <p className="text-xs mb-3 text-center text-gray-600">
            You may use this form or prepare your own written notice. Both must be signed and dated.
          </p>

          <div className="border-4 border-gray-900 bg-white p-6">
            <div className="text-center mb-6">
              <div className="text-xs text-gray-500 mb-2">DETACH AND RETURN THIS FORM TO CANCEL</div>
              <div className="border-b-2 border-dashed border-gray-400 my-2"></div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-600">Date:</div>
                <div className="border-b border-gray-400 py-2">____________________</div>
              </div>

              <div>
                <div className="text-xs text-gray-600 mb-2">To: Capital Mortgage Group LLC</div>
                <div className="leading-loose">
                  <p className="mb-4">
                    I/We hereby cancel the transaction for the mortgage loan on the property located at:
                  </p>
                  <div className="border-b border-gray-400 py-2 mb-4">
                    1234 Oak Street, Chicago, IL 60614
                  </div>
                  <p className="mb-4">Loan Number: BOB-2025-001234</p>
                  <p className="mb-4">Transaction Date: March 20, 2025</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-8">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Borrower Signature</div>
                  <div className="border-b-2 border-gray-900 py-6"></div>
                  <div className="mt-2 text-xs">
                    <div>Printed Name: ___________________</div>
                    <div>Date: ___________________</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Co-Borrower Signature (if applicable)</div>
                  <div className="border-b-2 border-gray-900 py-6"></div>
                  <div className="mt-2 text-xs">
                    <div>Printed Name: ___________________</div>
                    <div>Date: ___________________</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Effects of Cancellation */}
        <div className="p-6 border-b-2 border-gray-400">
          <h3 className="font-bold text-base mb-3 pb-2 border-b-2 border-red-700">EFFECTS OF CANCELLATION</h3>

          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              If you cancel this transaction within the rescission period described above:
            </p>

            <div className="bg-green-50 border-l-4 border-green-600 p-3">
              <h4 className="font-bold text-sm mb-2">What the Lender Must Do:</h4>
              <ul className="list-disc ml-6 space-y-1 text-xs">
                <li>Any <span className="font-bold">security interest</span> in your home arising from this transaction becomes void</li>
                <li>You will receive a <span className="font-bold">refund</span> of any money or property you have given to anyone in connection with this transaction</li>
                <li>Any liens or security interests will be <span className="font-bold">released within 20 days</span> after the lender receives your cancellation notice</li>
                <li>You will be entitled to a refund of <span className="font-bold">any amounts paid</span> by you or on your behalf</li>
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-3">
              <h4 className="font-bold text-sm mb-2">What You Must Do:</h4>
              <ul className="list-disc ml-6 space-y-1 text-xs">
                <li>Any property or money you have received from the lender must be <span className="font-bold">tendered back</span> to the lender</li>
                <li>If the lender does not take possession of the property within 20 days, you may <span className="font-bold">keep it</span> without further obligation</li>
                <li>You must <span className="font-bold">tender</span> the property at the location where it was received</li>
                <li>You may tender by <span className="font-bold">making it available</span> to the lender at the location of the property or to the lender's designated agent</li>
              </ul>
            </div>

            <p className="pt-2">
              The procedures outlined above must be completed within 20 calendar days after the lender receives your cancellation notice.
            </p>
          </div>
        </div>

        {/* Acknowledgment */}
        <div className="p-6 bg-gray-50">
          <h3 className="font-bold text-base mb-4 text-center uppercase">BORROWER ACKNOWLEDGMENT OF RECEIPT</h3>

          <p className="text-sm mb-6 leading-relaxed">
            By signing below, each borrower acknowledges receiving <span className="font-bold">two copies</span> of this Notice of Right to Cancel
            and understands the right to cancel this transaction. Each borrower also acknowledges receiving all required
            Truth in Lending disclosures.
          </p>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <div className="border-2 border-gray-800 p-4 rounded bg-white">
              <div className="mb-4">
                <div className="text-xs text-gray-600 mb-1">Borrower Signature</div>
                <div className="border-b-2 border-gray-800 pb-8 mb-2 italic text-lg">Edward J. Johnson</div>
                <div className="text-xs">
                  <div><span className="font-semibold">Printed Name:</span> Edward J. Johnson</div>
                  <div><span className="font-semibold">Date Received:</span> March 20, 2025</div>
                  <div><span className="font-semibold">Time Received:</span> 2:30 PM</div>
                </div>
              </div>
            </div>

            <div className="border-2 border-gray-800 p-4 rounded bg-white">
              <div className="mb-4">
                <div className="text-xs text-gray-600 mb-1">Co-Borrower Signature</div>
                <div className="border-b-2 border-gray-800 pb-8 mb-2 italic text-lg">Sarah M. Johnson</div>
                <div className="text-xs">
                  <div><span className="font-semibold">Printed Name:</span> Sarah M. Johnson</div>
                  <div><span className="font-semibold">Date Received:</span> March 20, 2025</div>
                  <div><span className="font-semibold">Time Received:</span> 2:30 PM</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-100 border-2 border-yellow-600 p-3 rounded text-xs">
            <p className="font-bold mb-1">RETAIN ONE COPY FOR YOUR RECORDS</p>
            <p>Keep this notice with your loan documents. If you have any questions about your right to cancel, contact your attorney or the lender immediately.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-red-700 text-white p-4 text-center text-xs border-t-4 border-red-700">
          <p className="font-bold mb-1">NOTICE OF RIGHT TO CANCEL - TRUTH IN LENDING ACT (TILA)</p>
          <p>This notice is provided pursuant to the Federal Truth in Lending Act (15 U.S.C. § 1601 et seq.) and Regulation Z (12 C.F.R. § 1026)</p>
          <p className="mt-2">Loan Number: BOB-2025-001234 | Transaction Date: March 20, 2025 | Rescission Deadline: March 23, 2025</p>
        </div>
      </div>
    </div>
  );
};

export default RightOfRescissionTemplate;
