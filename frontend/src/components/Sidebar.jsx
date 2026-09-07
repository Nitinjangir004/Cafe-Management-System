import React from 'react';
import {
  LayoutDashboard,
  Layers,
  Coffee,
  ShoppingCart,
  Receipt,
  Users,
  Globe,
  Lock,
  LogOut,
  ChevronRight,
  Store
} from 'lucide-react';

export default function Sidebar({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  user,
  onOpenChangePassword,
  onLogout
}) {
  if (!isOpen) return null;

  const menuSections = [
    {
      title: 'Operations',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'category', label: 'Manage Category', icon: Layers },
        { id: 'product', label: 'Manage Product', icon: Coffee },
        { id: 'order', label: 'Manage Order', icon: ShoppingCart },
        { id: 'bill', label: 'View Bills', icon: Receipt },
      ]
    },
    ...(user?.role === 'admin' ? [{
      title: 'Administration',
      items: [
        { id: 'user', label: 'User Management', icon: Users },
      ]
    }] : []),
  ];

  const handleSelect = (tabId) => {
    setActiveTab(tabId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="sidebar-backdrop"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 90,
          display: 'block'
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '280px',
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-strong)',
        zIndex: 95,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)',
        animation: 'slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'var(--accent-amber)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            fontWeight: 800
          }}>
            <Store size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-main)' }}>Cafe Management</div>
            <div style={{ fontSize: '11px', color: 'var(--accent-amber)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {user ? `${user.role} workspace` : 'Guest'}
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
          {menuSections.map((sec, sIdx) => (
            <div key={sIdx} style={{ marginBottom: '20px' }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-dim)',
                padding: '0 12px 8px'
              }}>
                {sec.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className="btn btn-ghost"
                      style={{
                        width: '100%',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: isActive ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                        color: isActive ? 'var(--accent-amber)' : 'var(--text-muted)',
                        fontWeight: isActive ? 700 : 500,
                        border: isActive ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Icon size={18} className={isActive ? 'text-amber' : ''} />
                        <span style={{ fontSize: '14px' }}>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight size={14} />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer Controls */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid var(--border)',
          background: 'rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <button
            className="btn btn-ghost"
            style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '13px' }}
            onClick={() => handleSelect('landing')}
          >
            <Globe size={16} className="text-amber" />
            <span>Public Landing Page</span>
          </button>

          {user && (
            <>
              <button
                className="btn btn-ghost"
                style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '13px' }}
                onClick={() => {
                  onClose();
                  onOpenChangePassword();
                }}
              >
                <Lock size={16} className="text-amber" />
                <span>Change Password</span>
              </button>

              <button
                className="btn btn-ghost"
                style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '13px', color: 'var(--danger)' }}
                onClick={() => {
                  onClose();
                  onLogout();
                }}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
