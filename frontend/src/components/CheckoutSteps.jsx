import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const steps = [
    { num: 1, title: 'Sign In', link: '/login', active: step1 },
    { num: 2, title: 'Shipping', link: '/shipping', active: step2 },
    { num: 3, title: 'Payment', link: '/payment', active: step3 },
    { num: 4, title: 'Place Order', link: '/placeorder', active: step4 },
  ];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '40px',
      flexWrap: 'wrap',
    }}>
      {steps.map((step, idx) => (
        <React.Fragment key={step.num}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 600,
              background: step.active ? 'var(--color-black)' : 'var(--color-beige)',
              color: step.active ? 'var(--color-cream)' : 'var(--color-grey)',
              transition: 'var(--transition-fast)',
            }}>
              {step.num}
            </span>
            {step.active ? (
              <Link to={step.link} style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-black)',
              }}>
                {step.title}
              </Link>
            ) : (
              <span style={{
                fontSize: '14px',
                fontWeight: 400,
                color: 'var(--color-grey)',
              }}>
                {step.title}
              </span>
            )}
          </div>
          {idx < steps.length - 1 && (
            <div style={{
              width: '32px',
              height: '1px',
              background: step.active ? 'var(--color-black)' : 'var(--color-grey-light)',
              opacity: 0.5,
            }}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;
