import React from 'react';

const AppraisalTemplate = () => {
  return (
    <div className="bg-white p-8 max-w-[8.5in] mx-auto font-serif text-xs leading-tight">
      {/* Header */}
      <div className="border-2 border-black mb-2">
        <div className="bg-gray-100 p-2 border-b border-black">
          <div className="flex justify-between items-center">
            <div className="font-bold text-sm">UNIFORM RESIDENTIAL APPRAISAL REPORT</div>
            <div className="text-right">
              <div className="font-bold">File #: 2025-APR-77349</div>
              <div>Fannie Mae Form 1004 / Freddie Mac Form 70</div>
            </div>
          </div>
        </div>

        {/* Property Section */}
        <div className="p-2 border-b border-black">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-bold mb-1">SUBJECT</div>
              <div><span className="font-semibold">Property Address:</span> 1456 Maple Street</div>
              <div><span className="font-semibold">City:</span> Chicago <span className="font-semibold ml-4">State:</span> IL <span className="font-semibold ml-4">Zip Code:</span> 60614</div>
              <div><span className="font-semibold">Legal Description:</span> Lot 23, Block 4, Oak Park Subdivision</div>
              <div><span className="font-semibold">Assessor's Parcel #:</span> 14-28-456-789-0000</div>
              <div><span className="font-semibold">Tax Year:</span> 2025 <span className="font-semibold ml-4">R.E. Taxes:</span> $8,450</div>
            </div>
            <div>
              <div className="font-bold mb-1">BORROWER</div>
              <div><span className="font-semibold">Borrower:</span> Edward Johnson</div>
              <div><span className="font-semibold">Co-Borrower:</span> Sarah Johnson</div>
              <div><span className="font-semibold">Lender/Client:</span> CMG Mortgage, Inc.</div>
              <div className="mt-2">
                <div><span className="font-semibold">County:</span> Cook County</div>
                <div><span className="font-semibold">Occupant:</span> ☑ Owner ☐ Tenant ☐ Vacant</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Section */}
        <div className="p-2 border-b border-black">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div><span className="font-semibold">Property Rights Appraised:</span> ☑ Fee Simple ☐ Leasehold</div>
              <div><span className="font-semibold">Assignment Type:</span> ☑ Purchase ☐ Refinance</div>
            </div>
            <div>
              <div><span className="font-semibold">Loan Type:</span> ☑ Conventional ☐ FHA ☐ VA</div>
              <div><span className="font-semibold">Contract Price:</span> $425,000</div>
            </div>
            <div>
              <div><span className="font-semibold">Date of Sale:</span> 06/25/2025</div>
              <div><span className="font-semibold">Appraisal Date:</span> 06/28/2025</div>
            </div>
          </div>
        </div>

        {/* Neighborhood Section */}
        <div className="p-2 border-b border-black">
          <div className="font-bold mb-1">NEIGHBORHOOD</div>
          <div className="grid grid-cols-3 gap-4 mb-2">
            <div>
              <div><span className="font-semibold">Location:</span> ☑ Urban ☐ Suburban ☐ Rural</div>
              <div><span className="font-semibold">Built-Up:</span> ☑ Over 75% ☐ 25-75% ☐ Under 25%</div>
            </div>
            <div>
              <div><span className="font-semibold">Growth:</span> ☑ Rapid ☐ Stable ☐ Slow</div>
              <div><span className="font-semibold">Property Values:</span> ☑ Increasing ☐ Stable ☐ Declining</div>
            </div>
            <div>
              <div><span className="font-semibold">Demand/Supply:</span> ☑ Shortage ☐ In Balance ☐ Over Supply</div>
              <div><span className="font-semibold">Marketing Time:</span> ☑ Under 3 mos ☐ 3-6 mos ☐ Over 6 mos</div>
            </div>
          </div>
          <div className="text-xs">
            <span className="font-semibold">Comments:</span> The subject is located in a desirable urban neighborhood with excellent access to schools, shopping, and public transportation. The area shows strong market activity with properties selling quickly.
          </div>
        </div>

        {/* Site Section */}
        <div className="p-2 border-b border-black">
          <div className="font-bold mb-1">SITE</div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div><span className="font-semibold">Dimensions:</span> 50' x 125'</div>
              <div><span className="font-semibold">Site Area:</span> 6,250 SF</div>
            </div>
            <div>
              <div><span className="font-semibold">Shape:</span> Rectangular</div>
              <div><span className="font-semibold">View:</span> Residential</div>
            </div>
            <div>
              <div><span className="font-semibold">Zoning:</span> R-3 Residential</div>
              <div><span className="font-semibold">Utilities:</span> All Public</div>
            </div>
            <div>
              <div><span className="font-semibold">Topography:</span> Level</div>
              <div><span className="font-semibold">FEMA Zone:</span> C (No Flood)</div>
            </div>
          </div>
        </div>

        {/* Improvements Section */}
        <div className="p-2 border-b border-black">
          <div className="font-bold mb-1">IMPROVEMENTS</div>
          <div className="grid grid-cols-3 gap-4 mb-2">
            <div>
              <div><span className="font-semibold">General Description</span></div>
              <div>Units: <span className="font-bold">One</span></div>
              <div>Stories: <span className="font-bold">2</span></div>
              <div>Type: <span className="font-bold">Det.</span></div>
              <div>Design: <span className="font-bold">Colonial</span></div>
              <div>Year Built: <span className="font-bold">2018</span></div>
              <div>Effective Age: <span className="font-bold">7 yrs</span></div>
            </div>
            <div>
              <div><span className="font-semibold">Foundation</span></div>
              <div>☑ Concrete Slab ☐ Crawl Space</div>
              <div>☐ Basement: ☐ Full ☐ Partial</div>
              <div className="mt-2"><span className="font-semibold">Exterior Walls</span></div>
              <div>☑ Vinyl Siding ☐ Brick</div>
              <div>☐ Wood ☐ Stucco</div>
            </div>
            <div>
              <div><span className="font-semibold">Roof Surface</span></div>
              <div>☑ Asphalt Shingle</div>
              <div>☐ Tile ☐ Metal</div>
              <div className="mt-2"><span className="font-semibold">Heating/Cooling</span></div>
              <div>☑ Forced Air ☑ Central A/C</div>
              <div>Fuel: ☑ Gas ☐ Electric</div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div><span className="font-semibold">Rooms:</span> 8</div>
              <div><span className="font-semibold">Bedrooms:</span> 4</div>
            </div>
            <div>
              <div><span className="font-semibold">Baths:</span> 2.5</div>
              <div><span className="font-semibold">Square Feet:</span> 2,450</div>
            </div>
            <div>
              <div><span className="font-semibold">Garage:</span> 2-Car Attached</div>
              <div><span className="font-semibold">Porch/Deck:</span> Rear Deck</div>
            </div>
            <div>
              <div><span className="font-semibold">Condition:</span> Good</div>
              <div><span className="font-semibold">Quality:</span> Good (Q3)</div>
            </div>
          </div>
        </div>

        {/* Sales Comparison Approach */}
        <div className="p-2 border-b border-black">
          <div className="font-bold mb-2">SALES COMPARISON APPROACH</div>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-black">
                <th className="text-left p-1 border-r border-black w-1/4">ITEM</th>
                <th className="text-center p-1 border-r border-black">SUBJECT</th>
                <th className="text-center p-1 border-r border-black">COMPARABLE SALE #1</th>
                <th className="text-center p-1 border-r border-black">COMPARABLE SALE #2</th>
                <th className="text-center p-1">COMPARABLE SALE #3</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-1 border-r border-black font-semibold">Address</td>
                <td className="p-1 border-r border-black text-center">1456 Maple St</td>
                <td className="p-1 border-r border-black text-center">1523 Oak Ave</td>
                <td className="p-1 border-r border-black text-center">1789 Elm St</td>
                <td className="p-1 text-center">1634 Pine Rd</td>
              </tr>
              <tr className="border-b">
                <td className="p-1 border-r border-black font-semibold">Sale Price</td>
                <td className="p-1 border-r border-black text-center">$425,000</td>
                <td className="p-1 border-r border-black text-center">$420,000</td>
                <td className="p-1 border-r border-black text-center">$432,000</td>
                <td className="p-1 text-center">$418,500</td>
              </tr>
              <tr className="border-b">
                <td className="p-1 border-r border-black font-semibold">Sale Date</td>
                <td className="p-1 border-r border-black text-center">Current</td>
                <td className="p-1 border-r border-black text-center">04/2025</td>
                <td className="p-1 border-r border-black text-center">03/2025</td>
                <td className="p-1 text-center">05/2025</td>
              </tr>
              <tr className="border-b">
                <td className="p-1 border-r border-black font-semibold">Location</td>
                <td className="p-1 border-r border-black text-center">Good</td>
                <td className="p-1 border-r border-black text-center">Good / $0</td>
                <td className="p-1 border-r border-black text-center">Superior / -$5,000</td>
                <td className="p-1 text-center">Good / $0</td>
              </tr>
              <tr className="border-b">
                <td className="p-1 border-r border-black font-semibold">Site/View</td>
                <td className="p-1 border-r border-black text-center">6,250 SF</td>
                <td className="p-1 border-r border-black text-center">6,000 SF / $0</td>
                <td className="p-1 border-r border-black text-center">6,500 SF / $0</td>
                <td className="p-1 text-center">6,200 SF / $0</td>
              </tr>
              <tr className="border-b">
                <td className="p-1 border-r border-black font-semibold">Design/Appeal</td>
                <td className="p-1 border-r border-black text-center">Colonial</td>
                <td className="p-1 border-r border-black text-center">Colonial / $0</td>
                <td className="p-1 border-r border-black text-center">Colonial / $0</td>
                <td className="p-1 text-center">Ranch / $0</td>
              </tr>
              <tr className="border-b">
                <td className="p-1 border-r border-black font-semibold">Quality/Condition</td>
                <td className="p-1 border-r border-black text-center">Good/Good</td>
                <td className="p-1 border-r border-black text-center">Good/Good / $0</td>
                <td className="p-1 border-r border-black text-center">Good/Avg / +$8,000</td>
                <td className="p-1 text-center">Good/Good / $0</td>
              </tr>
              <tr className="border-b">
                <td className="p-1 border-r border-black font-semibold">Age</td>
                <td className="p-1 border-r border-black text-center">7 yrs</td>
                <td className="p-1 border-r border-black text-center">6 yrs / $0</td>
                <td className="p-1 border-r border-black text-center">8 yrs / $0</td>
                <td className="p-1 text-center">7 yrs / $0</td>
              </tr>
              <tr className="border-b">
                <td className="p-1 border-r border-black font-semibold">Above Grade GLA</td>
                <td className="p-1 border-r border-black text-center">2,450 SF</td>
                <td className="p-1 border-r border-black text-center">2,400 SF / +$5,000</td>
                <td className="p-1 border-r border-black text-center">2,520 SF / -$7,000</td>
                <td className="p-1 text-center">2,380 SF / +$7,000</td>
              </tr>
              <tr className="border-b">
                <td className="p-1 border-r border-black font-semibold">Basement</td>
                <td className="p-1 border-r border-black text-center">Slab</td>
                <td className="p-1 border-r border-black text-center">Slab / $0</td>
                <td className="p-1 border-r border-black text-center">Slab / $0</td>
                <td className="p-1 text-center">Slab / $0</td>
              </tr>
              <tr className="border-b">
                <td className="p-1 border-r border-black font-semibold">Garage/Carport</td>
                <td className="p-1 border-r border-black text-center">2-Car Att.</td>
                <td className="p-1 border-r border-black text-center">2-Car Att. / $0</td>
                <td className="p-1 border-r border-black text-center">2-Car Att. / $0</td>
                <td className="p-1 text-center">2-Car Att. / $0</td>
              </tr>
              <tr className="border-b bg-yellow-50">
                <td className="p-1 border-r border-black font-bold">Net Adjustment</td>
                <td className="p-1 border-r border-black text-center">—</td>
                <td className="p-1 border-r border-black text-center font-bold">+$5,000</td>
                <td className="p-1 border-r border-black text-center font-bold">-$4,000</td>
                <td className="p-1 text-center font-bold">+$7,000</td>
              </tr>
              <tr className="bg-green-50">
                <td className="p-1 border-r border-black font-bold">Adjusted Sale Price</td>
                <td className="p-1 border-r border-black text-center">—</td>
                <td className="p-1 border-r border-black text-center font-bold">$425,000</td>
                <td className="p-1 border-r border-black text-center font-bold">$428,000</td>
                <td className="p-1 text-center font-bold">$425,500</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-2 text-xs">
            <span className="font-semibold">Comments on Sales Comparison:</span> The subject property is well-supported by recent comparable sales in the neighborhood. Adjustments are minimal, indicating good market support for the contract price.
          </div>
        </div>

        {/* Reconciliation */}
        <div className="p-2 border-b border-black">
          <div className="font-bold mb-1">RECONCILIATION</div>
          <div className="text-xs mb-2">
            Based on the sales comparison approach, the indicated value range is $425,000 to $428,000. The subject property is in good condition with no deferred maintenance observed. The market is active with strong demand.
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div><span className="font-semibold">Indicated Value by Sales Comparison Approach:</span> $426,000</div>
              <div><span className="font-semibold">Indicated Value by Cost Approach (if applicable):</span> N/A</div>
            </div>
            <div>
              <div><span className="font-semibold">Indicated Value by Income Approach (if applicable):</span> N/A</div>
            </div>
          </div>
        </div>

        {/* Final Opinion of Value */}
        <div className="p-2 bg-green-100 border-b-2 border-black">
          <div className="flex justify-between items-center">
            <div className="font-bold text-base">FINAL OPINION OF MARKET VALUE</div>
            <div className="font-bold text-2xl">$426,000</div>
          </div>
        </div>

        {/* Appraiser Section */}
        <div className="p-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-bold mb-1">APPRAISER</div>
              <div><span className="font-semibold">Name:</span> Michael Anderson</div>
              <div><span className="font-semibold">Company:</span> Premier Appraisal Services</div>
              <div><span className="font-semibold">License #:</span> IL-556-002345</div>
              <div><span className="font-semibold">Date of Report:</span> 06/28/2025</div>
              <div className="mt-2 pt-2 border-t border-gray-400">
                <div className="italic">Signature: Michael Anderson</div>
              </div>
            </div>
            <div>
              <div className="font-bold mb-1">SUPERVISORY APPRAISER (if applicable)</div>
              <div><span className="font-semibold">Name:</span> Jennifer Williams, MAI</div>
              <div><span className="font-semibold">Company:</span> Premier Appraisal Services</div>
              <div><span className="font-semibold">License #:</span> IL-556-001122</div>
              <div><span className="font-semibold">Date of Review:</span> 06/28/2025</div>
              <div className="mt-2 pt-2 border-t border-gray-400">
                <div className="italic">Signature: Jennifer Williams, MAI</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppraisalTemplate;
