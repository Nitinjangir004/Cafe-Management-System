import React, { useState } from 'react';
import { UserPlus, X, AlertCircle, CheckCircle } from 'lucide-react';
import { userApi } from '../services/api';

export default function SignupModal({ isOpen, onClose, onOpenLogin, onToast }) {
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const validate = () => {
    // Regex from regex.txt
    const nameRegex = /^[a-zA-Z0-9 ]+$/;
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\.[a-z]{2,4}$/;
    const contactRegex = /^[0-9]{10}$/;

    if (!nameRegex.test(name.trim())) {
      return 'Name should only contain letters, numbers, and spaces.';
    }
    if (!contactRegex.test(contactNumber.trim())) {
      return 'Contact number must be exactly 10 digits.';
    }
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address.';
    }
    if (password.length < 4) {
      return 'Password must be at least 4 characters.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await userApi.signup({
        name: name.trim(),
        contactNumber: contactNumber.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      if (res.data.status) {
        if (onToast) onToast('Successfully Registered! Please login.', 'success');
        onClose();
        onOpenLogin();
      } else {
        setError(res.data.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title">
            <UserPlus size={20} className="text-amber" />
            <span>Create Cafe Account</span>
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
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Number (10 Digits)</label>
              <input
                type="tel"
                maxLength={10}
                className="form-input"
                placeholder="9876543210"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              Already have an account? Login
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
