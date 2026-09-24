import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { orderService } from '../../services/orderService';
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
  FiShoppingBag,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiExternalLink,
  FiCheck,
  FiSearch,
  FiFilter,
  FiDollarSign,
  FiRefreshCw,
  FiMapPin,
  FiPackage
} from 'react-icons/fi';

const OrderListPage = () => {
  const dispatch = useDispatch();

  const { orders = [], loading, error } = useSelector((state) => state.orders || state.order || {});

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, PAID, PENDING_DISPATCH, DELIVERED, UNPAID
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrders = async (showToast = false) => {
    try {
      if (showToast) setIsRefreshing(true);
      dispatch(orderListRequest());
      const data = await orderService.getAllOrders();
      dispatch(orderListSuccess(data));
      if (showToast) {
        setIsRefreshing(false);
        toast.success('Order reservations refreshed from Atlas ledger');
      }
    } catch (err) {
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
    fetchOrders();
  }, []);

  const deliverHandler = async (id) => {
    try {
      dispatch(orderDeliverRequest());
      await orderService.deliverOrder(id);
      dispatch(orderDeliverSuccess());
      toast.success('Allocation dispatched & marked delivered');
      fetchOrders();
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

  // Summary statistics
  const totalOrders = safeOrders.length;
  const totalRevenue = safeOrders.reduce((acc, order) => acc + (Number(order.totalPrice) || 0), 0);
  const paidOrders = safeOrders.filter((order) => order.isPaid).length;
  const pendingDispatch = safeOrders.filter((order) => order.isPaid && !order.isDelivered).length;
  const deliveredOrders = safeOrders.filter((order) => order.isDelivered).length;

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return safeOrders.filter(order => {
      const clientName = (order.user?.name || order.shippingAddress?.recipientName || '').toLowerCase();
      const email = (order.user?.email || '').toLowerCase();
      const orderId = (order._id || '').toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      const matchesQuery = !q || clientName.includes(q) || email.includes(q) || orderId.includes(q);
      if (!matchesQuery) return false;

      if (statusFilter === 'PAID') return order.isPaid;
      if (statusFilter === 'PENDING_DISPATCH') return order.isPaid && !order.isDelivered;
      if (statusFilter === 'DELIVERED') return order.isDelivered;
      if (statusFilter === 'UNPAID') return !order.isPaid;

      return true;
    });
  }, [safeOrders, searchQuery, statusFilter]);

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
              Client Reservation Ledger
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
                background: 'transparent',
                color: '#6E6E73',
                textDecoration: 'none',
                fontSize: '12.5px',
                fontWeight: 600,
                transition: 'color 0.2s ease',
              }}
            >
              Fragrances
            </Link>
            <Link
              to="/admin/orders"
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
              Orders ({safeOrders.length})
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

        {/* 1. KEY LEDGER SUMMARY CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
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
              Total Allocations
            </span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#1D1D1F', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
              {totalOrders} Orders
            </div>
            <div style={{ fontSize: '11.5px', color: '#6E6E73', marginTop: '4px' }}>
              All client purchase reservations
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
              Gross Volume
            </span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#1D1D1F', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '11.5px', color: '#2E6F40', fontWeight: 600, marginTop: '4px' }}>
              {paidOrders} Settled Vault Orders
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
              Atelier Queue
            </span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: pendingDispatch > 0 ? '#B8956A' : '#2E6F40', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
              {pendingDispatch} In Atelier
            </div>
            <div style={{ fontSize: '11.5px', color: '#6E6E73', marginTop: '4px' }}>
              Paid & awaiting courier dispatch
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
              Completed Dispatches
            </span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#1D1D1F', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
              {deliveredOrders} Dispatched
            </div>
            <div style={{ fontSize: '11.5px', color: '#6E6E73', marginTop: '4px' }}>
              Successfully fulfilled to clients
            </div>
          </div>
        </div>

        {/* 2. SEARCH & FILTER TABS BAR */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}>
          {/* Search Box */}
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
              placeholder="Search by client name, email, or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '13px',
                color: '#1D1D1F',
                width: '280px',
              }}
            />
          </div>

          {/* Status Filter Tabs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#FFFFFF',
            padding: '5px',
            borderRadius: '999px',
            border: '1px solid rgba(184, 149, 106, 0.3)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}>
            {[
              { label: 'All Orders', value: 'ALL' },
              { label: 'Settled', value: 'PAID' },
              { label: 'In Atelier (To Dispatch)', value: 'PENDING_DISPATCH' },
              { label: 'Dispatched', value: 'DELIVERED' },
              { label: 'Unpaid', value: 'UNPAID' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '999px',
                  background: statusFilter === tab.value ? '#1D1D1F' : 'transparent',
                  color: statusFilter === tab.value ? '#FFFFFF' : '#6E6E73',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Refresh Action */}
          <button
            onClick={() => fetchOrders(true)}
            disabled={isRefreshing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '999px',
              background: '#FFFFFF',
              border: '1.5px solid rgba(184, 149, 106, 0.3)',
              color: '#1D1D1F',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <FiRefreshCw style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none', color: '#B8956A' }} />
            <span>Sync</span>
          </button>
        </div>

        {/* 3. ORDER LEDGER TABLE */}
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
            {filteredOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6E6E73' }}>
                <p style={{ fontSize: '15px', fontWeight: 600 }}>No reservations match your criteria.</p>
              </div>
            ) : (
              <div className="table-responsive-wrapper" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px', minWidth: '850px' }}>
                  <thead>
                    <tr style={{ background: 'rgba(184, 149, 106, 0.05)', borderBottom: '1.5px solid rgba(184, 149, 106, 0.25)', color: '#6E6E73' }}>
                      <th style={{ padding: '16px 20px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }}>Order Serial</th>
                      <th style={{ padding: '16px 20px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }}>VIP Client</th>
                      <th style={{ padding: '16px 20px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }}>Reservation Date</th>
                      <th style={{ padding: '16px 20px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }}>Allocations</th>
                      <th style={{ padding: '16px 20px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }}>Total Amount</th>
                      <th style={{ padding: '16px 20px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }}>Payment</th>
                      <th style={{ padding: '16px 20px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }}>Fulfillment</th>
                      <th style={{ padding: '16px 20px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr
                        key={order._id}
                        style={{
                          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                          transition: 'background 0.2s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(184, 149, 106, 0.03)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '16px 20px', fontFamily: 'monospace', color: '#6E6E73', fontWeight: 600 }}>
                          #{order._id?.slice(-8).toUpperCase()}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 700, color: '#1D1D1F' }}>
                            {order.user?.name || order.shippingAddress?.recipientName || 'VIP Client'}
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#6E6E73', marginTop: '2px' }}>
                            {order.shippingAddress?.city ? `${order.shippingAddress.city}, ${order.shippingAddress.country || 'Boutique'}` : 'Private Delivery'}
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', color: '#6E6E73' }}>
                          {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {(order.orderItems || []).slice(0, 3).map((it, idx) => (
                              <img
                                key={idx}
                                src={it.image || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=100&q=80'}
                                alt={it.name}
                                title={`${it.name} (Qty: ${it.qty})`}
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '8px',
                                  objectFit: 'cover',
                                  border: '1px solid rgba(184, 149, 106, 0.3)',
                                }}
                              />
                            ))}
                            {(order.orderItems?.length || 0) > 3 && (
                              <span style={{ fontSize: '11px', color: '#86868B', fontWeight: 700, background: '#FAF8F5', padding: '4px 8px', borderRadius: '6px' }}>
                                +{order.orderItems.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', fontWeight: 700, color: '#B8956A', fontSize: '14.5px' }}>
                          ${Number(order.totalPrice || 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          {order.isPaid ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '5px 12px',
                              borderRadius: '999px',
                              background: 'rgba(46, 111, 64, 0.1)',
                              color: '#2E6F40',
                              fontSize: '11.5px',
                              fontWeight: 700,
                            }}>
                              <FiCheckCircle /> Settled
                            </span>
                          ) : (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '5px 12px',
                              borderRadius: '999px',
                              background: 'rgba(217, 83, 79, 0.1)',
                              color: '#D9534F',
                              fontSize: '11.5px',
                              fontWeight: 700,
                            }}>
                              <FiClock /> Unpaid
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          {order.isDelivered ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '5px 12px',
                              borderRadius: '999px',
                              background: 'rgba(46, 111, 64, 0.1)',
                              color: '#2E6F40',
                              fontSize: '11.5px',
                              fontWeight: 700,
                            }}>
                              <FiTruck /> Dispatched
                            </span>
                          ) : (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '5px 12px',
                              borderRadius: '999px',
                              background: 'rgba(184, 149, 106, 0.15)',
                              color: '#A47D4C',
                              fontSize: '11.5px',
                              fontWeight: 700,
                            }}>
                              In Atelier
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <Link
                              to={`/order/${order._id}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '7px 16px',
                                borderRadius: '999px',
                                background: '#FFFFFF',
                                border: '1.5px solid rgba(184, 149, 106, 0.35)',
                                color: '#1D1D1F',
                                fontSize: '12px',
                                fontWeight: 700,
                                textDecoration: 'none',
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <span>Invoice</span>
                              <FiExternalLink style={{ fontSize: '11px' }} />
                            </Link>
                            {order.isPaid && !order.isDelivered && (
                              <button
                                onClick={() => deliverHandler(order._id)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '7px 16px',
                                  borderRadius: '999px',
                                  background: '#2E6F40',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                }}
                                title="Mark as dispatched"
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
        )}
      </div>
    </div>
  );
};

export default OrderListPage;
