import React, { useState } from 'react';
import { Database, Save, X, RefreshCw, Menu, ArrowLeft } from 'lucide-react';
import { getAppUrl } from '../config/appUrls';

const ExampleScreenB = ({ onMenuToggle, onNavigateBack }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Fixed Action Toolbar */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm relative">
        <div className="max-w-7xl mx-auto px-6 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onMenuToggle && (
                <button
                  onClick={onMenuToggle}
                  className="p-1.5 rounded hover:bg-gray-100 transition text-gray-500"
                  aria-label="Toggle navigation menu"
                >
                  <Menu size={18} />
                </button>
              )}
              {onNavigateBack && (
                <button
                  onClick={onNavigateBack}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-teal-600 transition font-medium"
                >
                  <ArrowLeft size={14} />
                  Back to BoB
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition font-medium text-xs"
                title="Refresh"
              >
                <RefreshCw size={14} />
                Refresh
              </button>
              <button
                onClick={() => { if (onNavigateBack) onNavigateBack(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition font-medium text-xs"
              >
                <X size={14} />
                Cancel
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 text-white rounded hover:bg-teal-600 transition font-medium text-xs">
                <Save size={14} />
                Save Changes
              </button>
              {/* User Dropdown */}
              <div className="relative ml-2">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold shadow-sm hover:bg-teal-600 transition-colors cursor-pointer"
                  title="User Menu"
                >
                  AO
                </button>
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => { setShowUserDropdown(false); alert('My Account clicked'); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                    >
                      My Account
                    </button>
                    <button
                      onClick={() => { setShowUserDropdown(false); alert('Sign Out clicked'); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-200"
                    >
                      Sign Out
                    </button>
                    <div className="border-t border-gray-200 pt-2 pb-1">
                      <p className="px-4 py-1 text-xs text-gray-500 font-semibold uppercase">Switch App</p>
                      <button
                        onClick={() => { setShowUserDropdown(false); window.location.href = getAppUrl('single-flow'); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Single Flow BoB
                      </button>
                      <button
                        onClick={() => { setShowUserDropdown(false); window.location.href = getAppUrl('bulk-bundle'); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Bulk Bundle Manager
                      </button>
                      <button
                        onClick={() => { setShowUserDropdown(false); window.location.href = getAppUrl('doctor-bob'); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Doctor BoB
                      </button>
                      <button
                        onClick={() => { setShowUserDropdown(false); window.location.href = getAppUrl('doctor-bob-bulk'); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-lg"
                      >
                        Doctor BoB - Bulk
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3">
              <Database className="text-teal-600" size={24} />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Clear to Close Review</h1>
                <p className="text-gray-600 text-xs mt-1">
                  QC audit screen for reviewing Clear to Close conditions and final approval checklist.
                </p>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
                <Database className="text-teal-600" size={24} />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 mb-2">
                Clear to Close Review
              </h2>
              <p className="text-gray-600 max-w-md mx-auto text-xs">
                This screen is currently a placeholder. Additional functionality and
                features will be added here as part of the Phase 4 initiative to
                fully decouple CMG users from Byte.
              </p>
              <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-lg text-xs font-medium">
                <span className="inline-block w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
                Under Development
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExampleScreenB;
