import React from 'react';

const TitleInsuranceTemplate = () => {
  return (
    <div className="bg-white p-8 max-w-[8.5in] mx-auto font-sans text-xs">
      {/* Header */}
      <div className="border-2 border-black">
        <div className="bg-blue-900 text-white p-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">COMMITMENT FOR TITLE INSURANCE</h1>
              <p className="text-sm mt-1">ALTA Commitment Form (2016)</p>
            </div>
            <div className="text-right">
              <div className="bg-white text-blue-900 px-3 py-1 rounded font-bold">
                File No: TC-2025-77349
              </div>
              <div className="text-sm mt-2">Commitment Date: 06/29/2025</div>
            </div>
          </div>
        </div>

        {/* Title Company Info */}
        <div className="p-4 bg-gray-50 border-b-2 border-black">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-bold text-sm mb-2">ISSUED BY:</div>
              <div className="font-semibold">First American Title Insurance Company</div>
              <div>Chicago National Office</div>
              <div>500 W Madison Street, Suite 2800</div>
              <div>Chicago, IL 60661</div>
              <div className="mt-2">Phone: (312) 555-TITLE (8485)</div>
            </div>
            <div>
              <div className="font-bold text-sm mb-2">PREPARED BY:</div>
              <div className="font-semibold">Sarah Mitchell, Title Officer</div>
              <div>License #: IL-TO-123456</div>
              <div className="mt-2">Email: sarah.mitchell@firstam.com</div>
              <div>Direct: (312) 555-0175</div>
            </div>
          </div>
        </div>

        {/* Property Information */}
        <div className="p-4 border-b-2 border-black">
          <div className="font-bold text-sm mb-2 text-blue-900">SCHEDULE A - PROPERTY DESCRIPTION</div>

          <div className="mb-3">
            <div className="font-semibold mb-1">1. Policy Amount:</div>
            <div className="grid grid-cols-2 gap-3 ml-4">
              <div className="bg-green-50 p-2 rounded border border-green-300">
                <div className="text-xs text-gray-600">Owner's Policy</div>
                <div className="text-lg font-bold text-green-800">$425,000.00</div>
              </div>
              <div className="bg-blue-50 p-2 rounded border border-blue-300">
                <div className="text-xs text-gray-600">Loan Policy</div>
                <div className="text-lg font-bold text-blue-800">$340,000.00</div>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="font-semibold mb-1">2. Premium: $2,380.00</div>
          </div>

          <div className="mb-3">
            <div className="font-semibold mb-1">3. The estate or interest in the land described herein is:</div>
            <div className="ml-4 bg-gray-50 p-2 rounded">Fee Simple</div>
          </div>

          <div className="mb-3">
            <div className="font-semibold mb-1">4. Title to the estate or interest is vested in:</div>
            <div className="ml-4 bg-gray-50 p-2 rounded">Edward J. Johnson and Sarah M. Johnson, husband and wife</div>
          </div>

          <div className="mb-3">
            <div className="font-semibold mb-1">5. The land is described as follows:</div>
            <div className="ml-4 bg-gray-50 p-3 rounded border border-gray-300">
              <div className="font-mono text-xs">
                <div>LOT 23, BLOCK 4 IN OAK PARK SUBDIVISION,</div>
                <div>A SUBDIVISION OF PART OF THE NORTHWEST QUARTER</div>
                <div>OF SECTION 14, TOWNSHIP 39 NORTH, RANGE 13 EAST</div>
                <div>OF THE THIRD PRINCIPAL MERIDIAN,</div>
                <div>IN COOK COUNTY, ILLINOIS.</div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-300">
                <div><span className="font-semibold">Commonly Known As:</span> 1456 Maple Street, Chicago, IL 60614</div>
                <div><span className="font-semibold">Permanent Index Number (PIN):</span> 14-28-456-789-0000</div>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="p-4 border-b-2 border-black">
          <div className="font-bold text-sm mb-3 text-blue-900">SCHEDULE B-I - REQUIREMENTS</div>
          <div className="text-xs mb-2">The following are the requirements to be complied with:</div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="font-semibold min-w-[30px]">1.</div>
              <div className="flex-1 bg-gray-50 p-2 rounded">
                Payment of the full consideration to, or for the account of, the grantors or mortgagors.
              </div>
            </div>
            <div className="flex gap-2">
              <div className="font-semibold min-w-[30px]">2.</div>
              <div className="flex-1 bg-gray-50 p-2 rounded">
                Proper execution and delivery of the deed of conveyance.
              </div>
            </div>
            <div className="flex gap-2">
              <div className="font-semibold min-w-[30px]">3.</div>
              <div className="flex-1 bg-gray-50 p-2 rounded">
                Proper execution and delivery of the mortgage or deed of trust.
              </div>
            </div>
            <div className="flex gap-2">
              <div className="font-semibold min-w-[30px]">4.</div>
              <div className="flex-1 bg-gray-50 p-2 rounded">
                Payment of all taxes, charges, assessments, levies and claims shown in Schedule B-II.
              </div>
            </div>
            <div className="flex gap-2">
              <div className="font-semibold min-w-[30px]">5.</div>
              <div className="flex-1 bg-gray-50 p-2 rounded">
                Satisfactory evidence of payment of consideration, value, and liens.
              </div>
            </div>
          </div>
        </div>

        {/* Exceptions */}
        <div className="p-4 border-b-2 border-black">
          <div className="font-bold text-sm mb-3 text-blue-900">SCHEDULE B-II - EXCEPTIONS</div>
          <div className="text-xs mb-2">This Commitment does not insure against loss or damage by reason of the following:</div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="font-semibold min-w-[30px]">1.</div>
              <div className="flex-1 bg-yellow-50 p-2 rounded border-l-4 border-yellow-500">
                <div className="font-semibold">Real Estate Taxes</div>
                <div className="mt-1">General taxes for the year 2025 and subsequent years, not yet due and payable.</div>
                <div className="mt-1 text-xs text-gray-600">
                  <span className="font-semibold">2024 Taxes Paid:</span> $8,450.00 (Receipt No. 2024-789456)
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="font-semibold min-w-[30px]">2.</div>
              <div className="flex-1 bg-gray-50 p-2 rounded">
                <div className="font-semibold">Rights of Parties in Possession</div>
                <div className="mt-1">Rights or claims of parties in possession not shown by the public records.</div>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="font-semibold min-w-[30px]">3.</div>
              <div className="flex-1 bg-gray-50 p-2 rounded">
                <div className="font-semibold">Easements and Restrictions</div>
                <div className="mt-1">Easements, liens, or encumbrances affecting the title that are not shown by public records but which a correct survey would disclose.</div>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="font-semibold min-w-[30px]">4.</div>
              <div className="flex-1 bg-green-50 p-2 rounded border-l-4 border-green-500">
                <div className="font-semibold">Utility Easements</div>
                <div className="mt-1">Utility easements as recorded in Document No. 2015-12345678 dated April 15, 2015.</div>
                <div className="mt-1 text-xs text-gray-600">Purpose: Electric, gas, water, and telecommunications</div>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="font-semibold min-w-[30px]">5.</div>
              <div className="flex-1 bg-gray-50 p-2 rounded">
                <div className="font-semibold">Subdivision Restrictions</div>
                <div className="mt-1">Covenants, conditions, and restrictions contained in the Oak Park Subdivision Declaration recorded as Document No. 2010-98765432 dated June 1, 2010.</div>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="font-semibold min-w-[30px]">6.</div>
              <div className="flex-1 bg-gray-50 p-2 rounded">
                <div className="font-semibold">Building Lines and Zoning</div>
                <div className="mt-1">Building lines, setbacks, and any other matters shown on the recorded plat.</div>
                <div className="mt-1">Zoning classification: R-3 Residential</div>
              </div>
            </div>
          </div>
        </div>

        {/* Title Search Summary */}
        <div className="p-4 border-b-2 border-black">
          <div className="font-bold text-sm mb-3 text-blue-900">TITLE SEARCH SUMMARY</div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="bg-gray-50 p-3 rounded mb-2">
                <div className="font-semibold text-xs mb-1">Search Period</div>
                <div>40 Years (1985 - 2025)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded mb-2">
                <div className="font-semibold text-xs mb-1">Chain of Title</div>
                <div>Clear - No breaks or gaps</div>
              </div>
              <div className="bg-green-50 p-3 rounded border border-green-300">
                <div className="font-semibold text-xs mb-1">Liens & Judgments</div>
                <div className="text-green-700 font-semibold">✓ None Found</div>
              </div>
            </div>
            <div>
              <div className="bg-gray-50 p-3 rounded mb-2">
                <div className="font-semibold text-xs mb-1">Current Owner</div>
                <div>John & Mary Seller</div>
                <div className="text-xs text-gray-600">Since: 03/15/2018</div>
              </div>
              <div className="bg-gray-50 p-3 rounded mb-2">
                <div className="font-semibold text-xs mb-1">Outstanding Mortgages</div>
                <div>$0.00 (Will be paid at closing)</div>
              </div>
              <div className="bg-green-50 p-3 rounded border border-green-300">
                <div className="font-semibold text-xs mb-1">Title Status</div>
                <div className="text-green-700 font-semibold">✓ Marketable & Insurable</div>
              </div>
            </div>
          </div>
        </div>

        {/* Commitment Notes */}
        <div className="p-4 bg-blue-50 border-b-2 border-black">
          <div className="font-bold text-sm mb-2">COMMITMENT NOTES</div>
          <div className="text-xs space-y-1">
            <p>• This Commitment is valid for 120 days from the commitment date shown above.</p>
            <p>• Title insurance policies will be issued upon satisfaction of all requirements in Schedule B-I.</p>
            <p>• The total premium shown includes both Owner's and Lender's policies (simultaneous issue rate).</p>
            <p>• A current survey is recommended to verify property boundaries and identify any encroachments.</p>
            <p>• All documents must be properly executed, notarized, and recorded in the Cook County Recorder's Office.</p>
          </div>
        </div>

        {/* Endorsements Available */}
        <div className="p-4 border-b-2 border-black">
          <div className="font-bold text-sm mb-3 text-blue-900">AVAILABLE ENDORSEMENTS</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-50 p-2 rounded">☑ ALTA 9 - Restrictions, Encroachments, Minerals</div>
            <div className="bg-gray-50 p-2 rounded">☑ ALTA 8.1 - Environmental Protection Lien</div>
            <div className="bg-gray-50 p-2 rounded">☑ ALTA 22 - Location</div>
            <div className="bg-gray-50 p-2 rounded">☑ ALTA 5.1 - Planned Unit Development</div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-100">
          <div className="text-center text-xs text-gray-600">
            <p className="font-bold mb-2">First American Title Insurance Company</p>
            <p>This Commitment is issued subject to the provisions, exclusions, and conditions of the ALTA Commitment Form (2016).</p>
            <p className="mt-2">For questions or additional information, please contact your Title Officer.</p>
            <p className="mt-2 font-semibold">Commitment Date: June 29, 2025 | File No: TC-2025-77349</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleInsuranceTemplate;
