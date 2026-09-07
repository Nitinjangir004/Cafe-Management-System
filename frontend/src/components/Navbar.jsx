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
  Moon,
  User as UserIcon
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
    <header style={{
      background: 'var(--bg-sidebar)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
        maxWidth: '1800px',
        margin: '0 auto',
      }}>
        {/* Left: Brand & Sidebar Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            className="btn btn-ghost"
            style={{ padding: '8px', color: 'var(--text-main)' }}
            onClick={onToggleSidebar}
            title="Toggle Sidebar"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            onClick={() => setActiveTab('dashboard')}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--accent-amber), #b45309)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              boxShadow: '0 0 12px var(--accent-glow)',
            }}>
              <Store size={22} />
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                Cafe Management System
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Enterprise Operations
              </div>
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs */}
        <nav className="navbar-tabs-container hidden-mobile">
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

        {/* Right: Clock, Online Status, & Profile Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Live Clock */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            padding: '6px 10px',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
          }}>
            <Clock size={13} className="text-amber" />
            <span>{time}</span>
          </div>

          {/* Backend Status */}
          <div
            title={backendOnline ? 'REST API Online' : 'Backend Disconnected'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: backendOnline ? 'var(--success)' : 'var(--danger)',
              padding: '6px 8px',
            }}
          >
            {backendOnline ? <Wifi size={15} /> : <WifiOff size={15} />}
            <span style={{ fontSize: '11px', fontWeight: 600 }} className="hidden-mobile">
              {backendOnline ? 'API Connected' : 'Offline'}
            </span>
          </div>

          {/* Theme Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              cursor: 'pointer',
            }}
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
                className="btn btn-secondary btn-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--accent-amber)',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '11px'
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700 }}>{user.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--accent-amber)', textTransform: 'uppercase' }}>
                    {user.role}
                  </div>
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
            <div style={{ display: 'flex', gap: '8px' }}>
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
