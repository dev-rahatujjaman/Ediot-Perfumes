import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FiUser, FiPackage, FiCheck, FiX, FiArrowRight } from 'react-icons/fi';
import { authService } from '../services/authService';
import { orderService } from '../services/orderService';
import {
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFail,
} from '../store/slices/authSlice';
import {
  myOrderListRequest,
  myOrderListSuccess,
  myOrderListFail,
} from '../store/slices/orderSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();

  const { userInfo, user, loading, error } = useSelector((state) => state.auth || {});
  const currentUser = userInfo || user;
  const { myOrders = [], loading: ordersLoading } = useSelector(
    (state) => state.orders || state.order || {}
  );

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        dispatch(myOrderListRequest());
        const data = await orderService.getMyOrders();
        dispatch(myOrderListSuccess(data));
      } catch (err) {
        dispatch(
          myOrderListFail(
            err.response && err.response.data.message
              ? err.response.data.message
              : err.message
          )
        );
      }
    };

    fetchMyOrders();
  }, [dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      dispatch(updateProfileRequest());
      const data = await authService.updateProfile({
        name,
        email,
        ...(password && { password }),
      });
      dispatch(updateProfileSuccess(data));
      toast.success('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      const msg =
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
      dispatch(updateProfileFail(msg));
      toast.error(msg);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '130px',
      paddingBottom: '120px',
      background: 'var(--color-cream)',
    }}>
      <div className="container">
        <div style={{ marginBottom: '48px' }}>
          <div style={{
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-gold)',
            fontWeight: 600,
            marginBottom: '8px',
          }}>
            Account Overview
          </div>
          <h1>My Profile & Orders</h1>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '380px 1fr',
          gap: '48px',
          alignItems: 'start',
        }}>
          {/* Profile Details Form */}
          <div style={{
            background: 'var(--color-warm-white)',
            borderRadius: '24px',
            padding: '40px 32px',
            border: '0.5px solid rgba(0, 0, 0, 0.04)',
            boxShadow: '0 4px 24px var(--color-soft-shadow)',
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>
              Personal Details
            </h3>

            {error && <div style={{ marginBottom: '20px' }}><Message variant="error">{error}</Message></div>}
            {loading && <div style={{ textAlign: 'center', marginBottom: '20px' }}><Loader /></div>}

            <form onSubmit={submitHandler}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 500,
                  marginBottom: '8px',
                  color: 'var(--color-charcoal)',
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--color-beige)',
                    background: 'var(--color-cream)',
                    fontSize: '14px',
                    fontFamily: 'var(--font-text)',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 500,
                  marginBottom: '8px',
                  color: 'var(--color-charcoal)',
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--color-beige)',
                    background: 'var(--color-cream)',
                    fontSize: '14px',
                    fontFamily: 'var(--font-text)',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 500,
                  marginBottom: '8px',
                  color: 'var(--color-charcoal)',
                }}>
                  New Password (optional)
                </label>
                <input
                  type="password"
                  placeholder="Leave blank to keep same"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--color-beige)',
                    background: 'var(--color-cream)',
                    fontSize: '14px',
                    fontFamily: 'var(--font-text)',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 500,
                  marginBottom: '8px',
                  color: 'var(--color-charcoal)',
                }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--color-beige)',
                    background: 'var(--color-cream)',
                    fontSize: '14px',
                    fontFamily: 'var(--font-text)',
                    outline: 'none',
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px' }}
                disabled={loading}
              >
                Save Changes
              </button>
            </form>
          </div>

          {/* Order History */}
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>
              Past Orders
            </h3>

            {ordersLoading ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}><Loader /></div>
            ) : (!Array.isArray(myOrders) || myOrders.length === 0) ? (
              <div style={{
                background: 'var(--color-warm-white)',
                borderRadius: '20px',
                padding: '48px 32px',
                textAlign: 'center',
                border: '0.5px solid rgba(0, 0, 0, 0.04)',
              }}>
                <p style={{ color: 'var(--color-grey)', marginBottom: '20px' }}>
                  You have not placed any fragrance orders yet.
                </p>
                <Link to="/" className="btn btn-secondary">
                  Explore Collection
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(Array.isArray(myOrders) ? myOrders : []).map((order) => (
                  <div
                    key={order._id}
                    style={{
                      background: 'var(--color-warm-white)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '0.5px solid rgba(0, 0, 0, 0.04)',
                      boxShadow: '0 2px 12px var(--color-soft-shadow)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--color-grey)', marginBottom: '4px' }}>
                        ORDER #{order._id.substring(order._id.length - 8).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-gold)' }}>
                        ${order.totalPrice}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <span style={{
                        fontSize: '12px',
                        padding: '4px 12px',
                        borderRadius: '980px',
                        fontWeight: 600,
                        background: order.isPaid ? 'rgba(39, 174, 96, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                        color: order.isPaid ? '#27ae60' : '#e74c3c',
                      }}>
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>

                      <Link
                        to={`/order/${order._id}`}
                        className="btn btn-secondary"
                        style={{ padding: '8px 18px', fontSize: '13px' }}
                      >
                        View Order
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
