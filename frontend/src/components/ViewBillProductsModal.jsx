import React from 'react';
import { Eye, X, Printer, Receipt } from 'lucide-react';

export default function ViewBillProductsModal({ isOpen, onClose, bill, onPrint }) {
  if (!isOpen || !bill) return null;

  let products = [];
  try {
    if (typeof bill.productDetails === 'string') {
      products = JSON.parse(bill.productDetails || '[]');
    } else if (Array.isArray(bill.productDetails)) {
      products = bill.productDetails;
    }
  } catch (err) {
    console.error('Failed to parse bill products:', err);
    products = [];
  }

  const formatCurrency = (val) => `₹${Number(val || 0).toFixed(2)}`;

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '650px' }}>
        <div className="modal-header">
          <div className="modal-title">
            <Receipt size={20} className="text-amber" />
            <span>Bill Details - {bill.uuid || `BILL-#${bill.id}`}</span>
          </div>
          <button className="btn btn-ghost" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Customer Metadata Card */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            padding: '16px',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            border: '1px solid var(--border)'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Customer</div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>{bill.name}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Contact</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{bill.contactNumber || 'N/A'}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Email</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{bill.email || 'N/A'}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Payment</div>
              <span className="badge badge-prep" style={{ textTransform: 'capitalize' }}>
                {bill.paymentMethod || 'Cash'}
              </span>
            </div>
          </div>

          {/* Product Items Table */}
          <div style={{ marginBottom: '16px', fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>
            Ordered Products ({products.length})
          </div>

          <div className="cafe-table-wrapper" style={{ maxHeight: '280px', overflowY: 'auto' }}>
            <table className="cafe-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th style={{ textAlign: 'right' }}>Price</th>
                  <th style={{ textAlign: 'center' }}>Qty</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No product items recorded for this bill.
                    </td>
                  </tr>
                ) : (
                  products.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 500 }}>{item.name}</td>
                      <td>
                        <span className="badge" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          {item.category || 'General'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                        {formatCurrency(item.price)}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>
                        {item.quantity}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                        {formatCurrency(item.total || (item.price * item.quantity))}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Grand Total Bar */}
          <div style={{
            marginTop: '20px',
            padding: '14px 18px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-amber)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>Total Amount</span>
            <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
              {formatCurrency(bill.totalAmount)}
            </span>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          {onPrint && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onPrint(bill);
              }}
            >
              <Printer size={16} />
              <span>Print Invoice</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
