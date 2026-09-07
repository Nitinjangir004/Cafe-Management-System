import React, { useState, useEffect } from 'react';
import { Layers, Coffee, Receipt, DollarSign, PlusCircle, ArrowRight, Eye, RefreshCw } from 'lucide-react';
import { dashboardApi, cafeBillApi } from '../services/api';

export default function CafeDashboardView({ onNavigate, onOpenViewBillModal }) {
  const [details, setDetails] = useState({ category: 0, product: 0, bill: 0 });
  const [recentBills, setRecentBills] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [detRes, billsRes] = await Promise.all([
        dashboardApi.getDetails(),
        cafeBillApi.getBills(),
      ]);
      setDetails(detRes.data || { category: 0, product: 0, bill: 0 });
      setRecentBills(billsRes.data?.slice(0, 5) || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatCurrency = (val) => `₹${Number(val || 0).toFixed(2)}`;

  const totalRevenue = recentBills.reduce((acc, b) => acc + Number(b.totalAmount || 0), 0);

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
            Cafe Operations Dashboard
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Real-time operational overview, catalog volume, and recent transactions.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={fetchDashboardData} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {/* Categories Card */}
        <div className="card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => onNavigate('category')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--info)' }}>
              <Layers size={22} />
            </div>
            <span className="badge badge-prep">Categories</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-main)', marginBottom: '4px' }}>
            {details.category}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)' }}>
            <span>Total Categories</span>
            <ArrowRight size={14} className="text-amber" />
          </div>
        </div>

        {/* Products Card */}
        <div className="card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => onNavigate('product')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-amber)' }}>
              <Coffee size={22} />
            </div>
            <span className="badge badge-amber">Products</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-main)', marginBottom: '4px' }}>
            {details.product}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)' }}>
            <span>Active Menu Items</span>
            <ArrowRight size={14} className="text-amber" />
          </div>
        </div>

        {/* Bills Card */}
        <div className="card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => onNavigate('bill')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
              <Receipt size={22} />
            </div>
            <span className="badge badge-ready">Generated</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-main)', marginBottom: '4px' }}>
            {details.bill}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)' }}>
            <span>Total Invoices</span>
            <ArrowRight size={14} className="text-amber" />
          </div>
        </div>

        {/* Quick Revenue Estimate Card */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(234, 179, 8, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eab308' }}>
              <DollarSign size={22} />
            </div>
            <span className="badge badge-amber">Recent Volume</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', marginBottom: '4px' }}>
            {formatCurrency(totalRevenue)}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Calculated from latest orders
          </div>
        </div>
      </div>

      {/* Quick Shortcuts */}
      <div style={{
        padding: '20px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '32px'
      }}>
        <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', color: 'var(--text-main)' }}>
          Quick Operational Shortcuts
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => onNavigate('order')}>
            <PlusCircle size={16} />
            <span>Create New Order</span>
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('category')}>
            <Layers size={16} />
            <span>Manage Categories</span>
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('product')}>
            <Coffee size={16} />
            <span>Manage Products</span>
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('bill')}>
            <Receipt size={16} />
            <span>View All Bills</span>
          </button>
        </div>
      </div>

      {/* Recent Bills Table */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0 }}>Recent Bills</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Latest customer receipts generated in the system.
            </p>
          </div>
          <button className="btn btn-ghost" onClick={() => onNavigate('bill')}>
            <span>View All</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="cafe-table-wrapper">
          <table className="cafe-table">
            <thead>
              <tr>
                <th>Bill / Invoice #</th>
                <th>Customer</th>
                <th>Payment</th>
                <th style={{ textAlign: 'right' }}>Total Amount</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentBills.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No bills generated yet. Click "Create New Order" to create the first bill!
                  </td>
                </tr>
              ) : (
                recentBills.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-amber)' }}>
                      {b.uuid}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{b.email || b.contactNumber || 'Walk-in'}</div>
                    </td>
                    <td>
                      <span className="badge badge-prep">{b.paymentMethod || 'Cash'}</span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      {formatCurrency(b.totalAmount)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn btn-ghost"
                        style={{ padding: '6px 10px' }}
                        title="View bill product details"
                        onClick={() => onOpenViewBillModal(b)}
                      >
                        <Eye size={15} />
                        <span>View</span>
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
