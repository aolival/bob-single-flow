import React, { useState, useEffect } from 'react';
import { RefreshCw, Download, CheckCircle, XCircle, Loader2, Upload, File, X, Search } from 'lucide-react';
import { getLoanDocumentStatus } from '../services/epsDocumentApi';

const BoBSingleFlow = () => {
  const [subjectLoan, setSubjectLoan] = useState('');
  const [bundleName, setBundleName] = useState('');
  const [borrowerName, setBorrowerName] = useState('');
  const [pdfBundleName, setPdfBundleName] = useState('');
  const [stackingOrder, setStackingOrder] = useState([]);
  const [activeStatusTab, setActiveStatusTab] = useState('all');
  const [fieldsLocked, setFieldsLocked] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildComplete, setBuildComplete] = useState(false);
  const [buildError, setBuildError] = useState(false);
  const [buildErrorDetails, setBuildErrorDetails] = useState('');
  const [bundleDownloadReady, setBundleDownloadReady] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [hideNotApplicableDocs, setHideNotApplicableDocs] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [loanValidated, setLoanValidated] = useState(false);

  // Read loan number and bundle name from URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const loanParam = urlParams.get('loan');
    const bundleParam = urlParams.get('bundle');

    if (loanParam) {
      setSubjectLoan(loanParam);
      setLoanValidated(true); // Mark as validated when loaded from URL
    }
    if (bundleParam) {
      setBundleName(bundleParam);
    }

    // Auto-load stacking order if both parameters are present
    if (loanParam && bundleParam) {
      // Small delay to ensure state is updated
      setTimeout(async () => {
        setValidationError('');
        setFieldsLocked(true);
        setIsLoadingDocuments(true);
        const docs = await generateStackingOrder(loanParam, bundleParam);
        setStackingOrder(docs);

        // Fetch borrower name and set PDF bundle name
        const mockBorrowerName = 'johndanieldoe'; // TODO: Fetch from API
        setBorrowerName(mockBorrowerName);
        const formattedBundleName = bundleParam.toLowerCase().replace(/ /g, '');
        setPdfBundleName(`${mockBorrowerName}-${loanParam}-${formattedBundleName}.pdf`);

        setIsLoadingDocuments(false);
      }, 100);
    }
  }, []);

  // Bundle Names from dbo.Bundle (~80 options)
  const bundleOptions = [
    "C2C - QC Bundle", "Docs Back - QC Bundle", "Funded - QC Bundle",
    "Agency Due Diligence", "AIG", "Ally", "AmeriHome", "Axos", "Bank of America",
    "Bank of England", "Barclays", "Caliber", "CarringtonMS", "Chase", "Citibank",
    "Citizens", "Comerica", "Community Lending", "Correspondent One", "CrossCountry",
    "Deutsche Bank", "Discover", "Flagstar", "FNMA Audit", "Freedom Mortgage",
    "GMAC", "Goldman Sachs", "Guaranty Bank", "Guild Mortgage", "Harbor",
    "Homebridge", "Homepoint", "HomeStar", "Huntington", "InFirst",
    "JP Morgan Chase", "Keybank", "Lakeview", "Liberty", "LoanCare",
    "M&T Bank", "Matrix", "Merchants", "Morgan Stanley", "Movement Mortgage",
    "Mr. Cooper", "Nations Direct", "Nations Lending", "Nationstar",
    "New Penn Financial", "NewRez", "Norcom", "Northpointe", "Oakmont",
    "Ocwen", "OnQ", "Pennymac", "PHH", "PNC", "Provident", "Quicken Loans",
    "RBS", "Regions", "Rocket Mortgage Bundle", "RoundPoint", "Santander",
    "Select Portfolio", "Shellpoint", "SunTrust", "Suntrust Mortgage",
    "SurePoint", "Synovus", "TCF", "TD Bank", "Texas Capital", "TIAA",
    "Truist", "U.S. Bank", "UBS", "Union Bank", "USAA", "Velocity",
    "Wachovia", "Wells Fargo", "WHEDA (WI Housing)", "Wilmington Trust",
    "Zions", "zFHA EBinder"
  ];

  // Generate stacking order using real EPS API
  const generateStackingOrder = async (loan, bundle) => {
    // Define required documents for this bundle (these would ideally come from dbo.Bundle API)
    const requiredDocuments = [
      { documentType: '1003 Application', category: 'Application', displayOrder: 1 },
      { documentType: 'Credit Report', category: 'Credit', displayOrder: 2 },
      { documentType: 'Appraisal', category: 'Property', displayOrder: 3 },
      { documentType: 'Title Insurance', category: 'Title', displayOrder: 4 },
      { documentType: 'W-2', category: 'Income', displayOrder: 5 },
      { documentType: 'Pay Stubs', category: 'Income', displayOrder: 6 },
      { documentType: 'Tax Returns', category: 'Income', displayOrder: 7 },
      { documentType: 'Self-Employment Income', category: 'Income', displayOrder: 8 },
      { documentType: 'Bank Statements', category: 'Assets', displayOrder: 9 },
      { documentType: 'Investment Statements', category: 'Assets', displayOrder: 10 },
      { documentType: 'Gift Letter', category: 'Assets', displayOrder: 11 },
      { documentType: 'Closing Disclosure', category: 'Closing', displayOrder: 12 },
      { documentType: 'Promissory Note', category: 'Closing', displayOrder: 13 },
      { documentType: 'Right of Rescission', category: 'Closing', displayOrder: 14 },
    ];

    try {
      console.log(`📄 Fetching documents for loan: ${loan} (Bundle: ${bundle})`);

      // Call real EPS API
      const status = await getLoanDocumentStatus(loan, requiredDocuments);

      console.log(`✅ API Response:`, status);
      console.log(`   - Total Required: ${status.totalRequired}`);
      console.log(`   - Found: ${status.foundCount}`);
      console.log(`   - Missing: ${status.missingCount}`);

      // Map API response to component format
      const documents = status.documentStatus.map(doc => ({
        category: doc.category,
        documentType: doc.documentType,
        status: doc.status, // 'Found' or 'Missing' from real API
        displayOrder: doc.displayOrder,
        foundCount: doc.foundCount,
        documents: doc.documents, // Actual document objects from API
      }));

      return documents;
    } catch (error) {
      console.error('❌ Error fetching documents from EPS API:', error);

      // Fallback: show all documents as Missing if API fails
      return requiredDocuments.map(doc => ({
        ...doc,
        status: 'Missing',
        foundCount: 0,
        documents: [],
      }));
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload only PDF files');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadSubmit = () => {
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    // Simulate file upload
    const newFile = {
      id: Date.now(),
      name: selectedFile.name,
      size: (selectedFile.size / 1024).toFixed(2) + ' KB',
      uploadDate: new Date().toLocaleString()
    };

    setUploadedFiles([...uploadedFiles, newFile]);
    setSelectedFile(null);
    setShowUploadModal(false);
    alert(`File "${selectedFile.name}" uploaded successfully!`);
  };

  const handleRemoveFile = (fileId) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId));
  };

  const handleLoadStackingOrder = async () => {
    // Validation should already be done at this point
    if (!loanValidated || !bundleName) {
      setValidationError('Please ensure loan number is validated and bundle is selected');
      return;
    }

    setValidationError('');
    setFieldsLocked(true);
    setIsLoadingDocuments(true);

    try {
      // Generate stacking order (now async with real API!)
      const docs = await generateStackingOrder(subjectLoan, bundleName);
      setStackingOrder(docs);

      // Fetch borrower name (mock for now - would come from EPS API)
      const mockBorrowerName = 'johndanieldoe'; // TODO: Fetch from API
      setBorrowerName(mockBorrowerName);

      // Set PDF Bundle Name (format: borrowername-loannumber-bundlename.pdf)
      const formattedBundleName = bundleName.toLowerCase().replace(/ /g, '');
      setPdfBundleName(`${mockBorrowerName}-${subjectLoan}-${formattedBundleName}.pdf`);
    } catch (error) {
      setValidationError(`Error loading documents: ${error.message}`);
      setFieldsLocked(false);
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  const handleBuildBundle = () => {
    setIsBuilding(true);
    setBuildComplete(false);
    setBuildError(false);
    setBuildErrorDetails('');
    setBundleDownloadReady(false);

    // Simulate bundle build process (2-5 seconds)
    const buildTime = Math.random() * 3000 + 2000;
    const shouldFail = Math.random() < 0.15; // 15% chance of failure for demo

    setTimeout(() => {
      setIsBuilding(false);
      if (shouldFail) {
        // Generate detailed error message
        const errors = [
          'Document stacking order could not be retrieved from database',
          'PDF generation service is temporarily unavailable',
          'Required document template is missing for this bundle type',
          'Network timeout while connecting to document storage',
          'Insufficient permissions to access document repository'
        ];
        const randomError = errors[Math.floor(Math.random() * errors.length)];
        setBuildErrorDetails(randomError);
        setBuildError(true);
      } else {
        setBuildComplete(true);
        setBundleDownloadReady(true);
      }
    }, buildTime);
  };

  const handleRebuildBundle = () => {
    setBuildError(false);
    setBuildErrorDetails('');
    handleBuildBundle();
  };

  const handleCancelError = () => {
    setBuildError(false);
    handleStartNew();
  };

  const handleDownloadBundle = () => {
    // Simulate download
    alert(`Downloading: ${pdfBundleName}`);
    // In production, this would trigger actual PDF download from dbo.Bundle.ServerFolderName
  };

  const handleLoanNumberValidation = () => {
    // Only validate when user presses Enter
    if (!subjectLoan.trim()) {
      setValidationError('Invalid Loan Number. Please Check and Try Again');
      setLoanValidated(false);
      return;
    }

    // Check for multiple loan numbers
    const hasMultipleLoans = /[\s,;|\t\n\r]+/.test(subjectLoan.trim());
    if (hasMultipleLoans) {
      setValidationError('Invalid Loan Number. Please Check and Try Again');
      setLoanValidated(false);
      return;
    }

    // Validate loan number format
    const loanNumberPattern = /^[A-Za-z]+[0-9]+$/;
    if (!loanNumberPattern.test(subjectLoan.trim())) {
      setValidationError('Invalid Loan Number. Please Check and Try Again');
      setLoanValidated(false);
      return;
    }

    // Validation passed - show bundle dropdown
    setValidationError('');
    setLoanValidated(true);
  };

  const handleStartNew = () => {
    setSubjectLoan('');
    setBundleName('');
    setBorrowerName('');
    setPdfBundleName('');
    setStackingOrder([]);
    setActiveStatusTab('all');
    setFieldsLocked(false);
    setBuildComplete(false);
    setBuildError(false);
    setBundleDownloadReady(false);
    setValidationError('');
    setLoanValidated(false);
  };

  const getFilteredDocs = () => {
    let docs = stackingOrder;

    // Filter by status tab
    if (activeStatusTab === 'missing') {
      docs = docs.filter(d => d.status === 'Missing');
    } else if (activeStatusTab === 'found') {
      docs = docs.filter(d => d.status === 'Found');
    }

    // Filter out N/A docs if checkbox is checked
    if (hideNotApplicableDocs) {
      docs = docs.filter(d => d.status !== 'N/A');
    }

    return docs;
  };

  const filteredDocs = getFilteredDocs();
  const missingCount = stackingOrder.filter(d => d.status === 'Missing').length;
  const foundCount = stackingOrder.filter(d => d.status === 'Found').length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="clearGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#67E8F9', stopOpacity: 1}} />
                <stop offset="50%" style={{stopColor: '#14B8A6', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#84CC16', stopOpacity: 1}} />
              </linearGradient>
            </defs>
            <text x="0" y="30" fontSize="32" fontWeight="700" fill="url(#clearGradient)" fontFamily="system-ui, -apple-system, sans-serif">C</text>
            <text x="22" y="30" fontSize="32" fontWeight="700" fill="#374151" fontFamily="system-ui, -apple-system, sans-serif">lear</text>
          </svg>
        </div>
        <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
          AO
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Bundle Builder - Single Loan Delivery
        </h1>

        {/* Selection Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="space-y-6 max-w-3xl">
              {/* Subject Loan - Always show first */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Subject Loan
                </label>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center px-3 pointer-events-none">
                    {!subjectLoan && !fieldsLocked && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Search size={16} />
                        <span className="text-sm">Search for and select a loan to build a bundle</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    value={subjectLoan}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSubjectLoan(value);
                      // Clear validation error when user types
                      if (validationError) {
                        setValidationError('');
                      }
                      // Reset validation state when user modifies the field
                      if (loanValidated) {
                        setLoanValidated(false);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleLoanNumberValidation();
                      }
                    }}
                    disabled={fieldsLocked}
                    className="w-full px-3 py-2 border border-gray-300 rounded disabled:bg-gray-200 disabled:text-gray-600 disabled:cursor-not-allowed bg-transparent relative z-10"
                  />
                </div>
              </div>

              {/* Bundle Name and PDF Bundle Name - Show when loan is validated */}
              {loanValidated && (
                <div className={`grid ${bundleName ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Bundle
                    </label>
                    <select
                      value={bundleName}
                      onChange={(e) => {
                        const selectedBundle = e.target.value;
                        setBundleName(selectedBundle);
                        // Auto-generate PDF bundle name when bundle is selected
                        if (selectedBundle) {
                          const mockBorrowerName = 'johndanieldoe'; // TODO: Fetch from API
                          const formattedBundleName = selectedBundle.toLowerCase().replace(/ /g, '');
                          setPdfBundleName(`${mockBorrowerName}-${subjectLoan}-${formattedBundleName}.pdf`);
                          setBorrowerName(mockBorrowerName);
                        } else {
                          setPdfBundleName('');
                        }
                      }}
                      disabled={fieldsLocked}
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-white disabled:bg-gray-200 disabled:text-gray-600 disabled:cursor-not-allowed"
                    >
                      <option value="">Select</option>
                      {bundleOptions.slice(3).map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  {/* PDF Bundle Name - Show only after bundle is selected */}
                  {bundleName && (
                    <div className="flex items-end">
                      <input
                        type="text"
                        value={pdfBundleName}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-600"
                        placeholder="Auto-generated"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Validation Error - Only show when explicitly set by handleLoadStackingOrder */}
            {validationError && stackingOrder.length === 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
                {validationError}
              </div>
            )}

            {/* Action Buttons - Show when bundle is selected */}
            {loanValidated && bundleName && (
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={handleStartNew}
                  className="px-8 py-2.5 bg-teal-50 text-teal-600 rounded-full hover:bg-teal-100 font-medium border border-teal-200"
                >
                  Start New Bundle
                </button>
                <button
                  onClick={handleLoadStackingOrder}
                  disabled={isLoadingDocuments || fieldsLocked}
                  className="px-8 py-2.5 bg-teal-700 text-white rounded-full hover:bg-teal-800 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoadingDocuments ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={18} />
                      Building...
                    </span>
                  ) : (
                    'Build Bundle'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stacking Order Display */}
        {stackingOrder.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold text-teal-600">
                Stacking Order - {subjectLoan}
              </h2>
              {bundleDownloadReady && (
                <div className="flex items-center gap-3">
                  <span className="text-green-600 font-medium flex items-center gap-2">
                    <CheckCircle size={20} />
                    Subject Bundle Available
                  </span>
                  <button
                    onClick={handleDownloadBundle}
                    className="flex items-center space-x-2 px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 font-medium"
                  >
                    <Download size={16} />
                    <span>Download Bundle</span>
                  </button>
                </div>
              )}
            </div>

            <div className="p-4">
              {/* Status Tabs and Actions */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveStatusTab('all')}
                    className={`px-4 py-2 rounded font-medium ${
                      activeStatusTab === 'all'
                        ? 'bg-gray-200 text-gray-800'
                        : 'bg-white border border-gray-300 text-gray-600'
                    }`}
                  >
                    All {stackingOrder.length > 0 && <span className="ml-1">({stackingOrder.length})</span>}
                  </button>
                  <button
                    onClick={() => setActiveStatusTab('missing')}
                    className={`px-4 py-2 rounded font-medium flex items-center ${
                      activeStatusTab === 'missing'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-white border border-gray-300 text-gray-600'
                    }`}
                  >
                    Missing {missingCount > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-semibold">{missingCount}</span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveStatusTab('found')}
                    className={`px-4 py-2 rounded font-medium ${
                      activeStatusTab === 'found'
                        ? 'bg-gray-200 text-gray-800'
                        : 'bg-white border border-gray-300 text-gray-600'
                    }`}
                  >
                    Found {foundCount > 0 && <span className="ml-1">({foundCount})</span>}
                  </button>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={hideNotApplicableDocs}
                      onChange={(e) => setHideNotApplicableDocs(e.target.checked)}
                      className="rounded accent-teal-600"
                    />
                    <span>Hide Not Applicable Docs</span>
                  </label>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-teal-100 text-teal-700 rounded hover:bg-teal-200 font-medium"
                  >
                    <Upload size={16} />
                    <span>Upload Document</span>
                  </button>
                </div>
              </div>

              {/* Documents Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDocs.map((doc, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <a
                            href={`#docs-manager?type=${encodeURIComponent(doc.documentType)}&loan=${encodeURIComponent(subjectLoan)}`}
                            className="text-teal-600 hover:text-teal-800 font-medium underline"
                          >
                            {doc.documentType}
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-sm font-medium ${
                            doc.status === 'Found'
                              ? 'bg-gray-100 text-gray-800'
                              : doc.status === 'Missing'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{doc.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Build Bundle Button */}
              {!buildComplete && !isBuilding && (
                <div className="flex justify-end mt-6 pt-4 border-t">
                  <button
                    onClick={handleBuildBundle}
                    disabled={missingCount > 0}
                    className="px-6 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Build Bundle
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Building Bundle Modal */}
      {isBuilding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96 text-center">
            <Loader2 className="animate-spin mx-auto mb-4 text-teal-600" size={48} />
            <h3 className="text-xl font-semibold mb-2">Building Bundle</h3>
            <p className="text-gray-600">Please wait while your bundle is being created...</p>
          </div>
        </div>
      )}

      {/* Build Success Modal */}
      {buildComplete && !bundleDownloadReady && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="text-green-600" size={32} />
              <h3 className="text-xl font-semibold">Bundle has been Created</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Your bundle has been successfully created and is ready for download.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setBundleDownloadReady(true);
                  setBuildComplete(false);
                }}
                className="flex-1 px-6 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 font-medium"
              >
                Download Bundle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Build Error Modal */}
      {buildError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px]">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="text-red-600" size={32} />
              <h3 className="text-xl font-semibold">Build Failed</h3>
            </div>
            <div className="mb-6">
              <p className="text-gray-600 mb-3">
                An error occurred. Build could not complete. Please click "Re-Build Bundle" to try again.
              </p>
              {buildErrorDetails && (
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm font-semibold text-red-800 mb-1">Error Details:</p>
                  <p className="text-sm text-red-700">{buildErrorDetails}</p>
                </div>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCancelError}
                className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleRebuildBundle}
                className="flex-1 px-6 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 font-medium"
              >
                Re-Build Bundle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px]">
            <h3 className="text-lg font-semibold mb-4">Upload Supplemental Document</h3>
            <p className="text-sm text-gray-600 mb-4">Upload additional documents to supplement the bundle (PDF only)</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select PDF File</label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              {selectedFile && (
                <div className="mt-2 p-2 bg-teal-50 border border-teal-200 rounded flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <File size={16} className="text-teal-600" />
                    <span className="text-sm text-teal-800">{selectedFile.name}</span>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-teal-600 hover:text-teal-800"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</p>
                <div className="space-y-2">
                  {uploadedFiles.map(file => (
                    <div key={file.id} className="p-2 bg-gray-50 border border-gray-200 rounded flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <File size={16} className="text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-800">{file.name}</p>
                          <p className="text-xs text-gray-500">{file.size} - {file.uploadDate}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(file.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                }}
                className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium"
              >
                Close
              </button>
              <button
                onClick={handleUploadSubmit}
                className="flex-1 px-6 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 font-medium"
              >
                Upload File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoBSingleFlow;
