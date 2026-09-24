import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="product-card" style={{ display: 'block', height: '100%' }}>
      <div style={{ position: 'relative', overflow: 'hidden', height: '100%', minHeight: '440px' }}>
        <img
          src={product.image || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80'}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />

        {/* Minimal Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '32px',
          color: 'white',
        }}>
          {/* Top Tag */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              padding: '6px 14px',
              borderRadius: '980px',
            }}>
              {product.category || 'Eau De Parfum'}
            </span>
          </div>

          {/* Bottom Details */}
          <div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px', letterSpacing: '0.05em' }}>
              {product.brand}
            </div>
            <h3 style={{
              color: 'white',
              fontSize: '24px',
              marginBottom: '8px',
              fontWeight: '600',
              letterSpacing: '-0.01em',
            }}>
              {product.name}
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <span style={{ fontSize: '24px', fontWeight: '400', fontStyle: 'italic' }}>
                ${product.price}
              </span>
              <span style={{
                fontSize: '13px',
                color: 'var(--color-gold-light)',
                fontWeight: '600',
              }}>
                Explore →
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
