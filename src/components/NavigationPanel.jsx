import React from 'react';
import { X, Home } from 'lucide-react';

const NavigationPanel = ({ isOpen, onClose, onNavigate, currentPage }) => {
  const menuItems = [
    { id: 'shipper', label: 'Shipper', icon: Home },
    { id: 'example-a', label: 'Example Screen A', icon: null },
    { id: 'example-b', label: 'Example Screen B', icon: null },
    { id: 'example-c', label: 'Example Screen C', icon: null },
  ];

  const handleMenuClick = (itemId) => {
    onNavigate(itemId);
    onClose(); // Auto-close the navigation panel after selection
  };

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Slide-out panel */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-teal-600 to-teal-700 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between p-4 border-b border-teal-500/30">
          <h2 className="text-white font-semibold text-lg">Navigation</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1.5 rounded-lg transition"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="py-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition ${
                  isActive
                    ? 'bg-teal-700/50 text-white border-l-4 border-white'
                    : 'text-teal-50 hover:bg-teal-600/40'
                }`}
              >
                {Icon && <Icon size={18} />}
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-teal-500/30">
          <p className="text-teal-200 text-xs text-center">
            BoB Navigation Panel
          </p>
          <p className="text-teal-300 text-xs text-center mt-1">
            Phase 4 Initiative
          </p>
        </div>
      </div>
    </>
  );
};

export default NavigationPanel;
