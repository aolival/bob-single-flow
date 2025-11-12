import React, { useState, useEffect } from 'react';
import { RefreshCw, Download, CheckCircle, XCircle, Loader2, Upload, File, X } from 'lucide-react';

const BoBSingleFlow = () => {
  const [subjectLoan, setSubjectLoan] = useState('');
  const [bundleName, setBundleName] = useState('');
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

  // Read loan number and bundle name from URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const loanParam = urlParams.get('loan');
    const bundleParam = urlParams.get('bundle');

    if (loanParam) {
      setSubjectLoan(loanParam);
    }
    if (bundleParam) {
      setBundleName(bundleParam);
    }

    // Auto-load stacking order if both parameters are present
    if (loanParam && bundleParam) {
      // Small delay to ensure state is updated
      setTimeout(() => {
        setValidationError('');
        setFieldsLocked(true);
        const docs = generateStackingOrder(loanParam, bundleParam);
        setStackingOrder(docs);
        setPdfBundleName(`${bundleParam.replace(/ /g, '_')}_${loanParam}.pdf`);
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

  // Generate mock stacking order based on bundle selection
  const generateStackingOrder = (loan, bundle) => {
    const mockDocuments = [
      { category: 'Title', documentType: '1003 Application', status: 'Found', displayOrder: 1 },
      { category: 'Title', documentType: 'Credit Report', status: 'Found', displayOrder: 2 },
      { category: 'Title', documentType: 'Appraisal', status: 'Missing', displayOrder: 3 },
      { category: 'Title', documentType: 'Title Insurance', status: 'N/A', displayOrder: 4 },
      { category: 'Income', documentType: 'W-2', status: 'Found', displayOrder: 5 },
      { category: 'Income', documentType: 'Pay Stubs', status: 'Found', displayOrder: 6 },
      { category: 'Income', documentType: 'Tax Returns', status: 'Missing', displayOrder: 7 },
      { category: 'Income', documentType: 'Self-Employment Income', status: 'N/A', displayOrder: 8 },
      { category: 'Assets', documentType: 'Bank Statements', status: 'Found', displayOrder: 9 },
      { category: 'Assets', documentType: 'Investment Statements', status: 'Found', displayOrder: 10 },
      { category: 'Assets', documentType: 'Gift Letter', status: 'N/A', displayOrder: 11 },
      { category: 'Closing', documentType: 'Closing Disclosure', status: 'Found', displayOrder: 12 },
      { category: 'Closing', documentType: 'Promissory Note', status: 'Found', displayOrder: 13 },
      { category: 'Closing', documentType: 'Right of Rescission', status: 'N/A', displayOrder: 14 },
    ];
    return mockDocuments;
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

  const handleLoadStackingOrder = () => {
    // Validation
    if (!subjectLoan.trim()) {
      setValidationError('Please enter a Subject Loan number');
      return;
    }
    if (!bundleName) {
      setValidationError('Please select a bundle name');
      return;
    }

    setValidationError('');
    setFieldsLocked(true);

    // Generate stacking order
    const docs = generateStackingOrder(subjectLoan, bundleName);
    setStackingOrder(docs);

    // Set PDF Bundle Name (from dbo.Bundle.OutputFileNameFormat)
    setPdfBundleName(`${bundleName.replace(/ /g, '_')}_${subjectLoan}.pdf`);
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

  const handleStartNew = () => {
    setSubjectLoan('');
    setBundleName('');
    setPdfBundleName('');
    setStackingOrder([]);
    setActiveStatusTab('all');
    setFieldsLocked(false);
    setBuildComplete(false);
    setBuildError(false);
    setBundleDownloadReady(false);
    setValidationError('');
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
            <div className="grid grid-cols-3 gap-6">
              {/* Subject Loan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Subject Loan
                </label>
                <input
                  type="text"
                  value={subjectLoan}
                  onChange={(e) => setSubjectLoan(e.target.value)}
                  disabled={fieldsLocked}
                  placeholder="Enter loan number"
                  className="w-full px-3 py-2 border border-gray-300 rounded disabled:bg-gray-200 disabled:text-gray-600 disabled:cursor-not-allowed"
                />
              </div>

              {/* Bundle Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Bundle
                </label>
                <select
                  value={bundleName}
                  onChange={(e) => setBundleName(e.target.value)}
                  disabled={fieldsLocked}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-white disabled:bg-gray-200 disabled:text-gray-600 disabled:cursor-not-allowed"
                >
                  <option value="">Select Bundle</option>
                  <option value="C2C - QC Bundle" style={{fontWeight: 'bold'}}>C2C - QC Bundle</option>
                  <option value="Docs Back - QC Bundle" style={{fontWeight: 'bold'}}>Docs Back - QC Bundle</option>
                  <option value="Funded - QC Bundle" style={{fontWeight: 'bold'}}>Funded - QC Bundle</option>
                  {bundleOptions.slice(3).map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* PDF Bundle Name (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PDF Bundle Name
                </label>
                <input
                  type="text"
                  value={pdfBundleName}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-600"
                  placeholder="Auto-generated"
                />
              </div>
            </div>

            {/* Validation Error */}
            {validationError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
                {validationError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              {stackingOrder.length > 0 && (
                <button
                  onClick={handleStartNew}
                  className="px-6 py-2 bg-teal-100 text-teal-700 rounded hover:bg-teal-200 font-medium"
                >
                  Start New Bundle
                </button>
              )}
              {stackingOrder.length === 0 && (
                <button
                  onClick={handleLoadStackingOrder}
                  className="px-6 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 font-medium"
                >
                  Load Stacking Order
                </button>
              )}
            </div>
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
                        Display Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDocs.map((doc, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-700">{doc.displayOrder}</td>
                        <td className="px-6 py-4 text-gray-700">{doc.category}</td>
                        <td className="px-6 py-4 text-gray-700">{doc.documentType}</td>
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
