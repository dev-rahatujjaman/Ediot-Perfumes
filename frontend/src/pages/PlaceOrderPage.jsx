import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { orderService } from '../services/orderService';
import {
  orderCreateRequest,
  orderCreateSuccess,
  orderCreateFail,
  orderCreateReset,
} from '../store/slices/orderSlice';
import { clearCartItems } from '../store/slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, shippingAddress, paymentMethod } = useSelector(
    (state) => state.cart
  );

  const { order, success, error, loading } = useSelector((state) => state.order);

  // Calculate prices
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty) || 1),
    0
  );
  const shippingPrice = itemsPrice > 100 ? 0 : 15;
  const taxPrice = Number((0.08 * itemsPrice).toFixed(2));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  useEffect(() => {
    if (success && order) {
      dispatch(orderCreateReset());
      dispatch(clearCartItems());
      navigate(`/order/${order._id}`);
      toast.success('Order placed and saved successfully!');
    }
  }, [success, order, navigate, dispatch]);

  const placeOrderHandler = async () => {
    try {
      dispatch(orderCreateRequest());

      const formattedItems = cartItems.map((item) => ({
        _id: item._id,
        product: item.product || item._id,
        name: item.name,
        qty: Number(item.qty) || 1,
        image: item.image || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80',
        price: Number(item.price) || 0,
      }));

      const payload = {
        orderItems: formattedItems,
        shippingAddress: shippingAddress && Object.keys(shippingAddress).length > 0 ? shippingAddress : {
          recipientName: 'VIP Client',
          address: '14 Grosvenor Square',
          city: 'London',
          postalCode: 'W1K 6HP',
          country: 'United Kingdom',
        },
        paymentMethod: paymentMethod || 'Vault White-Glove Transfer',
        itemsPrice: Number(itemsPrice.toFixed(2)),
        shippingPrice: Number(shippingPrice.toFixed(2)),
        taxPrice: Number(taxPrice),
        totalPrice: Number(totalPrice),
      };

      const data = await orderService.createOrder(payload);
      dispatch(orderCreateSuccess(data));
    } catch (err) {
      const msg =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : err.message || 'Failed to place order';
      dispatch(orderCreateFail(msg));
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
        <CheckoutSteps step1 step2 step3 step4 />

        {error && <div style={{ marginBottom: '24px' }}><Message variant="error">{error}</Message></div>}

        <div className="placeorder-layout-grid">
          {/* Order Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Delivery Card */}
            <div style={{
              background: 'var(--color-warm-white)',
              borderRadius: '20px',
              padding: '32px',
              border: '0.5px solid rgba(0, 0, 0, 0.04)',
              boxShadow: '0 2px 12px var(--color-soft-shadow)',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
                Delivery Address
              </h3>
              <p style={{ color: 'var(--color-charcoal)', lineHeight: '1.6' }}>
                {shippingAddress?.address || '14 Grosvenor Square'}, {shippingAddress?.city || 'London'}, {shippingAddress?.postalCode || 'W1K 6HP'}, {shippingAddress?.country || 'United Kingdom'}
              </p>
            </div>

            {/* Payment Method Card */}
            <div style={{
              background: 'var(--color-warm-white)',
              borderRadius: '20px',
              padding: '32px',
              border: '0.5px solid rgba(0, 0, 0, 0.04)',
              boxShadow: '0 2px 12px var(--color-soft-shadow)',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
                Payment Method
              </h3>
              <p style={{ color: 'var(--color-charcoal)' }}>
                {paymentMethod || 'Vault White-Glove Transfer'}
              </p>
            </div>

            {/* Order Items */}
            <div style={{
              background: 'var(--color-warm-white)',
              borderRadius: '20px',
              padding: '32px',
              border: '0.5px solid rgba(0, 0, 0, 0.04)',
              boxShadow: '0 2px 12px var(--color-soft-shadow)',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>
                Fragrance Selection
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      paddingBottom: '20px',
                      borderBottom: index !== cartItems.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
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
                        to={`/product/${item._id}`}
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
                        {item.qty} × ${(Number(item.price) || 0).toFixed(2)}
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '17px', color: 'var(--color-gold)' }}>
                      ${((Number(item.qty) || 1) * (Number(item.price) || 0)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Column */}
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
              Final Summary
            </h3>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '16px',
              fontSize: '15px',
              color: 'var(--color-charcoal)',
            }}>
              <span>Items Subtotal</span>
              <span style={{ fontWeight: 600 }}>${itemsPrice.toFixed(2)}</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '16px',
              fontSize: '15px',
              color: 'var(--color-charcoal)',
            }}>
              <span>Shipping</span>
              <span style={{ fontWeight: 600, color: shippingPrice === 0 ? 'var(--color-gold)' : 'inherit' }}>
                {shippingPrice === 0 ? 'Complimentary' : `$${shippingPrice.toFixed(2)}`}
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '16px',
              fontSize: '15px',
              color: 'var(--color-charcoal)',
            }}>
              <span>Estimated Tax (8%)</span>
              <span style={{ fontWeight: 600 }}>${taxPrice.toFixed(2)}</span>
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
                ${totalPrice}
              </span>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', padding: '16px', fontSize: '16px' }}
              disabled={cartItems.length === 0 || loading}
              onClick={placeOrderHandler}
            >
              {loading ? 'Securing Order...' : 'Complete Order'} <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
