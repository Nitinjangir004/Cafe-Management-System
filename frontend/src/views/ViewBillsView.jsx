import React, { useState, useEffect } from 'react';
import { Receipt, Search, Eye, Printer, Trash2, RefreshCw } from 'lucide-react';
import { cafeBillApi } from '../services/api';

export default function ViewBillsView({ onOpenViewProducts, onOpenReceipt, onToast }) {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await cafeBillApi.getBills();
      setBills(res.data || []);
    } catch (err) {
      if (onToast) onToast(err.message || 'Failed to load bills', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleDeleteBill = async (id, uuid) => {
    if (!window.confirm(`Are you sure you want to delete bill ${uuid || `#${id}`}?`)) return;

    try {
      const res = await cafeBillApi.delete(id);
      if (res.data.status) {
        if (onToast) onToast('Bill Deleted Successfully', 'success');
        fetchBills();
      } else {
        if (onToast) onToast(res.data.message || 'Failed to delete bill', 'error');
      }
    } catch (err) {
      if (onToast) onToast(err.message || 'Failed to delete bill', 'error');
    }
  };

  const formatCurrency = (val) => `₹${Number(val || 0).toFixed(2)}`;

  const filteredBills = bills.filter((b) => {
    const q = search.toLowerCase();
    return (
      (b.name && b.name.toLowerCase().includes(q)) ||
      (b.email && b.email.toLowerCase().includes(q)) ||
      (b.contactNumber && b.contactNumber.includes(q)) ||
      (b.uuid && b.uuid.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Receipt className="text-amber" size={26} />
            <span>View Bills & Invoices</span>
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Browse customer invoices, inspect itemized order products, and re-print receipts.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={fetchBills} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '20px', maxWidth: '450px', position: 'relative' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Filter by customer name, email, phone, or bill ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: '38px' }}
        />
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
      </div>

      {/* Bills Table */}
      <div className="card" style={{ padding: '20px' }}>
        <div className="cafe-table-wrapper">
          <table className="cafe-table">
            <thead>
              <tr>
                <th>Invoice / Bill UUID</th>
                <th>Customer Name</th>
                <th>Contact & Email</th>
                <th>Payment</th>
                <th style={{ textAlign: 'right' }}>Total Amount</th>
                <th>Date</th>
                <th style={{ width: '140px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    {loading ? 'Loading bills...' : 'No bills found matching your search.'}
                  </td>
                </tr>
              ) : (
                filteredBills.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-amber)', fontSize: '13px' }}>
                      {b.uuid || `BILL-#${b.id}`}
                    </td>
                    <td style={{ fontWeight: 600, fontSize: '15px' }}>{b.name}</td>
                    <td>
                      <div style={{ fontSize: '13px', color: 'var(--text-main)' }}>{b.contactNumber || 'N/A'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{b.email || 'N/A'}</div>
                    </td>
                    <td>
                      <span className="badge badge-prep" style={{ textTransform: 'capitalize' }}>
                        {b.paymentMethod || 'Cash'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                      {formatCurrency(b.totalAmount)}
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'Today'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                        <button
                          className="btn btn-ghost"
                          style={{ padding: '6px 8px' }}
                          title="View Bill Products Dialog"
                          onClick={() => onOpenViewProducts(b)}
                        >
                          <Eye size={16} className="text-amber" />
                        </button>
                        <button
                          className="btn btn-ghost"
                          style={{ padding: '6px 8px' }}
                          title="Print / Download Receipt"
                          onClick={() => onOpenReceipt(b)}
                        >
                          <Printer size={16} className="text-amber" />
                        </button>
                        <button
                          className="btn btn-ghost"
                          style={{ padding: '6px 8px' }}
                          title="Delete Bill"
                          onClick={() => handleDeleteBill(b.id, b.uuid)}
                        >
                          <Trash2 size={16} style={{ color: 'var(--danger)' }} />
                        </button>
                      </div>
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
