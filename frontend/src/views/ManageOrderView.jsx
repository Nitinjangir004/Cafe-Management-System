import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Trash2, Printer, AlertCircle, CheckCircle, CreditCard, User, Mail, Phone } from 'lucide-react';
import { categoryApi, productApi, cafeBillApi } from '../services/api';

export default function ManageOrderView({ user, onToast, onOpenReceipt }) {
  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  // Product selection
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [itemTotal, setItemTotal] = useState(0);

  // Cart
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        categoryApi.getAll(),
        productApi.getAll(),
      ]);
      const cats = catRes.data || [];
      const prods = prodRes.data?.filter((p) => p.status === 'true') || [];
      setCategories(cats);
      setProducts(prods);

      if (cats.length > 0) {
        setSelectedCategory(cats[0].id);
        const related = prods.filter((p) => String(p.categoryId) === String(cats[0].id));
        setFilteredProducts(related);
        if (related.length > 0) {
          selectProductItem(related[0]);
        }
      }
    } catch (err) {
      if (onToast) onToast('Failed to load menu items', 'error');
    }
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    const related = products.filter((p) => String(p.categoryId) === String(catId));
    setFilteredProducts(related);
    if (related.length > 0) {
      selectProductItem(related[0]);
    } else {
      setSelectedProductId('');
      setSelectedProduct(null);
      setUnitPrice(0);
      setItemTotal(0);
    }
  };

  const selectProductItem = (prod) => {
    if (!prod) return;
    setSelectedProductId(prod.id);
    setSelectedProduct(prod);
    const price = parseFloat(prod.price) || 0;
    setUnitPrice(price);
    setItemTotal(price * quantity);
  };

  const handleProductChange = (prodId) => {
    const prod = filteredProducts.find((p) => String(p.id) === String(prodId));
    selectProductItem(prod);
  };

  const handleQuantityChange = (qty) => {
    const val = Math.max(1, parseInt(qty) || 1);
    setQuantity(val);
    setItemTotal(unitPrice * val);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) {
      setError('Please select a product.');
      return;
    }

    setError('');
    const existingIndex = cart.findIndex((item) => item.id === selectedProduct.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      updated[existingIndex].total = updated[existingIndex].quantity * updated[existingIndex].price;
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          id: selectedProduct.id,
          name: selectedProduct.name,
          category: selectedProduct.categoryName || 'General',
          price: unitPrice,
          quantity: quantity,
          total: itemTotal,
        },
      ]);
    }

    setQuantity(1);
    setItemTotal(unitPrice * 1);
    if (onToast) onToast(`Added "${selectedProduct.name}" to order`, 'success');
  };

  const handleRemoveFromCart = (index) => {
    const updated = cart.filter((_, idx) => idx !== index);
    setCart(updated);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.total, 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const grandTotal = subtotal + tax;

  const validateOrder = () => {
    if (!customerName.trim()) return 'Customer Name is required.';
    if (cart.length === 0) return 'Please add at least one item to the order.';
    return null;
  };

  const handleSubmitOrder = async () => {
    const validationError = validateOrder();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const billData = {
        name: customerName.trim(),
        email: customerEmail.trim() || 'walkin@cafe.internal',
        contactNumber: customerPhone.trim() || '0000000000',
        paymentMethod: paymentMethod,
        totalAmount: grandTotal,
        productDetails: JSON.stringify(cart),
        createdBy: user?.name || 'Staff',
      };

      const res = await cafeBillApi.generateReport(billData);
      if (res.data.status) {
        if (onToast) onToast('Bill Generated Successfully!', 'success');

        const createdBill = {
          id: res.data.id,
          uuid: res.data.uuid,
          ...billData,
          createdAt: new Date().toISOString(),
        };

        // Reset order form
        setCustomerName('');
        setCustomerEmail('');
        setCustomerPhone('');
        setCart([]);

        // Immediately trigger receipt modal for print
        if (onOpenReceipt) {
          onOpenReceipt(createdBill);
        }
      } else {
        setError(res.data.message || 'Failed to generate bill');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit order');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => `₹${Number(val || 0).toFixed(2)}`;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShoppingCart className="text-amber" size={26} />
          <span>Manage Order & Bill Generation</span>
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
          Take in-store or takeaway orders, build customer tickets, and generate itemized thermal receipts.
        </p>
      </div>

      {error && (
        <div className="p-3 mb-4 rounded bg-red-950 border border-red-800 text-red-200 text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Grid: Customer Details & Product Selection */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Card 1: Customer Details */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontWeight: 700, fontSize: '15px' }}>
            <User size={18} className="text-amber" />
            <span>Customer Details</span>
          </div>

          <div className="form-group">
            <label className="form-label">Customer Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. John Doe"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <input
                type="tel"
                maxLength={10}
                className="form-input"
                placeholder="9876543210"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="john@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Payment Method</label>
            <select
              className="form-select"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="UPI / QR">UPI / QR Code</option>
            </select>
          </div>
        </div>

        {/* Card 2: Select Product */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontWeight: 700, fontSize: '15px' }}>
            <ShoppingCart size={18} className="text-amber" />
            <span>Select Product & Quantity</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Product</label>
              <select
                className="form-select"
                value={selectedProductId}
                onChange={(e) => handleProductChange(e.target.value)}
                disabled={filteredProducts.length === 0}
              >
                {filteredProducts.length === 0 ? (
                  <option value="">No items in category</option>
                ) : (
                  filteredProducts.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Unit Price</label>
              <input
                type="text"
                readOnly
                className="form-input"
                style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                value={formatCurrency(unitPrice)}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Quantity</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '8px 10px', borderRadius: '8px 0 0 8px' }}
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  style={{ textAlign: 'center', borderRadius: 0, borderLeft: 'none', borderRight: 'none' }}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '8px 10px', borderRadius: '0 8px 8px 0' }}
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Total</label>
              <input
                type="text"
                readOnly
                className="form-input"
                style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--accent-amber)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}
                value={formatCurrency(itemTotal)}
              />
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={handleAddToCart}
            disabled={!selectedProduct}
          >
            <Plus size={16} />
            <span>Add to Order Cart</span>
          </button>
        </div>
      </div>

      {/* Ordered Products Table & Bill Checkout */}
      <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ fontWeight: 700, fontSize: '16px' }}>
            Current Order Ticket ({cart.length} items)
          </div>
          {cart.length > 0 && (
            <button className="btn btn-ghost" style={{ color: 'var(--danger)', fontSize: '13px' }} onClick={() => setCart([])}>
              Clear Cart
            </button>
          )}
        </div>

        <div className="cafe-table-wrapper" style={{ marginBottom: '20px' }}>
          <table className="cafe-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th style={{ textAlign: 'right' }}>Price</th>
                <th style={{ textAlign: 'center' }}>Qty</th>
                <th style={{ textAlign: 'right' }}>Total</th>
                <th style={{ width: '80px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No products added yet. Select category & product above and click "Add to Order Cart".
                  </td>
                </tr>
              ) : (
                cart.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{item.name}</td>
                    <td>
                      <span className="badge badge-amber">{item.category}</span>
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                      {formatCurrency(item.price)}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>
                      {item.quantity}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-main)' }}>
                      {formatCurrency(item.total)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn btn-ghost"
                        style={{ padding: '6px' }}
                        title="Remove Item"
                        onClick={() => handleRemoveFromCart(idx)}
                      >
                        <Trash2 size={15} style={{ color: 'var(--danger)' }} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Invoice Total Summary */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '100%', maxWidth: '360px', background: 'var(--bg-surface)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrency(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: 'var(--text-muted)' }}>
              <span>CGST + SGST (5%)</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrency(tax)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border)', fontSize: '18px', fontWeight: 800, color: 'var(--accent-amber)' }}>
              <span>Grand Total</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrency(grandTotal)}</span>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '16px', padding: '12px', fontSize: '15px' }}
              onClick={handleSubmitOrder}
              disabled={loading || cart.length === 0}
            >
              <Printer size={18} />
              <span>{loading ? 'Processing...' : 'Submit & Generate Bill'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
