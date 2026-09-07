import React, { useState, useEffect } from 'react';
import { Layers, Plus, Search, Edit2, Trash2, X, RefreshCw, AlertCircle } from 'lucide-react';
import { categoryApi } from '../services/api';

export default function CategoryManagementView({ onToast }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryApi.getAll();
      setCategories(res.data || []);
    } catch (err) {
      if (onToast) onToast(err.message || 'Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setModalError('Category name cannot be empty.');
      return;
    }

    try {
      setModalLoading(true);
      setModalError('');
      const res = await categoryApi.add({ name: categoryName.trim() });
      if (res.data.status) {
        if (onToast) onToast('Category Added Successfully', 'success');
        setIsAddModalOpen(false);
        setCategoryName('');
        fetchCategories();
      } else {
        setModalError(res.data.message || 'Failed to add category');
      }
    } catch (err) {
      setModalError(err.message || 'Failed to add category');
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setModalError('Category name cannot be empty.');
      return;
    }

    try {
      setModalLoading(true);
      setModalError('');
      const res = await categoryApi.update({ id: editCategoryId, name: categoryName.trim() });
      if (res.data.status) {
        if (onToast) onToast('Category Updated Successfully', 'success');
        setIsEditModalOpen(false);
        setCategoryName('');
        setEditCategoryId(null);
        fetchCategories();
      } else {
        setModalError(res.data.message || 'Failed to update category');
      }
    } catch (err) {
      setModalError(err.message || 'Failed to update category');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      const res = await categoryApi.delete(id);
      if (res.data.status) {
        if (onToast) onToast('Category Deleted Successfully', 'success');
        fetchCategories();
      } else {
        if (onToast) onToast(res.data.message || 'Failed to delete category', 'error');
      }
    } catch (err) {
      if (onToast) onToast(err.message || 'Failed to delete category', 'error');
    }
  };

  const openEditModal = (cat) => {
    setEditCategoryId(cat.id);
    setCategoryName(cat.name);
    setModalError('');
    setIsEditModalOpen(true);
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* View Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers className="text-amber" size={26} />
            <span>Category Management</span>
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Create and organize menu categories for products, meals, and beverages.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={fetchCategories} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setCategoryName('');
              setModalError('');
              setIsAddModalOpen(true);
            }}
          >
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div style={{ marginBottom: '20px', maxWidth: '400px', position: 'relative' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: '38px' }}
        />
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
      </div>

      {/* Categories Table */}
      <div className="card" style={{ padding: '20px' }}>
        <div className="cafe-table-wrapper">
          <table className="cafe-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th>Category Name</th>
                <th style={{ width: '140px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    {loading ? 'Loading categories...' : 'No categories found matching your query.'}
                  </td>
                </tr>
              ) : (
                filteredCategories.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>#{c.id}</td>
                    <td style={{ fontWeight: 600, fontSize: '15px' }}>{c.name}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button
                          className="btn btn-ghost"
                          style={{ padding: '6px 8px' }}
                          title="Edit Category"
                          onClick={() => openEditModal(c)}
                        >
                          <Edit2 size={15} className="text-amber" />
                        </button>
                        <button
                          className="btn btn-ghost"
                          style={{ padding: '6px 8px' }}
                          title="Delete Category"
                          onClick={() => handleDeleteCategory(c.id, c.name)}
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

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <div className="modal-title">
                <Plus size={20} className="text-amber" />
                <span>Add New Category</span>
              </div>
              <button className="btn btn-ghost" onClick={() => setIsAddModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddCategory}>
              <div className="modal-body">
                {modalError && (
                  <div className="p-3 mb-4 rounded bg-red-950 border border-red-800 text-red-200 text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{modalError}</span>
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Specialty Desserts"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={modalLoading}>
                  {modalLoading ? 'Adding...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <div className="modal-title">
                <Edit2 size={20} className="text-amber" />
                <span>Edit Category</span>
              </div>
              <button className="btn btn-ghost" onClick={() => setIsEditModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEditCategory}>
              <div className="modal-body">
                {modalError && (
                  <div className="p-3 mb-4 rounded bg-red-950 border border-red-800 text-red-200 text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{modalError}</span>
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={modalLoading}>
                  {modalLoading ? 'Updating...' : 'Update Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
