import React, { useState, useEffect } from 'react';
import { Coffee, Plus, Search, Edit2, Trash2, X, RefreshCw, AlertCircle, Check, ToggleLeft, ToggleRight } from 'lucide-react';
import { productApi, categoryApi } from '../services/api';

export default function ProductManagementView({ onToast }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [editProductId, setEditProductId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        productApi.getAll(),
        categoryApi.getAll(),
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      if (onToast) onToast(err.message || 'Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!formName.trim() || !formCategoryId || !formPrice) {
      setModalError('Name, Category, and Price are required.');
      return;
    }

    try {
      setModalLoading(true);
      setModalError('');
      const res = await productApi.add({
        name: formName.trim(),
        categoryId: Number(formCategoryId),
        price: parseFloat(formPrice),
        description: formDescription.trim(),
        status: 'true',
      });

      if (res.data.status) {
        if (onToast) onToast('Product Added Successfully', 'success');
        setIsAddModalOpen(false);
        resetForm();
        fetchData();
      } else {
        setModalError(res.data.message || 'Failed to add product');
      }
    } catch (err) {
      setModalError(err.message || 'Failed to add product');
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    if (!formName.trim() || !formCategoryId || !formPrice) {
      setModalError('Name, Category, and Price are required.');
      return;
    }

    try {
      setModalLoading(true);
      setModalError('');
      const res = await productApi.update({
        id: editProductId,
        name: formName.trim(),
        categoryId: Number(formCategoryId),
        price: parseFloat(formPrice),
        description: formDescription.trim(),
      });

      if (res.data.status) {
        if (onToast) onToast('Product Updated Successfully', 'success');
        setIsEditModalOpen(false);
        resetForm();
        fetchData();
      } else {
        setModalError(res.data.message || 'Failed to update product');
      }
    } catch (err) {
      setModalError(err.message || 'Failed to update product');
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleStatus = async (product) => {
    const nextStatus = product.status === 'true' ? 'false' : 'true';
    try {
      const res = await productApi.updateStatus(product.id, nextStatus);
      if (res.data.status) {
        if (onToast) onToast('Product Status Updated Successfully', 'success');
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, status: nextStatus } : p))
        );
      }
    } catch (err) {
      if (onToast) onToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete product "${name}"?`)) return;

    try {
      const res = await productApi.delete(id);
      if (res.data.status) {
        if (onToast) onToast('Product Deleted Successfully', 'success');
        fetchData();
      } else {
        if (onToast) onToast(res.data.message || 'Failed to delete product', 'error');
      }
    } catch (err) {
      if (onToast) onToast(err.message || 'Failed to delete product', 'error');
    }
  };

  const openEditModal = (p) => {
    setEditProductId(p.id);
    setFormName(p.name);
    setFormCategoryId(p.categoryId || '');
    setFormPrice(p.price);
    setFormDescription(p.description || '');
    setModalError('');
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormName('');
    setFormCategoryId('');
    setFormPrice('');
    setFormDescription('');
    setEditProductId(null);
    setModalError('');
  };

  const formatCurrency = (val) => `₹${Number(val || 0).toFixed(2)}`;

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'ALL' || String(p.categoryId) === String(selectedCategory);
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Coffee className="text-amber" size={26} />
            <span>Product Catalog</span>
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Manage menu items, prices, descriptions, and catalog availability.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={fetchData} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              if (categories.length > 0) setFormCategoryId(categories[0].id);
              setIsAddModalOpen(true);
            }}
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ maxWidth: '360px', width: '100%', position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '38px' }}
          />
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', maxWidth: '600px' }}>
          <button
            className={`btn btn-sm ${selectedCategory === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedCategory('ALL')}
          >
            All Categories ({products.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              className={`btn btn-sm ${String(selectedCategory) === String(c.id) ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCategory(String(c.id))}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="card" style={{ padding: '20px' }}>
        <div className="cafe-table-wrapper">
          <table className="cafe-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Price</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ width: '130px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    {loading ? 'Loading catalog...' : 'No products found matching your filter.'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600, fontSize: '15px' }}>{p.name}</td>
                    <td>
                      <span className="badge badge-amber">{p.categoryName || 'General'}</span>
                    </td>
                    <td style={{ maxWidth: '300px', color: 'var(--text-muted)', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.description || 'No description provided'}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>
                      {formatCurrency(p.price)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn btn-ghost"
                        style={{ padding: '4px 8px' }}
                        title={`Click to toggle status (Currently ${p.status === 'true' ? 'Active' : 'Inactive'})`}
                        onClick={() => handleToggleStatus(p)}
                      >
                        {p.status === 'true' ? (
                          <span className="badge badge-ready" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Check size={12} /> Active
                          </span>
                        ) : (
                          <span className="badge badge-busy">
                            Inactive
                          </span>
                        )}
                      </button>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button
                          className="btn btn-ghost"
                          style={{ padding: '6px 8px' }}
                          title="Edit Product"
                          onClick={() => openEditModal(p)}
                        >
                          <Edit2 size={15} className="text-amber" />
                        </button>
                        <button
                          className="btn btn-ghost"
                          style={{ padding: '6px 8px' }}
                          title="Delete Product"
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                        >
                          <Trash2 size={15} style={{ color: 'var(--danger)' }} />
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

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <div className="modal-title">
                <Plus size={20} className="text-amber" />
                <span>Add New Product</span>
              </div>
              <button className="btn btn-ghost" onClick={() => setIsAddModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddProduct}>
              <div className="modal-body">
                {modalError && (
                  <div className="p-3 mb-4 rounded bg-red-950 border border-red-800 text-red-200 text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{modalError}</span>
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Hazelnut Frappe"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-input"
                    placeholder="e.g. 180.00"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    placeholder="Ingredients, preparation details, flavor profile..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={modalLoading}>
                  {modalLoading ? 'Saving...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <div className="modal-title">
                <Edit2 size={20} className="text-amber" />
                <span>Edit Product</span>
              </div>
              <button className="btn btn-ghost" onClick={() => setIsEditModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEditProduct}>
              <div className="modal-body">
                {modalError && (
                  <div className="p-3 mb-4 rounded bg-red-950 border border-red-800 text-red-200 text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{modalError}</span>
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-input"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={modalLoading}>
                  {modalLoading ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
