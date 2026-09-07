import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import ChangePasswordModal from './components/ChangePasswordModal';
import ViewBillProductsModal from './components/ViewBillProductsModal';
import ReceiptModal from './components/ReceiptModal';

// Views matching Angular cafe-springboot-angular-frontend
import LandingPageView from './views/LandingPageView';
import CafeDashboardView from './views/CafeDashboardView';
import CategoryManagementView from './views/CategoryManagementView';
import ProductManagementView from './views/ProductManagementView';
import ManageOrderView from './views/ManageOrderView';
import ViewBillsView from './views/ViewBillsView';
import UserManagementView from './views/UserManagementView';

import { dashboardApi } from './services/api';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function App() {
  // Default session: auto-load from localStorage or default to Admin User
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cafe_user');
      return saved ? JSON.parse(saved) : {
        name: 'Admin User',
        email: 'admin@mail.com',
        role: 'admin',
        contactNumber: '9876543210'
      };
    } catch {
      return {
        name: 'Admin User',
        email: 'admin@mail.com',
        role: 'admin',
        contactNumber: '9876543210'
      };
    }
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [backendOnline, setBackendOnline] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Theme state ('dark' or 'light')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('cafe_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cafe_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Modals state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isForgotPassOpen, setIsForgotPassOpen] = useState(false);
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);

  // Bill dialogs
  const [selectedBillForView, setSelectedBillForView] = useState(null);
  const [selectedBillForPrint, setSelectedBillForPrint] = useState(null);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const checkBackend = async () => {
    try {
      await dashboardApi.getDetails();
      setBackendOnline(true);
    } catch {
      setBackendOnline(false);
    }
  };

  useEffect(() => {
    checkBackend();
    const interval = setInterval(checkBackend, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('cafe_user');
    setUser(null);
    showToast('Logged out successfully', 'success');
    setActiveTab('landing');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    showToast(`Welcome back, ${userData.name}!`, 'success');
    setActiveTab('dashboard');
  };

  // If user is on the public landing page
  if (activeTab === 'landing') {
    return (
      <>
        <LandingPageView
          user={user}
          theme={theme}
          toggleTheme={toggleTheme}
          onEnterApp={() => setActiveTab('dashboard')}
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenSignup={() => setIsSignupOpen(true)}
          onOpenForgotPassword={() => setIsForgotPassOpen(true)}
        />

        {/* Modals */}
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          onOpenSignup={() => setIsSignupOpen(true)}
          onOpenForgotPassword={() => setIsForgotPassOpen(true)}
        />
        <SignupModal
          isOpen={isSignupOpen}
          onClose={() => setIsSignupOpen(false)}
          onOpenLogin={() => setIsLoginOpen(true)}
          onToast={showToast}
        />
        <ForgotPasswordModal
          isOpen={isForgotPassOpen}
          onClose={() => setIsForgotPassOpen(false)}
          onOpenLogin={() => setIsLoginOpen(true)}
          onToast={showToast}
        />

        {/* Toast Snackbar */}
        {toast && (
          <div className={`toast-bar ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
            {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{toast.message}</span>
            <button className="btn btn-ghost" style={{ padding: '2px', color: 'inherit' }} onClick={() => setToast(null)}>
              <X size={14} />
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        backendOnline={backendOnline}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenSignup={() => setIsSignupOpen(true)}
        onOpenChangePassword={() => setIsChangePassOpen(true)}
        onLogout={handleLogout}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Sidebar Drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenChangePassword={() => setIsChangePassOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main style={{ flex: 1 }}>
        {activeTab === 'dashboard' && (
          <CafeDashboardView
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenViewBillModal={(bill) => setSelectedBillForView(bill)}
          />
        )}

        {activeTab === 'category' && (
          <CategoryManagementView onToast={showToast} />
        )}

        {activeTab === 'product' && (
          <ProductManagementView onToast={showToast} />
        )}

        {activeTab === 'order' && (
          <ManageOrderView
            user={user}
            onToast={showToast}
            onOpenReceipt={(bill) => setSelectedBillForPrint(bill)}
          />
        )}

        {activeTab === 'bill' && (
          <ViewBillsView
            onOpenViewProducts={(bill) => setSelectedBillForView(bill)}
            onOpenReceipt={(bill) => setSelectedBillForPrint(bill)}
            onToast={showToast}
          />
        )}

        {activeTab === 'user' && user?.role === 'admin' && (
          <UserManagementView onToast={showToast} />
        )}
      </main>

      {/* Authentication Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onOpenSignup={() => setIsSignupOpen(true)}
        onOpenForgotPassword={() => setIsForgotPassOpen(true)}
      />

      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onToast={showToast}
      />

      <ForgotPasswordModal
        isOpen={isForgotPassOpen}
        onClose={() => setIsForgotPassOpen(false)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onToast={showToast}
      />

      <ChangePasswordModal
        isOpen={isChangePassOpen}
        onClose={() => setIsChangePassOpen(false)}
        userEmail={user?.email || 'admin@mail.com'}
        onToast={showToast}
      />

      {/* Bill Modals */}
      <ViewBillProductsModal
        isOpen={!!selectedBillForView}
        onClose={() => setSelectedBillForView(null)}
        bill={selectedBillForView}
        onPrint={(bill) => setSelectedBillForPrint(bill)}
      />

      <ReceiptModal
        bill={selectedBillForPrint}
        onClose={() => setSelectedBillForPrint(null)}
      />

      {/* Toast Notification */}
      {toast && (
        <div className={`toast-bar ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
          <button className="btn btn-ghost" style={{ padding: '2px', color: 'inherit' }} onClick={() => setToast(null)}>
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
