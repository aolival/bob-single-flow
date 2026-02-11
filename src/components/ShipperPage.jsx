import React, { useState } from 'react';
import { Calendar, Package, FileText, AlertCircle, Save, X, RefreshCw, ChevronDown, ChevronUp, Menu } from 'lucide-react';

const ShipperPage = ({ onMenuToggle }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const initialFormData = {
    // Shipping Details (8 fields)
    shipper: '',
    shippingReceivedDate: '',
    packagedDate: '',
    shippedDate: '',
    eNoteIndicator: '',
    notReadyToShip: '',
    shipped: '',
    mcc: '',

    // Servicing Information (8 fields)
    servicingOption: '',
    servicing: '',
    servicer: '',
    servicerLoanNumber: '',
    firstPaymentToServicer: '',
    dataTransmittedDate: '',
    packageSentDate: '',
    servicingTransferDate: ''
  };

  const initialExpandedSections = {
    shippingDetails: true,
    servicingInformation: false
  };

  const [expandedSections, setExpandedSections] = useState(initialExpandedSections);
  const [formData, setFormData] = useState(initialFormData);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRefresh = () => {
    setFormData(initialFormData);
    setExpandedSections(initialExpandedSections);
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-100 z-20">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-gray-100 border-b border-gray-200 relative">
        {/* CMG Financial Logo - Center */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-white rounded-lg px-4 py-1.5 shadow-sm">
            <div className="flex items-baseline gap-1">
              <span style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#9ACD32',
                fontFamily: 'Arial, sans-serif',
                letterSpacing: '-1px'
              }}>CMG</span>
              <span style={{
                fontSize: '16px',
                fontWeight: '400',
                color: '#5A5A5A',
                fontFamily: 'Arial, sans-serif',
                letterSpacing: '3px'
              }}>FINANCIAL</span>
            </div>
          </div>
        </div>

        {/* User Dropdown - Upper Right */}
        <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10">
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
                      window.location.href = 'http://localhost:5174';
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                  >
                    Switch to Single Flow BoB
                  </button>
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

        <div className="max-w-7xl mx-auto px-6">
          <div className="pt-3 pb-2 flex items-center gap-4">
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
              <h1 className="text-xl font-bold text-gray-900">Shipper Management</h1>
              <p className="text-gray-600 text-xs mt-0.5">Manage shipping and post-close efforts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Action Toolbar */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-2.5">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleRefresh}
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
        <div className="max-w-7xl mx-auto px-6 py-3">

        {/* SHIPPING DETAILS Section */}
        <div className="bg-white rounded-lg shadow-sm mb-2">
          <button
            onClick={() => toggleSection('shippingDetails')}
            className="w-full border-l-4 border-teal-500 bg-gray-50 px-6 py-2 hover:bg-gray-100 transition-colors"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Shipper */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Shipper
                </label>
                <select
                  value={formData.shipper}
                  onChange={(e) => handleInputChange('shipper', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                >
                  <option value="">Select...</option>
                  <option value="Shorline">Shorline</option>
                  <option value="Other">Other</option>
                </select>
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

              {/* ENote Indicator */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  ENote Indicator
                </label>
                <input
                  type="text"
                  value={formData.eNoteIndicator}
                  onChange={(e) => handleInputChange('eNoteIndicator', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                  placeholder="Enter indicator"
                />
              </div>

              {/* Not Ready to Ship */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Not Ready to Ship
                </label>
                <input
                  type="text"
                  value={formData.notReadyToShip}
                  onChange={(e) => handleInputChange('notReadyToShip', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                  placeholder="Status"
                />
              </div>

              {/* Shipped (from POST CLOSING DETAILS) */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Shipped
                </label>
                <input
                  type="date"
                  value={formData.shipped}
                  onChange={(e) => handleInputChange('shipped', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                />
              </div>

              {/* MCC */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  MCC
                </label>
                <input
                  type="text"
                  value={formData.mcc}
                  onChange={(e) => handleInputChange('mcc', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                  placeholder="Enter MCC"
                />
              </div>
            </div>
          </div>
          )}
        </div>

        {/* SERVICING INFORMATION Section */}
        <div className="bg-white rounded-lg shadow-sm mb-2">
          <button
            onClick={() => toggleSection('servicingInformation')}
            className="w-full border-l-4 border-teal-500 bg-gray-50 px-6 py-2 hover:bg-gray-100 transition-colors"
          >
            <h2 className="text-xs font-semibold text-gray-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Package size={14} className="text-teal-500" />
                SERVICING INFORMATION
              </span>
              {expandedSections.servicingInformation ? (
                <ChevronUp size={16} className="text-gray-600" />
              ) : (
                <ChevronDown size={16} className="text-gray-600" />
              )}
            </h2>
          </button>

          {expandedSections.servicingInformation && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Servicing Option */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Servicing Option
                </label>
                <select
                  value={formData.servicingOption}
                  onChange={(e) => handleInputChange('servicingOption', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                >
                  <option value="">Select...</option>
                  <option value="Servicing Retained">Servicing Retained</option>
                  <option value="Servicing Released">Servicing Released</option>
                </select>
              </div>

              {/* Servicing */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Servicing
                </label>
                <select
                  value={formData.servicing}
                  onChange={(e) => handleInputChange('servicing', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                >
                  <option value="">[Not Assigned]</option>
                  <option value="Assigned">Assigned</option>
                </select>
              </div>

              {/* Servicer */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Servicer
                </label>
                <select
                  value={formData.servicer}
                  onChange={(e) => handleInputChange('servicer', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                >
                  <option value="">Select...</option>
                  <option value="CMG-LoanServ">CMG-LoanServ</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Servicer Loan Number */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Servicer Loan Number
                </label>
                <input
                  type="text"
                  value={formData.servicerLoanNumber}
                  onChange={(e) => handleInputChange('servicerLoanNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                  placeholder="Enter loan number"
                />
              </div>

              {/* First Payment To Servicer */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  First Payment To Servicer
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={formData.firstPaymentToServicer}
                    onChange={(e) => handleInputChange('firstPaymentToServicer', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                  />
                  <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md text-xs hover:bg-gray-300 transition">
                    Fill
                  </button>
                </div>
              </div>

              {/* Data Transmitted Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Data Transmitted Date
                </label>
                <input
                  type="date"
                  value={formData.dataTransmittedDate}
                  onChange={(e) => handleInputChange('dataTransmittedDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Package Sent Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Package Sent Date
                </label>
                <input
                  type="date"
                  value={formData.packageSentDate}
                  onChange={(e) => handleInputChange('packageSentDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
                />
              </div>

              {/* Servicing Transfer Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Servicing Transfer Date
                </label>
                <input
                  type="date"
                  value={formData.servicingTransferDate}
                  onChange={(e) => handleInputChange('servicingTransferDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-xs"
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
