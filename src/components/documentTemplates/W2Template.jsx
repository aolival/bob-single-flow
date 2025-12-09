import React from 'react';

const W2Template = ({ year = '2024', employeeName = 'Edward Johnson' }) => {
  return (
    <div className="bg-white p-8 max-w-[8.5in] mx-auto font-sans text-xs">
      {/* W-2 Form */}
      <div className="border-4 border-black">
        {/* Header */}
        <div className="bg-gray-200 p-2 border-b-2 border-black">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold text-lg">Form W-2</div>
              <div className="text-xs">Wage and Tax Statement</div>
              <div className="text-xs font-bold">{year}</div>
            </div>
            <div className="text-right">
              <div className="font-bold">Copy B—To Be Filed With Employee's FEDERAL Tax Return</div>
              <div className="text-xs mt-1">This information is being furnished to the Internal Revenue Service</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2">
          {/* Left Column */}
          <div className="border-r-2 border-black">
            {/* Box a, b, c */}
            <div className="border-b border-black p-2">
              <div className="text-xs font-bold mb-1">a Employee's social security number</div>
              <div className="font-mono text-sm">123-45-6789</div>
            </div>

            {/* Employer Info */}
            <div className="border-b border-black p-2">
              <div className="text-xs font-bold mb-1">b Employer identification number (EIN)</div>
              <div className="font-mono text-sm">12-3456789</div>

              <div className="text-xs font-bold mt-2 mb-1">c Employer's name, address, and ZIP code</div>
              <div className="font-semibold">TechCorp Solutions, Inc.</div>
              <div>350 N Michigan Avenue, Suite 2200</div>
              <div>Chicago, IL 60601</div>
            </div>

            {/* Control Number */}
            <div className="border-b border-black p-2">
              <div className="text-xs font-bold mb-1">d Control number</div>
              <div className="font-mono">TC-{year}-00456</div>
            </div>

            {/* Employee Info */}
            <div className="border-b border-black p-2">
              <div className="text-xs font-bold mb-1">e Employee's first name and initial</div>
              <div className="font-semibold text-sm">{employeeName}</div>

              <div className="text-xs font-bold mt-2 mb-1">Last name</div>
              <div className="text-xs font-bold mb-1">f Employee's address and ZIP code</div>
              <div>1456 Maple Street</div>
              <div>Chicago, IL 60614</div>
            </div>
          </div>

          {/* Right Column - Wage and Tax Boxes */}
          <div>
            {/* Row 1: Boxes 1-2 */}
            <div className="grid grid-cols-2">
              <div className="border-b border-r border-black p-2">
                <div className="text-xs font-bold mb-1">1 Wages, tips, other compensation</div>
                <div className="font-mono text-sm font-bold">$125,750.00</div>
              </div>
              <div className="border-b border-black p-2">
                <div className="text-xs font-bold mb-1">2 Federal income tax withheld</div>
                <div className="font-mono text-sm font-bold">$22,435.00</div>
              </div>
            </div>

            {/* Row 2: Boxes 3-4 */}
            <div className="grid grid-cols-2">
              <div className="border-b border-r border-black p-2">
                <div className="text-xs font-bold mb-1">3 Social security wages</div>
                <div className="font-mono text-sm font-bold">$125,750.00</div>
              </div>
              <div className="border-b border-black p-2">
                <div className="text-xs font-bold mb-1">4 Social security tax withheld</div>
                <div className="font-mono text-sm font-bold">$7,796.50</div>
              </div>
            </div>

            {/* Row 3: Boxes 5-6 */}
            <div className="grid grid-cols-2">
              <div className="border-b border-r border-black p-2">
                <div className="text-xs font-bold mb-1">5 Medicare wages and tips</div>
                <div className="font-mono text-sm font-bold">$125,750.00</div>
              </div>
              <div className="border-b border-black p-2">
                <div className="text-xs font-bold mb-1">6 Medicare tax withheld</div>
                <div className="font-mono text-sm font-bold">$1,823.38</div>
              </div>
            </div>

            {/* Row 4: Boxes 7-8 */}
            <div className="grid grid-cols-2">
              <div className="border-b border-r border-black p-2">
                <div className="text-xs font-bold mb-1">7 Social security tips</div>
                <div className="font-mono text-sm">&nbsp;</div>
              </div>
              <div className="border-b border-black p-2">
                <div className="text-xs font-bold mb-1">8 Allocated tips</div>
                <div className="font-mono text-sm">&nbsp;</div>
              </div>
            </div>

            {/* Row 5: Boxes 9-10 */}
            <div className="grid grid-cols-2">
              <div className="border-b border-r border-black p-2">
                <div className="text-xs font-bold mb-1">9</div>
                <div className="font-mono text-sm">&nbsp;</div>
              </div>
              <div className="border-b border-black p-2">
                <div className="text-xs font-bold mb-1">10 Dependent care benefits</div>
                <div className="font-mono text-sm">&nbsp;</div>
              </div>
            </div>

            {/* Row 6: Boxes 11-12 */}
            <div className="grid grid-cols-2">
              <div className="border-b border-r border-black p-2">
                <div className="text-xs font-bold mb-1">11 Nonqualified plans</div>
                <div className="font-mono text-sm">&nbsp;</div>
              </div>
              <div className="border-b border-black p-2">
                <div className="text-xs font-bold mb-1">12a See instructions for box 12</div>
                <div className="flex gap-1">
                  <span className="font-mono text-xs">D</span>
                  <span className="font-mono text-sm">$8,500.00</span>
                </div>
                <div className="text-xs text-gray-600 mt-1">401(k) contributions</div>
              </div>
            </div>

            {/* Box 12 continuation */}
            <div className="border-b border-black p-2">
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <div className="text-xs">12b</div>
                </div>
                <div>
                  <div className="text-xs">12c</div>
                </div>
                <div>
                  <div className="text-xs">12d</div>
                </div>
                <div></div>
              </div>
            </div>

            {/* Box 13 */}
            <div className="border-b border-black p-2">
              <div className="text-xs font-bold">13</div>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-1">
                  <input type="checkbox" className="w-3 h-3" disabled />
                  <span className="text-xs">Statutory employee</span>
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" className="w-3 h-3" disabled checked />
                  <span className="text-xs">Retirement plan</span>
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" className="w-3 h-3" disabled />
                  <span className="text-xs">Third-party sick pay</span>
                </label>
              </div>
            </div>

            {/* Box 14 */}
            <div className="border-b border-black p-2">
              <div className="text-xs font-bold mb-1">14 Other</div>
              <div className="text-xs">State Disability Insurance: $125.75</div>
            </div>
          </div>
        </div>

        {/* State and Local Information */}
        <div className="grid grid-cols-5 border-t-2 border-black">
          <div className="border-r border-black p-2">
            <div className="text-xs font-bold mb-1">15 State</div>
            <div className="font-mono text-sm">IL</div>
          </div>
          <div className="border-r border-black p-2">
            <div className="text-xs font-bold mb-1">16 State wages, tips, etc.</div>
            <div className="font-mono text-sm">$125,750.00</div>
          </div>
          <div className="border-r border-black p-2">
            <div className="text-xs font-bold mb-1">17 State income tax</div>
            <div className="font-mono text-sm">$6,287.50</div>
          </div>
          <div className="border-r border-black p-2">
            <div className="text-xs font-bold mb-1">18 Local wages, tips, etc.</div>
            <div className="font-mono text-sm">&nbsp;</div>
          </div>
          <div className="p-2">
            <div className="text-xs font-bold mb-1">19 Local income tax</div>
            <div className="font-mono text-sm">&nbsp;</div>
          </div>
        </div>

        {/* State 2 (optional) */}
        <div className="grid grid-cols-5 border-t border-black">
          <div className="border-r border-black p-2">
            <div className="text-xs font-bold mb-1">20 Locality name</div>
            <div className="text-xs">&nbsp;</div>
          </div>
          <div className="border-r border-black p-2">
            <div className="text-xs">&nbsp;</div>
          </div>
          <div className="border-r border-black p-2">
            <div className="text-xs">&nbsp;</div>
          </div>
          <div className="border-r border-black p-2">
            <div className="text-xs">&nbsp;</div>
          </div>
          <div className="p-2">
            <div className="text-xs">&nbsp;</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 text-xs text-gray-600 text-center">
        <p>Form W-2 Wage and Tax Statement {year}</p>
        <p className="mt-1">Department of the Treasury—Internal Revenue Service</p>
        <p className="mt-2 text-xs">For Privacy Act and Paperwork Reduction Act Notice, see the separate instructions.</p>
      </div>
    </div>
  );
};

export default W2Template;
