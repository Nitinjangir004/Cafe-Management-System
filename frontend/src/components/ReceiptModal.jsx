import React from 'react';
import { Printer, X, CheckCircle2, Store } from 'lucide-react';

export default function ReceiptModal({ bill, onClose }) {
  if (!bill) return null;

  const handlePrint = () => {
    window.print();
  };

  let items = [];
  if (bill.order?.items && Array.isArray(bill.order.items)) {
    items = bill.order.items.map((i) => ({
      name: i.itemName || i.menuItem?.name || 'Item',
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      totalPrice: i.totalPrice,
    }));
  } else if (bill.productDetails) {
    try {
      const parsed = typeof bill.productDetails === 'string' ? JSON.parse(bill.productDetails) : bill.productDetails;
      items = Array.isArray(parsed) ? parsed.map((i) => ({
        name: i.name || 'Item',
        quantity: i.quantity || 1,
        unitPrice: i.price,
        totalPrice: i.total || (i.price * i.quantity),
      })) : [];
    } catch (e) {
      items = [];
    }
  } else if (Array.isArray(bill.items)) {
    items = bill.items;
  }

  const invoiceId = bill.invoiceNumber || bill.uuid || `BILL-#${bill.id}`;
  const custName = bill.customerName || bill.name || 'Walk-in Guest';
  const totalAmount = bill.grandTotal || bill.totalAmount || 0;
  const payMethod = bill.paymentMethod || 'Cash';
  const subtotal = bill.subtotal || Math.round((totalAmount / 1.05) * 100) / 100;
  const tax = bill.taxAmount || Math.round((totalAmount - subtotal) * 100) / 100;

  const formatCurrency = (val) => `₹${Number(val || 0).toFixed(2)}`;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }}>
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '440px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
      }}>
        {/* Header Actions */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="var(--success)" />
            <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>Thermal Invoice Receipt</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handlePrint}
              className="btn btn-primary btn-sm"
              title="Print Receipt"
            >
              <Printer size={15} />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'var(--bg-elevated)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          background: '#ffffff',
          color: '#18181b',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
        }} id="printable-receipt">
          {/* Cafe Header */}
          <div style={{ textAlign: 'center', marginBottom: '16px', borderBottom: '1px dashed #a1a1aa', paddingBottom: '12px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#18181b', letterSpacing: '0.04em', margin: '0 0 4px' }}>
              CAFE MANAGEMENT SYSTEM
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#71717a', margin: 0 }}>Artisanal Coffee, Bakery & Dining</p>
            <p style={{ fontSize: '0.75rem', color: '#71717a', margin: '2px 0' }}>GSTIN / Tax ID: 29ABCDE1234F1Z5</p>
          </div>

          {/* Invoice Meta */}
          <div style={{ marginBottom: '16px', fontSize: '0.8rem', borderBottom: '1px dashed #a1a1aa', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#71717a' }}>Invoice No:</span>
              <span style={{ fontWeight: '700' }}>{invoiceId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#71717a' }}>Customer:</span>
              <span style={{ fontWeight: '600' }}>{custName}</span>
            </div>
            {bill.contactNumber && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#71717a' }}>Phone:</span>
                <span>{bill.contactNumber}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#71717a' }}>Date & Time:</span>
              <span>{new Date(bill.createdAt || Date.now()).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#71717a' }}>Payment Method:</span>
              <span style={{ fontWeight: '700', textTransform: 'uppercase' }}>{payMethod}</span>
            </div>
          </div>

          {/* Itemized Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #d4d4d8', textAlign: 'left' }}>
                <th style={{ padding: '6px 0', width: '50%' }}>ITEM</th>
                <th style={{ padding: '6px 0', textAlign: 'center', width: '15%' }}>QTY</th>
                <th style={{ padding: '6px 0', textAlign: 'right', width: '35%' }}>AMT</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ padding: '8px 0', textAlign: 'center', color: '#71717a' }}>
                    Standard Cafe Service
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px dotted #e4e4e7' }}>
                    <td style={{ padding: '6px 0', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: '600' }}>{item.name}</div>
                    </td>
                    <td style={{ padding: '6px 0', textAlign: 'center', verticalAlign: 'top' }}>
                      {item.quantity}
                    </td>
                    <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: '600', verticalAlign: 'top' }}>
                      {formatCurrency(item.totalPrice || item.total)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ borderTop: '1px dashed #a1a1aa', paddingTop: '10px', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#71717a' }}>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#71717a' }}>CGST / SGST (5%):</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '8px',
              borderTop: '2px solid #18181b',
              fontSize: '1rem',
              fontWeight: '800'
            }}>
              <span>TOTAL PAID:</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          {/* Footer Note */}
          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.75rem', color: '#71717a', borderTop: '1px dashed #a1a1aa', paddingTop: '12px' }}>
            <p style={{ margin: '0 0 4px', fontWeight: '600', color: '#18181b' }}>Thank you for visiting us!</p>
            <p style={{ margin: 0 }}>All rights reserved @BTech Days</p>
          </div>
        </div>

        {/* Modal Close Action */}
        <div style={{ padding: '12px 20px', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
