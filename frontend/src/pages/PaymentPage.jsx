import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowRight, FiCreditCard, FiDollarSign } from 'react-icons/fi';
import { savePaymentMethod } from '../store/slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { shippingAddress, paymentMethod: savedPaymentMethod } = useSelector(
    (state) => state.cart
  );

  if (!shippingAddress?.address) {
    navigate('/shipping');
  }

  const [paymentMethod, setPaymentMethod] = useState(
    savedPaymentMethod || 'PayPal'
  );

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  const methods = [
    { id: 'PayPal', title: 'PayPal / Credit Card', desc: 'Fast, secure online payment', icon: <FiCreditCard /> },
    { id: 'Stripe', title: 'Stripe Pay', desc: 'Cards, Apple Pay, Google Pay', icon: <FiCreditCard /> },
    { id: 'Cash', title: 'Cash on Delivery', desc: 'Pay when your fragrance arrives', icon: <FiDollarSign /> },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '130px',
      paddingBottom: '120px',
      background: 'var(--color-cream)',
    }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        <CheckoutSteps step1 step2 step3 />

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
              Step 3 of 4
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 600 }}>Payment Method</h2>
          </div>

          <form onSubmit={submitHandler}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '36px' }}>
              {methods.map((method) => {
                const isSelected = paymentMethod === method.id;
                return (
                  <label
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '20px',
                      borderRadius: '16px',
                      border: isSelected ? '2px solid var(--color-black)' : '1px solid var(--color-beige)',
                      background: isSelected ? 'var(--color-cream)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={isSelected}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ accentColor: 'var(--color-black)', width: '18px', height: '18px' }}
                    />
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: isSelected ? 'var(--color-black)' : 'var(--color-beige)',
                      color: isSelected ? 'white' : 'var(--color-charcoal)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                    }}>
                      {method.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '2px' }}>
                        {method.title}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--color-grey)' }}>
                        {method.desc}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '16px', fontSize: '16px' }}
            >
              Continue to Review <FiArrowRight />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
