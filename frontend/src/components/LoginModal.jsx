import React, { useState } from 'react';
import { LogIn, X, Mail, Lock, AlertCircle } from 'lucide-react';
import { userApi } from '../services/api';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, onOpenSignup, onOpenForgotPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await userApi.login({ email, password });
      if (res.data.status) {
        const userData = {
          email: res.data.email,
          name: res.data.name,
          role: res.data.role,
          token: res.data.token,
          contactNumber: res.data.contactNumber,
        };
        localStorage.setItem('cafe_user', JSON.stringify(userData));
        onLoginSuccess(userData);
        onClose();
      } else {
        setError(res.data.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title">
            <LogIn size={20} className="text-amber" />
            <span>Login to Cafe Management</span>
          </div>
          <button className="btn btn-ghost" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="p-3 mb-4 rounded bg-red-950 border border-red-800 text-red-200 text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  placeholder="admin@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'var(--accent-amber)', fontSize: '12px', cursor: 'pointer' }}
                  onClick={() => { onClose(); onOpenForgotPassword(); }}
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div style={{ padding: '10px 14px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <strong>Demo Credentials:</strong><br />
              Admin: <code>admin@mail.com</code> / <code>admin</code><br />
              Staff: <code>user@mail.com</code> / <code>user</code>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => { onClose(); onOpenSignup(); }}
            >
              Don't have an account? Signup
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
