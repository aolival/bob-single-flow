import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCw, Download, CheckCircle, XCircle, Loader2, File, X, Search, ChevronDown, ChevronRight, Lock, Eye, Filter, AlertTriangle, Menu, FolderOpen, Folder, ExternalLink, ArrowUpDown, MoreVertical, Tag, SplitSquareHorizontal, ZoomIn, RotateCw, Trash2, Upload, Info } from 'lucide-react';
import { getLoanDocumentStatus, getDocumentsByLoan } from '../services/epsDocumentApi';
import { openDocPreview, generateDocHtml } from '../services/docPreviewGenerator';
import { getAppUrl } from '../config/appUrls';
import DocumentTemplateSelector from './documentTemplates/DocumentTemplateSelector';
import NavigationPanel from './NavigationPanel';
import ShipperPage from './ShipperPage';
import ExampleScreenA from './ExampleScreenA';
import ExampleScreenB from './ExampleScreenB';

// Module-level constant — 20 PROD DocumentCategoryIDs (A–Z); All Others is Stored Doc Manager only
const STACKING_ORDER_CATEGORIES = [
  'APP','ASSET','AUDIT','BOND SUB FIN','CONST','CORR','CRED','DISC','DOCS',
  'GOV','INC','MCC','MISC','POST CLSNG','PROP','PTF DOCS','RENO','TITLE','Unsigned','WHS'
];

const BoBSingleFlow = () => {
  const [subjectLoan, setSubjectLoan] = useState('');
  const [bundleName, setBundleName] = useState('');
  const [externalBundleName, setExternalBundleName] = useState('');
  const [internalBundleName, setInternalBundleName] = useState('');
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
  const [isValidatingLoan, setIsValidatingLoan] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(new Set(STACKING_ORDER_CATEGORIES));
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categoryDropdownPos, setCategoryDropdownPos] = useState({ top: 0, left: 0 });
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
  const [showBundleInFlightModal, setShowBundleInFlightModal] = useState(false); // Concurrency lock: loan already being bundled elsewhere
  const [editedDocProperties, setEditedDocProperties] = useState(null); // Track edited document properties
  const [showSaveSuccess, setShowSaveSuccess] = useState(false); // Show success message after save
  const [showBundlePreview, setShowBundlePreview] = useState(false); // Show bundled PDF preview
  const [showDocsPanel, setShowDocsPanel] = useState(false); // Phase 3: Split-screen Stored Doc Manager
  const [finalDocsExpanded, setFinalDocsExpanded] = useState({}); // Phase 3: expanded state for Final Docs categories
  const [docPropertiesSlider, setDocPropertiesSlider] = useState(null); // Phase 3: doc clicked in Final Docs panel for slider
  const [finalDocsSelectedDocs, setFinalDocsSelectedDocs] = useState(new Set()); // Phase 3: selected docs in Final Docs panel
  const [splitPct, setSplitPct] = useState(50); // Phase 3: resizable split % (left panel width)
  const [finalDocsStatusMap, setFinalDocsStatusMap] = useState({}); // Phase 3: per-doc status overrides (docId → status)
  const [finalDocsStatusFilter, setFinalDocsStatusFilter] = useState(''); // Phase 3: filter stored docs by status
  const [finalDocsSort, setFinalDocsSort] = useState('date-desc'); // Phase 3: sort order for stored docs
  const [isSyncingDocs, setIsSyncingDocs] = useState(false); // Phase 3: LOS Document Sync in progress
  const [hoveredDocPreview, setHoveredDocPreview] = useState(null); // Phase 3: { html, x, y } for hover popup on eye icon
  const [showMoreMenuId, setShowMoreMenuId] = useState(null); // Phase 3: docId of open ⋯ menu
  const [showSplitModal, setShowSplitModal] = useState(null); // Phase 3: doc being split (null = closed)
  const [splitDocSlots, setSplitDocSlots] = useState([{ id: 1, type: '', name: '', pages: [] }]); // Phase 3: split document definitions
  const [splitKeepOriginal, setSplitKeepOriginal] = useState(true); // Phase 3: keep original doc checkbox
  const [splitSelectedPages, setSplitSelectedPages] = useState(new Set()); // Phase 3: pages selected for drag
  const [splitActiveSlot, setSplitActiveSlot] = useState(1); // Phase 3: which slot pages drop into
  const isDraggingSplit = useRef(false);
  const handleSplitMouseMove = useCallback((e) => {
    if (!isDraggingSplit.current) return;
    const pct = Math.min(75, Math.max(25, (e.clientX / window.innerWidth) * 100));
    setSplitPct(pct);
  }, []);

  // Navigation Panel State (Phase 4 Initiative)
  const [isNavPanelOpen, setIsNavPanelOpen] = useState(false); // Toggle navigation panel
  const [currentPage, setCurrentPage] = useState('single-flow'); // Current active page view

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

  // Close category dropdown on outside click
  useEffect(() => {
    if (!showCategoryDropdown) return;
    const close = () => setShowCategoryDropdown(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [showCategoryDropdown]);

  // External Vendor Packaging bundles — alphabetical, starting with Agency Due Diligence
  const externalBundleOptions = [
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

  // Internal Operations bundles — top 2 are live, rest are alphabetical placeholders
  const internalBundleOptions = [
    "Clear to Close Review",
    "Recording Fee Reconciliation",
    "— — — Coming Soon — —",
    "Compliance Checklist — Post-Fund Audit",
    "Disbursement Ledger Reconciliation",
    "HMDA Data Integrity Review",
    "HOI Coverage Verification",
    "Investor Delivery Package — Audit",
    "Loan Modification Review",
    "NOI / Net Tangible Benefit Review",
    "PCCD Refund Tracking",
    "Post-Close QC — Final Docs Audit",
    "Regulatory Audit — Government Loans",
    "Servicing Transfer Package",
    "Title Policy Review — Post-Fund",
    "VOE / Income Verification Audit",
    "Wire Confirmation & Disbursement Audit",
  ];

  // Generate stacking order using real EPS API
  const generateStackingOrder = async (loan, bundle) => {
    // Define required documents based on bundle type
    let requiredDocuments;

    if (bundle === 'Clear to Close Review') {
      requiredDocuments = [
        { documentType: 'HOI Policy', category: 'MISC', displayOrder: 1 },
        { documentType: 'Title', category: 'TITLE', displayOrder: 2 },
        { documentType: 'CPL', category: 'TITLE', displayOrder: 3 },
        { documentType: 'Appraisal', category: 'PROP', displayOrder: 4 },
        { documentType: 'Purchase Contract', category: 'PROP', displayOrder: 5 },
        { documentType: 'Bond Resv./Comm.', category: 'BOND SUB FIN', displayOrder: 6 },
        { documentType: 'Credit Report', category: 'CRED', displayOrder: 7 },
        { documentType: 'Flood Cert', category: 'MISC', displayOrder: 8 },
        { documentType: 'Docs (UNSIGNED - PTF BUCKET)', category: 'Unsigned', displayOrder: 9 },
        { documentType: 'Lock Rate lock', category: 'APP', displayOrder: 10 },
        { documentType: 'USPS', category: 'MISC', displayOrder: 11 },
      ];
    } else {
      requiredDocuments = [
        { documentType: '1003 Application', category: 'APP', displayOrder: 1 },
        { documentType: 'Credit Report', category: 'CRED', displayOrder: 2 },
        { documentType: 'Appraisal', category: 'PROP', displayOrder: 3 },
        { documentType: 'Title Insurance', category: 'TITLE', displayOrder: 4 },
        { documentType: 'W-2', category: 'INC', displayOrder: 5 },
        { documentType: 'Pay Stubs', category: 'INC', displayOrder: 6 },
        { documentType: 'Tax Returns', category: 'INC', displayOrder: 7 },
        { documentType: 'Self-Employment Income', category: 'INC', displayOrder: 8 },
        { documentType: 'Bank Statements', category: 'ASSET', displayOrder: 9 },
        { documentType: 'Investment Statements', category: 'ASSET', displayOrder: 10 },
        { documentType: 'Gift Letter', category: 'ASSET', displayOrder: 11 },
        { documentType: 'Closing Disclosure', category: 'DISC', displayOrder: 12 },
        { documentType: 'Promissory Note', category: 'DOCS', displayOrder: 13 },
        { documentType: 'Right of Rescission', category: 'DOCS', displayOrder: 14 },
      ];
    }

    // Special handling for Clear to Close Review (mock data for demo)
    if (bundle === 'Clear to Close Review') {
      console.log(`📄 Generating mock data for: ${bundle}`);

      // Pick 2 random indices for Missing and Located - Not Approved
      const totalDocs = requiredDocuments.length;
      const missingIndex = Math.floor(Math.random() * totalDocs);
      let locatedNotApprovedIndex = Math.floor(Math.random() * totalDocs);

      // Ensure locatedNotApprovedIndex is different from missingIndex
      while (locatedNotApprovedIndex === missingIndex) {
        locatedNotApprovedIndex = Math.floor(Math.random() * totalDocs);
      }

      // Generate mock documents with statuses
      const documents = requiredDocuments.map((doc, index) => {
        let status = 'Found';
        let foundCount = 1;

        if (index === missingIndex) {
          status = 'Missing';
          foundCount = 0;
        } else if (index === locatedNotApprovedIndex) {
          status = 'Located - Not Approved';
          foundCount = 1;
          // 25% chance of having multiple located documents (2 or 3)
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
          documents: status === 'Found' || status === 'Located - Not Approved' ? [{ id: 1, name: `${doc.documentType}.pdf` }] : [],
        };
      });

      console.log(`✅ Mock Data Generated - Found: ${documents.filter(d => d.status === 'Found').length}, Missing: 1, Located - Not Approved: 1`);
      return documents;
    }

    if (bundle === 'Recording Fee Reconciliation') {
      // The Big 3: CD (what was charged) → County Receipt (what was paid) → Proof of Refund (resolution)
      // Supporting docs fill out the full SOP checklist — statuses tell the story of a live discrepancy
      return [
        {
          category: 'POST CLSNG',
          documentType: 'Final Settlement Statement / Closing Disclosure',
          status: 'Found',
          displayOrder: 1,
          foundCount: 1,
          documents: [{ id: 1, name: 'Closing-Disclosure-Final.pdf' }],
          feeNote: 'CD line item: Mortgage Recording Fee — $64.00',
        },
        {
          category: 'POST CLSNG',
          documentType: 'County Recording Receipt — Deed of Trust',
          status: 'Located - Not Approved',
          displayOrder: 2,
          foundCount: 1,
          documents: [{ id: 2, name: 'County-Recording-Receipt-DOT.pdf' }],
          feeNote: 'County collected $50.00 — $14.00 short of CD amount',
        },
        {
          category: 'POST CLSNG',
          documentType: 'Proof of Refund / Recording Fee Overage Resolution',
          status: 'Missing',
          displayOrder: 3,
          foundCount: 0,
          documents: [],
          feeNote: 'SOP Step 10 — borrower refund confirmation required within 24h',
        },
        {
          category: 'PROP',
          documentType: 'Recorded Deed of Trust / Security Instrument',
          status: 'Found',
          displayOrder: 4,
          foundCount: 1,
          documents: [{ id: 4, name: 'Recorded-DOT-Security-Instrument.pdf' }],
          feeNote: null,
        },
        {
          category: 'PROP',
          documentType: 'Recorded Warranty Deed',
          status: 'Found',
          displayOrder: 5,
          foundCount: 1,
          documents: [{ id: 5, name: 'Recorded-Warranty-Deed.pdf' }],
          feeNote: null,
        },
        {
          category: 'POST CLSNG',
          documentType: 'Disbursement Ledger',
          status: 'Found',
          displayOrder: 6,
          foundCount: 1,
          documents: [{ id: 6, name: 'Disbursement-Ledger.pdf' }],
          feeNote: '$50.00 disbursed to county recorder — does not match CD',
        },
        {
          category: 'POST CLSNG',
          documentType: 'E-Recording Fee Confirmation / Vendor Receipt',
          status: 'Located - Not Approved',
          displayOrder: 7,
          foundCount: 1,
          documents: [{ id: 7, name: 'ERecording-Fee-Confirmation.pdf' }],
          feeNote: 'Pending approval — fee variance not yet reconciled',
        },
        {
          category: 'POST CLSNG',
          documentType: 'Settlement Agent Correspondence — Fee Overage Notice',
          status: 'Missing',
          displayOrder: 8,
          foundCount: 0,
          documents: [],
          feeNote: 'SOP Step 5 — agent must acknowledge overage in writing',
        },
        {
          category: 'TITLE',
          documentType: 'Title Insurance Policy (Lender)',
          status: 'Found',
          displayOrder: 9,
          foundCount: 1,
          documents: [{ id: 9, name: 'Lender-Title-Policy.pdf' }],
          feeNote: null,
        },
        {
          category: 'TITLE',
          documentType: 'Closing Protection Letter (CPL)',
          status: 'Found',
          displayOrder: 10,
          foundCount: 1,
          documents: [{ id: 10, name: 'Closing-Protection-Letter.pdf' }],
          feeNote: null,
        },
      ];
    }

    // For other bundles: Generate random preview with 80% Found, 10% Missing, 10% Located - Not Approved
    console.log(`📄 Generating random preview for: ${bundle}`);

    const totalDocs = requiredDocuments.length;
    const missingCount = Math.ceil(totalDocs * 0.1); // 10%
    const locatedNotApprovedCount = Math.ceil(totalDocs * 0.1); // 10%
    const foundCount = totalDocs - missingCount - locatedNotApprovedCount; // Remaining 80%

    // Shuffle indices to randomly assign statuses
    const indices = Array.from({ length: totalDocs }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // Assign statuses: first missingCount as Missing, next locatedNotApprovedCount as Located - Not Approved, rest as Found
    const missingIndices = new Set(indices.slice(0, missingCount));
    const locatedNotApprovedIndices = new Set(indices.slice(missingCount, missingCount + locatedNotApprovedCount));

    const documents = requiredDocuments.map((doc, index) => {
      let status = 'Found';
      let foundCountValue = 1;

      if (missingIndices.has(index)) {
        status = 'Missing';
        foundCountValue = 0;
      } else if (locatedNotApprovedIndices.has(index)) {
        status = 'Located - Not Approved';
        foundCountValue = 1;
        // 25% chance of having multiple located documents (2 or 3)
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
        documents: status === 'Found' || status === 'Located - Not Approved' ? [{ id: 1, name: `${doc.documentType}.pdf` }] : [],
      };
    });

    console.log(`✅ Random Preview Generated - Found: ${foundCount}, Missing: ${missingCount}, Located - Not Approved: ${locatedNotApprovedCount}`);
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
    const activeBundleName = externalBundleName || internalBundleName;
    // Validation should already be done at this point
    if (!loanValidated || (!externalBundleName && !internalBundleName)) {
      setValidationError('Please ensure loan number is validated and bundle is selected');
      return;
    }

    setValidationError('');
    setFieldsLocked(true);
    setIsLoadingDocuments(true);

    try {
      // Generate stacking order (now async with real API!)
      const docs = await generateStackingOrder(subjectLoan, activeBundleName);
      setStackingOrder(docs);

      // Fetch borrower name (mock for now - would come from EPS API)
      const mockBorrowerName = 'johndanieldoe'; // TODO: Fetch from API
      setBorrowerName(mockBorrowerName);

      // Set PDF Bundle Name (format: borrowername-loannumber-bundlename.pdf)
      const formattedBundleName = activeBundleName.toLowerCase().replace(/ /g, '');
      setPdfBundleName(`${mockBorrowerName}-${subjectLoan}-${formattedBundleName}.pdf`);
    } catch (error) {
      setValidationError(`Error loading documents: ${error.message}`);
      setFieldsLocked(false);
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  // TODO: Replace with real API call — POST /api/bundles/lock-check { loanNumber }
  // Returns { inFlight: boolean, lockedBy?: string, lockedIn?: string }
  const checkBundleInFlight = (loanNumber) => {
    // Demo simulation: loan numbers ending in an even digit are "in flight" elsewhere
    const lastChar = loanNumber.trim().slice(-1);
    return !isNaN(lastChar) && parseInt(lastChar) % 2 === 0;
  };

  const handleBuildBundle = () => {
    // NOTE: Concurrency lock check (ERR-001) is intentionally disabled in demo/local builds.
    // Modal code and checkBundleInFlight() are preserved below for prod API integration (see US-103-FE BRD).
    // TODO: Uncomment when POST /api/bundles/lock-check is available in prod.
    // if (checkBundleInFlight(subjectLoan)) { setShowBundleInFlightModal(true); return; }

    // Step 1: Check for inactive/unapproved documents
    if (inactiveDocuments.length > 0) {
      setShowInactiveWarning(true);
      return;
    }

    // Step 3: Proceed with build
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

    // TODO (US-105): Gate 2 — BytePro existence check via EPS API when live
    // ref: BRD-UserStory_US105__LoanSearch-NoMatchesFound-SingleFlow.md
    setValidationError('');
    setLoanValidated(true);
  };

  const handleStartNew = () => {
    setSubjectLoan('');
    setBundleName('');
    setExternalBundleName('');
    setInternalBundleName('');
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
        (doc.status === 'Located - Not Approved' && doc.foundCount > 1)) {
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
               (doc.status === 'Located - Not Approved' && doc.foundCount === 1)) {
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
        status: doc.status === 'Located - Not Approved' ? 'located-not-approved' : doc.status === 'Found' ? 'approved' : 'not-reviewed',
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

  const toggleFinalDocCategory = (category) => {
    setFinalDocsExpanded(prev => ({
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
      editedDocProperties.status === 'located-not-approved' ? 'Located - Not Approved' :
      editedDocProperties.status === 'approved' ? 'Found' :
      editedDocProperties.status === 'rejected' ? 'Missing' :
      editedDocProperties.status === 'pending' ? 'Located - Not Approved' :
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
    } else if (activeStatusTab === 'located-not-approved') {
      docs = docs.filter(d => d.status === 'Located - Not Approved');
    }

    // Filter by category — full set = show all, subset/empty = show only selected
    if (selectedCategories.size < STACKING_ORDER_CATEGORIES.length) {
      docs = docs.filter(d => selectedCategories.has(d.category));
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
  const locatedNotApprovedCount = stackingOrder.filter(d => d.status === 'Located - Not Approved').length;

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col">
      {/* Navigation Panel */}
      <NavigationPanel
        isOpen={isNavPanelOpen}
        onClose={() => setIsNavPanelOpen(false)}
        onNavigate={(pageId) => setCurrentPage(pageId)}
        currentPage={currentPage}
      />

      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsNavPanelOpen(!isNavPanelOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Open navigation"
          >
            <Menu size={24} className="text-gray-700" />
          </button>

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
                    window.location.href = getAppUrl('bulk-bundle');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                >
                  Switch to BoB - Bulk Delivery
                </button>
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    window.location.href = getAppUrl('doctor-bob');
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                >
                  Switch to Doctor BoB - Single Loan
                </button>
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    window.location.href = getAppUrl('doctor-bob-bulk');
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

      {/* Conditional Page Rendering */}
      {currentPage === 'shipper' && <ShipperPage onMenuToggle={() => setIsNavPanelOpen(!isNavPanelOpen)} onNavigateBack={() => setCurrentPage('single-flow')} />}
      {currentPage === 'example-a' && <ExampleScreenA onMenuToggle={() => setIsNavPanelOpen(!isNavPanelOpen)} onNavigateBack={() => setCurrentPage('single-flow')} />}
      {currentPage === 'example-b' && <ExampleScreenB onMenuToggle={() => setIsNavPanelOpen(!isNavPanelOpen)} onNavigateBack={() => setCurrentPage('single-flow')} />}

      {/* Original Single Flow Content */}
      {currentPage === 'single-flow' && (
      <>
      <div
        className="flex flex-1 overflow-hidden"
        onMouseMove={handleSplitMouseMove}
        onMouseUp={() => { isDraggingSplit.current = false; }}
        onMouseLeave={() => { isDraggingSplit.current = false; }}
      >
        <div style={showDocsPanel ? { width: `${splitPct}%` } : {}} className={`${showDocsPanel ? '' : 'max-w-4xl mx-auto w-full'} p-4 transition-none flex flex-col overflow-hidden`}>
        <h1 className="text-2xl font-bold text-gray-800 mb-3 flex-shrink-0">
          Bundle Builder - Single Loan
        </h1>

        {/* Selection Section */}
        <div className="mb-2 flex-shrink-0">
          <div className="space-y-3">
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

              {/* Bundle Dropdowns - Show when loan is validated */}
              {loanValidated && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {/* LEFT COLUMN: External (default) or Internal when internal is chosen */}
                  <div>
                    {!internalBundleName && (
                      <>
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                          Select Bundle — External Vendor Packaging
                        </label>
                        <select
                          value={externalBundleName}
                          onChange={async (e) => {
                            const selectedBundle = e.target.value;
                            setExternalBundleName(selectedBundle);
                            setInternalBundleName('');
                            setBundleName(selectedBundle);
                            if (selectedBundle) {
                              const mockBorrowerName = 'johndanieldoe'; // TODO: Fetch from API
                              const formattedBundleName = selectedBundle.toLowerCase().replace(/ /g, '');
                              setPdfBundleName(`${mockBorrowerName}-${subjectLoan}-${formattedBundleName}.pdf`);
                              setBorrowerName(mockBorrowerName);
                              setIsLoadingDocuments(true);
                              try {
                                const docs = await generateStackingOrder(subjectLoan, selectedBundle);
                                setStackingOrder(docs);
                                setFieldsLocked(true);
                              } catch (err) {
                                console.error('Failed to auto-generate stacking order:', err);
                              } finally {
                                setIsLoadingDocuments(false);
                              }
                            } else {
                              setPdfBundleName('');
                              setStackingOrder([]);
                            }
                          }}
                          disabled={fieldsLocked}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        >
                          <option value="">— Select a bundle —</option>
                          {externalBundleOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </>
                    )}
                    {internalBundleName && (
                      <>
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                          Select Bundle — Internal Operations
                        </label>
                        <select
                          value={internalBundleName}
                          disabled
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-gray-50"
                        >
                          {internalBundleOptions.map((opt, i) => (
                            opt.startsWith('—')
                              ? <option key={i} disabled>{opt}</option>
                              : <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>

                  {/* RIGHT COLUMN: Internal dropdown (pre-selection) or PDF bundle name (post-selection) */}
                  <div>
                    {!externalBundleName && !internalBundleName && (
                      <>
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                          Select Bundle — Internal Operations
                        </label>
                        <select
                          value={internalBundleName}
                          onChange={async (e) => {
                            const selectedBundle = e.target.value;
                            setInternalBundleName(selectedBundle);
                            setExternalBundleName('');
                            setBundleName(selectedBundle);
                            if (selectedBundle) {
                              const mockBorrowerName = 'johndanieldoe'; // TODO: Fetch from API
                              const formattedBundleName = selectedBundle.toLowerCase().replace(/ /g, '');
                              setPdfBundleName(`${mockBorrowerName}-${subjectLoan}-${formattedBundleName}.pdf`);
                              setBorrowerName(mockBorrowerName);
                              setIsLoadingDocuments(true);
                              try {
                                const docs = await generateStackingOrder(subjectLoan, selectedBundle);
                                setStackingOrder(docs);
                                setFieldsLocked(true);
                              } catch (err) {
                                console.error('Failed to auto-generate stacking order:', err);
                              } finally {
                                setIsLoadingDocuments(false);
                              }
                            } else {
                              setPdfBundleName('');
                              setStackingOrder([]);
                            }
                          }}
                          disabled={fieldsLocked}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        >
                          <option value="">— Select a bundle —</option>
                          {internalBundleOptions.map((opt, i) => (
                            opt.startsWith('—')
                              ? <option key={i} disabled style={{ color: '#9ca3af', fontStyle: 'italic' }}>{opt}</option>
                              : <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </>
                    )}
                    {(externalBundleName || internalBundleName) && (
                      <>
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                          Bundle Name
                        </label>
                        <input
                          type="text"
                          value={pdfBundleName}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-600 text-xs"
                          placeholder="Auto-generated"
                        />
                      </>
                    )}
                  </div>
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
              <div className="flex justify-end items-center gap-3 mt-2">
                <button
                  onClick={handleStartNew}
                  className="px-4 py-2 bg-teal-100 text-teal-700 rounded hover:bg-teal-200 font-medium text-xs"
                >
                  Start New Bundle
                </button>

                {/* Build complete: Re-Build + Download */}
                {buildComplete && !isBuilding && (
                  <>
                    <button
                      onClick={handleRebuildBundle}
                      className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 font-medium text-xs"
                    >
                      Re-Build Bundle
                    </button>
                    <button
                      onClick={handleDownloadBundle}
                      className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 font-medium text-xs"
                    >
                      <Download size={13} />
                      Download Bundle
                    </button>
                  </>
                )}

                {/* Building in progress */}
                {isBuilding && (
                  <button disabled className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed font-medium text-xs flex items-center gap-2">
                    <Loader2 className="animate-spin" size={14} />
                    Building...
                  </button>
                )}

                {/* Not yet built: Build Bundle */}
                {!buildComplete && !isBuilding && (
                  <button
                    onClick={stackingOrder.length > 0 ? handleBuildBundle : handleLoadStackingOrder}
                    disabled={isLoadingDocuments}
                    className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed text-xs flex items-center gap-2"
                  >
                    {isLoadingDocuments ? (
                      <>
                        <Loader2 className="animate-spin" size={14} />
                        Loading...
                      </>
                    ) : (
                      'Build Bundle'
                    )}
                  </button>
                )}
              </div>
            )}
        </div>

        {/* Stacking Order Display */}
        {stackingOrder.length > 0 && (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="pb-2 mb-1 flex items-center justify-between flex-shrink-0">
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

            <div className="py-2 flex flex-col flex-1 min-h-0">
              {/* Status Tabs and Actions */}
              <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                {/* Filter tabs */}
                <button
                  onClick={() => setActiveStatusTab('all')}
                  className={`px-3 py-1.5 rounded font-medium text-xs whitespace-nowrap ${
                    activeStatusTab === 'all'
                      ? 'bg-white border-2 border-teal-600 text-teal-600'
                      : 'bg-white border border-gray-300 text-gray-600'
                  }`}
                >
                  All {stackingOrder.length > 0 && <span className="ml-1">{stackingOrder.length}</span>}
                </button>
                <button
                  onClick={() => setActiveStatusTab('missing')}
                  className={`px-3 py-1.5 rounded font-medium flex items-center text-xs whitespace-nowrap ${
                    activeStatusTab === 'missing'
                      ? 'bg-white border-2 border-teal-600 text-teal-600'
                      : 'bg-white border border-gray-300 text-gray-600'
                  }`}
                  title="Documents NOT found in BytePro loan file database"
                >
                  Missing {missingCount > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full font-semibold">{missingCount}</span>
                  )}
                </button>
                <button
                  onClick={() => setActiveStatusTab('located-not-approved')}
                  className={`px-3 py-1.5 rounded font-medium flex items-center text-xs whitespace-nowrap ${
                    activeStatusTab === 'located-not-approved'
                      ? 'bg-white border-2 border-teal-600 text-teal-600'
                      : 'bg-white border border-gray-300 text-gray-600'
                  }`}
                  title="Document is on file but has NOT been statused as approved"
                >
                  Located - Not Approved {locatedNotApprovedCount > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 bg-yellow-500 text-white text-xs rounded-full font-semibold">{locatedNotApprovedCount}</span>
                  )}
                </button>
                <button
                  onClick={() => setActiveStatusTab('found')}
                  className={`px-3 py-1.5 rounded font-medium text-xs whitespace-nowrap ${
                    activeStatusTab === 'found'
                      ? 'bg-white border-2 border-teal-600 text-teal-600'
                      : 'bg-white border border-gray-300 text-gray-600'
                  }`}
                  title="Approved documents ready for bundle"
                >
                  Found {foundCount > 0 && <span className="ml-1">{foundCount}</span>}
                </button>

                {/* Checkbox — plain, no border box, matching prod */}
                <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer select-none whitespace-nowrap ml-1" title="Hide docs marked as NOT Applicable">
                  <input
                    type="checkbox"
                    checked={hideNotApplicableDocs}
                    onChange={(e) => setHideNotApplicableDocs(e.target.checked)}
                    className="rounded accent-teal-600"
                  />
                  <span>Hide Not Applicable Docs</span>
                </label>

                {/* Push Stored Doc Manager + refresh to the right */}
                <div className="flex-1" />

                <button
                  onClick={() => setShowDocsPanel(prev => !prev)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded font-medium text-xs transition-colors whitespace-nowrap ${
                    showDocsPanel
                      ? 'bg-teal-600 text-white hover:bg-teal-700'
                      : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                  }`}
                >
                  <FolderOpen size={14} />
                  <span>Stored Doc Manager</span>
                </button>

                {/* Refresh — far right, circular, matching prod */}
                <button
                  onClick={async () => {
                    if (subjectLoan && bundleName) {
                      setIsLoadingDocuments(true);
                      try {
                        const docs = await generateStackingOrder(subjectLoan, bundleName);
                        setStackingOrder(docs);
                      } catch (err) { console.error(err); }
                      finally { setIsLoadingDocuments(false); }
                    }
                  }}
                  className="w-8 h-8 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-500 hover:text-teal-600 transition-colors flex items-center justify-center flex-shrink-0"
                  title="Refresh stacking order and document data"
                >
                  <RefreshCw size={14} />
                </button>
              </div>

              {/* Documents Table — only this scrolls, form section above stays fixed */}
              <div className="border border-gray-200 rounded overflow-hidden flex flex-col flex-1 min-h-0">
                <div className="overflow-y-auto flex-1">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b sticky top-0 z-10">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document Type
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      {(() => {
                        const isFiltered = selectedCategories.size < STACKING_ORDER_CATEGORIES.length;
                        const allSelected = selectedCategories.size === STACKING_ORDER_CATEGORIES.length;
                        return (
                          <th className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wider ${isFiltered ? 'bg-teal-50 text-teal-700' : 'text-gray-500'}`}>
                            <div className="flex items-center gap-1">
                              <span>Category</span>
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  if (!showCategoryDropdown) {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setCategoryDropdownPos({ top: rect.bottom + 4, left: rect.left });
                                  }
                                  setShowCategoryDropdown(v => !v);
                                }}
                                className={`p-0.5 rounded ${isFiltered ? 'text-teal-600' : 'text-gray-400 hover:text-gray-600'}`}
                                title="Filter by category"
                              >
                                <Filter size={12} />
                              </button>
                            </div>
                          </th>
                        );
                      })()}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDocs.map((doc, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 py-2">
                          <div>
                            {doc.status === 'Found' && doc.foundCount === 1 ? (
                              <span className="flex items-center gap-1.5">
                                {activeDocument === doc.documentType && (
                                  <Eye size={14} className="text-teal-600 flex-shrink-0" />
                                )}
                                <span className="font-medium text-xs text-gray-800">{doc.documentType}</span>
                                <button
                                  onClick={() => openDocPreview(doc.documentType, subjectLoan, borrowerName)}
                                  title="Open document preview"
                                  className="p-0.5 rounded hover:bg-teal-100 text-teal-500 hover:text-teal-700 flex-shrink-0"
                                >
                                  <ExternalLink size={15} />
                                </button>
                              </span>
                            ) : doc.status === 'Found' && doc.foundCount > 1 ? (
                              <span className="flex items-center gap-1.5">
                                {activeDocument === doc.documentType && (
                                  <Eye size={14} className="text-teal-600 flex-shrink-0" />
                                )}
                                <span className="font-medium text-xs text-gray-800">{doc.documentType}</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5">
                                {activeDocument === doc.documentType && (
                                  <Eye size={14} className="text-teal-600 flex-shrink-0" />
                                )}
                                <span className="font-medium text-xs text-gray-800">{doc.documentType}</span>
                              </span>
                            )}
                            {doc.feeNote && (
                              <p className="text-xs text-amber-600 font-medium mt-0.5">{doc.feeNote}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <span className="flex items-center gap-1.5">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              doc.status === 'Found'
                                ? 'bg-gray-100 text-gray-800'
                                : doc.status === 'Missing'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {doc.status === 'Found'
                                ? 'Found -'
                                : doc.status === 'Located - Not Approved'
                                ? 'Located - Not Approved -'
                                : doc.status === 'Missing'
                                ? 'Missing - Not Located in Loan File'
                                : doc.status}
                            </span>
                            {doc.status === 'Found' && doc.foundCount === 1 && (
                              <span
                                className="px-1.5 py-0.5 bg-green-50 text-green-700 border border-green-300 rounded text-xs font-bold flex-shrink-0"
                                title="Single document found — ready to preview"
                              >
                                {doc.foundCount}
                              </span>
                            )}
                            {doc.status === 'Found' && doc.foundCount > 1 && (
                              <span
                                className="px-1.5 py-0.5 bg-amber-100 text-amber-700 border border-amber-300 rounded text-xs font-bold flex-shrink-0"
                                title={`${doc.foundCount} copies found — document viewer requires a single source to launch directly`}
                              >
                                {doc.foundCount}
                              </span>
                            )}
                            {doc.status === 'Located - Not Approved' && (
                              <span
                                className="px-1.5 py-0.5 bg-yellow-50 text-yellow-700 border border-yellow-300 rounded text-xs font-bold flex-shrink-0"
                                title={`${doc.foundCount} ${doc.foundCount === 1 ? 'copy' : 'copies'} located but NOT approved`}
                              >
                                {doc.foundCount}
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700 text-xs">{doc.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>{/* end scroll container */}
              </div>{/* end border wrapper */}

              {/* Category filter panel — fixed to viewport, escapes all overflow containers */}
              {showCategoryDropdown && (() => {
                const isFiltered = selectedCategories.size < STACKING_ORDER_CATEGORIES.length;
                const allSelected = selectedCategories.size === STACKING_ORDER_CATEGORIES.length;
                return (
                  <div
                    style={{ position: 'fixed', top: categoryDropdownPos.top, left: categoryDropdownPos.left, zIndex: 9999 }}
                    className="w-52 bg-white border border-gray-200 rounded-lg shadow-xl"
                    onClick={e => e.stopPropagation()}
                  >
                    {/* (Select All) row — Excel style */}
                    <div className="px-3 py-2 border-b border-gray-100">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          ref={el => { if (el) el.indeterminate = !allSelected && selectedCategories.size > 0; }}
                          onChange={() => setSelectedCategories(allSelected ? new Set() : new Set(STACKING_ORDER_CATEGORIES))}
                          className="accent-teal-600 w-3.5 h-3.5"
                        />
                        <span className="text-xs font-semibold text-gray-700">(Select All)</span>
                      </label>
                    </div>
                    {/* Individual categories */}
                    <div className="py-1 max-h-64 overflow-y-auto">
                      {STACKING_ORDER_CATEGORIES.map(cat => (
                        <label key={cat} className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCategories.has(cat)}
                            onChange={() => {
                              const next = new Set(selectedCategories);
                              if (next.has(cat)) next.delete(cat); else next.add(cat);
                              setSelectedCategories(next);
                            }}
                            className="accent-teal-600 w-3.5 h-3.5 flex-shrink-0"
                          />
                          <span className="text-xs text-gray-700">{cat}</span>
                        </label>
                      ))}
                    </div>
                    {/* Footer */}
                    <div className="border-t border-gray-100 flex justify-end gap-3 px-3 py-2">
                      <button onClick={() => setShowCategoryDropdown(false)} className="text-xs text-gray-500 hover:text-gray-700">Close</button>
                      {isFiltered && (
                        <button
                          onClick={() => { setSelectedCategories(new Set(STACKING_ORDER_CATEGORIES)); setShowCategoryDropdown(false); }}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}

            </div>
          </div>
        )}
        </div>{/* end left panel */}

        {/* Draggable Divider */}
        {showDocsPanel && !docPropertiesSlider && (
          <div
            className="w-1.5 flex-shrink-0 bg-gray-200 hover:bg-teal-400 cursor-col-resize active:bg-teal-500 transition-colors z-20 flex items-center justify-center"
            onMouseDown={(e) => { e.preventDefault(); isDraggingSplit.current = true; }}
            title="Drag to resize"
          >
            <div className="w-0.5 h-8 bg-gray-400 rounded-full" />
          </div>
        )}

        {/* Right Panel: Final Documents in LOS */}
        {showDocsPanel && (() => {
          // Categories: 20 PROD DocumentCategoryIDs sorted A–Z, All Others pinned last (no valid DocTypeID)
          const FINAL_DOCS_CATEGORIES = [
            { name: 'APP', categoryId: 1000001, count: 7, docs: [
              { id: 'app-1', type: 'Loan Application', filename: '20251118194221_Loan_Application_Ryan_Lively', date: '11/18/25, 11:42 AM', createdBy: 'Borrower 1003', source: '', status: 'Approved' },
              { id: 'app-2', type: 'Loan Application', filename: 'Ryan_Lively_20251118194221_XMLApplication', date: '11/18/25, 11:42 AM', createdBy: 'Borrower 1003', source: '', status: 'Approved' },
              { id: 'app-3', type: 'Loan Application', filename: '1003 Uniform Residential Loan Application - 1-2021 (Ryan Lively)', date: '1/12/26, 12:56 PM', createdBy: 'SVC-BytePushback-PROD', source: 'Imported from LOS', status: 'Approved' },
              { id: 'app-4', type: 'Supplemental Consumer Information Form', filename: '1103 Supplemental Consumer Information Form (Ryan Lively)', date: '1/12/26, 12:56 PM', createdBy: 'SVC-BytePushback-PROD', source: 'Imported from LOS', status: 'Approved' },
              { id: 'app-5', type: 'Personal Identification', filename: 'Driver License', date: '1/14/26, 6:27 AM', createdBy: 'Shannon Lang', source: '', status: 'Approved' },
              { id: 'app-6', type: '1008 Transmittal Summary', filename: '1008 Transmittal Summary', date: '2/20/26, 2:48 PM', createdBy: 'KylieGrossman', source: 'Imported from LOS', status: 'Approved' },
              { id: 'app-7', type: 'Final 1003', filename: 'Final 1003', date: '2/27/26, 7:48 AM', createdBy: 'MindyWebb', source: 'Imported from LOS', status: 'Not Reviewed' },
            ]},
            { name: 'ASSET', categoryId: 1000005, count: 2, docs: [
              { id: 'asset-1', type: 'Bank Statement', filename: 'Chase_Bank_Statement_Dec2025', date: '1/14/26, 8:20 AM', createdBy: 'Shannon Lang', source: '', status: 'Approved' },
              { id: 'asset-2', type: 'Investment Account', filename: 'Fidelity_Investment_Statement', date: '1/14/26, 8:22 AM', createdBy: 'Shannon Lang', source: '', status: 'Not Reviewed' },
            ]},
            { name: 'AUDIT', categoryId: 1000011, count: 2, docs: [
              { id: 'audit-1', type: 'QC Audit Report', filename: 'QC_Audit_Final_Report', date: '3/15/26, 9:00 AM', createdBy: 'MindyWebb', source: 'Imported from LOS', status: 'Approved' },
            ]},
            { name: 'BOND SUB FIN', categoryId: 1000016, count: 3, docs: [
              { id: 'bond-1', type: 'Bond Reservation', filename: 'Bond_Reservation_Confirmation', date: '1/15/26, 10:00 AM', createdBy: 'KylieGrossman', source: 'Imported from LOS', status: 'Approved' },
              { id: 'bond-2', type: 'Bond Commitment', filename: 'Bond_Commitment_Letter', date: '1/15/26, 10:05 AM', createdBy: 'KylieGrossman', source: '', status: 'Reviewed' },
            ]},
            { name: 'CONST', categoryId: 1000020, count: 0, docs: [] },
            { name: 'CORR', categoryId: 1000012, count: 3, docs: [
              { id: 'corr-1', type: 'Commitment Letter', filename: 'Commitment_Letter_Ryan_Lively', date: '1/20/26, 3:00 PM', createdBy: 'KylieGrossman', source: 'Imported from LOS', status: 'Approved' },
              { id: 'corr-2', type: 'Borrower Correspondence', filename: 'Conditions_Satisfaction_Letter', date: '2/15/26, 10:00 AM', createdBy: 'MindyWebb', source: '', status: 'Not Reviewed' },
            ]},
            { name: 'CRED', categoryId: 1000003, count: 17, docs: [
              { id: 'cred-1', type: 'Other Property Owned PITI Documentation', filename: 'HOA - no HOA dues on any home', date: '1/14/26, 6:28 AM', createdBy: 'Shannon Lang', source: '', status: 'Approved' },
              { id: 'cred-2', type: 'Mortgage Statement', filename: '5105 N 32nd Pl- Tru West- Due 12/31', date: '1/14/26, 6:28 AM', createdBy: 'Shannon Lang', source: '', status: 'Approved' },
              { id: 'cred-3', type: 'Mortgage Statement', filename: '4602 N 74th Pl- Due 12/1', date: '1/14/26, 6:29 AM', createdBy: 'Shannon Lang', source: '', status: 'Reviewed' },
              { id: 'cred-4', type: 'Credit Report', filename: 'Tri-Merge Credit Report', date: '1/14/26, 7:00 AM', createdBy: 'Shannon Lang', source: '', status: 'Approved' },
              { id: 'cred-5', type: 'Credit Explanation Letter', filename: 'Credit Explanation - Collections', date: '1/15/26, 9:12 AM', createdBy: 'MindyWebb', source: '', status: 'Incomplete' },
              { id: 'cred-6', type: 'Liability Documentation', filename: 'Auto Loan Statement', date: '1/15/26, 9:15 AM', createdBy: 'MindyWebb', source: '', status: 'Not Reviewed' },
            ]},
            { name: 'DISC', categoryId: 1000002, count: 42, docs: [
              { id: 'disc-1', type: 'Closing Disclosure', filename: 'Final_CD_Signed', date: '2/25/26, 3:00 PM', createdBy: 'KylieGrossman', source: 'Imported from LOS', status: 'Ready to Ship' },
              { id: 'disc-2', type: 'Initial Closing Disclosure', filename: 'Initial_CD_Ryan_Lively', date: '2/10/26, 9:00 AM', createdBy: 'SVC-BytePushback-PROD', source: 'Imported from LOS', status: 'Approved' },
              { id: 'disc-3', type: 'Loan Estimate', filename: 'LE_Initial_Disclosure', date: '1/12/26, 1:00 PM', createdBy: 'SVC-BytePushback-PROD', source: 'Imported from LOS', status: 'Approved' },
            ]},
            { name: 'DOCS', categoryId: 1000007, count: 25, docs: [
              { id: 'docs-1', type: 'Note', filename: 'Promissory_Note_Signed', date: '2/28/26, 9:00 AM', createdBy: 'MindyWebb', source: 'Imported from LOS', status: 'Ready to Ship' },
              { id: 'docs-2', type: 'Deed of Trust', filename: 'Deed_of_Trust_Recorded', date: '2/28/26, 9:05 AM', createdBy: 'MindyWebb', source: 'Imported from LOS', status: 'Approved' },
              { id: 'docs-3', type: 'Right of Rescission', filename: 'Right_of_Rescission_Signed', date: '2/28/26, 9:10 AM', createdBy: 'MindyWebb', source: 'Imported from LOS', status: 'Approved' },
            ]},
            { name: 'GOV', categoryId: 1000008, count: 4, docs: [
              { id: 'gov-1', type: 'AUS Findings', filename: 'DU_Approve_Eligible_Findings', date: '1/12/26, 1:10 PM', createdBy: 'SVC-BytePushback-PROD', source: 'Imported from LOS', status: 'Approved' },
              { id: 'gov-2', type: 'FHA Case Number Assignment', filename: 'FHA_Case_Number_Assignment', date: '1/13/26, 9:00 AM', createdBy: 'KylieGrossman', source: 'Imported from LOS', status: 'Approved' },
              { id: 'gov-3', type: 'HUD-92900-A', filename: 'HUD_92900A_Addendum_Signed', date: '2/28/26, 9:30 AM', createdBy: 'MindyWebb', source: 'Imported from LOS', status: 'Ready to Ship' },
              { id: 'gov-4', type: 'MIP Disclosure', filename: 'MIP_Disclosure_Borrower_Signed', date: '1/12/26, 2:00 PM', createdBy: 'SVC-BytePushback-PROD', source: 'Imported from LOS', status: 'Approved' },
            ]},
            { name: 'INC', categoryId: 1000004, count: 30, docs: [
              { id: 'inc-1', type: 'W-2', filename: 'W2_2024_Ryan_Lively', date: '1/14/26, 8:00 AM', createdBy: 'Shannon Lang', source: '', status: 'Approved' },
              { id: 'inc-2', type: 'Pay Stubs', filename: 'PayStubs_Dec2025_Jan2026', date: '1/14/26, 8:05 AM', createdBy: 'Shannon Lang', source: '', status: 'Reviewed' },
              { id: 'inc-3', type: 'Tax Returns', filename: '2024_Federal_Tax_Return', date: '1/14/26, 8:10 AM', createdBy: 'Shannon Lang', source: 'Imported from LOS', status: 'Missing Pages' },
            ]},
            { name: 'MCC', categoryId: 1000018, count: 1, docs: [
              { id: 'mcc-1', type: 'Mortgage Credit Certificate', filename: 'MCC_Certificate_Ryan_Lively', date: '1/20/26, 11:00 AM', createdBy: 'KylieGrossman', source: 'Imported from LOS', status: 'Approved' },
            ]},
            { name: 'MISC', categoryId: 1000010, count: 3, docs: [
              { id: 'misc-1', type: 'HOI Policy', filename: 'HOI_Declarations_Page', date: '1/14/26, 7:00 AM', createdBy: 'Shannon Lang', source: '', status: 'Approved' },
              { id: 'misc-2', type: 'Flood Certification', filename: 'FEMA_Flood_Cert', date: '1/14/26, 7:05 AM', createdBy: 'Shannon Lang', source: 'Imported from LOS', status: 'Approved' },
              { id: 'misc-3', type: 'USPS Address Verification', filename: 'USPS_Address_Verification', date: '1/14/26, 7:10 AM', createdBy: 'SVC-BytePushback-PROD', source: 'Imported from LOS', status: 'Approved' },
            ]},
            { name: 'POST CLSNG', categoryId: 1000015, count: 6, docs: [
              { id: 'postclsng-1', type: 'Post-Closing Checklist', filename: 'Post_Closing_Checklist_Complete', date: '3/5/26, 8:00 AM', createdBy: 'KylieGrossman', source: '', status: 'Approved' },
              { id: 'postclsng-2', type: 'Recorded Deed', filename: 'Recorded_Deed_of_Trust', date: '3/10/26, 2:00 PM', createdBy: 'KylieGrossman', source: 'Imported from LOS', status: 'Not Reviewed' },
            ]},
            { name: 'PROP', categoryId: 1000006, count: 20, docs: [
              { id: 'prop-1', type: 'Appraisal', filename: 'Full_Appraisal_Report_2026', date: '1/20/26, 10:00 AM', createdBy: 'KylieGrossman', source: 'Imported from LOS', status: 'Approved' },
              { id: 'prop-2', type: 'Purchase Contract', filename: 'Fully_Executed_Purchase_Contract', date: '1/12/26, 2:00 PM', createdBy: 'SVC-BytePushback-PROD', source: 'Imported from LOS', status: 'Approved' },
              { id: 'prop-3', type: 'Title Commitment', filename: 'Title_Commitment_Prelim', date: '1/18/26, 11:30 AM', createdBy: 'MindyWebb', source: '', status: 'Incomplete' },
            ]},
            { name: 'PTF DOCS', categoryId: 1000013, count: 4, docs: [
              { id: 'ptf-1', type: 'Pre-Funding Checklist', filename: 'Pre_Funding_Checklist_Complete', date: '2/26/26, 8:00 AM', createdBy: 'KylieGrossman', source: '', status: 'Approved' },
              { id: 'ptf-2', type: 'Wire Instructions', filename: 'PTF_Wire_Instructions_Verified', date: '2/26/26, 8:15 AM', createdBy: 'KylieGrossman', source: '', status: 'Reviewed' },
              { id: 'ptf-3', type: 'PTF Condition', filename: 'PTF_Condition_Final_CD_Signed', date: '2/25/26, 4:00 PM', createdBy: 'MindyWebb', source: 'Imported from LOS', status: 'Approved' },
            ]},
            { name: 'RENO', categoryId: 1000019, count: 0, docs: [] },
            { name: 'TITLE', categoryId: 1000009, count: 4, docs: [
              { id: 'title-1', type: 'Title Policy', filename: 'Owners_Title_Policy', date: '2/28/26, 8:00 AM', createdBy: 'MindyWebb', source: 'Imported from LOS', status: 'Approved' },
              { id: 'title-2', type: 'CPL', filename: 'Closing_Protection_Letter', date: '2/28/26, 8:05 AM', createdBy: 'MindyWebb', source: '', status: 'Ready to Ship' },
            ]},
            { name: 'Unsigned', categoryId: 1000017, count: 3, docs: [
              { id: 'unsigned-1', type: 'Note (Unsigned)', filename: 'Note_UNSIGNED_PreClose', date: '2/27/26, 3:00 PM', createdBy: 'SVC-BytePushback-PROD', source: 'Imported from LOS', status: 'Not Reviewed' },
              { id: 'unsigned-2', type: 'Deed of Trust (Unsigned)', filename: 'Deed_UNSIGNED_PreClose', date: '2/27/26, 3:05 PM', createdBy: 'SVC-BytePushback-PROD', source: 'Imported from LOS', status: 'Not Reviewed' },
              { id: 'unsigned-3', type: 'Right of Rescission (Unsigned)', filename: 'ROR_UNSIGNED_PreClose', date: '2/27/26, 3:10 PM', createdBy: 'SVC-BytePushback-PROD', source: 'Imported from LOS', status: 'Not Reviewed' },
            ]},
            { name: 'WHS', categoryId: 1000014, count: 2, docs: [
              { id: 'whs-1', type: 'Warehouse Funding Request', filename: 'Warehouse_Funding_Request_CMG', date: '2/28/26, 7:00 AM', createdBy: 'SVC-BytePushback-PROD', source: 'Imported from LOS', status: 'Approved' },
              { id: 'whs-2', type: 'Warehouse Payoff', filename: 'Warehouse_Payoff_Confirmation', date: '3/5/26, 2:00 PM', createdBy: 'KylieGrossman', source: '', status: 'Not Reviewed' },
            ]},
            { name: 'All Others', categoryId: null, isOther: true, count: 4, docs: [
              { id: 'other-u1', type: 'Unclassified', filename: 'Unnamed_Document_01142026', date: '1/14/26, 10:22 AM', createdBy: 'Shannon Lang', source: 'Imported from LOS', status: 'Not Reviewed' },
              { id: 'other-u2', type: 'Unclassified', filename: 'Upload_022026_untitled', date: '2/1/26, 4:15 PM', createdBy: 'KylieGrossman', source: '', status: 'Not Reviewed' },
              { id: 'other-u3', type: 'Unclassified', filename: 'BytePro_Import_NoCategory', date: '1/12/26, 1:00 PM', createdBy: 'SVC-BytePushback-PROD', source: 'Imported from LOS', status: 'Not Reviewed' },
              { id: 'other-u4', type: 'Unclassified', filename: 'LOS_Export_MissingDocType_03032026', date: '3/3/26, 8:44 AM', createdBy: 'SVC-BytePushback-PROD', source: 'Imported from LOS', status: 'Not Reviewed' },
            ]},
          ];

          const allDocIds = FINAL_DOCS_CATEGORIES.flatMap(cat => cat.docs.map(d => d.id));
          const finalDocsSelectedCount = finalDocsSelectedDocs.size;
          const allSelected = allDocIds.length > 0 && allDocIds.every(id => finalDocsSelectedDocs.has(id));
          const allExpanded = FINAL_DOCS_CATEGORIES.every(cat => finalDocsExpanded[cat.name]);

          const toggleFinalDocSelection = (docId) => {
            setFinalDocsSelectedDocs(prev => {
              const next = new Set(prev);
              next.has(docId) ? next.delete(docId) : next.add(docId);
              return next;
            });
          };
          const clearFinalDocsSelection = () => setFinalDocsSelectedDocs(new Set());
          const selectAllDocs = () => setFinalDocsSelectedDocs(new Set(allDocIds));
          const expandAllCategories = () => {
            const obj = {};
            FINAL_DOCS_CATEGORIES.forEach(cat => { obj[cat.name] = true; });
            setFinalDocsExpanded(obj);
          };
          const collapseAllCategories = () => setFinalDocsExpanded({});
          const toggleCategorySelection = (catDocs) => {
            const ids = catDocs.map(d => d.id);
            const allSel = ids.every(id => finalDocsSelectedDocs.has(id));
            setFinalDocsSelectedDocs(prev => {
              const next = new Set(prev);
              allSel ? ids.forEach(id => next.delete(id)) : ids.forEach(id => next.add(id));
              return next;
            });
          };
          const statusColor = (s) => {
            if (s === 'Approved') return 'text-green-600';
            if (s === 'Not Reviewed') return 'text-yellow-600';
            if (s === 'Inactive') return 'text-gray-400';
            if (s === 'Incomplete') return 'text-orange-500';
            if (s === 'Missing Pages') return 'text-orange-600';
            if (s === 'Unacceptable') return 'text-red-600';
            if (s === 'Duplicate') return 'text-orange-400';
            if (s === 'Illegible') return 'text-red-400';
            if (s === 'Ready to Ship') return 'text-teal-600';
            if (s === 'Reviewed') return 'text-blue-600';
            return 'text-gray-600';
          };

          const toggleFinalDocCategory = (catName) => {
            setFinalDocsExpanded(prev => ({ ...prev, [catName]: !prev[catName] }));
          };

          const getDocStatus = (doc) => finalDocsStatusMap[doc.id] || doc.status;
          const updateDocStatus = (docId, status) => setFinalDocsStatusMap(prev => ({ ...prev, [docId]: status }));
          const applyBulkStatus = (status) => {
            const updates = {};
            finalDocsSelectedDocs.forEach(id => { updates[id] = status; });
            setFinalDocsStatusMap(prev => ({ ...prev, ...updates }));
          };
          const downloadSelectedDocs = () => {
            const selectedItems = FINAL_DOCS_CATEGORIES.flatMap(c => c.docs).filter(d => finalDocsSelectedDocs.has(d.id));
            selectedItems.forEach(d => openDocPreview(d.type, subjectLoan, borrowerName));
          };

          const sortDocs = (docs) => {
            const sorted = [...docs];
            if (finalDocsSort === 'type-asc') return sorted.sort((a, b) => a.type.localeCompare(b.type));
            if (finalDocsSort === 'type-desc') return sorted.sort((a, b) => b.type.localeCompare(a.type));
            if (finalDocsSort === 'date-asc') return sorted.sort((a, b) => a.date.localeCompare(b.date));
            return sorted.sort((a, b) => b.date.localeCompare(a.date));
          };
          const displayCategories = FINAL_DOCS_CATEGORIES.map(cat => ({
            ...cat,
            docs: sortDocs(cat.docs.filter(doc => !finalDocsStatusFilter || getDocStatus(doc) === finalDocsStatusFilter))
          }));

          return (
            <div style={{ width: `${100 - splitPct}%` }} className="sticky top-0 h-screen border-l border-gray-200 bg-white flex flex-col overflow-hidden z-10 relative flex-shrink-0">

              {/* Header */}
              <div className="px-3 py-2 border-b bg-white flex items-center justify-between flex-shrink-0">
                <button
                  onClick={() => setShowDocsPanel(false)}
                  className="shadow-sm border border-gray-300 bg-white px-3 py-1.5 rounded text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
                >
                  <X size={14} />
                  Close Doc Manager
                </button>
                <button
                  onClick={async () => {
                    setIsSyncingDocs(true);
                    await new Promise(r => setTimeout(r, 1600));
                    setIsSyncingDocs(false);
                  }}
                  disabled={isSyncingDocs}
                  className="flex items-center gap-1.5 px-2 py-1.5 bg-white border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50 shadow-sm disabled:opacity-60"
                >
                  {isSyncingDocs ? <Loader2 className="animate-spin" size={12} /> : <RefreshCw size={12} />}
                  <span className="hidden xl:inline">{isSyncingDocs ? 'Syncing...' : 'LOS Document Sync'}</span>
                </button>
              </div>

              {/* Controls Bar */}
              <div className="px-3 py-1.5 border-b bg-gray-50 flex items-center justify-between flex-shrink-0 gap-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={allSelected ? clearFinalDocsSelection : selectAllDocs}
                    className="text-xs text-teal-600 hover:text-teal-800 hover:underline font-medium"
                  >
                    {allSelected ? 'Deselect All' : 'Select All'}
                  </button>
                  <span className="text-gray-300 text-xs">|</span>
                  <button
                    onClick={allExpanded ? collapseAllCategories : expandAllCategories}
                    className="text-xs text-teal-600 hover:text-teal-800 hover:underline font-medium"
                  >
                    {allExpanded ? 'Collapse All' : 'Expand All'}
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <select
                    value={finalDocsStatusFilter}
                    onChange={(e) => setFinalDocsStatusFilter(e.target.value)}
                    className="text-xs border border-gray-200 rounded px-1.5 py-0.5 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-teal-400"
                  >
                    <option value="">Filter by Status</option>
                    <option value="Not Reviewed">Not Reviewed</option>
                    <option value="Approved">Approved</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Incomplete">Incomplete</option>
                    <option value="Missing Pages">Missing Pages</option>
                    <option value="Unacceptable">Unacceptable</option>
                    <option value="Duplicate">Duplicate</option>
                    <option value="Illegible">Illegible</option>
                    <option value="Ready to Ship">Ready to Ship</option>
                    <option value="Reviewed">Reviewed</option>
                  </select>
                  <select
                    value={finalDocsSort}
                    onChange={(e) => setFinalDocsSort(e.target.value)}
                    className="text-xs border border-gray-200 rounded px-1.5 py-0.5 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-teal-400"
                  >
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="type-asc">Type A–Z</option>
                    <option value="type-desc">Type Z–A</option>
                  </select>
                </div>
              </div>

              {/* Selection Action Bar */}
              {finalDocsSelectedCount > 0 && (
                <div className="px-3 py-1.5 border-b bg-white flex items-center justify-between flex-shrink-0 gap-2">
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={clearFinalDocsSelection} className="p-0.5 hover:bg-gray-100 rounded text-gray-500"><X size={13} /></button>
                    <span className="text-xs text-gray-600 font-medium whitespace-nowrap">{finalDocsSelectedCount} file(s) selected</span>
                  </div>
                  <div className="flex items-center gap-0.5 flex-wrap">
                    <button className="flex items-center gap-0.5 px-1.5 py-1 hover:bg-gray-100 rounded text-xs text-gray-600 font-medium whitespace-nowrap" title="Split view - coming soon" disabled>
                      <SplitSquareHorizontal size={11} /><span className="hidden sm:inline">Split</span>
                    </button>
                    <select
                      className="flex items-center gap-0.5 px-1.5 py-1 bg-teal-600 text-white rounded text-xs font-medium hover:bg-teal-700 whitespace-nowrap cursor-pointer"
                      defaultValue=""
                      onChange={(e) => { if (e.target.value) { applyBulkStatus(e.target.value); e.target.value = ''; } }}
                      onClick={e => e.stopPropagation()}
                    >
                      <option value="" disabled>Change Status</option>
                      <option value="Not Reviewed">Not Reviewed</option>
                      <option value="Approved">Approved</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Incomplete">Incomplete</option>
                      <option value="Missing Pages">Missing Pages</option>
                      <option value="Unacceptable">Unacceptable</option>
                      <option value="Duplicate">Duplicate</option>
                      <option value="Illegible">Illegible</option>
                      <option value="Ready to Ship">Ready to Ship</option>
                      <option value="Reviewed">Reviewed</option>
                    </select>
                    <button className="flex items-center gap-0.5 px-1.5 py-1 hover:bg-gray-100 rounded text-xs text-gray-400 font-medium whitespace-nowrap" title="Tag - coming soon" disabled>
                      <Tag size={11} /><span className="hidden sm:inline">Tag</span>
                    </button>
                    <button
                      onClick={downloadSelectedDocs}
                      className="flex items-center gap-0.5 px-1.5 py-1 hover:bg-gray-100 rounded text-xs text-gray-600 font-medium whitespace-nowrap"
                    >
                      <Download size={11} /><span className="hidden sm:inline">Download</span>
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded text-gray-500"><MoreVertical size={12} /></button>
                  </div>
                </div>
              )}

              {/* Category Tree */}
              <div className="flex-1 overflow-y-auto" onClick={() => setShowMoreMenuId(null)}>
                {displayCategories.map((cat) => {
                  const isExpanded = !!finalDocsExpanded[cat.name];
                  const catIds = cat.docs.map(d => d.id);
                  const selCount = catIds.filter(id => finalDocsSelectedDocs.has(id)).length;
                  const allSel = catIds.length > 0 && selCount === catIds.length;
                  const someSel = selCount > 0 && selCount < catIds.length;
                  return (
                    <div key={cat.name} className="border-b border-gray-100">
                      <div
                        className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-gray-50 cursor-pointer select-none"
                        onClick={() => toggleFinalDocCategory(cat.name)}
                      >
                        {isExpanded ? <ChevronDown size={13} className="text-gray-500 flex-shrink-0" /> : <ChevronRight size={13} className="text-gray-500 flex-shrink-0" />}
                        <input
                          type="checkbox"
                          className="w-3 h-3 accent-teal-600 flex-shrink-0"
                          checked={allSel}
                          ref={el => { if (el) el.indeterminate = someSel; }}
                          onChange={() => toggleCategorySelection(cat.docs)}
                          onClick={e => e.stopPropagation()}
                        />
                        {isExpanded ? <FolderOpen size={14} className="text-yellow-500 flex-shrink-0" /> : <Folder size={14} className="text-yellow-500 flex-shrink-0" />}
                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">{cat.name} ({cat.count})</span>
                        {cat.isOther && (
                          <span
                            className="ml-1 flex-shrink-0 cursor-help"
                            title="All Others — Documents appear here when stored in the system of record (BytePro) without a valid Document Type ID (DocTypeID). This is a data quality condition, not a document status."
                          >
                            <Info size={12} className="text-amber-500" />
                          </span>
                        )}
                      </div>

                      {isExpanded && (
                        <div>
                          {cat.docs.map((doc) => {
                            const isChecked = finalDocsSelectedDocs.has(doc.id);
                            return (
                              <div
                                key={doc.id}
                                className={`group flex items-start gap-2 px-5 py-1.5 border-t border-gray-100 cursor-pointer transition-colors ${isChecked ? 'bg-teal-50' : 'hover:bg-gray-200'}`}
                                onDoubleClick={() => setDocPropertiesSlider({ ...doc, category: cat.name })}
                              >
                                <input
                                  type="checkbox"
                                  className="w-3 h-3 accent-teal-600 flex-shrink-0 mt-1"
                                  checked={isChecked}
                                  onChange={() => toggleFinalDocSelection(doc.id)}
                                  onClick={e => e.stopPropagation()}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-1">
                                    <span className="text-xs font-semibold text-gray-700 leading-snug">
                                      {doc.type}
                                      <span className="font-normal text-gray-400 ml-1 break-all">({doc.filename})</span>
                                    </span>
                                    <div className={`flex items-center gap-0.5 flex-shrink-0 mt-0.5 ${isChecked ? 'flex' : 'hidden group-hover:flex'}`}>
                                      <select
                                        className={`text-xs font-medium bg-transparent cursor-pointer hover:bg-gray-100 rounded px-0.5 border-0 outline-none ${statusColor(getDocStatus(doc))}`}
                                        value={getDocStatus(doc)}
                                        onChange={(e) => { e.stopPropagation(); updateDocStatus(doc.id, e.target.value); }}
                                        onClick={e => e.stopPropagation()}
                                      >
                                        <option>Not Reviewed</option>
                                        <option>Approved</option>
                                        <option>Inactive</option>
                                        <option>Incomplete</option>
                                        <option>Missing Pages</option>
                                        <option>Unacceptable</option>
                                        <option>Duplicate</option>
                                        <option>Illegible</option>
                                        <option>Ready to Ship</option>
                                        <option>Reviewed</option>
                                      </select>
                                      <button
                                        className="p-0.5 text-gray-400 hover:text-teal-600 rounded"
                                        title="Hover to preview"
                                        onClick={e => e.stopPropagation()}
                                        onMouseEnter={(e) => {
                                          const rect = e.currentTarget.getBoundingClientRect();
                                          setHoveredDocPreview({ html: generateDocHtml(doc.type, subjectLoan, borrowerName), x: rect.left, y: rect.top });
                                        }}
                                        onMouseLeave={() => setHoveredDocPreview(null)}
                                      ><Eye size={12} /></button>
                                      <button className="p-0.5 text-gray-400 hover:text-teal-600 rounded" onClick={e => { e.stopPropagation(); openDocPreview(doc.type, subjectLoan, borrowerName); }} title="Open document"><Download size={12} /></button>
                                      <div className="relative">
                                        <button
                                          className="p-0.5 text-gray-400 hover:text-gray-700 rounded"
                                          title="More options"
                                          onClick={e => { e.stopPropagation(); setShowMoreMenuId(prev => prev === doc.id ? null : doc.id); }}
                                        ><MoreVertical size={12} /></button>
                                        {showMoreMenuId === doc.id && (
                                          <div
                                            className="absolute right-0 top-5 w-52 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 text-xs"
                                            onClick={e => e.stopPropagation()}
                                          >
                                            {/* Enabled actions */}
                                            <button className="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-700 flex items-center gap-2" onClick={() => { setDocPropertiesSlider({ ...doc, category: cat.name }); setShowMoreMenuId(null); }}>
                                              <span className="text-gray-500">⊞</span> Properties
                                            </button>
                                            <button className="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-700 flex items-center gap-2" onClick={() => { setShowSplitModal({ ...doc, category: cat.name }); setSplitDocSlots([{ id: 1, type: '', name: '', pages: [] }]); setSplitSelectedPages(new Set()); setSplitActiveSlot(1); setSplitKeepOriginal(true); setShowMoreMenuId(null); }}>
                                              <SplitSquareHorizontal size={12} className="text-gray-500" /> Split
                                            </button>
                                            <div className="border-t border-gray-100 my-1" />
                                            {/* Change Status submenu */}
                                            <div className="px-3 py-1.5 text-gray-700 flex items-center justify-between">
                                              <span>Change Status</span>
                                              <ChevronDown size={10} className="text-gray-400" />
                                            </div>
                                            {['Not Reviewed','Approved','Inactive','Incomplete','Missing Pages','Unacceptable','Duplicate','Illegible','Ready to Ship','Reviewed'].map(s => (
                                              <button key={s} className={`w-full text-left px-6 py-1 hover:bg-gray-50 ${statusColor(s)}`} onClick={() => { updateDocStatus(doc.id, s); setShowMoreMenuId(null); }}>{s}</button>
                                            ))}
                                            <div className="border-t border-gray-100 my-1" />
                                            <button className="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-gray-700 flex items-center gap-2" onClick={() => { openDocPreview(doc.type, subjectLoan, borrowerName); setShowMoreMenuId(null); }}>
                                              <Download size={12} className="text-gray-500" /> Download
                                            </button>
                                            <div className="border-t border-gray-100 my-1" />
                                            {/* Disabled actions — match PROD but grayed */}
                                            {['Tag','Add Pages','Sort/Rearrange Pages','Merge','Send to LOS','Send To AI Indexing','Duplicate','Copy to Loan','Move to Recycle Bin','Signature'].map(label => (
                                              <button key={label} disabled className="w-full text-left px-3 py-1.5 text-gray-300 flex items-center gap-2 cursor-default">{label}</button>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    {!isChecked && (
                                      <span className={`text-xs font-medium flex-shrink-0 mt-0.5 group-hover:hidden ${statusColor(getDocStatus(doc))}`}>{getDocStatus(doc)}</span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                                    Created {doc.date} - created by: {doc.createdBy}{doc.source ? ` - ${doc.source}` : ''}
                                  </p>
                                  <Lock size={10} className="text-gray-300 mt-0.5" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Hover Doc Preview Popup */}
              {hoveredDocPreview && (
                <div
                  className="fixed z-50 rounded-lg overflow-hidden shadow-2xl border border-gray-300"
                  style={{
                    width: 660,
                    height: Math.min(window.innerHeight - 32, 880),
                    left: Math.max(8, hoveredDocPreview.x - 676),
                    top: Math.max(8, Math.min(hoveredDocPreview.y - 40, window.innerHeight - Math.min(window.innerHeight - 32, 880) - 8)),
                    pointerEvents: 'none',
                  }}
                >
                  <iframe
                    srcDoc={hoveredDocPreview.html}
                    title="Document Preview"
                    className="w-full h-full border-0"
                    style={{ transform: 'scale(0.776)', transformOrigin: 'top left', width: '129%', height: '129%' }}
                  />
                </div>
              )}

              {/* Doc Review Modal — PROD-style two-panel: properties left, preview right */}
              {docPropertiesSlider && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={() => setDocPropertiesSlider(null)}>
                  <div className="bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden" style={{ width: '90vw', maxWidth: 1180, height: '88vh' }} onClick={e => e.stopPropagation()}>

                    {/* Modal Header */}
                    <div className="flex items-center justify-between px-4 py-2.5 border-b bg-white flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-800">Review {docPropertiesSlider.type}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          getDocStatus(docPropertiesSlider) === 'Approved' ? 'bg-green-100 text-green-700' :
                          getDocStatus(docPropertiesSlider) === 'Inactive' ? 'bg-gray-100 text-gray-500' :
                          getDocStatus(docPropertiesSlider) === 'Duplicate' ? 'bg-orange-100 text-orange-600' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>{getDocStatus(docPropertiesSlider)}</span>
                      </div>
                      <button onClick={() => setDocPropertiesSlider(null)} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
                    </div>

                    {/* Two-panel body */}
                    <div className="flex flex-1 overflow-hidden">

                      {/* LEFT — Document Properties form */}
                      <div className="w-64 flex-shrink-0 border-r bg-white flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                          <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide border-b pb-1">Document Properties</div>

                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Borrower</label>
                            <select className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal-500">
                              <option>Select</option>
                              <option selected>Ryan Lively</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Document Status</label>
                            <select
                              className={`w-full px-2 py-1.5 border border-gray-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium ${statusColor(getDocStatus(docPropertiesSlider))}`}
                              value={getDocStatus(docPropertiesSlider)}
                              onChange={e => updateDocStatus(docPropertiesSlider.id, e.target.value)}
                            >
                              <option>Not Reviewed</option>
                              <option>Approved</option>
                              <option>Inactive</option>
                              <option>Incomplete</option>
                              <option>Missing Pages</option>
                              <option>Unacceptable</option>
                              <option>Duplicate</option>
                              <option>Illegible</option>
                              <option>Ready to Ship</option>
                              <option>Reviewed</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Document Name</label>
                            <input type="text" defaultValue={docPropertiesSlider.filename} className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal-500" />
                          </div>

                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Document Type</label>
                            <input type="text" value={docPropertiesSlider.type} readOnly className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs bg-gray-50 text-gray-500" />
                          </div>

                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Document Expires</label>
                            <input type="date" className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal-500" />
                          </div>

                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Document Description</label>
                            <textarea rows={3} placeholder="Type comment here" className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none" />
                          </div>

                          <div className="space-y-1.5">
                            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                              <input type="checkbox" className="accent-teal-600" /> For Review
                            </label>
                            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                              <input type="checkbox" className="accent-teal-600" /> Inactive
                            </label>
                          </div>

                          <button className="flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-800 font-medium">
                            <Tag size={12} /> Add Tag
                          </button>

                          <div className="border-t pt-3">
                            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Associated Conditions</div>
                            <select className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal-500">
                              <option>Select</option>
                            </select>
                          </div>

                          <div className="border-t pt-3">
                            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Notes</div>
                            <textarea rows={2} placeholder="Add a note..." className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none" />
                          </div>
                        </div>
                      </div>

                      {/* RIGHT — Live document preview */}
                      <div className="flex-1 overflow-hidden">
                        <div className="w-full h-full relative">
                          <iframe
                            srcDoc={generateDocHtml(docPropertiesSlider.type, subjectLoan, borrowerName)}
                            title="Document Preview"
                            className="w-full h-full border-0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer actions */}
                    <div className="flex items-center justify-between px-4 py-2.5 border-t bg-gray-50 flex-shrink-0">
                      <button
                        onClick={() => { openDocPreview(docPropertiesSlider.type, subjectLoan, borrowerName); }}
                        className="px-3 py-1.5 bg-teal-600 text-white rounded text-xs font-semibold hover:bg-teal-700"
                      >
                        Save/Add Document Split
                      </button>
                      <div className="flex gap-2">
                        <button onClick={() => setDocPropertiesSlider(null)} className="px-4 py-1.5 border border-gray-300 text-gray-600 rounded text-xs font-medium hover:bg-gray-100">Cancel</button>
                        <button onClick={() => setDocPropertiesSlider(null)} className="px-4 py-1.5 bg-teal-700 text-white rounded text-xs font-semibold hover:bg-teal-800">Save</button>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>{/* end outer flex wrapper */}

      {/* Document Split Modal */}
      {showSplitModal && (() => {
        const SPLIT_PAGE_COUNT = 5;
        const DOC_TYPE_OPTIONS = ['Loan Application','Appraisal','Title Commitment','Purchase Contract','Credit Report','Bank Statement','Pay Stub','W-2','Tax Return','VOE','VOD','Gift Letter','Flood Cert','HOI','Note','Deed of Trust','Closing Disclosure','URLA','SSA-89','Borrower Authorization','Other'];
        const togglePage = (pageNum) => {
          setSplitSelectedPages(prev => {
            const next = new Set(prev);
            if (next.has(pageNum)) next.delete(pageNum); else next.add(pageNum);
            return next;
          });
        };
        const assignPagesToSlot = (slotId) => {
          if (splitSelectedPages.size === 0) return;
          const pages = [...splitSelectedPages].sort((a, b) => a - b);
          setSplitDocSlots(prev => prev.map(slot =>
            slot.id === slotId
              ? { ...slot, pages: [...new Set([...slot.pages, ...pages])] }
              : slot
          ));
          setSplitSelectedPages(new Set());
          setSplitActiveSlot(slotId);
        };
        const removeSlot = (slotId) => setSplitDocSlots(prev => prev.filter(s => s.id !== slotId));
        const addSlot = () => {
          const newId = Math.max(...splitDocSlots.map(s => s.id)) + 1;
          setSplitDocSlots(prev => [...prev, { id: newId, type: '', name: '', pages: [] }]);
          setSplitActiveSlot(newId);
        };
        const updateSlot = (slotId, field, val) => setSplitDocSlots(prev => prev.map(s => s.id === slotId ? { ...s, [field]: val } : s));
        const closeModal = () => { setShowSplitModal(null); setSplitDocSlots([{ id: 1, type: '', name: '', pages: [] }]); setSplitSelectedPages(new Set()); };
        return (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={closeModal}>
            <div
              className="bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden"
              style={{ width: '92vw', maxWidth: 980, height: '86vh' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b bg-white flex-shrink-0">
                <SplitSquareHorizontal size={15} className="text-gray-500" />
                <span className="font-semibold text-sm text-gray-800">Document Split</span>
                <span className="text-xs text-gray-400 ml-1 truncate">{showSplitModal.filename}</span>
                <button onClick={closeModal} className="ml-auto text-gray-400 hover:text-gray-700 p-1 rounded"><X size={16} /></button>
              </div>

              {/* Body */}
              <div className="flex flex-1 overflow-hidden">

                {/* LEFT — Page thumbnails */}
                <div className="w-72 border-r bg-white flex flex-col flex-shrink-0 overflow-hidden">
                  <div className="px-3 py-2 text-xs text-gray-500 font-medium border-b bg-gray-50">Pages — click to select, then assign to a document</div>
                  <div className="overflow-y-auto flex-1 p-3">
                    <div className="grid grid-cols-2 gap-3">
                      {Array.from({ length: SPLIT_PAGE_COUNT }, (_, i) => i + 1).map(pageNum => {
                        const isSelected = splitSelectedPages.has(pageNum);
                        const assignedSlot = splitDocSlots.find(s => s.pages.includes(pageNum));
                        return (
                          <div
                            key={pageNum}
                            onClick={() => togglePage(pageNum)}
                            className={`relative cursor-pointer rounded border-2 transition-all ${
                              isSelected ? 'border-teal-500 shadow-md' :
                              assignedSlot ? 'border-blue-300 opacity-60' :
                              'border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            {/* Mini page preview */}
                            <div className="bg-white rounded overflow-hidden" style={{ aspectRatio: '8.5/11' }}>
                              {pageNum === 1 ? (
                                <iframe
                                  srcDoc={generateDocHtml(showSplitModal.type, subjectLoan, borrowerName)}
                                  title={`Page ${pageNum}`}
                                  className="w-full h-full border-0 pointer-events-none"
                                  style={{ transform: 'scale(0.25)', transformOrigin: 'top left', width: '400%', height: '400%' }}
                                />
                              ) : (
                                <div className="w-full h-full p-2 flex flex-col gap-1">
                                  {Array.from({ length: 12 }).map((_, li) => (
                                    <div key={li} className={`h-1 rounded ${li === 0 ? 'bg-gray-400 w-3/4' : li % 4 === 0 ? 'bg-gray-200 w-2/3' : 'bg-gray-200'} ${li > 8 ? 'w-1/2' : ''}`} />
                                  ))}
                                </div>
                              )}
                            </div>
                            {/* Page number + icons */}
                            <div className="flex items-center justify-between px-1 py-0.5 bg-gray-50 border-t border-gray-100">
                              <span className="text-xs text-gray-500">{pageNum}</span>
                              <div className="flex items-center gap-1">
                                {assignedSlot && <span className="text-xs text-blue-500 font-medium">D{assignedSlot.id}</span>}
                                <ZoomIn size={10} className="text-gray-400" />
                                <RotateCw size={10} className="text-gray-400" />
                              </div>
                            </div>
                            {isSelected && (
                              <div className="absolute inset-0 bg-teal-500 bg-opacity-10 rounded pointer-events-none" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* Assign button */}
                  {splitSelectedPages.size > 0 && (
                    <div className="px-3 py-2 border-t bg-gray-50">
                      <div className="text-xs text-gray-500 mb-1">{splitSelectedPages.size} page(s) selected — assign to:</div>
                      <div className="flex flex-wrap gap-1">
                        {splitDocSlots.map(slot => (
                          <button key={slot.id} onClick={() => assignPagesToSlot(slot.id)}
                            className="px-2 py-1 bg-teal-600 text-white rounded text-xs font-medium hover:bg-teal-700">
                            Document {slot.id}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT — Split document slots */}
                <div className="flex-1 bg-gray-100 overflow-y-auto p-4 flex flex-col gap-4">
                  {splitDocSlots.map(slot => (
                    <div key={slot.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      {/* Card header */}
                      <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
                        <span className="text-sm font-semibold text-gray-700">Document {slot.id}</span>
                        {splitDocSlots.length > 1 && (
                          <button onClick={() => removeSlot(slot.id)} className="text-gray-400 hover:text-red-500 p-0.5 rounded">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      {/* Fields row */}
                      <div className="px-4 py-3 flex gap-3">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">Document Type</label>
                          <select
                            value={slot.type}
                            onChange={e => updateSlot(slot.id, 'type', e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                          >
                            <option value="">Document Type/Name</option>
                            {DOC_TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">Document Name</label>
                          <input
                            type="text"
                            placeholder="Description"
                            value={slot.name}
                            onChange={e => updateSlot(slot.id, 'name', e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                        <div className="w-32">
                          <label className="block text-xs text-gray-500 mb-1">Pages</label>
                          <input
                            type="text"
                            placeholder="Pages"
                            value={slot.pages.join(', ')}
                            onChange={e => updateSlot(slot.id, 'pages', e.target.value.split(',').map(p => parseInt(p.trim())).filter(n => !isNaN(n)))}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                      </div>
                      {/* Drop zone */}
                      <div
                        className={`mx-4 mb-3 rounded border-2 border-dashed flex flex-col items-center justify-center py-5 transition-colors ${
                          splitActiveSlot === slot.id && splitSelectedPages.size > 0
                            ? 'border-teal-400 bg-teal-50'
                            : slot.pages.length > 0
                            ? 'border-blue-200 bg-blue-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                        onClick={() => assignPagesToSlot(slot.id)}
                        style={{ cursor: splitSelectedPages.size > 0 ? 'copy' : 'default', minHeight: 70 }}
                      >
                        {slot.pages.length > 0 ? (
                          <div className="text-center">
                            <div className="text-xs font-medium text-blue-600 mb-0.5">Pages assigned: {slot.pages.sort((a,b)=>a-b).join(', ')}</div>
                            <div className="text-xs text-gray-400">Click to add more selected pages</div>
                          </div>
                        ) : (
                          <>
                            <Upload size={18} className="text-gray-300 mb-1.5" />
                            <div className="text-xs text-gray-400 text-center">Select pages from the left then drag and drop here</div>
                          </>
                        )}
                      </div>
                      {/* Preview button */}
                      <div className="px-4 pb-3">
                        <button
                          onClick={() => openDocPreview(showSplitModal.type, subjectLoan, borrowerName)}
                          className="px-3 py-1.5 border border-teal-500 text-teal-600 rounded text-xs font-medium hover:bg-teal-50"
                        >Preview Document</button>
                      </div>
                    </div>
                  ))}

                  {/* Add Document Split */}
                  <div>
                    <button
                      onClick={addSlot}
                      className="text-teal-600 text-sm font-medium hover:text-teal-800 flex items-center gap-1.5"
                    >
                      <span className="text-lg leading-none">+</span> Add Document Split
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2.5 border-t bg-white flex-shrink-0">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={splitKeepOriginal}
                    onChange={e => setSplitKeepOriginal(e.target.checked)}
                    className="accent-teal-600"
                  />
                  Keep Original Document
                </label>
                <div className="flex gap-2">
                  <button onClick={closeModal} className="px-4 py-1.5 border border-gray-300 text-gray-600 rounded text-xs font-medium hover:bg-gray-100">Cancel</button>
                  <button onClick={closeModal} className="px-5 py-1.5 bg-teal-600 text-white rounded text-xs font-semibold hover:bg-teal-700">Finish</button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-[12vh] z-50">
          <div className="bg-white rounded-lg overflow-hidden w-[480px] shadow-xl">
            {/* Green success header */}
            <div className="bg-green-600 px-6 py-5 flex items-center gap-4">
              <CheckCircle className="text-white flex-shrink-0" size={32} />
              <div>
                <h3 className="text-lg font-bold text-white">Bundle Successfully Created</h3>
                <p className="text-green-100 text-xs mt-0.5">Loan {subjectLoan} · {bundleName}</p>
              </div>
            </div>
            {/* Body */}
            <div className="px-6 py-5">
              <p className="text-gray-700 text-sm mb-1">Your bundle is ready.</p>
              <p className="text-gray-500 text-xs">Download the PDF bundle below or upload it directly to the loan file when ready.</p>
            </div>
            {/* Actions */}
            <div className="px-6 pb-5 flex gap-3">
              <button
                onClick={() => {
                  setBundleDownloadReady(true);
                  setBuildComplete(false);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-700 text-white rounded hover:bg-teal-800 font-semibold text-sm"
              >
                <Download size={15} />
                Download Bundle
              </button>
              <button
                onClick={() => {
                  setBundleDownloadReady(true);
                  setBuildComplete(false);
                }}
                className="px-4 py-2.5 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 font-medium text-sm"
              >
                Close
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

      {/* Bundle In-Flight Modal — Concurrency Lock */}
      {showBundleInFlightModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-[12vh] z-50">
          <div className="bg-white rounded-lg p-6 w-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">Build Failed</h3>
              <button onClick={() => setShowBundleInFlightModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600 text-xs">
                Bundle already in progress for this loan — please select another loan to continue.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowBundleInFlightModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium text-xs"
              >
                Cancel
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
              <h3 className="text-base font-semibold">Unapproved Documents Detected</h3>
            </div>
            <div className="mb-6">
              <p className="text-gray-700 mb-3 text-sm">
                This bundle contains documents with status <span className="font-semibold text-yellow-700">Located - Not Approved</span> that require attention.
              </p>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-xs font-semibold text-yellow-800 mb-2">⚠️ Important Notice:</p>
                <p className="text-xs text-yellow-700 mb-2">
                  These documents were found in the loan file but have not been approved for bundle inclusion. They may have statuses such as Not Reviewed, Rejected, Pending Review, or Inactive, which could affect bundle validity.
                </p>
                <p className="text-xs text-yellow-700">
                  {stackingOrder.filter(doc => doc.status === 'Located - Not Approved').length} located but not approved {stackingOrder.filter(doc => doc.status === 'Located - Not Approved').length === 1 ? 'document' : 'documents'} detected in this bundle.
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
                                 doc.status === 'pending' ? 'Located - Not Approved' : doc.status}
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
      </>
    )}
    </div>
  );
};

export default BoBSingleFlow;
