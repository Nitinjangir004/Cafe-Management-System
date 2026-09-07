import React, { useState, useEffect } from 'react';
import { 
  Store,
  Menu,
  X,
  LayoutDashboard,
  Layers,
  Coffee,
  ShoppingCart,
  Receipt,
  Users,
  LogOut,
  Lock,
  Globe,
  Clock,
  Wifi,
  WifiOff,
  Sun,
  Moon
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  user,
  backendOnline,
  theme,
  toggleTheme,
  onOpenLogin,
  onOpenSignup,
  onOpenChangePassword,
  onLogout,
  onToggleSidebar,
  isSidebarOpen,
}) {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'category', label: 'Category', icon: Layers },
    { id: 'product', label: 'Product', icon: Coffee },
    { id: 'order', label: 'Order', icon: ShoppingCart },
    { id: 'bill', label: 'View Bills', icon: Receipt },
    ...(user?.role === 'admin' ? [{ id: 'user', label: 'Users', icon: Users }] : []),
  ];

  return (
    <header className="app-navbar">
      <div className="navbar-inner">
        {/* Left: Brand & Sidebar Toggle */}
        <div className="navbar-left">
          <button
            className="btn btn-ghost"
            style={{ padding: '8px', color: 'var(--text-main)' }}
            onClick={onToggleSidebar}
            title="Toggle Sidebar"
            aria-label="Toggle Navigation Menu"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div
            className="navbar-brand"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="navbar-logo">
              <Store size={20} />
            </div>
            <div className="navbar-brand-text">
              <div className="navbar-title">Cafe Management</div>
              <div className="navbar-subtitle hidden-mobile">Enterprise Operations</div>
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs (Hidden on tablets & mobile; accessible via Sidebar) */}
        <nav className="navbar-tabs-container hidden-tablet">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-tab-button ${isActive ? 'active' : 'inactive'}`}
              >
                <Icon size={16} className="tab-icon" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Clock, Online Status, Theme & Profile Menu */}
        <div className="navbar-right">
          {/* Live Clock (Hidden on tablet/mobile) */}
          <div className="navbar-clock hidden-tablet">
            <Clock size={13} className="text-amber" />
            <span>{time}</span>
          </div>

          {/* Backend Status (Icon only on mobile) */}
          <div
            className="navbar-status"
            title={backendOnline ? 'REST API Online' : 'Backend Disconnected'}
            style={{ color: backendOnline ? 'var(--success)' : 'var(--danger)' }}
          >
            {backendOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
            <span className="hidden-mobile">
              {backendOnline ? 'API Connected' : 'Offline'}
            </span>
          </div>

          {/* Theme Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 9px' }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <>
                <Sun size={15} className="text-amber" />
                <span className="hidden-mobile" style={{ fontSize: '12px' }}>Light</span>
              </>
            ) : (
              <>
                <Moon size={15} style={{ color: 'var(--accent-amber)' }} />
                <span className="hidden-mobile" style={{ fontSize: '12px' }}>Dark</span>
              </>
            )}
          </button>

          {/* User Profile Dropdown */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-secondary btn-sm navbar-profile-btn"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                title={user.name}
              >
                <div className="navbar-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="navbar-user-info hidden-mobile">
                  <div className="navbar-user-name">{user.name}</div>
                  <div className="navbar-user-role">{user.role}</div>
                </div>
              </button>

              {/* Profile Popover Menu */}
              {isProfileOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '8px',
                  width: '210px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 200,
                  padding: '6px',
                }}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>{user.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{user.email}</div>
                  </div>

                  <button
                    className="btn btn-ghost"
                    style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '13px' }}
                    onClick={() => {
                      setIsProfileOpen(false);
                      onOpenChangePassword();
                    }}
                  >
                    <Lock size={15} className="text-amber" />
                    <span>Change Password</span>
                  </button>

                  <button
                    className="btn btn-ghost"
                    style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '13px' }}
                    onClick={() => {
                      setIsProfileOpen(false);
                      setActiveTab('landing');
                    }}
                  >
                    <Globe size={15} className="text-amber" />
                    <span>Public Landing Page</span>
                  </button>

                  <div style={{ borderTop: '1px solid var(--border)', marginTop: '4px', paddingTop: '4px' }}>
                    <button
                      className="btn btn-ghost"
                      style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '13px', color: 'var(--danger)' }}
                      onClick={() => {
                        setIsProfileOpen(false);
                        onLogout();
                      }}
                    >
                      <LogOut size={15} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '6px' }}>
              <button className="btn btn-secondary btn-sm" onClick={onOpenSignup}>
                Sign Up
              </button>
              <button className="btn btn-primary btn-sm" onClick={onOpenLogin}>
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
