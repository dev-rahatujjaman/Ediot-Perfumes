import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiCheckCircle, FiClock, FiCreditCard } from 'react-icons/fi';
import { orderService } from '../services/orderService';
import {
  orderDetailsRequest,
  orderDetailsSuccess,
  orderDetailsFail,
  orderPayRequest,
  orderPaySuccess,
  orderPayFail,
  orderPayReset,
} from '../store/slices/orderSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const OrderPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const { order, loading, error, success } = useSelector((state) => state.order);
  const { userInfo, user } = useSelector((state) => state.auth);
  const currentUser = userInfo || user;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch(orderDetailsRequest());
        const data = await orderService.getOrderById(id);
        dispatch(orderDetailsSuccess(data));
      } catch (err) {
        dispatch(
          orderDetailsFail(
            err.response && err.response.data.message
              ? err.response.data.message
              : err.message
          )
        );
      }
    };

    if (!order || order._id !== id || success) {
      dispatch(orderPayReset());
      fetchOrder();
    }
  }, [dispatch, id, order, success]);

  const payOrderHandler = async () => {
    setPaymentProcessing(true);
    try {
      dispatch(orderPayRequest());
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const paymentResult = {
        id: 'PAYMENT_' + Date.now(),
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        payer: { email_address: currentUser?.email || 'customer@ediotbreeze.com' },
      };
      await orderService.payOrder(id, paymentResult);
      dispatch(orderPaySuccess());
      toast.success('Payment completed successfully!');
    } catch (err) {
      const msg =
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
      dispatch(orderPayFail(msg));
      toast.error(msg);
    } finally {
      setPaymentProcessing(false);
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
        <Link to="/profile" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '32px',
          fontSize: '14px',
          fontWeight: 500,
          color: 'var(--color-grey)',
        }}>
          <FiArrowLeft /> Back to profile
        </Link>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}><Loader /></div>
        ) : error ? (
          <Message variant="error">{error}</Message>
        ) : order ? (
          <div>
            <div style={{ marginBottom: '40px' }}>
              <div style={{
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                fontWeight: 600,
                marginBottom: '8px',
              }}>
                Receipt & Status
              </div>
              <h1 style={{ fontSize: '32px' }}>Order #{order._id}</h1>
            </div>

            <div className="order-layout-grid">
              {/* Order Info Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Shipping Details */}
                <div style={{
                  background: 'var(--color-warm-white)',
                  borderRadius: '20px',
                  padding: '32px',
                  border: '0.5px solid rgba(0, 0, 0, 0.04)',
                  boxShadow: '0 2px 12px var(--color-soft-shadow)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Delivery Details</h3>
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 12px',
                      borderRadius: '980px',
                      fontWeight: 600,
                      background: order.isDelivered ? 'rgba(39, 174, 96, 0.1)' : 'rgba(184, 149, 106, 0.15)',
                      color: order.isDelivered ? '#27ae60' : 'var(--color-gold)',
                    }}>
                      {order.isDelivered ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : 'In Preparation'}
                    </span>
                  </div>
                  <p style={{ color: 'var(--color-charcoal)', marginBottom: '8px' }}>
                    <strong>Recipient: </strong> {order.user?.name || currentUser?.name}
                  </p>
                  <p style={{ color: 'var(--color-charcoal)', marginBottom: '8px' }}>
                    <strong>Email: </strong> {order.user?.email || currentUser?.email}
                  </p>
                  <p style={{ color: 'var(--color-grey)' }}>
                    <strong>Address: </strong> {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                  </p>
                </div>

                {/* Payment Status */}
                <div style={{
                  background: 'var(--color-warm-white)',
                  borderRadius: '20px',
                  padding: '32px',
                  border: '0.5px solid rgba(0, 0, 0, 0.04)',
                  boxShadow: '0 2px 12px var(--color-soft-shadow)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Payment Details</h3>
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 12px',
                      borderRadius: '980px',
                      fontWeight: 600,
                      background: order.isPaid ? 'rgba(39, 174, 96, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                      color: order.isPaid ? '#27ae60' : '#e74c3c',
                    }}>
                      {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Awaiting Payment'}
                    </span>
                  </div>
                  <p style={{ color: 'var(--color-charcoal)' }}>
                    <strong>Method: </strong> {order.paymentMethod}
                  </p>
                </div>

                {/* Items List */}
                <div style={{
                  background: 'var(--color-warm-white)',
                  borderRadius: '20px',
                  padding: '32px',
                  border: '0.5px solid rgba(0, 0, 0, 0.04)',
                  boxShadow: '0 2px 12px var(--color-soft-shadow)',
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>
                    Ordered Fragrances
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {order.orderItems?.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '20px',
                          paddingBottom: '20px',
                          borderBottom: index !== order.orderItems.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: '70px',
                            height: '70px',
                            objectFit: 'cover',
                            borderRadius: '12px',
                            background: 'white',
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <Link
                            to={`/product/${item.product || item._id}`}
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontWeight: 600,
                              fontSize: '17px',
                              display: 'block',
                              marginBottom: '4px',
                            }}
                          >
                            {item.name}
                          </Link>
                          <div style={{ fontSize: '14px', color: 'var(--color-grey)' }}>
                            {item.qty} × ${item.price?.toFixed(2)}
                          </div>
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '17px', color: 'var(--color-gold)' }}>
                          ${(item.qty * item.price)?.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <div
                className="sticky-sidebar-col"
                style={{
                  background: 'var(--color-warm-white)',
                  borderRadius: '24px',
                  padding: '36px 32px',
                  border: '0.5px solid rgba(0, 0, 0, 0.04)',
                  boxShadow: '0 4px 24px var(--color-soft-shadow)',
                  position: 'sticky',
                  top: '90px',
                }}
              >
                <h3 style={{ fontSize: '22px', marginBottom: '24px', fontWeight: 600 }}>
                  Order Summary
                </h3>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  fontSize: '15px',
                  color: 'var(--color-charcoal)',
                }}>
                  <span>Items</span>
                  <span style={{ fontWeight: 600 }}>${order.itemsPrice}</span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  fontSize: '15px',
                  color: 'var(--color-charcoal)',
                }}>
                  <span>Shipping</span>
                  <span style={{ fontWeight: 600, color: order.shippingPrice === 0 ? 'var(--color-gold)' : 'inherit' }}>
                    {order.shippingPrice === 0 ? 'Complimentary' : `$${order.shippingPrice}`}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  fontSize: '15px',
                  color: 'var(--color-charcoal)',
                }}>
                  <span>Tax</span>
                  <span style={{ fontWeight: 600 }}>${order.taxPrice}</span>
                </div>

                <div style={{
                  height: '1px',
                  background: 'rgba(0, 0, 0, 0.06)',
                  margin: '20px 0',
                }}></div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '32px',
                  fontSize: '22px',
                }}>
                  <span style={{ fontWeight: 600 }}>Total</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-gold)' }}>
                    ${order.totalPrice}
                  </span>
                </div>

                {!order.isPaid && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '16px', fontSize: '16px' }}
                    onClick={payOrderHandler}
                    disabled={paymentProcessing}
                  >
                    {paymentProcessing ? 'Processing...' : 'Pay with PayPal / Card'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OrderPage;
