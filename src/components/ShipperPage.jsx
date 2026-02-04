import React, { useState } from 'react';
import { Calendar, Package, FileText, AlertCircle, Save, X, RefreshCw, ChevronDown, ChevronUp, Menu } from 'lucide-react';

const ShipperPage = ({ onMenuToggle }) => {
  const [expandedSections, setExpandedSections] = useState({
    shippingDetails: true,
    ethicsReadiness: false,
    postClosingDetails: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const [formData, setFormData] = useState({
    // Shipping Details
    shipper: '',
    shippingReceivedDate: '',
    docsBackDate: '',
    docsImagedDate: '',
    collateralPackageSentDate: '',
    shipByDate: '',
    returnedDueDate: '',
    packagedDate: '',
    shippedDate: '',
    finalHUDToInvestorDate: '',
    noteShipmentReceivedDate: '',
    suspendedDate: '',
    clearedDate: '',
    purchasedDate: '',
    noteReturnedToWarehouseDate: '',
    shippingNotes: '',

    // Ethics/Readiness Section
    ethicsIndicator: '',
    closingDocsBackAndIndexed: '',
    privacyNoticeOptOut: false,
    notReadyToShip: false,
    residualToShipping: false,

    // Post Closing Details
    shipped: '',
    investorCommitmentExpirationDate: '',
    uiNumber: '',
    trailDocType: '',
    inoDDO1: '',
    fundedDate: '',
    deedOfTrust: '',
    finalTitlePolicy: '',
    shippersReady: '',
    isoetp: '',
    debunkedDate: '',
    sentToInvestorDOT: '',
    sentToInvestorTP: '',
    satNoteDeedRequested: '',
    reviewPastDOT: '',
    trackingInfo: '',
    shareLoansTracking: '',
    satNoteDeedSent: '',
    controlDOT: '',
    dotUPSTracking: '',
    tpUPSTracking: '',
    uploadedToInvestorDOT: '',
    uploadedToInvestorTP: '',
    mccSent: '',
    reviewPsatTP: '',
    sentToServicerDOT: '',
    sentToServicerTP: '',
    complianceChacalROUT: '',
    controlETP: '',
    dotRecordedDate: '',
    tpRecordedDate: '',
    complianceFNGSent: '',
    dotInstrumentNumber: '',
    tpInstrumentNumber: '',
    mklsc: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-100 z-20">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-gray-100 border-b border-gray-200 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="pt-6 pb-4 flex items-center gap-4">
            {/* Hamburger Menu Button */}
            {onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="p-2 hover:bg-gray-200 rounded-lg transition"
                aria-label="Toggle navigation menu"
              >
                <Menu size={24} className="text-gray-700" />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shipper Management</h1>
              <p className="text-gray-600 text-xs mt-1">Manage shipping and post-close efforts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Action Toolbar */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-2.5">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition font-medium text-xs"
              title="Refresh"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition font-medium text-xs">
              <X size={14} />
              Cancel
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 text-white rounded hover:bg-teal-600 transition font-medium text-xs">
              <Save size={14} />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">

        {/* SHIPPING DETAILS Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <button
            onClick={() => toggleSection('shippingDetails')}
            className="w-full border-l-4 border-teal-500 bg-gray-50 px-6 py-4 hover:bg-gray-100 transition-colors"
          >
            <h2 className="text-xs font-semibold text-gray-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText size={14} className="text-teal-500" />
                SHIPPING DETAILS
              </span>
              {expandedSections.shippingDetails ? (
                <ChevronUp size={16} className="text-gray-600" />
              ) : (
                <ChevronDown size={16} className="text-gray-600" />
              )}
            </h2>
          </button>

          {expandedSections.shippingDetails && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Shipper */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Shipper
                </label>
                <input
                  type="text"
                  value={formData.shipper}
                  onChange={(e) => handleInputChange('shipper', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                  placeholder="Enter shipper name"
                />
              </div>

              {/* Shipping Received Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Shipping Received Date
                </label>
                <input
                  type="date"
                  value={formData.shippingReceivedDate}
                  onChange={(e) => handleInputChange('shippingReceivedDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Docs Back Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Docs Back Date
                </label>
                <input
                  type="date"
                  value={formData.docsBackDate}
                  onChange={(e) => handleInputChange('docsBackDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Docs Imaged Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Docs Imaged Date
                </label>
                <input
                  type="date"
                  value={formData.docsImagedDate}
                  onChange={(e) => handleInputChange('docsImagedDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Collateral Package Sent Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Collateral Package Sent Date
                </label>
                <input
                  type="date"
                  value={formData.collateralPackageSentDate}
                  onChange={(e) => handleInputChange('collateralPackageSentDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Ship By Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Ship By Date
                </label>
                <input
                  type="date"
                  value={formData.shipByDate}
                  onChange={(e) => handleInputChange('shipByDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Returned Due Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Returned Due Date
                </label>
                <input
                  type="date"
                  value={formData.returnedDueDate}
                  onChange={(e) => handleInputChange('returnedDueDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Packaged Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Packaged Date
                </label>
                <input
                  type="date"
                  value={formData.packagedDate}
                  onChange={(e) => handleInputChange('packagedDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Shipped Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Shipped Date
                </label>
                <input
                  type="date"
                  value={formData.shippedDate}
                  onChange={(e) => handleInputChange('shippedDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Final HUD to Investor Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Final HUD to Investor Date
                </label>
                <input
                  type="date"
                  value={formData.finalHUDToInvestorDate}
                  onChange={(e) => handleInputChange('finalHUDToInvestorDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Note Shipment Received Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Note Shipment Received Date
                </label>
                <input
                  type="date"
                  value={formData.noteShipmentReceivedDate}
                  onChange={(e) => handleInputChange('noteShipmentReceivedDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Suspended Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Suspended Date
                </label>
                <input
                  type="date"
                  value={formData.suspendedDate}
                  onChange={(e) => handleInputChange('suspendedDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Cleared Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Cleared Date
                </label>
                <input
                  type="date"
                  value={formData.clearedDate}
                  onChange={(e) => handleInputChange('clearedDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Purchased Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Purchased Date
                </label>
                <input
                  type="date"
                  value={formData.purchasedDate}
                  onChange={(e) => handleInputChange('purchasedDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Note Returned to Warehouse Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Note Returned to Warehouse Date
                </label>
                <input
                  type="date"
                  value={formData.noteReturnedToWarehouseDate}
                  onChange={(e) => handleInputChange('noteReturnedToWarehouseDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                />
              </div>
            </div>

            {/* Shipping Notes - Full Width */}
            <div className="mt-6">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Shipping Notes
              </label>
              <textarea
                value={formData.shippingNotes}
                onChange={(e) => handleInputChange('shippingNotes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                placeholder="Enter shipping notes..."
              />
            </div>
          </div>
          )}
        </div>

        {/* Ethics/Readiness Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <button
            onClick={() => toggleSection('ethicsReadiness')}
            className="w-full border-l-4 border-teal-500 bg-gray-50 px-6 py-4 hover:bg-gray-100 transition-colors"
          >
            <h2 className="text-xs font-semibold text-gray-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertCircle size={14} className="text-teal-500" />
                ETHICS & READINESS
              </span>
              {expandedSections.ethicsReadiness ? (
                <ChevronUp size={16} className="text-gray-600" />
              ) : (
                <ChevronDown size={16} className="text-gray-600" />
              )}
            </h2>
          </button>

          {expandedSections.ethicsReadiness && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Ethics Indicator */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Ethics Indicator
                </label>
                <input
                  type="text"
                  value={formData.ethicsIndicator}
                  onChange={(e) => handleInputChange('ethicsIndicator', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white text-xs"
                />
              </div>

              {/* Closing Docs Back and Indexed */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Closing Docs Back and Indexed
                </label>
                <input
                  type="date"
                  value={formData.closingDocsBackAndIndexed}
                  onChange={(e) => handleInputChange('closingDocsBackAndIndexed', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white text-xs"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.privacyNoticeOptOut}
                    onChange={(e) => handleInputChange('privacyNoticeOptOut', e.target.checked)}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-xs font-medium text-gray-700">Privacy Notice Opt Out</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.notReadyToShip}
                    onChange={(e) => handleInputChange('notReadyToShip', e.target.checked)}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-xs font-medium text-gray-700">Not Ready to Ship</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.residualToShipping}
                    onChange={(e) => handleInputChange('residualToShipping', e.target.checked)}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-xs font-medium text-gray-700">Residual to Shipping</span>
                </label>
              </div>
            </div>
          </div>
          )}
        </div>

        {/* POST CLOSING DETAILS Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <button
            onClick={() => toggleSection('postClosingDetails')}
            className="w-full border-l-4 border-teal-500 bg-gray-50 px-6 py-4 hover:bg-gray-100 transition-colors"
          >
            <h2 className="text-xs font-semibold text-gray-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar size={14} className="text-teal-500" />
                POST CLOSING DETAILS
              </span>
              {expandedSections.postClosingDetails ? (
                <ChevronUp size={16} className="text-gray-600" />
              ) : (
                <ChevronDown size={16} className="text-gray-600" />
              )}
            </h2>
          </button>

          {expandedSections.postClosingDetails && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Shipped */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Shipped
                </label>
                <input
                  type="date"
                  value={formData.shipped}
                  onChange={(e) => handleInputChange('shipped', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Investor Commitment Expiration Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Investor Commitment Expiration Date
                </label>
                <input
                  type="date"
                  value={formData.investorCommitmentExpirationDate}
                  onChange={(e) => handleInputChange('investorCommitmentExpirationDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* UI Number */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  UI#
                </label>
                <input
                  type="text"
                  value={formData.uiNumber}
                  onChange={(e) => handleInputChange('uiNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                  placeholder="Enter UI number"
                />
              </div>

              {/* Trail Doc Type */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Trail Doc Type
                </label>
                <input
                  type="text"
                  value={formData.trailDocType}
                  onChange={(e) => handleInputChange('trailDocType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* INODD01 */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  INODD01
                </label>
                <input
                  type="text"
                  value={formData.inoDDO1}
                  onChange={(e) => handleInputChange('inoDDO1', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Funded Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Funded Date
                </label>
                <input
                  type="date"
                  value={formData.fundedDate}
                  onChange={(e) => handleInputChange('fundedDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Deed Of Trust */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Deed Of Trust
                </label>
                <input
                  type="date"
                  value={formData.deedOfTrust}
                  onChange={(e) => handleInputChange('deedOfTrust', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Final Title Policy */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Final Title Policy
                </label>
                <input
                  type="date"
                  value={formData.finalTitlePolicy}
                  onChange={(e) => handleInputChange('finalTitlePolicy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Shipper's Ready */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Shipper's Ready
                </label>
                <input
                  type="text"
                  value={formData.shippersReady}
                  onChange={(e) => handleInputChange('shippersReady', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* ISOETP */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  ISOETP
                </label>
                <input
                  type="text"
                  value={formData.isoetp}
                  onChange={(e) => handleInputChange('isoetp', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Debunked Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Debunked Date
                </label>
                <input
                  type="date"
                  value={formData.debunkedDate}
                  onChange={(e) => handleInputChange('debunkedDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Sent To Investor DOT */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Sent To Investor DOT
                </label>
                <input
                  type="date"
                  value={formData.sentToInvestorDOT}
                  onChange={(e) => handleInputChange('sentToInvestorDOT', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Sent To Investor TP */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Sent To Investor TP
                </label>
                <input
                  type="date"
                  value={formData.sentToInvestorTP}
                  onChange={(e) => handleInputChange('sentToInvestorTP', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* SAT Note Deed Requested */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  SAT Note Deed Requested
                </label>
                <input
                  type="text"
                  value={formData.satNoteDeedRequested}
                  onChange={(e) => handleInputChange('satNoteDeedRequested', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Review Past DOT */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Review Past DOT
                </label>
                <input
                  type="text"
                  value={formData.reviewPastDOT}
                  onChange={(e) => handleInputChange('reviewPastDOT', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Tracking Info */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Tracking Info (MicheleCahan)
                </label>
                <input
                  type="text"
                  value={formData.trackingInfo}
                  onChange={(e) => handleInputChange('trackingInfo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                  placeholder="User and timestamp info"
                />
              </div>

              {/* ShareLoans Tracking */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  ShareLoans Tracking
                </label>
                <input
                  type="text"
                  value={formData.shareLoansTracking}
                  onChange={(e) => handleInputChange('shareLoansTracking', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                  placeholder="User and timestamp info"
                />
              </div>

              {/* SAT Note Deed Sent */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  SAT Note Deed Sent
                </label>
                <input
                  type="text"
                  value={formData.satNoteDeedSent}
                  onChange={(e) => handleInputChange('satNoteDeedSent', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Control DOT */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Control DOT
                </label>
                <input
                  type="text"
                  value={formData.controlDOT}
                  onChange={(e) => handleInputChange('controlDOT', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* DOT UPS Tracking # */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  DOT UPS Tracking #
                </label>
                <input
                  type="text"
                  value={formData.dotUPSTracking}
                  onChange={(e) => handleInputChange('dotUPSTracking', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                  placeholder="Tracking number"
                />
              </div>

              {/* TP UPS Tracking # */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  TP UPS Tracking #
                </label>
                <input
                  type="text"
                  value={formData.tpUPSTracking}
                  onChange={(e) => handleInputChange('tpUPSTracking', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                  placeholder="Tracking number"
                />
              </div>

              {/* Uploaded to Investor DOT */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Uploaded to Investor DOT
                </label>
                <input
                  type="text"
                  value={formData.uploadedToInvestorDOT}
                  onChange={(e) => handleInputChange('uploadedToInvestorDOT', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Uploaded to Investor TP */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Uploaded to Investor TP
                </label>
                <input
                  type="text"
                  value={formData.uploadedToInvestorTP}
                  onChange={(e) => handleInputChange('uploadedToInvestorTP', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* MCC Sent */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  MCC Sent
                </label>
                <input
                  type="text"
                  value={formData.mccSent}
                  onChange={(e) => handleInputChange('mccSent', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Review Psat TP */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Review Psat TP
                </label>
                <input
                  type="text"
                  value={formData.reviewPsatTP}
                  onChange={(e) => handleInputChange('reviewPsatTP', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Sent To Servicer DOT */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Sent To Servicer DOT
                </label>
                <input
                  type="text"
                  value={formData.sentToServicerDOT}
                  onChange={(e) => handleInputChange('sentToServicerDOT', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Sent To Servicer TP */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Sent To Servicer TP
                </label>
                <input
                  type="text"
                  value={formData.sentToServicerTP}
                  onChange={(e) => handleInputChange('sentToServicerTP', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Compliance Chacal ROUT */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Compliance Chacal ROUT
                </label>
                <input
                  type="text"
                  value={formData.complianceChacalROUT}
                  onChange={(e) => handleInputChange('complianceChacalROUT', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Control ETP */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Control ETP
                </label>
                <input
                  type="text"
                  value={formData.controlETP}
                  onChange={(e) => handleInputChange('controlETP', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* DOT Recorded Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  DOT Recorded Date
                </label>
                <input
                  type="date"
                  value={formData.dotRecordedDate}
                  onChange={(e) => handleInputChange('dotRecordedDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* TP Recorded Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  TP Recorded Date
                </label>
                <input
                  type="date"
                  value={formData.tpRecordedDate}
                  onChange={(e) => handleInputChange('tpRecordedDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Compliance FNG Sent */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Compliance FNG Sent
                </label>
                <input
                  type="text"
                  value={formData.complianceFNGSent}
                  onChange={(e) => handleInputChange('complianceFNGSent', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* DOT Instrument Number */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  DOT Instrument Number
                </label>
                <input
                  type="text"
                  value={formData.dotInstrumentNumber}
                  onChange={(e) => handleInputChange('dotInstrumentNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* TP Instrument Number */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  TP Instrument Number
                </label>
                <input
                  type="text"
                  value={formData.tpInstrumentNumber}
                  onChange={(e) => handleInputChange('tpInstrumentNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>

              {/* MKLSC */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  MKLSC
                </label>
                <input
                  type="text"
                  value={formData.mklsc}
                  onChange={(e) => handleInputChange('mklsc', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent text-xs"
                />
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default ShipperPage;
