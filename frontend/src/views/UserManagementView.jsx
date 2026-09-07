import React, { useState, useEffect } from 'react';
import { Users, Search, RefreshCw, Check, X, Shield, User } from 'lucide-react';
import { userApi } from '../services/api';

export default function UserManagementView({ onToast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userApi.getAll();
      setUsers(res.data || []);
    } catch (err) {
      if (onToast) onToast(err.message || 'Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'true' ? 'false' : 'true';
    try {
      const res = await userApi.updateStatus(user.id, nextStatus);
      if (res.data.status) {
        if (onToast) onToast('User Status Updated Successfully', 'success');
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
        );
      }
    } catch (err) {
      if (onToast) onToast(err.message || 'Failed to update user status', 'error');
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.contactNumber && u.contactNumber.includes(q))
    );
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users className="text-amber" size={26} />
            <span>User Management</span>
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Review registered staff and cafe users, grant account activation, and manage access privileges.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={fetchUsers} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '20px', maxWidth: '400px', position: 'relative' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Search users by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: '38px' }}
        />
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
      </div>

      {/* Users Table */}
      <div className="card" style={{ padding: '20px' }}>
        <div className="cafe-table-wrapper">
          <table className="cafe-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Role</th>
                <th style={{ textAlign: 'center' }}>Account Status</th>
                <th style={{ width: '140px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    {loading ? 'Loading users...' : 'No users found.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '15px' }}>{u.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{u.email}</div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                      {u.contactNumber}
                    </td>
                    <td>
                      <span className="badge badge-amber" style={{ textTransform: 'uppercase' }}>
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {u.status === 'true' ? (
                        <span className="badge badge-ready" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={12} /> Active / Approved
                        </span>
                      ) : (
                        <span className="badge badge-busy" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <X size={12} /> Inactive / Pending
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className={`btn btn-sm ${u.status === 'true' ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={() => handleToggleStatus(u)}
                      >
                        {u.status === 'true' ? 'Deactivate' : 'Approve & Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
