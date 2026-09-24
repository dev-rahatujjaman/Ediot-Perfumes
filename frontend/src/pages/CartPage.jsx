import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiTrash2, FiArrowLeft, FiArrowRight, FiShoppingBag, FiShield, FiTruck } from 'react-icons/fi';
import { addToCart, removeFromCart } from '../store/slices/cartSlice';
import Message from '../components/Message';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div style={{
      paddingTop: '120px',
      paddingBottom: '140px',
      background: 'var(--color-cream)',
      minHeight: '100vh',
    }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <Link to="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '32px',
          fontSize: '14px',
          fontWeight: 500,
          color: 'var(--color-grey)',
        }}>
          <FiArrowLeft /> Back to fragrances
        </Link>

        {/* Page Title */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-gold)',
            fontWeight: 600,
            marginBottom: '12px',
          }}>
            Review Your Selection
          </div>
          <h1>Shopping Bag</h1>
        </div>

        {cartItems.length === 0 ? (
          <div style={{
            background: 'var(--color-warm-white)',
            borderRadius: '24px',
            padding: '80px 32px',
            textAlign: 'center',
            border: '0.5px solid rgba(0, 0, 0, 0.04)',
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(184, 149, 106, 0.12)', color: 'var(--color-gold)', marginBottom: '24px', fontSize: '32px' }}>
              <FiShoppingBag />
            </div>
            <h3 style={{ marginBottom: '16px' }}>Your bag is empty</h3>
            <p style={{ color: 'var(--color-grey)', marginBottom: '32px', maxWidth: '420px', margin: '0 auto 32px' }}>
              Discover our signature fragrances and elevate your presence with our collection.
            </p>
            <Link to="/" className="btn btn-primary">
              Explore Collection <FiArrowRight />
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            gap: '48px',
            alignItems: 'start',
          }}>
            {/* Bag Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  style={{
                    background: 'var(--color-warm-white)',
                    borderRadius: '20px',
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    border: '0.5px solid rgba(0, 0, 0, 0.04)',
                    boxShadow: '0 2px 12px var(--color-soft-shadow)',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '90px',
                      height: '90px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      background: 'white',
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--color-grey)',
                      marginBottom: '4px',
                    }}>
                      {item.brand || 'Ediot Breeze'}
                    </div>
                    <Link
                      to={`/product/${item._id}`}
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '19px',
                        fontWeight: 600,
                        color: 'var(--color-black)',
                        display: 'block',
                        marginBottom: '8px',
                      }}
                    >
                      {item.name}
                    </Link>
                    <div style={{
                      fontSize: '17px',
                      fontWeight: 600,
                      color: 'var(--color-gold)',
                    }}>
                      ${item.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <select
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(
                          addToCart({
                            ...item,
                            qty: Number(e.target.value),
                          })
                        )
                      }
                      style={{
                        padding: '10px 16px',
                        borderRadius: '980px',
                        border: '1px solid var(--color-beige)',
                        background: 'var(--color-cream)',
                        fontFamily: 'var(--font-text)',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      {[...Array(item.countInStock || 10).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          Qty: {x + 1}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => removeFromCartHandler(item._id)}
                      style={{
                        background: 'transparent',
                        color: 'var(--color-grey)',
                        fontSize: '18px',
                        padding: '8px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'var(--transition-fast)',
                        cursor: 'pointer',
                      }}
                      title="Remove item"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Card */}
            <div style={{
              background: 'var(--color-warm-white)',
              borderRadius: '24px',
              padding: '36px 32px',
              border: '0.5px solid rgba(0, 0, 0, 0.04)',
              boxShadow: '0 4px 24px var(--color-soft-shadow)',
              position: 'sticky',
              top: '90px',
            }}>
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
                <span>Total Items</span>
                <span style={{ fontWeight: 600 }}>{totalItems}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '16px',
                fontSize: '15px',
                color: 'var(--color-charcoal)',
              }}>
                <span>Shipping</span>
                <span style={{ fontWeight: 600, color: 'var(--color-gold)' }}>Complimentary</span>
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
                fontSize: '20px',
              }}>
                <span style={{ fontWeight: 600 }}>Estimated Total</span>
                <span style={{ fontWeight: 600, color: 'var(--color-gold)' }}>
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%', padding: '16px', fontSize: '16px', marginBottom: '20px' }}
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout <FiArrowRight />
              </button>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(0,0,0,0.06)',
                fontSize: '13px',
                color: 'var(--color-grey)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiTruck style={{ color: 'var(--color-gold)' }} />
                  <span>Free worldwide express delivery on all orders</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiShield style={{ color: 'var(--color-gold)' }} />
                  <span>Authenticity & satisfaction guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
