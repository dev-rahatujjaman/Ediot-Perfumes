import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowRight } from 'react-icons/fi';
import { saveShippingAddress } from '../store/slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { shippingAddress } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '130px',
      paddingBottom: '120px',
      background: 'var(--color-cream)',
    }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        <CheckoutSteps step1 step2 />

        <div style={{
          background: 'var(--color-warm-white)',
          borderRadius: '24px',
          padding: '48px 40px',
          border: '0.5px solid rgba(0, 0, 0, 0.04)',
          boxShadow: '0 8px 32px var(--color-soft-shadow)',
        }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              fontWeight: 600,
              marginBottom: '8px',
            }}>
              Step 2 of 4
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 600 }}>Delivery Details</h2>
          </div>

          <form onSubmit={submitHandler}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                marginBottom: '8px',
                color: 'var(--color-charcoal)',
              }}>
                Street Address
              </label>
              <input
                type="text"
                placeholder="e.g. 124 Luxury Ave, Suite 400"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: '1px solid var(--color-beige)',
                  background: 'var(--color-cream)',
                  fontSize: '15px',
                  fontFamily: 'var(--font-text)',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 500,
                  marginBottom: '8px',
                  color: 'var(--color-charcoal)',
                }}>
                  City
                </label>
                <input
                  type="text"
                  placeholder="e.g. New York"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: '1px solid var(--color-beige)',
                    background: 'var(--color-cream)',
                    fontSize: '15px',
                    fontFamily: 'var(--font-text)',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 500,
                  marginBottom: '8px',
                  color: 'var(--color-charcoal)',
                }}>
                  Postal Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10001"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    border: '1px solid var(--color-beige)',
                    background: 'var(--color-cream)',
                    fontSize: '15px',
                    fontFamily: 'var(--font-text)',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                marginBottom: '8px',
                color: 'var(--color-charcoal)',
              }}>
                Country
              </label>
              <input
                type="text"
                placeholder="e.g. United States"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: '1px solid var(--color-beige)',
                  background: 'var(--color-cream)',
                  fontSize: '15px',
                  fontFamily: 'var(--font-text)',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '16px', fontSize: '16px' }}
            >
              Continue to Payment <FiArrowRight />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
