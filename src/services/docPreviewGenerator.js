/**
 * docPreviewGenerator.js
 * Generates realistic mock document previews for demo purposes.
 * TODO: Replace openDocPreview() call with real CMG Doc API endpoint when available.
 */

const CMG_LOGO_SVG = `
  <div style="display:flex;align-items:baseline;gap:4px;">
    <span style="font-size:28px;font-weight:700;color:#9ACD32;font-family:Arial,sans-serif;letter-spacing:-1px;">CMG</span>
    <span style="font-size:13px;font-weight:400;color:#5A5A5A;font-family:Arial,sans-serif;letter-spacing:3px;">FINANCIAL</span>
  </div>`;

const BASE_STYLES = `
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 11px; color: #1a1a1a; background: #f0f0f0; }
    .page { background: #fff; max-width: 850px; margin: 24px auto; padding: 48px 56px; box-shadow: 0 2px 12px rgba(0,0,0,0.18); min-height: 1100px; position: relative; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #9ACD32; padding-bottom: 14px; margin-bottom: 22px; }
    .doc-title { font-size: 17px; font-weight: 700; color: #1a3a5c; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #1a3a5c; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-bottom: 10px; }
    .field-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px 20px; }
    .field-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px 20px; }
    .field { margin-bottom: 8px; }
    .field label { display: block; font-size: 9px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
    .field .value { font-size: 11px; font-weight: 600; color: #1a1a1a; border-bottom: 1px solid #ccc; padding-bottom: 2px; min-height: 16px; }
    table { width: 100%; border-collapse: collapse; font-size: 10px; }
    th { background: #1a3a5c; color: #fff; padding: 6px 8px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 6px 8px; border-bottom: 1px solid #eee; }
    tr:nth-child(even) td { background: #f7f9fb; }
    .stamp { position: absolute; top: 80px; right: 56px; border: 3px solid #2d7a3a; color: #2d7a3a; font-size: 13px; font-weight: 700; padding: 6px 14px; border-radius: 4px; transform: rotate(-8deg); letter-spacing: 1px; opacity: 0.75; }
    .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-35deg); font-size: 80px; color: rgba(0,0,0,0.04); font-weight: 900; white-space: nowrap; pointer-events: none; z-index: 0; }
    .footer { position: absolute; bottom: 32px; left: 56px; right: 56px; border-top: 1px solid #ddd; padding-top: 8px; display: flex; justify-content: space-between; font-size: 9px; color: #999; }
    .sig-line { border-bottom: 1px solid #333; margin-top: 32px; width: 240px; }
    .sig-label { font-size: 9px; color: #666; margin-top: 3px; }
    .highlight { background: #fffde7; padding: 10px 14px; border-left: 3px solid #f59e0b; margin: 12px 0; font-size: 10px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 9px; font-weight: 700; }
    .badge-green { background: #d1fae5; color: #065f46; }
    .badge-blue { background: #dbeafe; color: #1e40af; }
    .badge-yellow { background: #fef3c7; color: #92400e; }
  </style>`;

function loanHeader(loanNumber, borrowerName, docTitle) {
  const formatted = borrowerName
    ? borrowerName.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, s => s.toUpperCase())
    : 'John Daniel Doe';
  return `
    <div class="header">
      ${CMG_LOGO_SVG}
      <div style="text-align:right;font-size:10px;color:#555;">
        <div style="font-weight:700;color:#1a3a5c;font-size:12px;margin-bottom:2px;">${formatted}</div>
        <div>Loan #: <strong>${loanNumber}</strong></div>
        <div>Date: ${new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</div>
      </div>
    </div>
    <div class="doc-title">${docTitle}</div>`;
}

function page(content, loanNumber) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>CMG Document Preview</title>${BASE_STYLES}</head>
  <body>
    <div class="watermark">DEMO</div>
    <div class="page">
      ${content}
      <div class="footer">
        <span>CMG Financial &bull; Document Management System &bull; DEMO PREVIEW</span>
        <span>Loan # ${loanNumber} &bull; Page 1 of 1</span>
      </div>
    </div>
  </body></html>`;
}

// ─── Individual document generators ──────────────────────────────────────────

function w2(loanNumber, borrowerName) {
  const name = borrowerName ? borrowerName.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase() : 'DOE, JOHN D';
  return page(`
    ${loanHeader(loanNumber, borrowerName, 'W-2 Wage and Tax Statement')}
    <div class="stamp">RECEIVED</div>
    <div class="section">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <div style="font-size:13px;font-weight:700;color:#1a3a5c;">Tax Year: 2024</div>
        <div class="badge badge-blue">Copy B — To Be Filed With Employee's Federal Tax Return</div>
      </div>
      <div class="field-grid">
        <div class="field"><label>Employee SSN</label><div class="value">***-**-6789</div></div>
        <div class="field"><label>Employer EIN</label><div class="value">82-4471033</div></div>
        <div class="field"><label>Tax Year</label><div class="value">2024</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Employer Information</div>
      <div class="field-grid-2">
        <div class="field"><label>Employer Name</label><div class="value">WESTERN PACIFIC CORPORATION</div></div>
        <div class="field"><label>Employer Address</label><div class="value">4200 Commerce Dr, Phoenix, AZ 85001</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Employee Information</div>
      <div class="field-grid-2">
        <div class="field"><label>Employee Name</label><div class="value">${name}</div></div>
        <div class="field"><label>Employee Address</label><div class="value">8821 N 34th Ave, Phoenix, AZ 85051</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Wages &amp; Compensation</div>
      <table>
        <thead><tr><th>Box</th><th>Description</th><th>Amount</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>Wages, tips, other compensation</td><td><strong>$112,500.00</strong></td></tr>
          <tr><td>2</td><td>Federal income tax withheld</td><td>$18,340.00</td></tr>
          <tr><td>3</td><td>Social security wages</td><td>$112,500.00</td></tr>
          <tr><td>4</td><td>Social security tax withheld</td><td>$6,975.00</td></tr>
          <tr><td>5</td><td>Medicare wages and tips</td><td>$112,500.00</td></tr>
          <tr><td>6</td><td>Medicare tax withheld</td><td>$1,631.25</td></tr>
          <tr><td>12a</td><td>401(k) Elective Deferrals</td><td>$9,750.00</td></tr>
          <tr><td>17</td><td>State income tax withheld (AZ)</td><td>$3,937.50</td></tr>
        </tbody>
      </table>
    </div>`, loanNumber);
}

function payStubs(loanNumber, borrowerName) {
  const name = borrowerName ? borrowerName.replace(/([a-z])([A-Z])/g, '$1 $2') : 'John Daniel Doe';
  return page(`
    ${loanHeader(loanNumber, borrowerName, 'Pay Stub — Most Recent 30 Days')}
    <div class="stamp">VERIFIED</div>
    <div class="section">
      <div class="section-title">Employer &amp; Employee</div>
      <div class="field-grid">
        <div class="field"><label>Employer</label><div class="value">Western Pacific Corporation</div></div>
        <div class="field"><label>Employee</label><div class="value">${name}</div></div>
        <div class="field"><label>Pay Period</label><div class="value">03/01/2026 – 03/15/2026</div></div>
        <div class="field"><label>Pay Date</label><div class="value">03/20/2026</div></div>
        <div class="field"><label>Pay Frequency</label><div class="value">Semi-Monthly</div></div>
        <div class="field"><label>Department</label><div class="value">Operations</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Earnings</div>
      <table>
        <thead><tr><th>Type</th><th>Rate</th><th>Hours</th><th>Current</th><th>YTD</th></tr></thead>
        <tbody>
          <tr><td>Regular</td><td>$54.13/hr</td><td>80</td><td>$4,330.00</td><td>$25,980.00</td></tr>
          <tr><td>Overtime</td><td>$81.19/hr</td><td>4</td><td>$324.76</td><td>$1,298.04</td></tr>
          <tr><td><strong>Gross Pay</strong></td><td></td><td>84</td><td><strong>$4,654.76</strong></td><td><strong>$27,278.04</strong></td></tr>
        </tbody>
      </table>
    </div>
    <div class="section">
      <div class="section-title">Deductions</div>
      <table>
        <thead><tr><th>Description</th><th>Current</th><th>YTD</th></tr></thead>
        <tbody>
          <tr><td>Federal Income Tax</td><td>$744.76</td><td>$4,468.56</td></tr>
          <tr><td>State Income Tax (AZ)</td><td>$162.92</td><td>$977.52</td></tr>
          <tr><td>Social Security</td><td>$288.60</td><td>$1,731.60</td></tr>
          <tr><td>Medicare</td><td>$67.49</td><td>$404.94</td></tr>
          <tr><td>Medical Insurance</td><td>$215.00</td><td>$1,290.00</td></tr>
          <tr><td>401(k) 6%</td><td>$279.29</td><td>$1,675.74</td></tr>
          <tr><td><strong>Net Pay</strong></td><td><strong>$2,896.70</strong></td><td><strong>$16,730.68</strong></td></tr>
        </tbody>
      </table>
    </div>`, loanNumber);
}

function creditReport(loanNumber, borrowerName) {
  const name = borrowerName ? borrowerName.replace(/([a-z])([A-Z])/g, '$1 $2') : 'John Daniel Doe';
  return page(`
    ${loanHeader(loanNumber, borrowerName, 'Tri-Merge Credit Report')}
    <div class="stamp">APPROVED</div>
    <div class="highlight">Tri-Merge report sourced from Equifax, Experian, and TransUnion via Factual Data. Pull date: ${new Date().toLocaleDateString()}</div>
    <div class="section">
      <div class="section-title">Borrower Summary</div>
      <div class="field-grid">
        <div class="field"><label>Borrower Name</label><div class="value">${name}</div></div>
        <div class="field"><label>SSN (masked)</label><div class="value">***-**-6789</div></div>
        <div class="field"><label>DOB</label><div class="value">**/**/1985</div></div>
        <div class="field"><label>Current Address</label><div class="value">8821 N 34th Ave, Phoenix AZ 85051</div></div>
        <div class="field"><label>Address Since</label><div class="value">March 2019</div></div>
        <div class="field"><label>Employment</label><div class="value">Western Pacific Corp</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Credit Scores</div>
      <table>
        <thead><tr><th>Bureau</th><th>Score</th><th>Model</th><th>Risk Level</th></tr></thead>
        <tbody>
          <tr><td>Equifax</td><td><strong>742</strong></td><td>FICO 5</td><td><span class="badge badge-green">Good</span></td></tr>
          <tr><td>Experian</td><td><strong>738</strong></td><td>FICO 2</td><td><span class="badge badge-green">Good</span></td></tr>
          <tr><td>TransUnion</td><td><strong>751</strong></td><td>FICO 4</td><td><span class="badge badge-green">Good</span></td></tr>
          <tr><td><strong>Mid Score (qualifying)</strong></td><td><strong>742</strong></td><td></td><td></td></tr>
        </tbody>
      </table>
    </div>
    <div class="section">
      <div class="section-title">Trade Lines Summary</div>
      <table>
        <thead><tr><th>Creditor</th><th>Type</th><th>Balance</th><th>Limit/High</th><th>Payment</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>Chase Sapphire</td><td>Revolving</td><td>$4,200</td><td>$18,000</td><td>$84</td><td><span class="badge badge-green">Current</span></td></tr>
          <tr><td>Toyota Financial</td><td>Installment</td><td>$12,340</td><td>$32,000</td><td>$487</td><td><span class="badge badge-green">Current</span></td></tr>
          <tr><td>Bank of America</td><td>Revolving</td><td>$890</td><td>$10,000</td><td>$25</td><td><span class="badge badge-green">Current</span></td></tr>
          <tr><td>Navient (Student)</td><td>Installment</td><td>$0</td><td>$24,500</td><td>$0</td><td><span class="badge badge-green">Paid</span></td></tr>
        </tbody>
      </table>
    </div>
    <div class="section">
      <div class="section-title">Public Records &amp; Inquiries</div>
      <div class="field-grid-2">
        <div class="field"><label>Public Records</label><div class="value">None</div></div>
        <div class="field"><label>Hard Inquiries (24 mo)</label><div class="value">2</div></div>
        <div class="field"><label>Collections</label><div class="value">None</div></div>
        <div class="field"><label>Debt-to-Credit Ratio</label><div class="value">28%</div></div>
      </div>
    </div>`, loanNumber);
}

function appraisal(loanNumber, borrowerName) {
  return page(`
    ${loanHeader(loanNumber, borrowerName, 'Uniform Residential Appraisal Report (URAR)')}
    <div class="stamp">CERTIFIED</div>
    <div class="section">
      <div class="section-title">Subject Property</div>
      <div class="field-grid">
        <div class="field"><label>Property Address</label><div class="value">8821 N 34th Ave, Phoenix, AZ 85051</div></div>
        <div class="field"><label>Legal Description</label><div class="value">LOT 22, BLOCK 4, CAMELBACK HEIGHTS</div></div>
        <div class="field"><label>County</label><div class="value">Maricopa</div></div>
        <div class="field"><label>Property Type</label><div class="value">Single Family Residential</div></div>
        <div class="field"><label>Year Built</label><div class="value">1997</div></div>
        <div class="field"><label>GLA (Sq Ft)</label><div class="value">2,184</div></div>
        <div class="field"><label>Lot Size</label><div class="value">7,405 sq ft / 0.17 ac</div></div>
        <div class="field"><label>Bedrooms</label><div class="value">4</div></div>
        <div class="field"><label>Bathrooms</label><div class="value">2.5</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Value Conclusion</div>
      <div class="field-grid">
        <div class="field"><label>Appraised Value</label><div class="value" style="font-size:16px;font-weight:700;color:#1a3a5c;">$485,000</div></div>
        <div class="field"><label>Effective Date</label><div class="value">${new Date().toLocaleDateString()}</div></div>
        <div class="field"><label>Approach Used</label><div class="value">Sales Comparison</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Comparable Sales</div>
      <table>
        <thead><tr><th>Address</th><th>Proximity</th><th>Sale Price</th><th>GLA</th><th>$/SqFt</th><th>Sale Date</th></tr></thead>
        <tbody>
          <tr><td>8740 N 33rd Ave</td><td>0.12 mi</td><td>$479,000</td><td>2,101</td><td>$228</td><td>Jan 2026</td></tr>
          <tr><td>3412 W Morten Ave</td><td>0.34 mi</td><td>$492,500</td><td>2,240</td><td>$220</td><td>Feb 2026</td></tr>
          <tr><td>8956 N 36th Ave</td><td>0.28 mi</td><td>$481,000</td><td>2,175</td><td>$221</td><td>Dec 2025</td></tr>
        </tbody>
      </table>
    </div>
    <div class="section">
      <div class="section-title">Appraiser Certification</div>
      <div class="field-grid-2">
        <div class="field"><label>Appraiser Name</label><div class="value">Sandra K. Morales, MAI</div></div>
        <div class="field"><label>License No.</label><div class="value">AZ-CG-30214</div></div>
        <div class="field"><label>Company</label><div class="value">Southwest Appraisal Group LLC</div></div>
        <div class="field"><label>Inspection Date</label><div class="value">${new Date(Date.now() - 7*86400000).toLocaleDateString()}</div></div>
      </div>
      <div class="sig-line"></div><div class="sig-label">Appraiser Signature</div>
    </div>`, loanNumber);
}

function closingDisclosure(loanNumber, borrowerName) {
  const name = borrowerName ? borrowerName.replace(/([a-z])([A-Z])/g, '$1 $2') : 'John Daniel Doe';
  return page(`
    ${loanHeader(loanNumber, borrowerName, 'Closing Disclosure')}
    <div class="highlight" style="border-color:#1a3a5c;background:#f0f4ff;">This form is a statement of final loan terms and closing costs. Compare this document to your Loan Estimate.</div>
    <div class="section">
      <div class="section-title">Loan Information</div>
      <div class="field-grid">
        <div class="field"><label>Borrower</label><div class="value">${name}</div></div>
        <div class="field"><label>Loan Number</label><div class="value">${loanNumber}</div></div>
        <div class="field"><label>Loan Purpose</label><div class="value">Purchase</div></div>
        <div class="field"><label>Loan Type</label><div class="value">FHA Fixed Rate</div></div>
        <div class="field"><label>Loan Term</label><div class="value">30 Years</div></div>
        <div class="field"><label>Interest Rate</label><div class="value">6.875%</div></div>
        <div class="field"><label>Monthly P&amp;I</label><div class="value">$2,944.16</div></div>
        <div class="field"><label>Monthly MIP</label><div class="value">$231.08</div></div>
        <div class="field"><label>Total Monthly Payment</label><div class="value" style="font-weight:700;">$3,388.74</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Loan Costs</div>
      <table>
        <thead><tr><th>Description</th><th>Borrower-Paid</th><th>Seller-Paid</th><th>Paid By Others</th></tr></thead>
        <tbody>
          <tr><td>Origination Charges</td><td>$1,850.00</td><td>—</td><td>—</td></tr>
          <tr><td>Appraisal Fee</td><td>$575.00</td><td>—</td><td>—</td></tr>
          <tr><td>Credit Report Fee</td><td>$28.00</td><td>—</td><td>—</td></tr>
          <tr><td>Title – Settlement Fee</td><td>$450.00</td><td>—</td><td>—</td></tr>
          <tr><td>Title Insurance (Lender)</td><td>$812.00</td><td>—</td><td>—</td></tr>
          <tr><td>Prepaid Interest (14 days)</td><td>$1,295.00</td><td>—</td><td>—</td></tr>
          <tr><td>Homeowner's Insurance (12 mo)</td><td>$1,404.00</td><td>—</td><td>—</td></tr>
          <tr><td><strong>Total Closing Costs</strong></td><td><strong>$6,414.00</strong></td><td>—</td><td>—</td></tr>
        </tbody>
      </table>
    </div>
    <div class="section">
      <div class="section-title">Cash to Close</div>
      <div class="field-grid">
        <div class="field"><label>Purchase Price</label><div class="value">$465,000</div></div>
        <div class="field"><label>Down Payment (3.5%)</label><div class="value">$16,275</div></div>
        <div class="field"><label>Total Cash to Close</label><div class="value" style="font-size:14px;font-weight:700;color:#1a3a5c;">$22,689.00</div></div>
      </div>
    </div>`, loanNumber);
}

function promissoryNote(loanNumber, borrowerName) {
  const name = borrowerName ? borrowerName.replace(/([a-z])([A-Z])/g, '$1 $2') : 'John Daniel Doe';
  return page(`
    ${loanHeader(loanNumber, borrowerName, 'Promissory Note')}
    <div class="section">
      <div style="text-align:center;font-size:10px;color:#555;margin-bottom:16px;">MULTISTATE FIXED RATE NOTE — Single Family — Fannie Mae/Freddie Mac Uniform Instrument</div>
      <div class="field-grid">
        <div class="field"><label>Date</label><div class="value">${new Date().toLocaleDateString()}</div></div>
        <div class="field"><label>City</label><div class="value">Phoenix</div></div>
        <div class="field"><label>State</label><div class="value">Arizona</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Borrower's Promise to Pay</div>
      <p style="font-size:10px;line-height:1.7;color:#333;">In return for a loan that I have received, I promise to pay U.S. $<strong>448,725.00</strong> (this amount is called "Principal"), plus interest, to the order of <strong>CMG MORTGAGE, INC.</strong> I will make all payments under this Note in the form of cash, check or money order.</p>
    </div>
    <div class="section">
      <div class="section-title">Loan Terms</div>
      <div class="field-grid">
        <div class="field"><label>Principal Amount</label><div class="value">$448,725.00</div></div>
        <div class="field"><label>Interest Rate</label><div class="value">6.875% per annum</div></div>
        <div class="field"><label>First Payment Date</label><div class="value">May 1, 2026</div></div>
        <div class="field"><label>Final Payment Date</label><div class="value">April 1, 2056</div></div>
        <div class="field"><label>Monthly Payment</label><div class="value">$2,944.16</div></div>
        <div class="field"><label>Loan Number</label><div class="value">${loanNumber}</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Property Address</div>
      <div class="field"><label>Collateral Address</label><div class="value">8821 N 34th Ave, Phoenix, AZ 85051</div></div>
    </div>
    <div style="margin-top:40px;">
      <div class="sig-line"></div><div class="sig-label">${name} — Borrower</div>
      <div style="margin-top:6px;font-size:9px;color:#666;">Date: ___________________</div>
    </div>`, loanNumber);
}

function rightOfRescission(loanNumber, borrowerName) {
  const name = borrowerName ? borrowerName.replace(/([a-z])([A-Z])/g, '$1 $2') : 'John Daniel Doe';
  const rescindBy = new Date(Date.now() + 3*86400000).toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  return page(`
    ${loanHeader(loanNumber, borrowerName, 'Notice of Right to Cancel (Right of Rescission)')}
    <div class="highlight" style="border-color:#dc2626;background:#fef2f2;">
      <strong>IMPORTANT:</strong> This is not a loan commitment. Your right to cancel expires at midnight on <strong>${rescindBy}</strong>.
    </div>
    <div class="section">
      <div class="section-title">Your Right to Cancel</div>
      <p style="font-size:10px;line-height:1.8;color:#333;">You are entering into a transaction that will result in a mortgage, lien, or security interest on/in your home. <strong>${name}</strong> has the legal right under federal law (Truth in Lending Act) to cancel this transaction, without cost, within <strong>THREE BUSINESS DAYS</strong> from whichever of the following events occurs last:</p>
      <ul style="margin:12px 0 12px 20px;font-size:10px;line-height:1.8;color:#333;">
        <li>The date of the transaction: <strong>${new Date().toLocaleDateString()}</strong></li>
        <li>The date you received your Truth in Lending disclosures</li>
        <li>The date you received this notice of your right to cancel</li>
      </ul>
    </div>
    <div class="section">
      <div class="section-title">Rescission Deadline</div>
      <div class="field-grid-2">
        <div class="field"><label>Transaction Date</label><div class="value">${new Date().toLocaleDateString()}</div></div>
        <div class="field"><label>Cancel By (Midnight)</label><div class="value" style="font-weight:700;color:#dc2626;">${rescindBy}</div></div>
        <div class="field"><label>Loan Number</label><div class="value">${loanNumber}</div></div>
        <div class="field"><label>Property Address</label><div class="value">8821 N 34th Ave, Phoenix, AZ 85051</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">How to Cancel</div>
      <p style="font-size:10px;line-height:1.7;color:#333;">If you decide to cancel, you may do so by notifying CMG Financial in writing at: <strong>3160 Crow Canyon Rd, Suite 400, San Ramon, CA 94583</strong> or fax to <strong>1-800-555-0198</strong>. You may use any written statement signed and dated by you.</p>
    </div>
    <div style="margin-top:32px;">
      <div class="field-grid-2">
        <div><div class="sig-line"></div><div class="sig-label">${name} — Signature</div><div style="font-size:9px;color:#666;margin-top:3px;">Date: ___________________</div></div>
        <div><div class="sig-line"></div><div class="sig-label">Co-Borrower Signature (if applicable)</div><div style="font-size:9px;color:#666;margin-top:3px;">Date: ___________________</div></div>
      </div>
    </div>`, loanNumber);
}

function application1003(loanNumber, borrowerName) {
  const name = borrowerName ? borrowerName.replace(/([a-z])([A-Z])/g, '$1 $2') : 'John Daniel Doe';
  return page(`
    ${loanHeader(loanNumber, borrowerName, 'Uniform Residential Loan Application (1003)')}
    <div class="section">
      <div class="section-title">Section 1 — Borrower Information</div>
      <div class="field-grid">
        <div class="field"><label>Borrower Name</label><div class="value">${name}</div></div>
        <div class="field"><label>SSN</label><div class="value">***-**-6789</div></div>
        <div class="field"><label>DOB</label><div class="value">**/**/1985</div></div>
        <div class="field"><label>Cell Phone</label><div class="value">(602) 555-0142</div></div>
        <div class="field"><label>Email</label><div class="value">jdoe@email.com</div></div>
        <div class="field"><label>Citizenship</label><div class="value">U.S. Citizen</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Section 2 — Financial Information — Assets</div>
      <table>
        <thead><tr><th>Account Type</th><th>Institution</th><th>Account #</th><th>Value</th></tr></thead>
        <tbody>
          <tr><td>Checking</td><td>Chase Bank</td><td>****4821</td><td>$28,450.00</td></tr>
          <tr><td>Savings</td><td>Wells Fargo</td><td>****7703</td><td>$41,200.00</td></tr>
          <tr><td>401(k)</td><td>Fidelity</td><td>****2290</td><td>$87,340.00</td></tr>
        </tbody>
      </table>
    </div>
    <div class="section">
      <div class="section-title">Section 3 — Loan &amp; Property Information</div>
      <div class="field-grid">
        <div class="field"><label>Loan Purpose</label><div class="value">Purchase</div></div>
        <div class="field"><label>Property Address</label><div class="value">8821 N 34th Ave, Phoenix AZ 85051</div></div>
        <div class="field"><label>Property Type</label><div class="value">Primary Residence</div></div>
        <div class="field"><label>Loan Amount</label><div class="value">$448,725</div></div>
        <div class="field"><label>Interest Rate</label><div class="value">6.875%</div></div>
        <div class="field"><label>Loan Term</label><div class="value">360 Months</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Section 4 — Employment</div>
      <div class="field-grid">
        <div class="field"><label>Employer</label><div class="value">Western Pacific Corporation</div></div>
        <div class="field"><label>Position</label><div class="value">Operations Manager</div></div>
        <div class="field"><label>Years in Field</label><div class="value">8 Years</div></div>
        <div class="field"><label>Base Income</label><div class="value">$9,375.00/mo</div></div>
        <div class="field"><label>Start Date</label><div class="value">April 2017</div></div>
        <div class="field"><label>Self-Employed</label><div class="value">No</div></div>
      </div>
    </div>`, loanNumber);
}

function bankStatements(loanNumber, borrowerName) {
  return page(`
    ${loanHeader(loanNumber, borrowerName, 'Bank Statements — 60 Day History')}
    <div class="stamp">VERIFIED</div>
    <div class="section">
      <div class="section-title">Account Information</div>
      <div class="field-grid">
        <div class="field"><label>Institution</label><div class="value">Chase Bank NA</div></div>
        <div class="field"><label>Account Type</label><div class="value">Personal Checking</div></div>
        <div class="field"><label>Account Number</label><div class="value">****4821</div></div>
        <div class="field"><label>Statement Period</label><div class="value">Jan 20 – Mar 19, 2026</div></div>
        <div class="field"><label>Opening Balance</label><div class="value">$22,140.00</div></div>
        <div class="field"><label>Closing Balance</label><div class="value">$28,450.00</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Transaction History (Selected)</div>
      <table>
        <thead><tr><th>Date</th><th>Description</th><th>Deposits</th><th>Withdrawals</th><th>Balance</th></tr></thead>
        <tbody>
          <tr><td>03/20</td><td>Direct Deposit — Western Pacific Corp</td><td>$2,896.70</td><td>—</td><td>$28,450.00</td></tr>
          <tr><td>03/15</td><td>Online Transfer — Chase Sapphire</td><td>—</td><td>$250.00</td><td>$25,553.30</td></tr>
          <tr><td>03/05</td><td>Direct Deposit — Western Pacific Corp</td><td>$2,896.70</td><td>—</td><td>$25,803.30</td></tr>
          <tr><td>03/01</td><td>Mortgage Payment — Truwest CU</td><td>—</td><td>$1,487.00</td><td>$22,906.60</td></tr>
          <tr><td>02/20</td><td>Direct Deposit — Western Pacific Corp</td><td>$2,896.70</td><td>—</td><td>$24,393.60</td></tr>
          <tr><td>02/15</td><td>Electric Bill — APS</td><td>—</td><td>$184.22</td><td>$21,496.90</td></tr>
          <tr><td>02/05</td><td>Direct Deposit — Western Pacific Corp</td><td>$2,896.70</td><td>—</td><td>$21,681.12</td></tr>
          <tr><td>01/20</td><td>Direct Deposit — Western Pacific Corp</td><td>$2,896.70</td><td>—</td><td>$22,140.00</td></tr>
        </tbody>
      </table>
    </div>
    <div class="section">
      <div class="section-title">Large Deposit Review (&gt;$1,000)</div>
      <div class="highlight">All deposits verified as payroll from Western Pacific Corporation. No unexplained large deposits identified in 60-day review period.</div>
    </div>`, loanNumber);
}

function titleReport(loanNumber, borrowerName) {
  return page(`
    ${loanHeader(loanNumber, borrowerName, 'Preliminary Title Report / Title Commitment')}
    <div class="stamp">CLEAR</div>
    <div class="section">
      <div class="section-title">Property &amp; Commitment Details</div>
      <div class="field-grid">
        <div class="field"><label>Property Address</label><div class="value">8821 N 34th Ave, Phoenix, AZ 85051</div></div>
        <div class="field"><label>APN</label><div class="value">149-33-022-0</div></div>
        <div class="field"><label>County</label><div class="value">Maricopa County, AZ</div></div>
        <div class="field"><label>Title Company</label><div class="value">Fidelity National Title Agency</div></div>
        <div class="field"><label>Order Number</label><div class="value">FNT-2026-042817</div></div>
        <div class="field"><label>Effective Date</label><div class="value">${new Date().toLocaleDateString()}</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Vesting</div>
      <div class="field"><label>Current Owner(s)</label><div class="value">BRIAN JOSEPH GARRETT AND LISA MARIE GARRETT, Husband and Wife as Joint Tenants</div></div>
      <div class="field" style="margin-top:8px;"><label>Proposed Vesting (Buyer)</label><div class="value">JOHN DANIEL DOE, A Single Man</div></div>
    </div>
    <div class="section">
      <div class="section-title">Exceptions &amp; Encumbrances</div>
      <table>
        <thead><tr><th>#</th><th>Type</th><th>Details</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>General &amp; Special Taxes</td><td>2025 taxes — $2,184.00 (paid)</td><td><span class="badge badge-green">Clear</span></td></tr>
          <tr><td>2</td><td>First Deed of Trust</td><td>Chase Bank NA — to be paid off at close</td><td><span class="badge badge-yellow">Payoff Required</span></td></tr>
          <tr><td>3</td><td>HOA CC&amp;Rs</td><td>Camelback Heights HOA — no dues owed</td><td><span class="badge badge-green">Clear</span></td></tr>
          <tr><td>4</td><td>Easements</td><td>Utility easement — 5ft rear, standard</td><td><span class="badge badge-green">Standard</span></td></tr>
        </tbody>
      </table>
    </div>
    <div class="section">
      <div class="section-title">Insurance Coverage</div>
      <div class="field-grid">
        <div class="field"><label>Lender's Policy Amount</label><div class="value">$448,725.00</div></div>
        <div class="field"><label>Owner's Policy Amount</label><div class="value">$465,000.00</div></div>
        <div class="field"><label>Premium (Lender)</label><div class="value">$812.00</div></div>
      </div>
    </div>`, loanNumber);
}

function hoiPolicy(loanNumber, borrowerName) {
  const name = borrowerName ? borrowerName.replace(/([a-z])([A-Z])/g, '$1 $2') : 'John Daniel Doe';
  return page(`
    ${loanHeader(loanNumber, borrowerName, "Homeowner's Insurance Policy Declaration")}
    <div class="stamp">ACTIVE</div>
    <div class="section">
      <div class="section-title">Policy Summary</div>
      <div class="field-grid">
        <div class="field"><label>Insurance Company</label><div class="value">State Farm Fire and Casualty Co.</div></div>
        <div class="field"><label>Policy Number</label><div class="value">SF-AZ-83-0042871-6</div></div>
        <div class="field"><label>Named Insured</label><div class="value">${name}</div></div>
        <div class="field"><label>Property Address</label><div class="value">8821 N 34th Ave, Phoenix, AZ 85051</div></div>
        <div class="field"><label>Policy Period</label><div class="value">04/01/2026 – 04/01/2027</div></div>
        <div class="field"><label>Annual Premium</label><div class="value">$1,404.00</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Coverage Summary</div>
      <table>
        <thead><tr><th>Coverage</th><th>Description</th><th>Limit</th><th>Deductible</th></tr></thead>
        <tbody>
          <tr><td>Coverage A</td><td>Dwelling</td><td>$465,000</td><td>$1,000</td></tr>
          <tr><td>Coverage B</td><td>Other Structures</td><td>$46,500</td><td>$1,000</td></tr>
          <tr><td>Coverage C</td><td>Personal Property</td><td>$232,500</td><td>$1,000</td></tr>
          <tr><td>Coverage D</td><td>Loss of Use</td><td>$93,000</td><td>—</td></tr>
          <tr><td>Coverage E</td><td>Liability</td><td>$300,000</td><td>—</td></tr>
          <tr><td>Coverage F</td><td>Medical Payments</td><td>$5,000</td><td>—</td></tr>
        </tbody>
      </table>
    </div>
    <div class="section">
      <div class="section-title">Mortgagee Clause</div>
      <div class="field"><label>Mortgagee / Loss Payee</label><div class="value">CMG MORTGAGE, INC., ISAOA/ATIMA — 3160 Crow Canyon Rd Ste 400, San Ramon CA 94583</div></div>
      <div class="field" style="margin-top:8px;"><label>Loan Number</label><div class="value">${loanNumber}</div></div>
    </div>`, loanNumber);
}

function giftLetter(loanNumber, borrowerName) {
  const name = borrowerName ? borrowerName.replace(/([a-z])([A-Z])/g, '$1 $2') : 'John Daniel Doe';
  return page(`
    ${loanHeader(loanNumber, borrowerName, 'Gift Letter — Down Payment Assistance')}
    <div class="section">
      <p style="font-size:11px;line-height:1.9;color:#333;">I/We hereby certify that the funds described below have been given as a <strong>gift</strong> to the borrower(s) named below for the sole purpose of assisting with the purchase of the property described herein. <strong>No repayment is expected or required.</strong></p>
    </div>
    <div class="section">
      <div class="section-title">Donor Information</div>
      <div class="field-grid">
        <div class="field"><label>Donor Name</label><div class="value">Robert Allen Doe</div></div>
        <div class="field"><label>Relationship to Borrower</label><div class="value">Father</div></div>
        <div class="field"><label>Donor Address</label><div class="value">1442 E Oak St, Tucson, AZ 85701</div></div>
        <div class="field"><label>Donor Phone</label><div class="value">(520) 555-0187</div></div>
        <div class="field"><label>Source of Funds</label><div class="value">Personal Savings — Chase Checking ****3391</div></div>
        <div class="field"><label>Gift Amount</label><div class="value" style="font-size:14px;font-weight:700;color:#1a3a5c;">$10,000.00</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Recipient &amp; Property</div>
      <div class="field-grid">
        <div class="field"><label>Borrower Name</label><div class="value">${name}</div></div>
        <div class="field"><label>Loan Number</label><div class="value">${loanNumber}</div></div>
        <div class="field"><label>Property Address</label><div class="value">8821 N 34th Ave, Phoenix, AZ 85051</div></div>
      </div>
    </div>
    <div style="margin-top:32px;">
      <div class="field-grid-2">
        <div><div class="sig-line"></div><div class="sig-label">Donor Signature — Robert Allen Doe</div><div style="font-size:9px;color:#666;margin-top:3px;">Date: ___________________</div></div>
        <div><div class="sig-line"></div><div class="sig-label">Borrower Acknowledgment — ${name}</div><div style="font-size:9px;color:#666;margin-top:3px;">Date: ___________________</div></div>
      </div>
    </div>`, loanNumber);
}

function taxReturns(loanNumber, borrowerName) {
  const name = borrowerName ? borrowerName.replace(/([a-z])([A-Z])/g, '$1 $2') : 'John Daniel Doe';
  return page(`
    ${loanHeader(loanNumber, borrowerName, 'Federal Tax Return — Form 1040 (2023 & 2024)')}
    <div class="stamp">RECEIVED</div>
    <div class="section">
      <div class="section-title">Tax Year 2024</div>
      <div class="field-grid">
        <div class="field"><label>Filing Status</label><div class="value">Single</div></div>
        <div class="field"><label>Name</label><div class="value">${name}</div></div>
        <div class="field"><label>SSN</label><div class="value">***-**-6789</div></div>
      </div>
      <table style="margin-top:10px;">
        <thead><tr><th>Line</th><th>Description</th><th>2024 Amount</th><th>2023 Amount</th></tr></thead>
        <tbody>
          <tr><td>1a</td><td>W-2 Wages</td><td>$112,500</td><td>$108,000</td></tr>
          <tr><td>2b</td><td>Taxable Interest</td><td>$324</td><td>$188</td></tr>
          <tr><td>9</td><td>Total Income</td><td>$112,824</td><td>$108,188</td></tr>
          <tr><td>11</td><td>AGI</td><td>$103,074</td><td>$98,438</td></tr>
          <tr><td>12</td><td>Standard Deduction</td><td>$14,600</td><td>$13,850</td></tr>
          <tr><td>15</td><td>Taxable Income</td><td>$88,474</td><td>$84,588</td></tr>
          <tr><td>24</td><td>Total Tax</td><td>$14,702</td><td>$13,887</td></tr>
          <tr><td>25a</td><td>Federal Tax Withheld</td><td>$18,340</td><td>$17,600</td></tr>
          <tr><td>35a</td><td><strong>Refund</strong></td><td><strong>$3,638</strong></td><td><strong>$3,713</strong></td></tr>
        </tbody>
      </table>
    </div>`, loanNumber);
}

function purchaseContract(loanNumber, borrowerName) {
  const name = borrowerName ? borrowerName.replace(/([a-z])([A-Z])/g, '$1 $2') : 'John Daniel Doe';
  return page(`
    ${loanHeader(loanNumber, borrowerName, 'Arizona Real Estate Purchase Contract')}
    <div class="stamp">EXECUTED</div>
    <div class="section">
      <div class="section-title">Parties</div>
      <div class="field-grid-2">
        <div class="field"><label>Buyer(s)</label><div class="value">${name}</div></div>
        <div class="field"><label>Seller(s)</label><div class="value">Brian Joseph Garrett &amp; Lisa Marie Garrett</div></div>
        <div class="field"><label>Buyer's Agent</label><div class="value">Amanda Reyes, Realty ONE Group</div></div>
        <div class="field"><label>Seller's Agent</label><div class="value">David Kim, Coldwell Banker</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Property &amp; Price</div>
      <div class="field-grid">
        <div class="field"><label>Property Address</label><div class="value">8821 N 34th Ave, Phoenix, AZ 85051</div></div>
        <div class="field"><label>APN</label><div class="value">149-33-022-0</div></div>
        <div class="field"><label>Legal Description</label><div class="value">Lot 22, Blk 4, Camelback Heights</div></div>
        <div class="field"><label>Purchase Price</label><div class="value" style="font-size:14px;font-weight:700;color:#1a3a5c;">$465,000.00</div></div>
        <div class="field"><label>Earnest Money</label><div class="value">$5,000.00</div></div>
        <div class="field"><label>Down Payment</label><div class="value">$16,275.00 (3.5%)</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Key Dates &amp; Contingencies</div>
      <table>
        <thead><tr><th>Milestone</th><th>Date</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>Contract Execution Date</td><td>February 28, 2026</td><td><span class="badge badge-green">Complete</span></td></tr>
          <tr><td>Inspection Period Ends</td><td>March 7, 2026</td><td><span class="badge badge-green">Complete</span></td></tr>
          <tr><td>Loan Approval Deadline</td><td>March 21, 2026</td><td><span class="badge badge-green">Complete</span></td></tr>
          <tr><td>Appraisal Deadline</td><td>March 14, 2026</td><td><span class="badge badge-green">Complete</span></td></tr>
          <tr><td>Close of Escrow</td><td>April 1, 2026</td><td><span class="badge badge-blue">Pending</span></td></tr>
        </tbody>
      </table>
    </div>`, loanNumber);
}

function floodCert(loanNumber, borrowerName) {
  return page(`
    ${loanHeader(loanNumber, borrowerName, 'Standard Flood Hazard Determination (SFHD)')}
    <div class="stamp">CERTIFIED</div>
    <div class="section">
      <div class="section-title">Property Information</div>
      <div class="field-grid">
        <div class="field"><label>Property Address</label><div class="value">8821 N 34th Ave, Phoenix, AZ 85051</div></div>
        <div class="field"><label>Community Name</label><div class="value">City of Phoenix</div></div>
        <div class="field"><label>Community Number</label><div class="value">040076</div></div>
        <div class="field"><label>Map Panel Number</label><div class="value">04013C2125L</div></div>
        <div class="field"><label>Map Revision Date</label><div class="value">October 3, 2014</div></div>
        <div class="field"><label>Determination Date</label><div class="value">${new Date().toLocaleDateString()}</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Flood Zone Determination</div>
      <div class="field-grid-2">
        <div class="field"><label>Flood Zone</label><div class="value" style="font-size:16px;font-weight:700;color:#1a3a5c;">X (Unshaded)</div></div>
        <div class="field"><label>NFIP Community Status</label><div class="value">Regular Program — In Good Standing</div></div>
        <div class="field"><label>Flood Insurance Required?</label><div class="value" style="font-weight:700;color:#065f46;">NO — Zone X is minimal flood hazard</div></div>
        <div class="field"><label>Special Flood Hazard Area</label><div class="value">No</div></div>
      </div>
    </div>
    <div class="highlight" style="border-color:#2d7a3a;background:#f0fdf4;">
      ✓ Property is located in FEMA Flood Zone X — outside the 100-year floodplain. Federal flood insurance is <strong>NOT required</strong> for this transaction.
    </div>
    <div class="section" style="margin-top:16px;">
      <div class="section-title">Certification</div>
      <div class="field-grid">
        <div class="field"><label>Determination Vendor</label><div class="value">ServiceLink Flood — FEMA Certified</div></div>
        <div class="field"><label>Certificate Number</label><div class="value">SLF-2026-${loanNumber}-001</div></div>
        <div class="field"><label>Life of Loan Tracking</label><div class="value">Yes — CMG Financial</div></div>
      </div>
    </div>`, loanNumber);
}

function rateLock(loanNumber, borrowerName) {
  const name = borrowerName ? borrowerName.replace(/([a-z])([A-Z])/g, '$1 $2') : 'John Daniel Doe';
  const expiry = new Date(Date.now() + 30*86400000).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
  return page(`
    ${loanHeader(loanNumber, borrowerName, 'Rate Lock Confirmation')}
    <div class="highlight" style="border-color:#1a3a5c;background:#f0f4ff;">
      <strong>Rate Lock Active</strong> — Your interest rate has been locked. Expires: <strong>${expiry}</strong>
    </div>
    <div class="section">
      <div class="section-title">Lock Terms</div>
      <div class="field-grid">
        <div class="field"><label>Borrower</label><div class="value">${name}</div></div>
        <div class="field"><label>Loan Number</label><div class="value">${loanNumber}</div></div>
        <div class="field"><label>Loan Type</label><div class="value">FHA 30-Year Fixed</div></div>
        <div class="field"><label>Interest Rate</label><div class="value" style="font-size:16px;font-weight:700;color:#1a3a5c;">6.875%</div></div>
        <div class="field"><label>APR</label><div class="value">7.102%</div></div>
        <div class="field"><label>Points</label><div class="value">0.000 (No Points)</div></div>
        <div class="field"><label>Lock Period</label><div class="value">45 Days</div></div>
        <div class="field"><label>Lock Date</label><div class="value">${new Date(Date.now() - 15*86400000).toLocaleDateString()}</div></div>
        <div class="field"><label>Expiration Date</label><div class="value" style="font-weight:700;">${expiry}</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Loan Parameters</div>
      <div class="field-grid">
        <div class="field"><label>Loan Amount</label><div class="value">$448,725</div></div>
        <div class="field"><label>LTV</label><div class="value">96.5%</div></div>
        <div class="field"><label>Property Type</label><div class="value">SFR — Primary Residence</div></div>
        <div class="field"><label>FICO Score Used</label><div class="value">742</div></div>
        <div class="field"><label>Monthly P&amp;I</label><div class="value">$2,944.16</div></div>
        <div class="field"><label>Investor</label><div class="value">FHA / HUD</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Lock Confirmation</div>
      <div class="field-grid-2">
        <div class="field"><label>Locked By</label><div class="value">KylieGrossman — CMG Lock Desk</div></div>
        <div class="field"><label>Confirmation #</label><div class="value">CMG-LOCK-${loanNumber}-2026</div></div>
      </div>
    </div>`, loanNumber);
}

function investmentStatements(loanNumber, borrowerName) {
  const name = borrowerName ? borrowerName.replace(/([a-z])([A-Z])/g, '$1 $2') : 'John Daniel Doe';
  return page(`
    ${loanHeader(loanNumber, borrowerName, 'Investment / Retirement Account Statement')}
    <div class="stamp">VERIFIED</div>
    <div class="section">
      <div class="section-title">Account Details</div>
      <div class="field-grid">
        <div class="field"><label>Institution</label><div class="value">Fidelity Investments</div></div>
        <div class="field"><label>Account Holder</label><div class="value">${name}</div></div>
        <div class="field"><label>Account Type</label><div class="value">401(k) — Employer Plan</div></div>
        <div class="field"><label>Account Number</label><div class="value">****2290</div></div>
        <div class="field"><label>Statement Date</label><div class="value">${new Date().toLocaleDateString()}</div></div>
        <div class="field"><label>Total Account Value</label><div class="value" style="font-size:14px;font-weight:700;color:#1a3a5c;">$87,340.00</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Holdings</div>
      <table>
        <thead><tr><th>Fund</th><th>Shares</th><th>Price</th><th>Value</th><th>% Alloc</th></tr></thead>
        <tbody>
          <tr><td>Fidelity 500 Index (FXAIX)</td><td>142.4</td><td>$218.72</td><td>$31,145.73</td><td>35.7%</td></tr>
          <tr><td>Fidelity Total Market (FSKAX)</td><td>214.8</td><td>$112.44</td><td>$24,152.11</td><td>27.6%</td></tr>
          <tr><td>Vanguard Target 2045 (VTIVX)</td><td>388.2</td><td>$42.18</td><td>$16,374.88</td><td>18.8%</td></tr>
          <tr><td>Money Market (FDRXX)</td><td>—</td><td>$1.00</td><td>$15,667.28</td><td>17.9%</td></tr>
        </tbody>
      </table>
    </div>
    <div class="section">
      <div class="section-title">Qualifying Asset Note</div>
      <div class="highlight">Per agency guidelines, 60% of vested retirement balance ($52,404) may be used as qualifying assets for this transaction.</div>
    </div>`, loanNumber);
}

function genericDoc(loanNumber, borrowerName, docType) {
  return page(`
    ${loanHeader(loanNumber, borrowerName, docType)}
    <div class="section">
      <div class="section-title">Document Information</div>
      <div class="field-grid">
        <div class="field"><label>Document Type</label><div class="value">${docType}</div></div>
        <div class="field"><label>Loan Number</label><div class="value">${loanNumber}</div></div>
        <div class="field"><label>Date</label><div class="value">${new Date().toLocaleDateString()}</div></div>
        <div class="field"><label>Status</label><div class="value">Approved</div></div>
        <div class="field"><label>Source</label><div class="value">BytePro LOS — Imported from LOS</div></div>
        <div class="field"><label>Uploaded By</label><div class="value">SVC-BytePushback-PROD</div></div>
      </div>
    </div>
    <div class="highlight">
      This is a demo preview for <strong>${docType}</strong>. A dedicated document template will be configured when the CMG Doc API integration is active.
    </div>
    <div class="section" style="margin-top:16px;">
      <div class="section-title">Borrower</div>
      <div class="field-grid-2">
        <div class="field"><label>Name</label><div class="value">${borrowerName ? borrowerName.replace(/([a-z])([A-Z])/g, '$1 $2') : 'John Daniel Doe'}</div></div>
        <div class="field"><label>Property</label><div class="value">8821 N 34th Ave, Phoenix, AZ 85051</div></div>
      </div>
    </div>`, loanNumber);
}

// ─── Router ──────────────────────────────────────────────────────────────────

export function generateDocHtml(docType, loanNumber, borrowerName) {
  const t = docType.toLowerCase();
  if (t.includes('w-2') || t.includes('w2'))                    return w2(loanNumber, borrowerName);
  if (t.includes('pay stub') || t.includes('paystub'))           return payStubs(loanNumber, borrowerName);
  if (t.includes('credit report'))                               return creditReport(loanNumber, borrowerName);
  if (t.includes('appraisal'))                                   return appraisal(loanNumber, borrowerName);
  if (t.includes('closing disclosure'))                          return closingDisclosure(loanNumber, borrowerName);
  if (t.includes('promissory note'))                             return promissoryNote(loanNumber, borrowerName);
  if (t.includes('rescission') || t.includes('right to cancel')) return rightOfRescission(loanNumber, borrowerName);
  if (t.includes('1003') || t.includes('loan application'))      return application1003(loanNumber, borrowerName);
  if (t.includes('bank statement'))                              return bankStatements(loanNumber, borrowerName);
  if (t.includes('title') || t.includes('cpl'))                  return titleReport(loanNumber, borrowerName);
  if (t.includes('hoi') || t.includes('homeowner'))              return hoiPolicy(loanNumber, borrowerName);
  if (t.includes('gift letter'))                                 return giftLetter(loanNumber, borrowerName);
  if (t.includes('tax return') || t.includes('1040'))            return taxReturns(loanNumber, borrowerName);
  if (t.includes('purchase contract'))                           return purchaseContract(loanNumber, borrowerName);
  if (t.includes('flood'))                                       return floodCert(loanNumber, borrowerName);
  if (t.includes('rate lock') || t.includes('lock rate'))        return rateLock(loanNumber, borrowerName);
  if (t.includes('investment') || t.includes('retirement'))      return investmentStatements(loanNumber, borrowerName);
  return genericDoc(loanNumber, borrowerName, docType);
}

/**
 * Opens a realistic mock document preview in a new browser tab.
 * @param {string} docType  - The document type label from the stacking order
 * @param {string} loanNumber - The subject loan number
 * @param {string} borrowerName - The borrower name string
 */
export function openDocPreview(docType, loanNumber, borrowerName) {
  const html = generateDocHtml(docType, loanNumber, borrowerName);
  const tab = window.open('', '_blank');
  if (tab) {
    tab.document.write(html);
    tab.document.close();
  }
}

/**
 * Downloads a realistic mock document as an HTML file.
 * Uses the same generator as openDocPreview — same templates, same loan data,
 * but triggers a browser file download instead of opening a new tab.
 * @param {string} docType    - Document type label (used to route to the right template)
 * @param {string} filename   - The base filename for the downloaded file
 * @param {string} loanNumber - Subject loan number
 * @param {string} borrowerName - Borrower name string
 */
export function downloadDocPreview(docType, filename, loanNumber, borrowerName) {
  const html = generateDocHtml(docType, loanNumber, borrowerName);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
