import React, { useState } from 'react';
import { KeyRound, X, AlertCircle } from 'lucide-react';
import { userApi } from '../services/api';

export default function ForgotPasswordModal({ isOpen, onClose, onOpenLogin, onToast }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your registered email address.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await userApi.forgotPassword(email.trim());
      if (onToast) {
        onToast(res.data.message || 'Check your mail for Credentials.', 'success');
      }
      onClose();
      onOpenLogin();
    } catch (err) {
      setError(err.message || 'Password reset request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title">
            <KeyRound size={20} className="text-amber" />
            <span>Forgot Password</span>
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

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Enter your registered account email. A temporary credential or recovery link will be sent to your inbox.
            </p>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="registered@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => { onClose(); onOpenLogin(); }}
            >
              Back to Login
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send Recovery'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
