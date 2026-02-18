import React, { useState } from 'react';
import { User, LogOut, Settings, Grid, ChevronDown, FileText, Package, Stethoscope, Activity, Menu } from 'lucide-react';
import { getAppUrl } from '../config/appUrls';

export default function BoBHeader({ currentApp = 'bulk', onMenuToggle }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAppsMenu, setShowAppsMenu] = useState(false);

  // Mock user data - would come from SSO in production
  const user = {
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Loan Processor',
    avatar: 'JD'
  };

  const apps = [
    {
      id: 'bulk',
      name: 'Bulk Bundle Manager',
      icon: Package,
      url: getAppUrl('bulk-bundle'),
      description: 'Process multiple loan bundles'
    },
    {
      id: 'single',
      name: 'Single Flow Builder',
      icon: FileText,
      url: getAppUrl('single-flow'),
      description: 'Build individual bundles'
    },
    {
      id: 'doctor',
      name: 'Doctor BoB',
      icon: Stethoscope,
      url: getAppUrl('doctor-bob'),
      description: 'Quality control & validation'
    },
    {
      id: 'doctor-bulk',
      name: 'Doctor BoB - Bulk',
      icon: Activity,
      url: getAppUrl('doctor-bob-bulk'),
      description: 'Bulk QC & validation processing'
    }
  ];

  const handleLogout = () => {
    alert('Logout functionality would redirect to SSO logout');
  };

  const handleSwitchProfile = () => {
    alert('Switch profile functionality would open profile selector');
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Hamburger Menu, Logo & App Switcher */}
          <div className="flex items-center gap-4">
            {/* Hamburger Menu Button */}
            {onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                aria-label="Toggle navigation menu"
              >
                <Menu size={24} />
              </button>
            )}

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  B
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold">BoB Manager Suite</h1>
                <p className="text-xs text-indigo-200">Bundle of Bundles</p>
              </div>
            </div>

            {/* App Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowAppsMenu(!showAppsMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
              >
                <Grid size={18} />
                <span className="text-sm font-medium">Apps</span>
                <ChevronDown size={16} className={`transition-transform ${showAppsMenu ? 'rotate-180' : ''}`} />
              </button>

              {showAppsMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowAppsMenu(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-20 overflow-hidden">
                    {apps.map(app => {
                      const Icon = app.icon;
                      const isActive = app.id === currentApp;
                      return (
                        <a
                          key={app.id}
                          href={app.url}
                          className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition ${
                            isActive ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${
                            isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            <Icon size={20} />
                          </div>
                          <div className="flex-1">
                            <div className={`font-semibold ${
                              isActive ? 'text-indigo-600' : 'text-gray-900'
                            }`}>
                              {app.name}
                              {isActive && (
                                <span className="ml-2 text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded">
                                  Active
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{app.description}</div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-indigo-600">{user.avatar}</span>
              </div>
              <div className="text-left hidden md:block">
                <div className="text-sm font-semibold">{user.name}</div>
                <div className="text-xs text-indigo-200">{user.role}</div>
              </div>
              <ChevronDown size={16} className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-20 overflow-hidden">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <div className="font-semibold text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="text-xs text-gray-400 mt-1">{user.role}</div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={handleSwitchProfile}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                    >
                      <User size={18} />
                      <span>Switch Profile</span>
                    </button>
                    <button
                      onClick={() => alert('Settings would open here')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Settings size={18} />
                      <span>Settings</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition font-medium"
                    >
                      <LogOut size={18} />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
