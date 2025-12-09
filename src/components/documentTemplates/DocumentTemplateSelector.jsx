import React from 'react';
import AppraisalTemplate from './AppraisalTemplate';
import W2Template from './W2Template';
import PaystubTemplate from './PaystubTemplate';
import CreditReportTemplate from './CreditReportTemplate';
import Application1003Template from './Application1003Template';
import TitleInsuranceTemplate from './TitleInsuranceTemplate';
import TaxReturnTemplate from './TaxReturnTemplate';
import BankStatementTemplate from './BankStatementTemplate';
import ClosingDisclosureTemplate from './ClosingDisclosureTemplate';
import SelfEmploymentIncomeTemplate from './SelfEmploymentIncomeTemplate';
import InvestmentStatementTemplate from './InvestmentStatementTemplate';
import GiftLetterTemplate from './GiftLetterTemplate';
import PromissoryNoteTemplate from './PromissoryNoteTemplate';
import RightOfRescissionTemplate from './RightOfRescissionTemplate';

/**
 * DocumentTemplateSelector - Displays realistic document templates based on document type
 *
 * This component analyzes the document name/type and renders the appropriate
 * realistic mortgage document template with dummy data
 */
const DocumentTemplateSelector = ({ documentType, documentName, category }) => {
  // Normalize document name for matching
  const normalizedName = (documentName || documentType || '').toLowerCase();
  const normalizedCategory = (category || '').toLowerCase();

  // Appraisal Documents
  if (normalizedName.includes('appraisal') ||
      normalizedName.includes('urar') ||
      normalizedCategory.includes('property')) {
    return <AppraisalTemplate />;
  }

  // W-2 Forms
  if (normalizedName.includes('w-2') || normalizedName.includes('w2')) {
    // Extract year from document name if available
    const yearMatch = documentName.match(/20\d{2}/);
    const year = yearMatch ? yearMatch[0] : '2024';
    return <W2Template year={year} />;
  }

  // Paystubs
  if (normalizedName.includes('pay stub') ||
      normalizedName.includes('paystub') ||
      normalizedName.includes('pay check') ||
      normalizedName.includes('paycheck')) {
    return <PaystubTemplate />;
  }

  // Credit Reports
  if (normalizedName.includes('credit') ||
      normalizedName.includes('tri-merge') ||
      normalizedName.includes('trimerge') ||
      normalizedCategory.includes('credit')) {
    return <CreditReportTemplate />;
  }

  // 1003 Application
  if (normalizedName.includes('1003') ||
      normalizedName.includes('application') ||
      normalizedName.includes('urla') ||
      normalizedCategory.includes('application')) {
    return <Application1003Template />;
  }

  // Title Insurance
  if (normalizedName.includes('title') ||
      normalizedName.includes('commitment') ||
      normalizedName.includes('cpl') ||
      normalizedCategory.includes('title')) {
    return <TitleInsuranceTemplate />;
  }

  // Tax Returns
  if (normalizedName.includes('tax return') ||
      normalizedName.includes('1040') ||
      normalizedName.includes('tax transcript')) {
    // Extract year from document name if available
    const yearMatch = documentName.match(/20\d{2}/);
    const year = yearMatch ? yearMatch[0] : '2024';
    return <TaxReturnTemplate year={year} />;
  }

  // Bank Statements
  if (normalizedName.includes('bank statement') ||
      normalizedName.includes('checking') ||
      normalizedName.includes('savings') ||
      normalizedCategory.includes('asset')) {
    return <BankStatementTemplate />;
  }

  // Closing Disclosure
  if (normalizedName.includes('closing disclosure') ||
      normalizedName.includes('cd') ||
      normalizedCategory.includes('closing')) {
    return <ClosingDisclosureTemplate />;
  }

  // Self-Employment Income / Profit & Loss
  if (normalizedName.includes('self-employment') ||
      normalizedName.includes('self employment') ||
      normalizedName.includes('profit and loss') ||
      normalizedName.includes('profit & loss') ||
      normalizedName.includes('p&l') ||
      normalizedName.includes('p & l') ||
      normalizedCategory.includes('income')) {
    return <SelfEmploymentIncomeTemplate />;
  }

  // Investment Statements
  if (normalizedName.includes('investment') ||
      normalizedName.includes('401k') ||
      normalizedName.includes('401(k)') ||
      normalizedName.includes('ira') ||
      normalizedName.includes('brokerage') ||
      normalizedName.includes('retirement account') ||
      normalizedCategory.includes('investment')) {
    return <InvestmentStatementTemplate />;
  }

  // Gift Letter
  if (normalizedName.includes('gift letter') ||
      normalizedName.includes('gift funds') ||
      normalizedName.includes('donor') ||
      normalizedCategory.includes('gift')) {
    return <GiftLetterTemplate />;
  }

  // Promissory Note
  if (normalizedName.includes('promissory note') ||
      normalizedName.includes('note') ||
      normalizedCategory.includes('note')) {
    return <PromissoryNoteTemplate />;
  }

  // Right of Rescission
  if (normalizedName.includes('rescission') ||
      normalizedName.includes('right to cancel') ||
      normalizedName.includes('tila') ||
      normalizedName.includes('right of rescission') ||
      normalizedCategory.includes('rescission')) {
    return <RightOfRescissionTemplate />;
  }

  // Default fallback - show a generic document placeholder
  return (
    <div className="bg-white p-8 max-w-[8.5in] mx-auto font-sans">
      <div className="border-2 border-gray-300 rounded-lg p-6">
        <div className="flex items-center justify-center mb-4">
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-2">{documentType || 'Document'}</h2>
        <p className="text-center text-gray-500 mb-4">
          {documentName || 'Document Name'}
        </p>
        <div className="bg-gray-50 p-4 rounded text-sm text-gray-600">
          <p className="mb-2"><strong>Category:</strong> {category || 'N/A'}</p>
          <p className="mb-2"><strong>Status:</strong> Available for Review</p>
          <p className="mb-2"><strong>File Type:</strong> PDF</p>
          <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500">
            <p className="text-xs">
              <strong>Demo Note:</strong> This is a placeholder for document types that don't have a specific template yet.
              In production, the actual PDF from the Byte API will be displayed here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentTemplateSelector;
