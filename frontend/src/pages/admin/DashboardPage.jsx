import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { userService } from '../../services/userService';
import {
  orderListRequest,
  orderListSuccess,
  orderListFail,
  orderDeliverRequest,
  orderDeliverSuccess,
  orderDeliverFail,
} from '../../store/slices/orderSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import {
  FiTrendingUp,
  FiShoppingBag,
  FiUsers,
  FiBox,
  FiDollarSign,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiRefreshCw,
  FiExternalLink,
  FiAlertTriangle,
  FiCheck,
  FiFilter,
  FiSearch,
  FiSliders,
  FiActivity
} from 'react-icons/fi';

const DashboardPage = () => {
  const dispatch = useDispatch();

  const { orders = [], loading: ordersLoading, error } = useSelector((state) => state.orders || state.order || {});
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingExtras, setLoadingExtras] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, PAID, UNPAID, DELIVERED, PENDING_DELIVERY

  const fetchDashboardData = async (showToast = false) => {
    try {
      if (showToast) setIsRefreshing(true);
      dispatch(orderListRequest());

      const [orderData, prodData, uData] = await Promise.all([
        orderService.getAllOrders(),
        productService.getProducts().catch(() => ({ data: [] })),
        userService.getUsers().catch(() => ({ data: [] })),
      ]);

      dispatch(orderListSuccess(orderData));

      const pList = prodData?.products || prodData?.data || (Array.isArray(prodData) ? prodData : []);
      setProducts(pList);

      const uList = uData?.data || (Array.isArray(uData) ? uData : []);
      setUsers(uList);

      setLoadingExtras(false);
      if (showToast) {
        setIsRefreshing(false);
        toast.success('Maison telemetry synchronized with MongoDB Atlas');
      }
    } catch (err) {
      setLoadingExtras(false);
      setIsRefreshing(false);
      dispatch(
        orderListFail(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        )
      );
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dispatch]);

  const deliverHandler = async (id) => {
    try {
      dispatch(orderDeliverRequest());
      await orderService.deliverOrder(id);
      dispatch(orderDeliverSuccess());
      toast.success('Allocation marked as dispatched & delivered');
      fetchDashboardData();
    } catch (err) {
      const msg =
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
      dispatch(orderDeliverFail(msg));
      toast.error(msg);
    }
  };

  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeProducts = Array.isArray(products) ? products : [];
  const safeUsers = Array.isArray(users) ? users : [];

  // Key performance calculations
  const totalRevenue = safeOrders.reduce((acc, order) => acc + (Number(order.totalPrice) || 0), 0);
  const totalOrders = safeOrders.length;
  const paidOrders = safeOrders.filter((order) => order.isPaid).length;
  const deliveredOrders = safeOrders.filter((order) => order.isDelivered).length;
  const pendingDispatchOrders = safeOrders.filter((order) => order.isPaid && !order.isDelivered).length;
  const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;
  const settlementRate = totalOrders > 0 ? ((paidOrders / totalOrders) * 100).toFixed(0) : 0;

  // Inventory health
  const lowStockProducts = safeProducts.filter(p => (p.countInStock !== undefined ? p.countInStock : p.stock) <= 5);
  const totalStockUnits = safeProducts.reduce((acc, p) => acc + (Number(p.countInStock || p.stock || 0)), 0);

  // Category breakdown
  const categoryCounts = useMemo(() => {
    const counts = {};
    safeProducts.forEach(p => {
      const cat = p.category || 'Extrait de Parfum';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [safeProducts]);

  // Filtered orders list for interactive table
  const filteredOrders = useMemo(() => {
    return safeOrders.filter(order => {
      const clientName = (order.user?.name || order.shippingAddress?.recipientName || '').toLowerCase();
      const orderId = (order._id || '').toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchesQuery = !query || clientName.includes(query) || orderId.includes(query);

      if (!matchesQuery) return false;

      if (statusFilter === 'PAID') return order.isPaid;
      if (statusFilter === 'UNPAID') return !order.isPaid;
      if (statusFilter === 'DELIVERED') return order.isDelivered;
      if (statusFilter === 'PENDING_DELIVERY') return order.isPaid && !order.isDelivered;

      return true;
    });
  }, [safeOrders, searchQuery, statusFilter]);

  const isLoading = ordersLoading || loadingExtras;

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
              <FiActivity style={{ animation: 'spin 4s linear infinite' }} />
              <span>Maison Executive Control Suite</span>
              <span>✦</span>
              <span style={{ color: '#2E6F40', fontWeight: 800 }}>Atlas Cloud Live</span>
            </div>
            <h1 style={{
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              color: '#1D1D1F',
              margin: 0,
            }}>
              Executive Intelligence Center
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Sync DB Button */}
            <button
              onClick={() => fetchDashboardData(true)}
              disabled={isRefreshing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '999px',
                background: '#FFFFFF',
                border: '1.5px solid rgba(184, 149, 106, 0.35)',
                color: '#1D1D1F',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
              title="Synchronize live MongoDB Atlas ledger"
            >
              <FiRefreshCw style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none', color: '#B8956A' }} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Atlas'}</span>
            </button>

            {/* Navigation Switcher Pills */}
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
                  background: '#1D1D1F',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/products"
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
                Orders ({totalOrders})
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
                Clients ({safeUsers.length})
              </Link>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}><Loader /></div>
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <>
            {/* 1. TOP 5 EXECUTIVE METRIC CARDS */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '20px',
              marginBottom: '36px',
            }}>
              {/* Card 1: Gross Allocation */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '24px',
                border: '1.5px solid rgba(184, 149, 106, 0.3)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #B8956A 0%, #D4AF37 100%)',
                }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B8956A', fontWeight: 700 }}>
                      Gross Volume
                    </span>
                    <div style={{ fontSize: '30px', fontWeight: 800, color: '#1D1D1F', marginTop: '6px', fontFamily: 'var(--font-display)' }}>
                      ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'rgba(184, 149, 106, 0.12)',
                    color: '#B8956A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}>
                    <FiDollarSign />
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#2E6F40', fontWeight: 600, marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiTrendingUp /> {settlementRate}% Settled Conversion
                </div>
              </div>

              {/* Card 2: Total Reservations */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '24px',
                border: '1px solid rgba(184, 149, 106, 0.25)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B8956A', fontWeight: 700 }}>
                      Reservations
                    </span>
                    <div style={{ fontSize: '30px', fontWeight: 800, color: '#1D1D1F', marginTop: '6px', fontFamily: 'var(--font-display)' }}>
                      {totalOrders}
                    </div>
                  </div>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'rgba(29, 29, 31, 0.06)',
                    color: '#1D1D1F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}>
                    <FiShoppingBag />
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#6E6E73', fontWeight: 600, marginTop: '12px' }}>
                  Avg ${averageOrderValue.toFixed(2)} per Flacon Order
                </div>
              </div>

              {/* Card 3: Atelier Dispatch Pipeline */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '24px',
                border: '1px solid rgba(184, 149, 106, 0.25)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B8956A', fontWeight: 700 }}>
                      Atelier Dispatch
                    </span>
                    <div style={{ fontSize: '30px', fontWeight: 800, color: '#1D1D1F', marginTop: '6px', fontFamily: 'var(--font-display)' }}>
                      {deliveredOrders} / {totalOrders}
                    </div>
                  </div>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: pendingDispatchOrders > 0 ? 'rgba(184, 149, 106, 0.15)' : 'rgba(46, 111, 64, 0.1)',
                    color: pendingDispatchOrders > 0 ? '#B8956A' : '#2E6F40',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}>
                    <FiTruck />
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: pendingDispatchOrders > 0 ? '#B8956A' : '#2E6F40', fontWeight: 700, marginTop: '12px' }}>
                  {pendingDispatchOrders > 0 ? `✦ ${pendingDispatchOrders} Awaiting Atelier Dispatch` : '✓ All Settled Dispatched'}
                </div>
              </div>

              {/* Card 4: Catalog & Vault Stock */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '24px',
                border: '1px solid rgba(184, 149, 106, 0.25)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B8956A', fontWeight: 700 }}>
                      Vault Flacons
                    </span>
                    <div style={{ fontSize: '30px', fontWeight: 800, color: '#1D1D1F', marginTop: '6px', fontFamily: 'var(--font-display)' }}>
                      {safeProducts.length}
                    </div>
                  </div>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'rgba(184, 149, 106, 0.12)',
                    color: '#B8956A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}>
                    <FiBox />
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#6E6E73', fontWeight: 600, marginTop: '12px' }}>
                  {totalStockUnits} Total Flacons in Stock
                </div>
              </div>

              {/* Card 5: VIP Connoisseurs */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '24px',
                border: '1px solid rgba(184, 149, 106, 0.25)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B8956A', fontWeight: 700 }}>
                      VIP Connoisseurs
                    </span>
                    <div style={{ fontSize: '30px', fontWeight: 800, color: '#1D1D1F', marginTop: '6px', fontFamily: 'var(--font-display)' }}>
                      {safeUsers.length}
                    </div>
                  </div>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'rgba(29, 29, 31, 0.06)',
                    color: '#1D1D1F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}>
                    <FiUsers />
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#6E6E73', fontWeight: 600, marginTop: '12px' }}>
                  {safeUsers.filter(u => u.isAdmin).length} Atelier Administrators
                </div>
              </div>
            </div>

            {/* 2. ANALYTICS & REORDER MONITORING ROW */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: '24px',
              marginBottom: '36px',
            }}>
              {/* Box A: Olfactory Family Allocation */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '28px',
                border: '1.5px solid rgba(184, 149, 106, 0.3)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-display)', color: '#1D1D1F' }}>
                      Olfactory Formulation Ratios
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#6E6E73' }}>
                      Distribution of fragrances across haute maceration categories
                    </p>
                  </div>
                  <FiSliders style={{ color: '#B8956A', fontSize: '18px' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {Object.entries(categoryCounts).map(([cat, count]) => {
                    const percentage = safeProducts.length > 0 ? ((count / safeProducts.length) * 100).toFixed(0) : 0;
                    return (
                      <div key={cat}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                          <span style={{ color: '#1D1D1F' }}>{cat}</span>
                          <span style={{ color: '#B8956A' }}>{count} Flacons ({percentage}%)</span>
                        </div>
                        <div style={{
                          height: '8px',
                          borderRadius: '999px',
                          background: '#F0EBE1',
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            width: `${percentage}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #B8956A 0%, #D4AF37 100%)',
                            borderRadius: '999px',
                            transition: 'width 0.8s ease',
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Box B: Low Stock & Formulation Depletion Radar */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '28px',
                border: '1.5px solid rgba(184, 149, 106, 0.3)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-display)', color: '#1D1D1F' }}>
                      Maison Vault Depletion Radar
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#6E6E73' }}>
                      Flacons requiring Grasse distillation batch replenishment
                    </p>
                  </div>
                  <FiAlertTriangle style={{ color: '#D9534F', fontSize: '18px' }} />
                </div>

                {lowStockProducts.length === 0 ? (
                  <div style={{
                    padding: '24px',
                    borderRadius: '16px',
                    background: 'rgba(46, 111, 64, 0.08)',
                    border: '1px solid rgba(46, 111, 64, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#2E6F40',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}>
                    <FiCheckCircle style={{ fontSize: '20px', flexShrink: 0 }} />
                    <span>All catalog extraits are adequately macerated and stocked in the vault.</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {lowStockProducts.slice(0, 4).map(prod => (
                      <div
                        key={prod._id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '14px',
                          background: '#FAF8F5',
                          border: '1px solid rgba(184, 149, 106, 0.25)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={prod.image}
                            alt={prod.name}
                            style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1D1D1F' }}>{prod.name}</div>
                            <div style={{ fontSize: '11px', color: '#D9534F', fontWeight: 700 }}>
                              Only {prod.countInStock || prod.stock || 0} flacons remaining
                            </div>
                          </div>
                        </div>

                        <Link
                          to={`/admin/product/${prod._id}/edit`}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '999px',
                            background: '#1D1D1F',
                            color: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: 700,
                            textDecoration: 'none',
                          }}
                        >
                          Restock
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 3. RECENT ALLOCATIONS INTERACTIVE LEDGER */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '28px',
              border: '1.5px solid rgba(184, 149, 106, 0.3)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.04)',
              padding: 'clamp(20px, 3vw, 36px)',
            }}>
              {/* Ledger Header & Search/Filter Controls */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '24px',
              }}>
                <div>
                  <h2 style={{
                    fontSize: '22px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-display)',
                    color: '#1D1D1F',
                    margin: 0,
                  }}>
                    VIP Client Allocation Ledger
                  </h2>
                  <p style={{ color: '#6E6E73', fontSize: '13.5px', marginTop: '4px', margin: 0 }}>
                    Live transaction vault records and dispatch status
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {/* Search input */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#FAF8F5',
                    border: '1.5px solid rgba(184, 149, 106, 0.3)',
                    borderRadius: '999px',
                    padding: '8px 16px',
                  }}>
                    <FiSearch style={{ color: '#B8956A', fontSize: '14px' }} />
                    <input
                      type="text"
                      placeholder="Search Client or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        fontSize: '12.5px',
                        color: '#1D1D1F',
                        width: '150px',
                      }}
                    />
                  </div>

                  {/* Filter Status Selector */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: '#FAF8F5',
                    padding: '4px',
                    borderRadius: '999px',
                    border: '1px solid rgba(184, 149, 106, 0.3)',
                  }}>
                    {[
                      { label: 'All', value: 'ALL' },
                      { label: 'Settled', value: 'PAID' },
                      { label: 'In Atelier', value: 'PENDING_DELIVERY' },
                      { label: 'Dispatched', value: 'DELIVERED' },
                    ].map((tab) => (
                      <button
                        key={tab.value}
                        onClick={() => setStatusFilter(tab.value)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '999px',
                          background: statusFilter === tab.value ? '#1D1D1F' : 'transparent',
                          color: statusFilter === tab.value ? '#FFFFFF' : '#6E6E73',
                          border: 'none',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <Link
                    to="/admin/orders"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#B8956A',
                      fontWeight: 700,
                      fontSize: '13px',
                      textDecoration: 'none',
                      marginLeft: '6px',
                    }}
                  >
                    <span>Full Ledger</span>
                    <FiArrowRight />
                  </Link>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 20px', color: '#6E6E73', fontSize: '14px' }}>
                  No reservations match the specified filter.
                </div>
              ) : (
                <div className="table-responsive-wrapper" style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1.5px solid rgba(184, 149, 106, 0.25)', color: '#6E6E73' }}>
                        <th style={{ padding: '14px 16px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }}>Order Serial</th>
                        <th style={{ padding: '14px 16px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }}>Client</th>
                        <th style={{ padding: '14px 16px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }}>Date</th>
                        <th style={{ padding: '14px 16px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }}>Items</th>
                        <th style={{ padding: '14px 16px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }}>Amount</th>
                        <th style={{ padding: '14px 16px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }}>Settlement</th>
                        <th style={{ padding: '14px 16px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }}>Dispatch</th>
                        <th style={{ padding: '14px 16px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.slice(0, 10).map((order) => (
                        <tr
                          key={order._id}
                          style={{
                            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                            transition: 'background 0.2s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(184, 149, 106, 0.03)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <td style={{ padding: '16px', fontFamily: 'monospace', color: '#6E6E73', fontWeight: 600 }}>
                            #{order._id?.slice(-8).toUpperCase()}
                          </td>
                          <td style={{ padding: '16px', fontWeight: 700, color: '#1D1D1F' }}>
                            <div>{order.user?.name || order.shippingAddress?.recipientName || 'VIP Client'}</div>
                            <div style={{ fontSize: '11px', color: '#86868B', fontWeight: 500 }}>
                              {order.shippingAddress?.city || 'Boutique Collection'}
                            </div>
                          </td>
                          <td style={{ padding: '16px', color: '#6E6E73' }}>
                            {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {(order.orderItems || []).slice(0, 3).map((it, idx) => (
                                <img
                                  key={idx}
                                  src={it.image || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=100&q=80'}
                                  alt={it.name}
                                  title={`${it.name} (Qty: ${it.qty})`}
                                  style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '6px',
                                    objectFit: 'cover',
                                    border: '1px solid rgba(184, 149, 106, 0.3)',
                                  }}
                                />
                              ))}
                              {(order.orderItems?.length || 0) > 3 && (
                                <span style={{ fontSize: '11px', color: '#86868B', fontWeight: 600 }}>
                                  +{order.orderItems.length - 3}
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '16px', fontWeight: 700, color: '#B8956A' }}>
                            ${Number(order.totalPrice || 0).toFixed(2)}
                          </td>
                          <td style={{ padding: '16px' }}>
                            {order.isPaid ? (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '4px 10px',
                                borderRadius: '999px',
                                background: 'rgba(46, 111, 64, 0.1)',
                                color: '#2E6F40',
                                fontSize: '11px',
                                fontWeight: 700,
                              }}>
                                <FiCheckCircle /> Settled
                              </span>
                            ) : (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '4px 10px',
                                borderRadius: '999px',
                                background: 'rgba(217, 83, 79, 0.1)',
                                color: '#D9534F',
                                fontSize: '11px',
                                fontWeight: 700,
                              }}>
                                <FiClock /> Pending
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '16px' }}>
                            {order.isDelivered ? (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '4px 10px',
                                borderRadius: '999px',
                                background: 'rgba(46, 111, 64, 0.1)',
                                color: '#2E6F40',
                                fontSize: '11px',
                                fontWeight: 700,
                              }}>
                                <FiTruck /> Dispatched
                              </span>
                            ) : (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '4px 10px',
                                borderRadius: '999px',
                                background: 'rgba(184, 149, 106, 0.15)',
                                color: '#A47D4C',
                                fontSize: '11px',
                                fontWeight: 700,
                              }}>
                                In Atelier
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '16px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                              <Link
                                to={`/order/${order._id}`}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '6px 14px',
                                  borderRadius: '999px',
                                  background: '#FFFFFF',
                                  border: '1px solid rgba(184, 149, 106, 0.35)',
                                  color: '#1D1D1F',
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  textDecoration: 'none',
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                <span>Details</span>
                                <FiExternalLink style={{ fontSize: '11px' }} />
                              </Link>
                              {order.isPaid && !order.isDelivered && (
                                <button
                                  onClick={() => deliverHandler(order._id)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '6px 14px',
                                    borderRadius: '999px',
                                    background: '#2E6F40',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                  }}
                                  title="Dispatch order now"
                                >
                                  <FiCheck /> Dispatch
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
