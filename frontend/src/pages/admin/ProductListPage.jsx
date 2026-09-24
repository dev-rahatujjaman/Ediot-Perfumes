import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { listProducts, deleteProduct, createProduct, resetSuccess } from '../../store/slices/productSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiBox,
  FiLayers,
  FiDollarSign,
  FiExternalLink,
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiRefreshCw,
  FiTag,
  FiX
} from 'react-icons/fi';

const ProductListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products = [], loading, error, successCreate, successDelete } = useSelector((state) => state.products || state.product || {});

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL'); // ALL, IN_STOCK, LOW_STOCK, OUT_OF_STOCK
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New flacon form state
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState(195);
  const [newBrand, setNewBrand] = useState('Ediot Breeze');
  const [newCategory, setNewCategory] = useState('Extrait de Parfum');
  const [newStock, setNewStock] = useState(20);
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80');
  const [newDesc, setNewDesc] = useState('Handcrafted haute perfumery reserve formulated in Grasse with rare botanical absolutes.');

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch, successDelete]);

  useEffect(() => {
    if (successCreate) {
      dispatch(resetSuccess());
      setShowCreateModal(false);
      dispatch(listProducts());
    }
  }, [successCreate, dispatch]);

  const safeProducts = Array.isArray(products) ? products : [];

  // Metrics
  const totalFlacons = safeProducts.length;
  const totalUnits = safeProducts.reduce((acc, p) => acc + (Number(p.countInStock || p.stock || 0)), 0);
  const totalValuation = safeProducts.reduce((acc, p) => acc + ((Number(p.price) || 0) * (Number(p.countInStock || p.stock || 0))), 0);
  const lowStockCount = safeProducts.filter(p => (p.countInStock || p.stock || 0) <= 5).length;

  // Categories set
  const categories = useMemo(() => {
    const set = new Set();
    safeProducts.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [safeProducts]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return safeProducts.filter(p => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || p.name?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q);
      if (!matchesSearch) return false;

      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;

      const stock = Number(p.countInStock !== undefined ? p.countInStock : p.stock || 0);
      if (stockFilter === 'IN_STOCK' && stock <= 5) return false;
      if (stockFilter === 'LOW_STOCK' && (stock > 5 || stock <= 0)) return false;
      if (stockFilter === 'OUT_OF_STOCK' && stock > 0) return false;

      return true;
    });
  }, [safeProducts, searchQuery, selectedCategory, stockFilter]);

  const deleteHandler = async (id, name) => {
    if (window.confirm(`Are you sure you wish to decommission "${name || 'this fragrance'}" from the active collection?`)) {
      dispatch(deleteProduct(id));
      toast.success('Fragrance decommissioned successfully');
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error('Please provide a formulation name');
      return;
    }

    const payload = {
      name: newName,
      price: Number(newPrice),
      brand: newBrand,
      category: newCategory,
      countInStock: Number(newStock),
      stock: Number(newStock),
      image: newImage,
      description: newDesc,
    };

    dispatch(createProduct(payload));
    toast.success('New haute formulation created in catalog');
  };

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '130px',
      paddingBottom: '120px',
      background: 'var(--color-cream, #FDFCFA)',
      color: '#1D1D1F',
    }}>
      <div className="container" style={{ maxWidth: '1340px', margin: '0 auto', padding: '0 24px' }}>

        {/* TOP BAR / NAVIGATION TABS */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '36px',
          paddingBottom: '24px',
          borderBottom: '1px solid rgba(184, 149, 106, 0.25)',
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#B8956A',
              fontWeight: 700,
              marginBottom: '6px',
            }}>
              <span>✦</span>
              <span>Maison Executive Control</span>
              <span>✦</span>
            </div>
            <h1 style={{
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              color: '#1D1D1F',
              margin: 0,
            }}>
              Fragrance Atelier Catalog
            </h1>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#FFFFFF',
            padding: '6px',
            borderRadius: '999px',
            border: '1px solid rgba(184, 149, 106, 0.3)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
          }}>
            <Link
              to="/admin/dashboard"
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                background: 'transparent',
                color: '#6E6E73',
                textDecoration: 'none',
                fontSize: '12.5px',
                fontWeight: 600,
                transition: 'color 0.2s ease',
              }}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/products"
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                background: '#1D1D1F',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '12.5px',
                fontWeight: 700,
                letterSpacing: '0.04em',
              }}
            >
              Fragrances ({safeProducts.length})
            </Link>
            <Link
              to="/admin/orders"
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                background: 'transparent',
                color: '#6E6E73',
                textDecoration: 'none',
                fontSize: '12.5px',
                fontWeight: 600,
                transition: 'color 0.2s ease',
              }}
            >
              Orders
            </Link>
            <Link
              to="/admin/users"
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                background: 'transparent',
                color: '#6E6E73',
                textDecoration: 'none',
                fontSize: '12.5px',
                fontWeight: 600,
                transition: 'color 0.2s ease',
              }}
            >
              Clients
            </Link>
          </div>
        </div>

        {/* 1. CATALOG SUMMARY CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '22px',
            border: '1.5px solid rgba(184, 149, 106, 0.3)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
          }}>
            <span style={{ fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B8956A', fontWeight: 700 }}>
              Active Formulations
            </span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#1D1D1F', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
              {totalFlacons} Flacons
            </div>
            <div style={{ fontSize: '11.5px', color: '#6E6E73', marginTop: '4px' }}>
              Distinct Grasse Extraits in Active Ledger
            </div>
          </div>

          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '22px',
            border: '1px solid rgba(184, 149, 106, 0.25)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
          }}>
            <span style={{ fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B8956A', fontWeight: 700 }}>
              Vault Reserve Units
            </span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#1D1D1F', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
              {totalUnits} Units
            </div>
            <div style={{ fontSize: '11.5px', color: '#6E6E73', marginTop: '4px' }}>
              Total bottles ready for VIP allocation
            </div>
          </div>

          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '22px',
            border: '1px solid rgba(184, 149, 106, 0.25)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
          }}>
            <span style={{ fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B8956A', fontWeight: 700 }}>
              Inventory Valuation
            </span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#1D1D1F', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
              ${totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '11.5px', color: '#6E6E73', marginTop: '4px' }}>
              Gross value of vault reserves
            </div>
          </div>

          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '22px',
            border: '1px solid rgba(184, 149, 106, 0.25)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
          }}>
            <span style={{ fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B8956A', fontWeight: 700 }}>
              Stock Depletion Alerts
            </span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: lowStockCount > 0 ? '#D9534F' : '#2E6F40', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
              {lowStockCount} Low Stock
            </div>
            <div style={{ fontSize: '11.5px', color: '#6E6E73', marginTop: '4px' }}>
              {lowStockCount > 0 ? 'Batch replenishment recommended' : 'All formulas well-stocked'}
            </div>
          </div>
        </div>

        {/* 2. CONTROLS BAR: SEARCH, FILTERS & ADD NEW FLACON BUTTON */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}>
          {/* Search and Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#FFFFFF',
              border: '1.5px solid rgba(184, 149, 106, 0.35)',
              borderRadius: '999px',
              padding: '10px 18px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}>
              <FiSearch style={{ color: '#B8956A', fontSize: '15px' }} />
              <input
                type="text"
                placeholder="Search by name, category, or note..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '13px',
                  color: '#1D1D1F',
                  width: '240px',
                }}
              />
            </div>

            {/* Category Filter Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '10px 16px',
                borderRadius: '999px',
                border: '1.5px solid rgba(184, 149, 106, 0.35)',
                background: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#1D1D1F',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Stock Filter Select */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              style={{
                padding: '10px 16px',
                borderRadius: '999px',
                border: '1.5px solid rgba(184, 149, 106, 0.35)',
                background: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#1D1D1F',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">All Stock Levels</option>
              <option value="IN_STOCK">Plentiful Stock (&gt; 5)</option>
              <option value="LOW_STOCK">Low Stock (≤ 5)</option>
              <option value="OUT_OF_STOCK">Depleted (0)</option>
            </select>
          </div>

          {/* Formulate New Flacon Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 26px',
              borderRadius: '999px',
              background: '#1D1D1F',
              color: '#FFFFFF',
              border: '1px solid rgba(184, 149, 106, 0.4)',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#B8956A';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1D1D1F';
              e.currentTarget.style.color = '#FFFFFF';
            }}
          >
            <FiPlus style={{ fontSize: '16px' }} />
            <span>Formulate New Flacon</span>
          </button>
        </div>

        {/* 3. CATALOG LEDGER TABLE */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}><Loader /></div>
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <div style={{
            background: '#FFFFFF',
            borderRadius: '28px',
            border: '1.5px solid rgba(184, 149, 106, 0.3)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.04)',
            overflow: 'hidden',
          }}>
            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6E6E73' }}>
                <p style={{ fontSize: '15px', fontWeight: 600 }}>No fragrances match your filter criteria.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                  <thead>
                    <tr style={{ background: 'rgba(184, 149, 106, 0.05)', borderBottom: '1.5px solid rgba(184, 149, 106, 0.25)', color: '#6E6E73' }}>
                      <th style={{ padding: '16px 20px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }}>Flacon & Formula</th>
                      <th style={{ padding: '16px 20px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }}>Reserve Price</th>
                      <th style={{ padding: '16px 20px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }}>Category / Accord</th>
                      <th style={{ padding: '16px 20px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }}>Maison Brand</th>
                      <th style={{ padding: '16px 20px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }}>Vault Stock</th>
                      <th style={{ padding: '16px 20px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => {
                      const stock = Number(product.countInStock !== undefined ? product.countInStock : product.stock || 0);
                      return (
                        <tr
                          key={product._id}
                          style={{
                            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                            transition: 'background 0.2s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(184, 149, 106, 0.03)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                              <img
                                src={product.image || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80'}
                                alt={product.name}
                                style={{
                                  width: '52px',
                                  height: '52px',
                                  borderRadius: '14px',
                                  objectFit: 'cover',
                                  border: '1.5px solid rgba(184, 149, 106, 0.3)',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                }}
                              />
                              <div>
                                <div style={{ fontWeight: 700, color: '#1D1D1F', fontSize: '14.5px' }}>
                                  {product.name}
                                </div>
                                <div style={{ fontSize: '11px', color: '#86868B', fontFamily: 'monospace', marginTop: '2px' }}>
                                  ID: #{product._id?.slice(-8).toUpperCase()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '16px 20px', fontWeight: 700, color: '#B8956A', fontSize: '15px' }}>
                            ${Number(product.price || 0).toFixed(2)}
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 12px',
                              borderRadius: '999px',
                              background: 'rgba(184, 149, 106, 0.12)',
                              color: '#A47D4C',
                              fontSize: '11.5px',
                              fontWeight: 700,
                            }}>
                              {product.category || 'Extrait de Parfum'}
                            </span>
                          </td>
                          <td style={{ padding: '16px 20px', color: '#6E6E73', fontWeight: 600 }}>
                            {product.brand || 'Ediot Breeze'}
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '5px 12px',
                              borderRadius: '999px',
                              background: stock > 5 ? 'rgba(46, 111, 64, 0.1)' : stock > 0 ? 'rgba(184, 149, 106, 0.15)' : 'rgba(217, 83, 79, 0.1)',
                              color: stock > 5 ? '#2E6F40' : stock > 0 ? '#A47D4C' : '#D9534F',
                              fontSize: '11.5px',
                              fontWeight: 700,
                            }}>
                              {stock > 5 ? <FiCheckCircle /> : stock > 0 ? <FiAlertTriangle /> : <FiXCircle />}
                              <span>{stock > 0 ? `${stock} in Vault` : 'Depleted'}</span>
                            </span>
                          </td>
                          <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                              <Link
                                to={`/product/${product._id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  background: '#FAF8F5',
                                  border: '1px solid rgba(184, 149, 106, 0.25)',
                                  color: '#6E6E73',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  textDecoration: 'none',
                                  fontSize: '13px',
                                  transition: 'all 0.2s ease',
                                }}
                                title="Preview on Boutique"
                              >
                                <FiExternalLink />
                              </Link>
                              <Link
                                to={`/admin/product/${product._id}/edit`}
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  background: 'rgba(184, 149, 106, 0.12)',
                                  border: '1px solid rgba(184, 149, 106, 0.3)',
                                  color: '#B8956A',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  textDecoration: 'none',
                                  fontSize: '13px',
                                  transition: 'all 0.2s ease',
                                }}
                                title="Refine Formulation"
                              >
                                <FiEdit2 />
                              </Link>
                              <button
                                onClick={() => deleteHandler(product._id, product.name)}
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  background: 'rgba(217, 83, 79, 0.1)',
                                  border: '1px solid rgba(217, 83, 79, 0.2)',
                                  color: '#D9534F',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  fontSize: '13px',
                                  transition: 'all 0.2s ease',
                                }}
                                title="Decommission Flacon"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 4. FORMULATE NEW FLACON MODAL */}
        {showCreateModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
            onClick={() => setShowCreateModal(false)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '680px',
                background: '#FFFFFF',
                borderRadius: '28px',
                padding: '36px',
                border: '1.5px solid rgba(184, 149, 106, 0.35)',
                boxShadow: '0 30px 90px rgba(0,0,0,0.2)',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <span style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B8956A', fontWeight: 700 }}>
                    Maison Atelier
                  </span>
                  <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-display)', margin: '4px 0 0', color: '#1D1D1F' }}>
                    Formulate New Haute Flacon
                  </h2>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{ background: '#FAF8F5', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#1D1D1F' }}
                >
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E73', marginBottom: '6px' }}>
                    Flacon Title / Name
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Amber Nuit Extrait Sovereign"
                    required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid rgba(184, 149, 106, 0.3)', background: '#FAF8F5', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E73', marginBottom: '6px' }}>
                      Price ($ USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid rgba(184, 149, 106, 0.3)', background: '#FAF8F5', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E73', marginBottom: '6px' }}>
                      Initial Stock Units
                    </label>
                    <input
                      type="number"
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid rgba(184, 149, 106, 0.3)', background: '#FAF8F5', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E73', marginBottom: '6px' }}>
                      Maison Brand
                    </label>
                    <input
                      type="text"
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid rgba(184, 149, 106, 0.3)', background: '#FAF8F5', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E73', marginBottom: '6px' }}>
                      Olfactory Category
                    </label>
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Extrait de Parfum / Amber & Oud"
                      required
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid rgba(184, 149, 106, 0.3)', background: '#FAF8F5', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E73', marginBottom: '6px' }}>
                    Artwork Visual URL
                  </label>
                  <input
                    type="text"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid rgba(184, 149, 106, 0.3)', background: '#FAF8F5', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E73', marginBottom: '6px' }}>
                    Olfactory Formulation Description
                  </label>
                  <textarea
                    rows="3"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid rgba(184, 149, 106, 0.3)', background: '#FAF8F5', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    marginTop: '8px',
                    padding: '14px',
                    borderRadius: '999px',
                    background: '#1D1D1F',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  }}
                >
                  Publish New Flacon to Boutique
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
