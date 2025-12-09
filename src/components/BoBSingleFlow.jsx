import React, { useState, useEffect } from 'react';
import { RefreshCw, Download, CheckCircle, XCircle, Loader2, Upload, File, X, Search, ChevronDown, ChevronRight, Lock, Eye, Filter, AlertTriangle } from 'lucide-react';
import { getLoanDocumentStatus } from '../services/epsDocumentApi';
import DocumentTemplateSelector from './documentTemplates/DocumentTemplateSelector';

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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showDocStorageModal, setShowDocStorageModal] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showDocViewer, setShowDocViewer] = useState(false);
  const [viewingDocument, setViewingDocument] = useState(null);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [splitPosition, setSplitPosition] = useState(60); // Percentage for left panel width
  const [modalPosition, setModalPosition] = useState({ x: 350, y: 50 }); // Modal position for dragging
  const [activeDocument, setActiveDocument] = useState(null); // Track which document is currently being viewed
  const [docViewerSplitPosition, setDocViewerSplitPosition] = useState(20); // Percentage for Document Viewer left panel width
  const [docStorageTypeFilter, setDocStorageTypeFilter] = useState(''); // Filter documents by type/status in storage modal
  const [docStorageCategoryFilter, setDocStorageCategoryFilter] = useState(''); // Filter documents by category in storage modal
  const [showInactiveWarning, setShowInactiveWarning] = useState(false); // Warning modal for inactive documents
  const [editedDocProperties, setEditedDocProperties] = useState(null); // Track edited document properties
  const [showSaveSuccess, setShowSaveSuccess] = useState(false); // Show success message after save
  const [showBundlePreview, setShowBundlePreview] = useState(false); // Show bundled PDF preview

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
    // Define required documents based on bundle type
    let requiredDocuments;

    if (bundle === 'C2C - QC Bundle') {
      // Specific stacking order for C2C - QC Bundle
      requiredDocuments = [
        { documentType: 'HOI Policy', category: 'Insurance', displayOrder: 1 },
        { documentType: 'Title', category: 'Title', displayOrder: 2 },
        { documentType: 'CPL', category: 'Title', displayOrder: 3 },
        { documentType: 'Appraisal', category: 'Property', displayOrder: 4 },
        { documentType: 'Purchase Contract', category: 'Property', displayOrder: 5 },
        { documentType: 'Bond Resv./Comm.', category: 'Financial', displayOrder: 6 },
        { documentType: 'Credit Report', category: 'Credit', displayOrder: 7 },
        { documentType: 'Flood Cert', category: 'Insurance', displayOrder: 8 },
        { documentType: 'Docs (UNSIGNED - PTF BUCKET)', category: 'Documents', displayOrder: 9 },
        { documentType: 'Lock Rate lock', category: 'Loan', displayOrder: 10 },
        { documentType: 'USPS', category: 'Verification', displayOrder: 11 },
      ];
    } else {
      // Default stacking order for other bundles
      requiredDocuments = [
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
    }

    // Special handling for C2C - QC Bundle (mock data for demo)
    if (bundle === 'C2C - QC Bundle') {
      console.log(`📄 Generating mock data for: ${bundle}`);

      // Pick 2 random indices for Missing and Possible Find - Inactive
      const totalDocs = requiredDocuments.length;
      const missingIndex = Math.floor(Math.random() * totalDocs);
      let possibleFindIndex = Math.floor(Math.random() * totalDocs);

      // Ensure possibleFindIndex is different from missingIndex
      while (possibleFindIndex === missingIndex) {
        possibleFindIndex = Math.floor(Math.random() * totalDocs);
      }

      // Generate mock documents with statuses
      const documents = requiredDocuments.map((doc, index) => {
        let status = 'Found';
        let foundCount = 1;

        if (index === missingIndex) {
          status = 'Missing';
          foundCount = 0;
        } else if (index === possibleFindIndex) {
          status = 'Pending Review - Inactive';
          foundCount = 1;
          // 25% chance of having multiple inactive documents found (2 or 3)
          const hasMultiple = Math.random() < 0.25;
          if (hasMultiple) {
            foundCount = Math.random() < 0.5 ? 2 : 3;
          }
        } else if (status === 'Found') {
          // 25% chance of having multiple documents found (2 or 3)
          const hasMultiple = Math.random() < 0.25;
          if (hasMultiple) {
            foundCount = Math.random() < 0.5 ? 2 : 3;
          }
        }

        return {
          category: doc.category,
          documentType: doc.documentType,
          status: status,
          displayOrder: doc.displayOrder,
          foundCount: foundCount,
          documents: status === 'Found' || status === 'Pending Review - Inactive' ? [{ id: 1, name: `${doc.documentType}.pdf` }] : [],
        };
      });

      console.log(`✅ Mock Data Generated - Found: ${documents.filter(d => d.status === 'Found').length}, Missing: 1, Possible Find: 1`);
      return documents;
    }

    // For other bundles: Generate random preview with 80% Found, 10% Missing, 10% Inactive
    console.log(`📄 Generating random preview for: ${bundle}`);

    const totalDocs = requiredDocuments.length;
    const missingCount = Math.ceil(totalDocs * 0.1); // 10%
    const inactiveCount = Math.ceil(totalDocs * 0.1); // 10%
    const foundCount = totalDocs - missingCount - inactiveCount; // Remaining 80%

    // Shuffle indices to randomly assign statuses
    const indices = Array.from({ length: totalDocs }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // Assign statuses: first missingCount as Missing, next inactiveCount as Inactive, rest as Found
    const missingIndices = new Set(indices.slice(0, missingCount));
    const inactiveIndices = new Set(indices.slice(missingCount, missingCount + inactiveCount));

    const documents = requiredDocuments.map((doc, index) => {
      let status = 'Found';
      let foundCountValue = 1;

      if (missingIndices.has(index)) {
        status = 'Missing';
        foundCountValue = 0;
      } else if (inactiveIndices.has(index)) {
        status = 'Pending Review - Inactive';
        foundCountValue = 1;
        // 25% chance of having multiple inactive documents found (2 or 3)
        const hasMultiple = Math.random() < 0.25;
        if (hasMultiple) {
          foundCountValue = Math.random() < 0.5 ? 2 : 3;
        }
      } else if (status === 'Found') {
        // 25% chance of having multiple documents found (2 or 3)
        const hasMultiple = Math.random() < 0.25;
        if (hasMultiple) {
          foundCountValue = Math.random() < 0.5 ? 2 : 3;
        }
      }

      return {
        category: doc.category,
        documentType: doc.documentType,
        status: status,
        displayOrder: doc.displayOrder,
        foundCount: foundCountValue,
        documents: status === 'Found' || status === 'Pending Review - Inactive' ? [{ id: 1, name: `${doc.documentType}.pdf` }] : [],
      };
    });

    console.log(`✅ Random Preview Generated - Found: ${foundCount}, Missing: ${missingCount}, Inactive: ${inactiveCount}`);
    return documents;
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
    // Check if there are any inactive documents
    const inactiveDocuments = stackingOrder.filter(doc => doc.status === 'Pending Review - Inactive');

    if (inactiveDocuments.length > 0) {
      // Show warning modal if inactive documents exist
      setShowInactiveWarning(true);
      return;
    }

    // Proceed with build if no inactive documents
    proceedWithBuild();
  };

  const proceedWithBuild = () => {
    setShowInactiveWarning(false);
    setIsBuilding(true);
    setBuildComplete(false);
    setBuildError(false);
    setBuildErrorDetails('');
    setBundleDownloadReady(false);

    // Show spinner for 10 seconds, then complete successfully
    setTimeout(() => {
      setIsBuilding(false);
      setBuildComplete(true);
      setBundleDownloadReady(true);
    }, 10000);
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
    // Show the bundled PDF preview with all documents in stacking order
    setShowBundlePreview(true);
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

  // Mock data for all available documents in EPS for the loan
  const getAllLoanDocuments = () => {
    // Helper function to randomly assign status (excluding Approved and Inactive)
    const getRandomStatus = () => {
      const statuses = ['not-reviewed', 'rejected', 'pending'];
      return statuses[Math.floor(Math.random() * statuses.length)];
    };

    return {
      'Application': [
        { name: '1003 Application', filename: '1003_URLA_Johnson_Edward_20250627.pdf', uploaded: '6/27/2025 9:15:23 AM', status: getRandomStatus(), source: 'E-Sign Import' },
        { name: '1003 URLA', filename: 'UniformResidentialLoanApp_1.pdf', uploaded: '6/27/2025 9:15:24 AM', status: getRandomStatus(), source: 'E-Sign Import' },
        { name: '1003 URLA - Updated', filename: 'UniformResidentialLoanApp_2_REVISED.pdf', uploaded: '6/30/2025 3:22:11 PM', status: getRandomStatus(), source: 'E-Sign Import' },
        { name: 'Borrower Authorization', filename: 'BorrowerAuth_Consent_20250627.pdf', uploaded: '6/27/2025 9:16:05 AM', status: getRandomStatus(), source: 'E-Sign Import' }
      ],
      'Credit': [
        { name: 'Credit Report', filename: 'TriMerge_Credit_77349726_20250627.pdf', uploaded: '6/27/2025 11:32:46 AM', status: getRandomStatus(), source: 'Interface', expires: '10/27/2025' },
        { name: 'Credit Report - Borrower', filename: 'Experian_Report_Johnson_Edward.pdf', uploaded: '6/27/2025 11:33:12 AM', status: getRandomStatus(), source: 'Interface', expires: '10/27/2025' },
        { name: 'Credit Report - Co-Borrower', filename: 'Experian_Report_Johnson_Sarah.pdf', uploaded: '6/27/2025 11:33:45 AM', status: getRandomStatus(), source: 'Interface', expires: '10/27/2025' },
        { name: 'Credit Supplement', filename: 'CreditSupplement_PaymentHistory.pdf', uploaded: '6/28/2025 2:14:33 PM', status: getRandomStatus(), source: 'Manually Add' }
      ],
      'Property': [
        { name: 'Appraisal', filename: 'Appraisal_Report_1456_Maple_St_20250628.pdf', uploaded: '6/28/2025 4:45:17 PM', status: getRandomStatus(), source: 'Interface', expires: '12/28/2025' },
        { name: 'Appraisal - URAR Form 1004', filename: 'URAR_1004_Property_Valuation.pdf', uploaded: '6/28/2025 4:45:18 PM', status: getRandomStatus(), source: 'Interface' },
        { name: 'Purchase Contract', filename: 'PurchaseAgreement_1456_Maple_St.pdf', uploaded: '6/25/2025 2:34:17 PM', status: getRandomStatus(), source: 'Manually Add', expires: '08/25/2025' },
        { name: 'Property Disclosure', filename: 'SellerDisclosure_PropertyCondition.pdf', uploaded: '6/25/2025 2:35:08 PM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'Home Inspection Report', filename: 'HomeInspection_Report_20250626.pdf', uploaded: '6/26/2025 1:22:44 PM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'Pest Inspection', filename: 'PestInspection_Termite_Report.pdf', uploaded: '6/26/2025 3:18:29 PM', status: getRandomStatus(), source: 'Manually Add' }
      ],
      'Title': [
        { name: 'Title Insurance', filename: 'TitlePolicy_CommitmentReport_20250629.pdf', uploaded: '6/29/2025 10:12:33 AM', status: getRandomStatus(), source: 'Interface' },
        { name: 'Title Commitment', filename: 'TitleCommitment_FirstAmerican.pdf', uploaded: '6/29/2025 10:12:34 AM', status: getRandomStatus(), source: 'Interface' },
        { name: 'CPL', filename: 'CPL_CertifiedPlatMap_1456_Maple.pdf', uploaded: '6/29/2025 10:15:22 AM', status: getRandomStatus(), source: 'Interface' },
        { name: 'Preliminary Title Report', filename: 'PreliminaryTitleReport_Chicago_Title.pdf', uploaded: '6/28/2025 3:44:18 PM', status: getRandomStatus(), source: 'Interface' },
        { name: 'Title Search', filename: 'TitleSearch_PropertyHistory_40Years.pdf', uploaded: '6/28/2025 3:45:01 PM', status: getRandomStatus(), source: 'Interface' }
      ],
      'Income': [
        { name: 'W-2', filename: 'W2_Johnson_Edward_2024.pdf', uploaded: '6/27/2025 10:15:44 AM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'W-2', filename: 'W2_Johnson_Edward_2023.pdf', uploaded: '6/27/2025 10:15:45 AM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'W-2', filename: 'W2_Johnson_Sarah_2024.pdf', uploaded: '6/27/2025 10:16:12 AM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'W-2', filename: 'W2_Johnson_Sarah_2023.pdf', uploaded: '6/27/2025 10:16:13 AM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'Pay Stubs', filename: 'PayStub_Edward_20250615.pdf', uploaded: '6/27/2025 10:18:22 AM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'Pay Stubs', filename: 'PayStub_Edward_20250531.pdf', uploaded: '6/27/2025 10:18:23 AM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'Pay Stubs', filename: 'PayStub_Sarah_20250615.pdf', uploaded: '6/27/2025 10:19:05 AM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'Pay Stubs', filename: 'PayStub_Sarah_20250531.pdf', uploaded: '6/27/2025 10:19:06 AM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'Tax Returns', filename: 'TaxReturn_1040_2024_Joint.pdf', uploaded: '6/27/2025 10:22:34 AM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'Tax Returns', filename: 'TaxReturn_1040_2023_Joint.pdf', uploaded: '6/27/2025 10:22:35 AM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'Tax Transcripts', filename: 'IRS_Transcript_2024_Edward.pdf', uploaded: '6/28/2025 9:33:18 AM', status: getRandomStatus(), source: 'Interface' },
        { name: 'Tax Transcripts', filename: 'IRS_Transcript_2023_Edward.pdf', uploaded: '6/28/2025 9:33:19 AM', status: getRandomStatus(), source: 'Interface' },
        { name: 'Employment Verification', filename: 'VOE_TechCorp_Edward_Johnson.pdf', uploaded: '6/28/2025 2:14:55 PM', status: getRandomStatus(), source: 'Interface' },
        { name: 'Employment Verification', filename: 'VOE_HealthSystem_Sarah_Johnson.pdf', uploaded: '6/28/2025 2:15:22 PM', status: getRandomStatus(), source: 'Interface' },
        { name: 'Self-Employment Income', filename: 'SelfEmployment_ProfitLoss_2024.pdf', uploaded: '6/27/2025 11:05:18 AM', status: getRandomStatus(), source: 'Manually Add' }
      ],
      'Assets': [
        { name: 'Bank Statements', filename: 'BankStatement_Chase_Checking_202505.pdf', uploaded: '6/27/2025 10:45:33 AM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'Bank Statements', filename: 'BankStatement_Chase_Checking_202504.pdf', uploaded: '6/27/2025 10:45:34 AM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'Bank Statements', filename: 'BankStatement_Chase_Savings_202505.pdf', uploaded: '6/27/2025 10:46:12 AM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'Bank Statements', filename: 'BankStatement_Chase_Savings_202504.pdf', uploaded: '6/27/2025 10:46:13 AM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'Investment Statements', filename: 'Investment_Fidelity_401k_202505.pdf', uploaded: '6/27/2025 10:50:28 AM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'Investment Statements', filename: 'Investment_Vanguard_IRA_202505.pdf', uploaded: '6/27/2025 10:50:51 AM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'Gift Letter', filename: 'GiftLetter_Parents_DownPayment_25K.pdf', uploaded: '6/27/2025 11:15:44 AM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'Gift Funds Evidence', filename: 'GiftFunds_WireTransfer_Receipt.pdf', uploaded: '6/28/2025 10:22:18 AM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'Asset Verification', filename: 'VOD_Chase_Bank_Verification.pdf', uploaded: '6/29/2025 11:18:33 AM', status: getRandomStatus(), source: 'Interface' }
      ],
      'Insurance': [
        { name: 'HOI Policy', filename: 'Homeowners_Insurance_StateFarm_Policy.pdf', uploaded: '6/29/2025 1:22:45 PM', status: getRandomStatus(), source: 'Manually Add', expires: '06/29/2026' },
        { name: 'Insurance Declaration', filename: 'Insurance_DecPage_Coverage_Details.pdf', uploaded: '6/29/2025 1:22:46 PM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'Flood Cert', filename: 'FloodCertification_FEMA_Zone_C.pdf', uploaded: '6/28/2025 3:33:22 PM', status: getRandomStatus(), source: 'Interface' },
        { name: 'Flood Insurance', filename: 'FloodInsurance_Policy_NFIP.pdf', uploaded: '6/29/2025 1:25:18 PM', status: getRandomStatus(), source: 'Manually Add' }
      ],
      'Closing': [
        { name: 'Closing Disclosure', filename: 'ClosingDisclosure_Final_20250702.pdf', uploaded: '7/2/2025 9:15:44 AM', status: getRandomStatus(), source: 'Doc Prep' },
        { name: 'Closing Disclosure - Initial', filename: 'ClosingDisclosure_Initial_20250630.pdf', uploaded: '6/30/2025 3:22:18 PM', status: getRandomStatus(), source: 'Doc Prep' },
        { name: 'Promissory Note', filename: 'PromissoryNote_Signed_350000.pdf', uploaded: '7/5/2025 10:33:22 AM', status: getRandomStatus(), source: 'E-Sign Import' },
        { name: 'Deed of Trust', filename: 'DeedOfTrust_SecurityInstrument.pdf', uploaded: '7/5/2025 10:33:23 AM', status: getRandomStatus(), source: 'E-Sign Import' },
        { name: 'Right of Rescission', filename: 'RightOfRescission_3Day_Notice.pdf', uploaded: '7/5/2025 10:33:24 AM', status: getRandomStatus(), source: 'E-Sign Import' },
        { name: 'Settlement Statement', filename: 'HUD1_SettlementStatement_Final.pdf', uploaded: '7/5/2025 11:15:33 AM', status: getRandomStatus(), source: 'Interface' },
        { name: 'Closing Instructions', filename: 'ClosingInstructions_TitleCompany.pdf', uploaded: '7/2/2025 2:45:18 PM', status: getRandomStatus(), source: 'Interface' }
      ],
      'Disclosures': [
        { name: 'Loan Estimate', filename: 'LoanEstimate_Initial_20250627.pdf', uploaded: '6/27/2025 2:31:42 PM', status: getRandomStatus(), source: 'Interface' },
        { name: 'Loan Estimate', filename: 'LoanEstimate_Revised_20250630.pdf', uploaded: '6/30/2025 4:15:22 PM', status: getRandomStatus(), source: 'Interface' },
        { name: 'Initial Disclosures', filename: 'InitialDisclosures_Package.pdf', uploaded: '6/27/2025 2:19:26 PM', status: getRandomStatus(), source: 'E-Sign Import' },
        { name: 'Privacy Notice', filename: 'PrivacyNotice_GLBA_Compliance.pdf', uploaded: '6/27/2025 3:13:37 PM', status: getRandomStatus(), source: 'E-Sign Import' },
        { name: 'Intent to Proceed', filename: 'IntentToProceed_Signed_20250627.pdf', uploaded: '6/27/2025 3:13:38 PM', status: getRandomStatus(), source: 'E-Sign Import' },
        { name: 'ECOA Disclosure', filename: 'ECOA_EqualCreditOpportunity_Notice.pdf', uploaded: '6/27/2025 3:13:39 PM', status: getRandomStatus(), source: 'E-Sign Import' },
        { name: 'Mortgage Fraud Warning', filename: 'FBI_MortgageFraud_Warning.pdf', uploaded: '6/27/2025 3:13:40 PM', status: getRandomStatus(), source: 'E-Sign Import' },
        { name: 'Patriot Act Disclosure', filename: 'PatriotAct_CustomerIdentification.pdf', uploaded: '6/27/2025 3:13:41 PM', status: getRandomStatus(), source: 'E-Sign Import' },
        { name: 'Servicing Disclosure', filename: 'ServicingDisclosure_Transfer_Notice.pdf', uploaded: '6/27/2025 3:14:15 PM', status: getRandomStatus(), source: 'E-Sign Import' },
        { name: 'Affiliated Business Disclosure', filename: 'AfBA_Disclosure_RelatedServices.pdf', uploaded: '6/27/2025 3:14:44 PM', status: getRandomStatus(), source: 'E-Sign Import' }
      ],
      'Loan': [
        { name: 'Lock Rate Lock', filename: 'RateLock_Confirmation_6.5_Percent.pdf', uploaded: '6/29/2025 4:22:33 PM', status: getRandomStatus(), source: 'Interface' },
        { name: 'Loan Approval', filename: 'UnderwritingApproval_Conditional.pdf', uploaded: '6/30/2025 11:45:22 AM', status: getRandomStatus(), source: 'Interface' },
        { name: 'Clear to Close', filename: 'ClearToClose_Final_Approval.pdf', uploaded: '7/2/2025 9:33:44 AM', status: getRandomStatus(), source: 'Interface' },
        { name: 'Loan Summary', filename: 'LoanSummary_Terms_Conditions.pdf', uploaded: '6/30/2025 2:15:33 PM', status: getRandomStatus(), source: 'Interface' },
        { name: 'Amortization Schedule', filename: 'AmortizationSchedule_30Year_Fixed.pdf', uploaded: '6/30/2025 2:16:05 PM', status: getRandomStatus(), source: 'Interface' }
      ],
      'Verification': [
        { name: 'USPS', filename: 'USPS_AddressValidation_1456_Maple.pdf', uploaded: '6/27/2025 2:34:50 PM', status: getRandomStatus(), source: 'Interface' },
        { name: 'SSN Verification', filename: 'SSN_Validation_Report_Borrowers.pdf', uploaded: '6/27/2025 11:55:18 PM', status: getRandomStatus(), source: 'Interface' },
        { name: 'Identity Verification', filename: 'ID_Verification_DriversLicense_Edward.pdf', uploaded: '6/27/2025 9:44:22 AM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'Identity Verification', filename: 'ID_Verification_DriversLicense_Sarah.pdf', uploaded: '6/27/2025 9:44:55 AM', status: getRandomStatus(), source: 'Manually Add' }
      ],
      'Government': [
        { name: 'FHA Case Number', filename: 'FHA_CaseNumber_Assignment.pdf', uploaded: '6/28/2025 10:13:37 AM', status: getRandomStatus(), source: 'Interface' },
        { name: 'FHA Addendum to URLA', filename: 'FHA_URLA_Addendum_92900A.pdf', uploaded: '7/2/2025 3:13:37 PM', status: getRandomStatus(), source: 'E-Sign Import' },
        { name: 'FHA Real Estate Certification', filename: 'FHA_AmendatoryClause_RealEstate.pdf', uploaded: '7/2/2025 3:13:38 PM', status: getRandomStatus(), source: 'E-Sign Import' },
        { name: 'FHA Notice to Homebuyers', filename: 'FHA_Notice_ImportantNotice_Homebuyers.pdf', uploaded: '7/2/2025 3:13:39 PM', status: getRandomStatus(), source: 'E-Sign Import' },
        { name: 'FHA For Your Protection', filename: 'FHA_ForYourProtection_Settlement.pdf', uploaded: '7/2/2025 3:13:40 PM', status: getRandomStatus(), source: 'E-Sign Import' },
        { name: 'FHA Identity Certification', filename: 'FHA_IdentityCertificate_SSN.pdf', uploaded: '7/2/2025 3:13:41 PM', status: getRandomStatus(), source: 'E-Sign Import' },
        { name: 'VA Certificate of Eligibility', filename: 'VA_COE_Certificate_26_1880.pdf', uploaded: '6/29/2025 9:22:15 AM', status: getRandomStatus(), source: 'Interface' }
      ],
      'Compliance': [
        { name: 'SGFE Compliance Certificate', filename: 'ComplianceEase_Certificate_ID_06302025.pdf', uploaded: '6/30/2025 2:23:18 PM', status: getRandomStatus(), source: 'Interface' },
        { name: 'AUS Findings', filename: 'DU_Findings_Approve_Eligible.pdf', uploaded: '6/28/2025 11:44:33 AM', status: getRandomStatus(), source: 'Interface' },
        { name: 'Quality Control Review', filename: 'QC_Review_PreFunding_ChecklistComplete.pdf', uploaded: '7/2/2025 11:13:27 AM', status: getRandomStatus(), source: 'Interface' },
        { name: 'HMDA LAR', filename: 'HMDA_LoanApplicationRegister_2025.pdf', uploaded: '6/27/2025 3:44:55 PM', status: getRandomStatus(), source: 'Interface' },
        { name: 'Anti-Steering Disclosure', filename: 'AntiSteering_LoanOptions_Disclosure.pdf', uploaded: '6/27/2025 3:15:22 PM', status: getRandomStatus(), source: 'E-Sign Import' }
      ],
      'Miscellaneous': [
        { name: 'E-Sign Audit Trail', filename: 'AuditTrail_InitialDisclosures_20250627.pdf', uploaded: '6/27/2025 5:08:39 PM', status: getRandomStatus(), source: 'E-Sign Import' },
        { name: 'E-Sign Audit Trail', filename: 'AuditTrail_Closing_Package_20250705.pdf', uploaded: '7/5/2025 10:35:18 PM', status: getRandomStatus(), source: 'E-Sign Import' },
        { name: 'Processor Notes', filename: 'ProcessorNotes_LoanFile_Summary.pdf', uploaded: '6/30/2025 4:22:33 PM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'Underwriter Conditions', filename: 'UW_Conditions_List_Outstanding.pdf', uploaded: '6/30/2025 11:46:15 AM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'Wire Instructions', filename: 'WireInstructions_DownPayment_Closing.pdf', uploaded: '7/3/2025 9:15:44 AM', status: getRandomStatus(), source: 'Manually Add' }
      ],
      'Post Closing': [
        { name: 'Final Title Policy', filename: 'FinalTitlePolicy_Owners_Lenders.pdf', uploaded: '10/9/2025 12:14:20 PM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'Recorded Security Instrument', filename: 'RecordedDeed_CountyRecorder_Stamped.pdf', uploaded: '10/9/2025 12:14:21 PM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'Recorded Deed', filename: 'RecordedWarrantyDeed_20251009.pdf', uploaded: '10/9/2025 12:15:05 PM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'Servicing Transfer Notice', filename: 'ServicingTransfer_Goodbye_Letter.pdf', uploaded: '9/11/2025 2:30:55 PM', status: getRandomStatus(), source: 'Manually Add' },
        { name: 'Final HUD Settlement', filename: 'FinalHUD_PostClosing_Reconciliation.pdf', uploaded: '7/10/2025 3:22:18 PM', status: getRandomStatus(), source: 'Interface' }
      ]
    };
  };

  // Handle document click - show storage modal for Missing or Found with multiple docs, direct viewer for single Found/Inactive
  const handleDocumentClick = (e, doc) => {
    e.preventDefault();

    // Set the active document to show indicator icon
    setActiveDocument(doc.documentType);

    // If Missing OR Found/Inactive with multiple documents (foundCount > 1), show doc storage modal
    if (doc.status === 'Missing' ||
        (doc.status === 'Found' && doc.foundCount > 1) ||
        (doc.status === 'Pending Review - Inactive' && doc.foundCount > 1)) {
      setSelectedDocType(doc.documentType);
      setShowDocStorageModal(true);
      // Reset filters when opening modal
      setDocStorageTypeFilter('');
      setDocStorageCategoryFilter('');
      // Initialize all categories as expanded
      const allDocs = getAllLoanDocuments();
      const expanded = {};
      Object.keys(allDocs).forEach(cat => {
        expanded[cat] = true;
      });
      setExpandedCategories(expanded);
    } else if ((doc.status === 'Found' && doc.foundCount === 1) ||
               (doc.status === 'Pending Review - Inactive' && doc.foundCount === 1)) {
      // For single Found (foundCount === 1) or single Inactive doc (foundCount === 1), show direct document viewer with metadata
      // In production, this would make an API call to fetch document details from EPS
      const docDetails = {
        documentType: doc.documentType,
        category: doc.category,
        status: doc.status,
        filename: `${doc.documentType.replace(/\s+/g, '_')}_${subjectLoan}_${Date.now()}.pdf`,
        created: new Date().toLocaleString(),
        format: 'PDF',
        location: `\\\\cmgmortgage.com\\BPRO.DATA\\${subjectLoan}\\${doc.documentType.replace(/\s+/g, '_')}.pdf`,
        description: doc.documentType
      };
      setViewingDocument(docDetails);
      // Initialize edited properties
      setEditedDocProperties({
        status: doc.status === 'Pending Review - Inactive' ? 'inactive' : doc.status === 'Found' ? 'approved' : 'not-reviewed',
        documentName: docDetails.filename,
        documentType: '',
        expires: '',
        description: docDetails.description,
        tags: {
          forReview: false,
          firstTime: false
        },
        associatedCondition: '',
        notes: ''
      });
      setShowDocViewer(true);
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleViewDocument = (doc, category) => {
    const docDetails = { ...doc, category };
    setViewingDocument(docDetails);
    // Initialize edited properties with current document data
    setEditedDocProperties({
      status: doc.status || 'not-reviewed',
      documentName: doc.filename || doc.name || '',
      documentType: '',
      expires: '',
      description: '',
      tags: {
        forReview: false,
        firstTime: false
      },
      associatedCondition: '',
      notes: ''
    });
    setShowDocViewer(true);
  };

  // Save document property changes
  const handleSaveDocumentProperties = async () => {
    if (!editedDocProperties || !viewingDocument) return;

    // TODO: In production, make API call to BytePro DBO via EPS API
    // Example: await updateDocumentProperties(subjectLoan, viewingDocument.documentType, editedDocProperties);

    console.log('📝 Saving document properties to EPS API:', {
      loan: subjectLoan,
      documentType: viewingDocument.documentType,
      properties: editedDocProperties
    });

    // Convert dropdown values back to grid display format
    const newGridStatus =
      editedDocProperties.status === 'inactive' ? 'Pending Review - Inactive' :
      editedDocProperties.status === 'approved' ? 'Found' :
      editedDocProperties.status === 'rejected' ? 'Missing' :
      editedDocProperties.status === 'pending' ? 'Pending Review - Inactive' :
      'Missing';

    // Update the stacking order with new status
    const updatedStackingOrder = stackingOrder.map(doc => {
      if (doc.documentType === viewingDocument.documentType) {
        return {
          ...doc,
          status: newGridStatus
        };
      }
      return doc;
    });

    setStackingOrder(updatedStackingOrder);

    // Update the viewing document
    setViewingDocument({
      ...viewingDocument,
      status: newGridStatus
    });

    // Show success message
    setShowSaveSuccess(true);
    setTimeout(() => {
      setShowSaveSuccess(false);
    }, 3000);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  // Get filtered documents for Document Storage Modal
  const getFilteredStorageDocuments = () => {
    const allDocs = getAllLoanDocuments();

    // If no filters applied, return all documents
    if (!docStorageTypeFilter && !docStorageCategoryFilter) {
      return allDocs;
    }

    // Apply filters
    const filtered = {};
    Object.entries(allDocs).forEach(([category, docs]) => {
      // Filter by category first
      if (docStorageCategoryFilter && category !== docStorageCategoryFilter) {
        return; // Skip this category
      }

      // Filter by status/type within the category
      const filteredDocs = docStorageTypeFilter
        ? docs.filter(doc => doc.status === docStorageTypeFilter)
        : docs;

      // Only include category if it has matching documents
      if (filteredDocs.length > 0) {
        filtered[category] = filteredDocs;
      }
    });

    return filtered;
  };

  const getFilteredDocs = () => {
    let docs = stackingOrder;

    // Filter by status tab
    if (activeStatusTab === 'missing') {
      docs = docs.filter(d => d.status === 'Missing');
    } else if (activeStatusTab === 'found') {
      docs = docs.filter(d => d.status === 'Found');
    } else if (activeStatusTab === 'pending') {
      docs = docs.filter(d => d.status === 'Pending Review - Inactive');
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      docs = docs.filter(d => d.category === selectedCategory);
    }

    // Filter out N/A docs if checkbox is checked
    if (hideNotApplicableDocs) {
      docs = docs.filter(d => d.status !== 'N/A');
    }

    return docs;
  };

  // Get unique categories from stacking order
  const uniqueCategories = [...new Set(stackingOrder.map(doc => doc.category))].sort();

  const filteredDocs = getFilteredDocs();
  const missingCount = stackingOrder.filter(d => d.status === 'Missing').length;
  const foundCount = stackingOrder.filter(d => d.status === 'Found').length;
  const pendingCount = stackingOrder.filter(d => d.status === 'Pending Review - Inactive').length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <svg width="85" height="40" viewBox="0 0 85 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <span className="text-black text-2xl font-bold ml-2">- BoB Manager</span>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold shadow-sm hover:bg-teal-600 transition-colors cursor-pointer"
          >
            AO
          </button>
          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    alert('My Account clicked');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                >
                  My Account
                </button>
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    alert('Sign Out clicked');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    window.location.href = 'http://localhost:5173';
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                >
                  Switch to BoB - Bulk Delivery
                </button>
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    window.location.href = 'http://localhost:5175';
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                >
                  Switch to Doctor BoB - Single Loan
                </button>
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    window.location.href = 'http://localhost:5180';
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                >
                  Switch to Doctor BoB - Bulk Delivery
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-6">
          BoB (Builder of Bundles) | Single Loan Delivery
        </h1>

        {/* Selection Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="space-y-6 max-w-3xl">
              {/* Subject Loan - Always show first */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Select Subject Loan
                </label>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center px-3 pointer-events-none">
                    {!subjectLoan && !fieldsLocked && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Search size={14} />
                        <span className="text-xs">Search for and select a loan to build a bundle</span>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded disabled:bg-gray-200 disabled:text-gray-600 disabled:cursor-not-allowed bg-transparent relative z-10 text-xs"
                  />
                </div>
              </div>

              {/* Bundle Name and PDF Bundle Name - Show when loan is validated */}
              {loanValidated && (
                <div className={`grid ${bundleName ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-white disabled:bg-gray-200 disabled:text-gray-600 disabled:cursor-not-allowed text-xs"
                    >
                      <option value="">Select</option>
                      <option value="C2C - QC Bundle" style={{fontWeight: 'bold'}}>C2C - QC Bundle</option>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-600 text-xs"
                        placeholder="Auto-generated"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Validation Error - Only show when explicitly set by handleLoadStackingOrder */}
            {validationError && stackingOrder.length === 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
                {validationError}
              </div>
            )}

            {/* Action Buttons - Show when bundle is selected */}
            {loanValidated && bundleName && (
              <div className="max-w-3xl flex justify-end space-x-4 mt-6">
                <button
                  onClick={handleStartNew}
                  className="px-4 py-2 bg-teal-100 text-teal-700 rounded hover:bg-teal-200 font-medium text-xs"
                >
                  Start New Bundle
                </button>
                <button
                  onClick={handleLoadStackingOrder}
                  disabled={isLoadingDocuments || fieldsLocked}
                  className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                >
                  {isLoadingDocuments ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={14} />
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
                  <span className="text-green-600 font-medium flex items-center gap-2 text-xs">
                    <CheckCircle size={16} />
                    Subject Bundle Available
                  </span>
                  <button
                    onClick={handleDownloadBundle}
                    className="flex items-center space-x-2 px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 font-medium text-xs"
                  >
                    <Download size={14} />
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
                    className={`px-4 py-2 rounded font-medium text-xs ${
                      activeStatusTab === 'all'
                        ? 'bg-white border-2 border-teal-600 text-teal-600'
                        : 'bg-white border border-gray-300 text-gray-600'
                    }`}
                  >
                    All {stackingOrder.length > 0 && <span className="ml-1">{stackingOrder.length}</span>}
                  </button>
                  <button
                    onClick={() => setActiveStatusTab('missing')}
                    className={`px-4 py-2 rounded font-medium flex items-center text-xs ${
                      activeStatusTab === 'missing'
                        ? 'bg-white border-2 border-teal-600 text-teal-600'
                        : 'bg-white border border-gray-300 text-gray-600'
                    }`}
                  >
                    Missing {missingCount > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-semibold">{missingCount}</span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveStatusTab('pending')}
                    className={`px-4 py-2 rounded font-medium flex items-center text-xs ${
                      activeStatusTab === 'pending'
                        ? 'bg-white border-2 border-teal-600 text-teal-600'
                        : 'bg-white border border-gray-300 text-gray-600'
                    }`}
                  >
                    Pending Review {pendingCount > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-yellow-500 text-white text-xs rounded-full font-semibold">{pendingCount}</span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveStatusTab('found')}
                    className={`px-4 py-2 rounded font-medium text-xs ${
                      activeStatusTab === 'found'
                        ? 'bg-white border-2 border-teal-600 text-teal-600'
                        : 'bg-white border border-gray-300 text-gray-600'
                    }`}
                  >
                    Found {foundCount > 0 && <span className="ml-1">{foundCount}</span>}
                  </button>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowDocStorageModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-teal-100 text-teal-700 rounded hover:bg-teal-200 font-medium text-xs"
                  >
                    <File size={14} />
                    <span>View Stored Docs</span>
                  </button>
                  <label className="flex items-center space-x-2 text-xs text-gray-700">
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
                    className="flex items-center space-x-2 px-4 py-2 bg-teal-100 text-teal-700 rounded hover:bg-teal-200 font-medium text-xs"
                  >
                    <Upload size={14} />
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
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        selectedCategory !== 'all' ? 'bg-teal-50 text-teal-700' : 'text-gray-500'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span>Category</span>
                          <div className="relative">
                            <button
                              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                              className={`ml-2 p-1 rounded ${
                                selectedCategory !== 'all'
                                  ? 'bg-teal-200 hover:bg-teal-300'
                                  : 'hover:bg-gray-200'
                              }`}
                            >
                              <ChevronDown size={14} className={selectedCategory !== 'all' ? 'text-teal-700' : 'text-gray-600'} />
                            </button>
                            {showCategoryDropdown && (
                              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      setSelectedCategory('all');
                                      setShowCategoryDropdown(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-100 ${
                                      selectedCategory === 'all' ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-gray-700'
                                    }`}
                                  >
                                    All Categories
                                  </button>
                                  {uniqueCategories.map(category => (
                                    <button
                                      key={category}
                                      onClick={() => {
                                        setSelectedCategory(category);
                                        setShowCategoryDropdown(false);
                                      }}
                                      className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-100 ${
                                        selectedCategory === category ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-gray-700'
                                      }`}
                                    >
                                      {category}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDocs.map((doc, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <a
                            href={`#docs-manager?type=${encodeURIComponent(doc.documentType)}&loan=${encodeURIComponent(subjectLoan)}`}
                            onClick={(e) => handleDocumentClick(e, doc)}
                            className="text-teal-600 hover:text-teal-800 font-medium underline text-xs cursor-pointer flex items-center gap-2"
                          >
                            {activeDocument === doc.documentType && (
                              <Eye size={14} className="text-teal-600 flex-shrink-0" />
                            )}
                            {doc.documentType}
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            doc.status === 'Found'
                              ? 'bg-gray-100 text-gray-800'
                              : doc.status === 'Missing'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {doc.status === 'Found' || doc.status === 'Pending Review - Inactive'
                              ? `${doc.status} - ${doc.foundCount}`
                              : doc.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700 text-xs">{doc.category}</td>
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
                    className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 font-medium text-xs"
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
            <Loader2 className="animate-spin mx-auto mb-4 text-teal-600" size={40} />
            <h3 className="text-base font-semibold mb-2">Building Bundle</h3>
            <p className="text-gray-600 text-xs">Please wait while your bundle is being created...</p>
          </div>
        </div>
      )}

      {/* Build Success Modal */}
      {buildComplete && !bundleDownloadReady && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="text-green-600" size={24} />
              <h3 className="text-base font-semibold">Bundle has been Created</h3>
            </div>
            <p className="text-gray-600 mb-6 text-xs">
              Your bundle has been successfully created and is ready for download.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setBundleDownloadReady(true);
                  setBuildComplete(false);
                }}
                className="flex-1 px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 font-medium text-xs"
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
              <XCircle className="text-red-600" size={24} />
              <h3 className="text-base font-semibold">Build Failed</h3>
            </div>
            <div className="mb-6">
              <p className="text-gray-600 mb-3 text-xs">
                An error occurred. Build could not complete. Please click "Re-Build Bundle" to try again.
              </p>
              {buildErrorDetails && (
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-xs font-semibold text-red-800 mb-1">Error Details:</p>
                  <p className="text-xs text-red-700">{buildErrorDetails}</p>
                </div>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCancelError}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleRebuildBundle}
                className="flex-1 px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 font-medium text-xs"
              >
                Re-Build Bundle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inactive Documents Warning Modal */}
      {showInactiveWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px]">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-yellow-600" size={24} />
              <h3 className="text-base font-semibold">Inactive Documents Detected</h3>
            </div>
            <div className="mb-6">
              <p className="text-gray-700 mb-3 text-sm">
                This bundle contains documents marked as <span className="font-semibold text-yellow-700">Inactive</span> that require review.
              </p>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-xs font-semibold text-yellow-800 mb-2">⚠️ Important Notice:</p>
                <p className="text-xs text-yellow-700 mb-2">
                  Inactive documents may not meet current compliance standards and could affect the validity of this bundle package.
                </p>
                <p className="text-xs text-yellow-700">
                  {stackingOrder.filter(doc => doc.status === 'Pending Review - Inactive').length} inactive {stackingOrder.filter(doc => doc.status === 'Pending Review - Inactive').length === 1 ? 'document' : 'documents'} detected in this bundle.
                </p>
              </div>
              <p className="text-gray-600 mt-4 text-xs">
                Do you wish to proceed with building this bundle?
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowInactiveWarning(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium text-xs"
              >
                Cancel
              </button>
              <button
                onClick={proceedWithBuild}
                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 font-medium text-xs"
              >
                Yes, Proceed Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px]">
            <h3 className="text-base font-semibold mb-4">Upload Supplemental Document</h3>
            <p className="text-xs text-gray-600 mb-4">Upload additional documents to supplement the bundle (PDF only)</p>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">Select PDF File</label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs"
              />
              {selectedFile && (
                <div className="mt-2 p-2 bg-teal-50 border border-teal-200 rounded flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <File size={16} className="text-teal-600" />
                    <span className="text-xs text-teal-800">{selectedFile.name}</span>
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
                <p className="text-xs font-medium text-gray-700 mb-2">Uploaded Files:</p>
                <div className="space-y-2">
                  {uploadedFiles.map(file => (
                    <div key={file.id} className="p-2 bg-gray-50 border border-gray-200 rounded flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <File size={16} className="text-gray-600" />
                        <div>
                          <p className="text-xs text-gray-800">{file.name}</p>
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
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium text-xs"
              >
                Close
              </button>
              <button
                onClick={handleUploadSubmit}
                className="flex-1 px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 font-medium text-xs"
              >
                Upload File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Storage Modal */}
      {showDocStorageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-50">
          <div
            className="bg-white rounded-lg w-[85%] max-w-6xl h-[85vh] flex flex-col shadow-2xl"
            style={{
              position: 'absolute',
              left: `${modalPosition.x}px`,
              top: `${modalPosition.y}px`,
            }}
          >
            {/* Header - Draggable */}
            <div
              className="px-6 py-4 border-b flex items-center justify-between cursor-move bg-gray-50"
              onMouseDown={(e) => {
                e.preventDefault();
                const startX = e.clientX - modalPosition.x;
                const startY = e.clientY - modalPosition.y;

                const handleMouseMove = (e) => {
                  setModalPosition({
                    x: e.clientX - startX,
                    y: e.clientY - startY
                  });
                };

                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            >
              <h3 className="text-base font-semibold">Documents - Loan {subjectLoan}</h3>
              <button
                onClick={() => {
                  setShowDocStorageModal(false);
                  setPreviewDocument(null);
                  setActiveDocument(null);
                }}
                className="text-gray-500 hover:text-gray-700"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <X size={20} />
              </button>
            </div>

            {/* Controls Bar */}
            <div className="px-6 py-3 border-b bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="text-xs text-teal-600 hover:text-teal-800 font-medium">
                  Select All
                </button>
                <span className="text-gray-300">|</span>
                <button className="text-xs text-teal-600 hover:text-teal-800 font-medium">
                  Collapse All
                </button>
              </div>
              <div className="flex items-center gap-3">
                {/* Filter Icon Indicator - Highlights when filters are active */}
                <div className="relative">
                  <Filter
                    size={16}
                    className={`transition-colors ${
                      docStorageTypeFilter || docStorageCategoryFilter
                        ? 'text-teal-600'
                        : 'text-gray-400'
                    }`}
                  />
                  {(docStorageTypeFilter || docStorageCategoryFilter) && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-teal-600 rounded-full"></div>
                  )}
                </div>

                <span className="text-xs text-gray-600">Filter by:</span>
                <select
                  className={`px-3 py-1 border rounded text-xs bg-white transition-colors ${
                    docStorageTypeFilter
                      ? 'border-teal-500 ring-1 ring-teal-200'
                      : 'border-gray-300'
                  }`}
                  value={docStorageTypeFilter}
                  onChange={(e) => setDocStorageTypeFilter(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="approved">Approved</option>
                  <option value="not-reviewed">Not Reviewed</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending Review</option>
                  <option value="rejected">Rejected</option>
                </select>
                <span className="text-xs text-gray-600 ml-2">Category:</span>
                <select
                  className={`px-3 py-1 border rounded text-xs bg-white transition-colors ${
                    docStorageCategoryFilter
                      ? 'border-teal-500 ring-1 ring-teal-200'
                      : 'border-gray-300'
                  }`}
                  value={docStorageCategoryFilter}
                  onChange={(e) => setDocStorageCategoryFilter(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="POST CLSNG">POST CLSNG</option>
                  <option value="CRED">CRED</option>
                  <option value="AUDIT">AUDIT</option>
                  <option value="DISC">DISC</option>
                  <option value="PROP">PROP</option>
                  <option value="MISC">MISC</option>
                  <option value="DOCS">DOCS</option>
                  <option value="GOV">GOV</option>
                  <option value="APP">APP</option>
                </select>
                <button
                  className={`p-1 rounded transition-colors ${
                    docStorageTypeFilter || docStorageCategoryFilter
                      ? 'bg-teal-100 hover:bg-teal-200'
                      : 'hover:bg-gray-200'
                  }`}
                  title={docStorageTypeFilter || docStorageCategoryFilter ? 'Clear Filters' : 'Refresh'}
                  onClick={() => {
                    setDocStorageTypeFilter('');
                    setDocStorageCategoryFilter('');
                  }}
                >
                  <RefreshCw
                    size={14}
                    className={docStorageTypeFilter || docStorageCategoryFilter ? 'text-teal-600' : 'text-gray-600'}
                  />
                </button>
              </div>
            </div>

            {/* Split View: Documents Table & Preview */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Panel - Documents Table */}
              <div style={{ width: `${splitPosition}%` }} className="flex flex-col border-r overflow-hidden">
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Status</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Category</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Type</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Description</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Expires</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Date/Time Created</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Format</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700 border-b">Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(getFilteredStorageDocuments()).map(([category, docs]) =>
                        docs.map((doc, idx) => (
                          <tr
                            key={`${category}-${idx}`}
                            className={`border-b cursor-pointer transition-colors ${
                              previewDocument?.filename === doc.filename
                                ? 'bg-teal-50'
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => setPreviewDocument({ ...doc, category })}
                            onDoubleClick={() => handleViewDocument(doc, category)}
                          >
                            <td className="px-3 py-2">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                doc.status === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : doc.status === 'not-reviewed'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : doc.status === 'inactive'
                                  ? 'bg-gray-100 text-gray-800'
                                  : doc.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}>
                                {doc.status === 'approved' ? 'Approved' :
                                 doc.status === 'not-reviewed' ? 'Not Reviewed' :
                                 doc.status === 'inactive' ? 'Inactive' :
                                 doc.status === 'rejected' ? 'Rejected' :
                                 doc.status === 'pending' ? 'Pending Review' : doc.status}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-gray-700">{category}</td>
                            <td className="px-3 py-2 text-gray-700">{doc.name}</td>
                            <td className="px-3 py-2 text-teal-600 hover:text-teal-800 font-medium">{doc.filename}</td>
                            <td className="px-3 py-2 text-red-600">{doc.expires || ''}</td>
                            <td className="px-3 py-2 text-gray-700">{doc.uploaded}</td>
                            <td className="px-3 py-2 text-gray-700">PDF</td>
                            <td className="px-3 py-2 text-gray-700">{doc.source}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Resizable Divider */}
              <div
                className="w-1 bg-gray-300 hover:bg-teal-500 cursor-col-resize flex-shrink-0 transition-colors"
                onMouseDown={(e) => {
                  e.preventDefault();
                  const startX = e.clientX;
                  const startWidth = splitPosition;
                  const container = e.currentTarget.parentElement;

                  const handleMouseMove = (moveEvent) => {
                    if (container) {
                      const containerWidth = container.offsetWidth;
                      const deltaX = moveEvent.clientX - startX;
                      const deltaPercent = (deltaX / containerWidth) * 100;
                      const newWidth = Math.min(Math.max(30, startWidth + deltaPercent), 80);
                      setSplitPosition(newWidth);
                    }
                  };

                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };

                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              />

              {/* Right Panel - Document Preview */}
              <div className="flex-1 bg-gray-50 overflow-auto">
                {previewDocument ? (
                  <div className="h-full flex flex-col">
                    {/* Preview Header */}
                    <div className="bg-white border-b px-4 py-3">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">
                        {previewDocument.name}
                      </h4>
                      <div className="space-y-1 text-xs text-gray-600">
                        <p><strong>Filename:</strong> {previewDocument.filename}</p>
                        <p><strong>Category:</strong> {previewDocument.category}</p>
                        <p><strong>Status:</strong>{' '}
                          <span className={`px-2 py-0.5 rounded font-medium ${
                            previewDocument.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : previewDocument.status === 'not-reviewed'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {previewDocument.status === 'approved' ? 'Approved' :
                             previewDocument.status === 'not-reviewed' ? 'Not Reviewed' :
                             previewDocument.status === 'inactive' ? 'Inactive' : previewDocument.status}
                          </span>
                        </p>
                        <p><strong>Uploaded:</strong> {previewDocument.uploaded}</p>
                        <p><strong>Source:</strong> {previewDocument.source}</p>
                        {previewDocument.expires && (
                          <p className="text-red-600"><strong>Expires:</strong> {previewDocument.expires}</p>
                        )}
                      </div>
                    </div>

                    {/* Preview Actions */}
                    <div className="bg-white border-b px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleViewDocument(previewDocument, previewDocument.category)}
                        className="px-3 py-1.5 bg-teal-600 text-white rounded hover:bg-teal-700 text-xs font-medium"
                      >
                        Open Full View
                      </button>
                      <button
                        onClick={() => alert(`Downloading ${previewDocument.filename}...`)}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs font-medium"
                      >
                        Download
                      </button>
                    </div>

                    {/* Preview Area - Realistic Document Templates */}
                    <div className="flex-1 overflow-auto bg-gray-100">
                      <div className="p-4">
                        <div className="bg-white shadow-lg max-w-4xl mx-auto">
                          <DocumentTemplateSelector
                            documentType={previewDocument.name}
                            documentName={previewDocument.filename}
                            category={previewDocument.category}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center p-6">
                    <div className="text-center text-gray-400">
                      <File size={48} className="mx-auto mb-3" />
                      <p className="text-sm font-medium mb-1">No Document Selected</p>
                      <p className="text-xs">Click on any document row to preview</p>
                      <p className="text-xs mt-1">Double-click to open full view</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t bg-gray-50 flex justify-between items-center">
              <p className="text-xs text-gray-600">
                {(() => {
                  const filteredDocs = getFilteredStorageDocuments();
                  const filteredCount = Object.values(filteredDocs).reduce((sum, docs) => sum + docs.length, 0);
                  const totalCount = Object.values(getAllLoanDocuments()).reduce((sum, docs) => sum + docs.length, 0);
                  return docStorageTypeFilter || docStorageCategoryFilter
                    ? `Showing ${filteredCount} of ${totalCount} Documents`
                    : `Total Documents: ${totalCount}`;
                })()}
              </p>
              <button
                onClick={() => {
                  setShowDocStorageModal(false);
                  setPreviewDocument(null);
                  setActiveDocument(null);
                  setDocStorageTypeFilter('');
                  setDocStorageCategoryFilter('');
                }}
                className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 font-medium text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {showDocViewer && viewingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-[60]">
          <div
            className="bg-white rounded-lg w-[85%] max-w-6xl h-[85vh] flex flex-col shadow-2xl"
            style={{
              position: 'absolute',
              left: `${modalPosition.x}px`,
              top: `${modalPosition.y}px`,
            }}
          >
            {/* Header - Draggable */}
            <div
              className="px-6 py-3 border-b flex items-center justify-between cursor-move bg-gray-50"
              onMouseDown={(e) => {
                e.preventDefault();
                const startX = e.clientX - modalPosition.x;
                const startY = e.clientY - modalPosition.y;

                const handleMouseMove = (e) => {
                  setModalPosition({
                    x: e.clientX - startX,
                    y: e.clientY - startY
                  });
                };

                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            >
              <h3 className="text-sm font-semibold text-gray-800">
                {viewingDocument.filename || viewingDocument.name}
              </h3>
              <button
                onClick={() => {
                  setShowDocViewer(false);
                  setActiveDocument(null);
                }}
                className="text-gray-500 hover:text-gray-700"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Content - Split Layout */}
            <div className="flex-1 flex overflow-hidden bg-gray-50">
              {/* Left Panel - Document Properties */}
              <div style={{ width: `${docViewerSplitPosition}%` }} className="border-r bg-white overflow-y-auto flex-shrink-0">
                {/* Header */}
                <div className="px-4 py-3 border-b">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-gray-800">Document Properties</h4>
                    <ChevronDown size={14} className="text-gray-500" />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="px-4 py-3 space-y-3">
                  {/* Document Status */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Document Status</label>
                    <select
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      value={editedDocProperties?.status || 'not-reviewed'}
                      onChange={(e) => setEditedDocProperties(prev => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="not-reviewed">Not Reviewed</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="pending">Pending Review</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Document Name */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Document Name</label>
                    <input
                      type="text"
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      value={editedDocProperties?.documentName || ''}
                      onChange={(e) => setEditedDocProperties(prev => ({ ...prev, documentName: e.target.value }))}
                    />
                  </div>

                  {/* Document Type */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Document Type</label>
                    <select
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      value={editedDocProperties?.documentType || ''}
                      onChange={(e) => setEditedDocProperties(prev => ({ ...prev, documentType: e.target.value }))}
                    >
                      <option value="">Select Type</option>
                      <option value="verification-of-employment">Verification of Employment</option>
                      <option value="w2">W-2</option>
                      <option value="pay-stubs">Pay Stubs</option>
                      <option value="bank-statements">Bank Statements</option>
                      <option value="tax-returns">Tax Returns</option>
                      <option value="credit-report">Credit Report</option>
                      <option value="appraisal">Appraisal</option>
                      <option value="title-policy">Title Policy</option>
                      <option value="insurance">Insurance</option>
                      <option value="loan-estimate">Loan Estimate</option>
                      <option value="closing-disclosure">Closing Disclosure</option>
                      <option value="purchase-agreement">Purchase Agreement</option>
                      <option value="1003">1003 Application</option>
                    </select>
                  </div>

                  {/* Document Expires */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Document Expires</label>
                    <input
                      type="date"
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      value={editedDocProperties?.expires || ''}
                      onChange={(e) => setEditedDocProperties(prev => ({ ...prev, expires: e.target.value }))}
                    />
                  </div>

                  {/* Document Description */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Document Description</label>
                    <textarea
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs bg-white resize-none focus:outline-none focus:ring-1 focus:ring-teal-500"
                      rows={3}
                      placeholder="Type comment here"
                      value={editedDocProperties?.description || ''}
                      onChange={(e) => setEditedDocProperties(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  {/* Tags Section */}
                  <div className="pt-2 space-y-1.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded text-teal-600 w-3 h-3"
                        checked={editedDocProperties?.tags?.forReview || false}
                        onChange={(e) => setEditedDocProperties(prev => ({
                          ...prev,
                          tags: { ...prev.tags, forReview: e.target.checked }
                        }))}
                      />
                      <span className="text-xs text-gray-700">For Review</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded text-teal-600 w-3 h-3"
                        checked={editedDocProperties?.tags?.firstTime || false}
                        onChange={(e) => setEditedDocProperties(prev => ({
                          ...prev,
                          tags: { ...prev.tags, firstTime: e.target.checked }
                        }))}
                      />
                      <span className="text-xs text-gray-700">FirstTime</span>
                    </label>
                    <button className="text-xs text-teal-600 hover:text-teal-800 font-medium flex items-center gap-1 mt-1">
                      <span className="text-base">+</span> Add Tag
                    </button>
                  </div>
                </div>

                {/* Associated Conditions */}
                <div className="border-t">
                  <div className="px-4 py-2 bg-gray-50 border-b">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-semibold text-gray-800">Associated Conditions</h5>
                      <ChevronDown size={12} className="text-gray-500" />
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <label className="block text-xs text-gray-600 mb-1">Associated Condition</label>
                    <select
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      value={editedDocProperties?.associatedCondition || ''}
                      onChange={(e) => setEditedDocProperties(prev => ({ ...prev, associatedCondition: e.target.value }))}
                    >
                      <option value="">Select</option>
                      <option value="prior-to-docs">Prior to Docs</option>
                      <option value="prior-to-funding">Prior to Funding</option>
                      <option value="prior-to-closing">Prior to Closing</option>
                      <option value="post-closing">Post Closing</option>
                      <option value="cleared">Cleared</option>
                      <option value="outstanding">Outstanding</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div className="border-t">
                  <div className="px-4 py-2 bg-gray-50 border-b">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-semibold text-gray-800">Notes</h5>
                      <ChevronDown size={12} className="text-gray-500" />
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <textarea
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs bg-white resize-none focus:outline-none focus:ring-1 focus:ring-teal-500"
                      rows={4}
                      placeholder="Type notes here"
                      value={editedDocProperties?.notes || ''}
                      onChange={(e) => setEditedDocProperties(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Resizable Divider */}
              <div
                className="w-1 bg-gray-300 hover:bg-teal-500 cursor-col-resize flex-shrink-0 transition-colors"
                onMouseDown={(e) => {
                  e.preventDefault();
                  const startX = e.clientX;
                  const startWidth = docViewerSplitPosition;
                  const container = e.currentTarget.parentElement;

                  const handleMouseMove = (moveEvent) => {
                    if (container) {
                      const containerWidth = container.offsetWidth;
                      const deltaX = moveEvent.clientX - startX;
                      const deltaPercent = (deltaX / containerWidth) * 100;
                      const newWidth = Math.min(Math.max(15, startWidth + deltaPercent), 40);
                      setDocViewerSplitPosition(newWidth);
                    }
                  };

                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };

                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              />

              {/* Right Panel - PDF Viewer */}
              <div className="flex-1 flex flex-col">
                {/* Toolbar */}
                <div className="bg-white border-b px-3 py-2 flex items-center gap-1">
                  {/* Document Thumbnail Preview */}
                  <div className="mr-3">
                    <div className="w-12 h-16 bg-gray-200 rounded border border-gray-300 flex items-center justify-center">
                      <File size={20} className="text-gray-500" />
                    </div>
                  </div>

                  <div className="h-6 w-px bg-gray-300 mx-1"></div>

                  {/* Zoom Controls */}
                  <button className="p-1.5 hover:bg-gray-100 rounded" title="Zoom Out">
                    <span className="text-gray-600 text-sm font-bold">-</span>
                  </button>
                  <span className="text-xs text-gray-600 px-2">100%</span>
                  <button className="p-1.5 hover:bg-gray-100 rounded" title="Zoom In">
                    <span className="text-gray-600 text-sm font-bold">+</span>
                  </button>

                  <div className="h-6 w-px bg-gray-300 mx-1"></div>

                  {/* Page Navigation */}
                  <div className="flex items-center gap-2 px-2">
                    <span className="text-xs text-gray-600">1 / 1</span>
                  </div>

                  <div className="h-6 w-px bg-gray-300 mx-1"></div>

                  {/* Document Tools */}
                  <button className="p-1.5 hover:bg-gray-100 rounded" title="Highlight">
                    <div className="w-5 h-5 bg-yellow-200 rounded"></div>
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded" title="Draw">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 14 L14 2" />
                      </svg>
                    </div>
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded" title="Text">
                    <div className="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-600">A</div>
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded" title="Square">
                    <div className="w-5 h-5 border-2 border-gray-600 rounded"></div>
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded" title="Download">
                    <Download size={16} className="text-gray-600" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded" title="More Options">
                    <div className="w-5 h-5 flex items-center justify-center text-gray-600">...</div>
                  </button>

                  <div className="h-6 w-px bg-gray-300 mx-1"></div>

                  {/* Remove Button */}
                  <button className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded flex items-center gap-1">
                    <X size={12} />
                    Remove
                  </button>
                </div>

                {/* PDF Preview Area */}
                <div className="flex-1 overflow-auto bg-gray-100">
                  <div className="p-6">
                    <div className="bg-white shadow-lg max-w-4xl mx-auto">
                      {/* Realistic Document Templates */}
                      <DocumentTemplateSelector
                        documentType={viewingDocument.documentType}
                        documentName={viewingDocument.filename || viewingDocument.name}
                        category={viewingDocument.category}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t bg-gray-50">
              {/* Success Message - Full Width */}
              {showSaveSuccess && (
                <div className="mb-3 flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-xs text-green-700 font-medium">Changes saved successfully!</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <button className="text-xs text-teal-600 hover:text-teal-800 font-medium flex items-center gap-1">
                  <File size={14} />
                  Save/Add Document Split
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDocViewer(false);
                      setActiveDocument(null);
                      setEditedDocProperties(null);
                      setShowSaveSuccess(false);
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveDocumentProperties}
                    className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 font-medium text-xs"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowDocViewer(false);
                      setActiveDocument(null);
                      setEditedDocProperties(null);
                      setShowSaveSuccess(false);
                    }}
                    className="px-6 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 font-medium text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bundle Preview Modal - Clean PDF output stream */}
      {showBundlePreview && (
        <div className="fixed inset-0 bg-white z-[70]">
          {/* Close Button - Floating */}
          <button
            onClick={() => setShowBundlePreview(false)}
            className="fixed top-4 right-4 z-[80] p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 shadow-lg"
            title="Close Preview"
          >
            <X size={24} />
          </button>

          {/* Scrollable PDF Stream */}
          <div className="w-full h-full overflow-auto">
            <div className="max-w-[8.5in] mx-auto py-6">
              {stackingOrder
                .filter(doc => doc.status !== 'Missing')
                .map((doc, index, filteredDocs) => (
                  <div key={index}>
                    <DocumentTemplateSelector
                      documentType={doc.documentType}
                      documentName={doc.documentType}
                      category={doc.category}
                    />
                    {/* Simple page break between documents */}
                    {index < filteredDocs.length - 1 && (
                      <div className="h-6"></div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoBSingleFlow;
