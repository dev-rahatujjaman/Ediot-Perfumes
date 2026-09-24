import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiShoppingBag,
  FiCheck,
  FiEye,
  FiStar,
  FiFilter,
  FiSearch,
  FiShield,
  FiCompass,
  FiDroplet,
  FiX,
  FiLayers,
  FiArrowRight
} from 'react-icons/fi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LUXURY_PRODUCTS } from '../data/luxuryProducts';
import { addToCart } from '../store/slices/cartSlice';

gsap.registerPlugin(ScrollTrigger);

const FAMILIES = [
  'All Creations',
  'Extrait de Parfum',
  'Grand Reserve',
  'Solar & Citrus',
  'Amber & Oud',
  'Night Florals',
];

const LuxuryProductGrid = () => {
  const [selectedFamily, setSelectedFamily] = useState('All Creations');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('curated');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [addedMap, setAddedMap] = useState({});
  const [visibleCount, setVisibleCount] = useState(12);

  const gridContainerRef = useRef(null);
  const dispatch = useDispatch();

  // Filter & Sort Logic
  const filteredProducts = LUXURY_PRODUCTS.filter((prod) => {
    const matchesFamily =
      selectedFamily === 'All Creations' ||
      prod.category === selectedFamily ||
      prod.family === selectedFamily;

    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.notes &&
        (prod.notes.top.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.notes.heart.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.notes.base.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesFamily && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
    return 0; // curated
  });

  const displayedProducts = sortedProducts.slice(0, visibleCount);

  // GSAP 3D Hover Perspective Tilt Physics
  const handleMouseMove = (e, cardEl) => {
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    cardEl.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

    const shineEl = cardEl.querySelector('.card-shine-sheen');
    if (shineEl) {
      shineEl.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(184, 149, 106, 0.2) 0%, transparent 60%)`;
      shineEl.style.opacity = '1';
    }
  };

  const handleMouseLeave = (cardEl) => {
    if (!cardEl) return;
    cardEl.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    const shineEl = cardEl.querySelector('.card-shine-sheen');
    if (shineEl) {
      shineEl.style.opacity = '0';
    }
  };

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        _id: product._id,
        name: `Ediot Breeze - ${product.name} (50ML)`,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock || 10,
        qty: 1,
      })
    );

    setAddedMap((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product._id]: false }));
    }, 2200);
  };

  return (
    <section
      id="fragrances"
      style={{
        background: 'var(--color-cream, #FDFCFA)',
        color: '#1D1D1F',
        padding: '60px 0 20px 0',
        position: 'relative',
        borderTop: '1px solid rgba(184, 149, 106, 0.2)',
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header Title Section */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '48px',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#B8956A',
                fontWeight: 700,
                marginBottom: '12px',
              }}
            >
              <span>✦</span>
              <span>The Grand Flacon Vault • 24 Master Formulations</span>
              <span>✦</span>
            </div>
            <h2
              style={{
                fontSize: 'clamp(32px, 4vw, 52px)',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: '#1D1D1F',
                margin: 0,
                fontFamily: 'var(--font-display)',
              }}
            >
              Masterworks of <span style={{ color: '#B8956A', fontStyle: 'italic' }}>Haute Parfumerie</span>
            </h2>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#6E6E73',
              fontSize: '13px',
            }}
          >
            <span
              style={{
                background: 'rgba(184, 149, 106, 0.12)',
                border: '1px solid rgba(184, 149, 106, 0.3)',
                padding: '6px 16px',
                borderRadius: '999px',
                color: '#B8956A',
                fontWeight: 700,
              }}
            >
              {filteredProducts.length} Creations Available
            </span>
          </div>
        </div>

        {/* Filter Toolbar: Family Pills + Live Search + Sort */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(184, 149, 106, 0.25)',
            borderRadius: '24px',
            padding: '16px 24px',
            marginBottom: '48px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
          }}
        >
          {/* Family Filter Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            {FAMILIES.map((fam) => {
              const isActive = selectedFamily === fam;
              return (
                <button
                  key={fam}
                  onClick={() => setSelectedFamily(fam)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '999px',
                    background: isActive
                      ? '#1D1D1F'
                      : 'rgba(0, 0, 0, 0.04)',
                    color: isActive ? '#FFFFFF' : '#4A4A4E',
                    border: isActive ? 'none' : '1px solid rgba(0, 0, 0, 0.06)',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: isActive ? '0 4px 14px rgba(0,0,0,0.15)' : 'none',
                  }}
                >
                  {fam}
                </button>
              );
            })}
          </div>

          {/* Search Box & Sort Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(0, 0, 0, 0.03)',
                border: '1px solid rgba(184, 149, 106, 0.3)',
                borderRadius: '999px',
                padding: '8px 16px',
              }}
            >
              <FiSearch style={{ color: '#B8956A', fontSize: '14px' }} />
              <input
                type="text"
                placeholder="Search notes, names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#1D1D1F',
                  fontSize: '12.5px',
                  width: '150px',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#8E8E93',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                  }}
                >
                  <FiX />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '8px 16px',
                background: 'rgba(0, 0, 0, 0.03)',
                border: '1px solid rgba(184, 149, 106, 0.3)',
                borderRadius: '999px',
                color: '#1D1D1F',
                fontSize: '12.5px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="curated">Maison Curated</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="rating">Highest Rated (5.0)</option>
            </select>
          </div>
        </div>

        {/* 24-Product Grid with 3D Perspective Card Physics */}
        <div
          ref={gridContainerRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
            gap: '32px',
            marginBottom: '32px',
          }}
        >
          {displayedProducts.map((product) => {
            const isAdded = addedMap[product._id];

            return (
              <div
                key={product._id}
                className="luxury-card-wrapper"
                style={{
                  position: 'relative',
                  borderRadius: '24px',
                  background: '#FFFFFF',
                  border: '1px solid rgba(184, 149, 106, 0.25)',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)',
                  overflow: 'hidden',
                  transition: 'transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.25s ease, border-color 0.25s ease',
                  willChange: 'transform',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
              >
                {/* 3D Glass Sheen Highlight Follower */}
                <div
                  className="card-shine-sheen"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    zIndex: 4,
                  }}
                />

                {/* Top Image Container with Badges */}
                <div
                  style={{
                    position: 'relative',
                    height: '320px',
                    overflow: 'hidden',
                    background: '#F6F3EE',
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />

                  {/* Top Left Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      zIndex: 3,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        background: 'rgba(255, 255, 255, 0.92)',
                        backdropFilter: 'blur(10px)',
                        color: '#1D1D1F',
                        border: '1px solid rgba(184, 149, 106, 0.35)',
                        display: 'inline-block',
                      }}
                    >
                      {product.badge || product.category}
                    </span>
                  </div>

                  {/* Top Right Quick View Trigger Button */}
                  <button
                    onClick={() => setQuickViewProduct(product)}
                    aria-label="Quick Olfactory View"
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.92)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(184, 149, 106, 0.35)',
                      color: '#1D1D1F',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 3,
                      transition: 'all 0.25s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#1D1D1F';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.92)';
                      e.currentTarget.style.color = '#1D1D1F';
                    }}
                  >
                    <FiEye />
                  </button>

                  {/* Rating Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '14px',
                      left: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      color: '#1D1D1F',
                      background: 'rgba(255, 255, 255, 0.85)',
                      padding: '3px 8px',
                      borderRadius: '999px',
                      fontWeight: 700,
                      zIndex: 3,
                    }}
                  >
                    <FiStar style={{ color: '#B8956A', fill: '#B8956A' }} />
                    <span>{product.rating || '5.0'}</span>
                    <span style={{ color: '#8E8E93', fontWeight: 400 }}>
                      ({product.numReviews || 48})
                    </span>
                  </div>
                </div>

                {/* Card Body Details */}
                <div
                  style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '11px',
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: '#B8956A',
                          fontWeight: 700,
                        }}
                      >
                        {product.family || 'Haute Fragrance'}
                      </span>
                      <span style={{ fontSize: '11px', color: '#8E8E93' }}>
                        {product.volume || '50ML Extrait'}
                      </span>
                    </div>

                    <Link
                      to={`/product/${product._id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <h3
                        style={{
                          fontSize: '19px',
                          fontWeight: 700,
                          color: '#1D1D1F',
                          marginBottom: '8px',
                          lineHeight: 1.3,
                          fontFamily: 'var(--font-display)',
                          transition: 'color 0.2s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#B8956A')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#1D1D1F')}
                      >
                        {product.name}
                      </h3>
                    </Link>

                    <p
                      style={{
                        fontSize: '12.5px',
                        lineHeight: 1.6,
                        color: '#6E6E73',
                        marginBottom: '16px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {product.description}
                    </p>

                    {/* Olfactory Notes Pill Bar */}
                    {product.notes && (
                      <div
                        style={{
                          background: 'rgba(0, 0, 0, 0.02)',
                          border: '1px solid rgba(0, 0, 0, 0.06)',
                          borderRadius: '10px',
                          padding: '8px 12px',
                          fontSize: '11px',
                          color: '#4A4A4E',
                          marginBottom: '18px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        <span style={{ color: '#B8956A', fontWeight: 700 }}>Accords: </span>
                        {product.notes.heart || product.notes.top}
                      </div>
                    )}
                  </div>

                  {/* Price & Action Button Footer */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '16px',
                      borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: '22px',
                          fontWeight: 800,
                          color: '#1D1D1F',
                          fontFamily: 'var(--font-display)',
                        }}
                      >
                        ${product.price}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#8E8E93',
                          marginLeft: '4px',
                        }}
                      >
                        USD
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '999px',
                        background: isAdded
                          ? 'linear-gradient(135deg, #2E6F40 0%, #1E4E2C 100%)'
                          : 'linear-gradient(135deg, #1D1D1F 0%, #000000 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.25s ease',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      {isAdded ? (
                        <>
                          <FiCheck />
                          <span>Reserved</span>
                        </>
                      ) : (
                        <>
                          <FiShoppingBag />
                          <span>Reserve</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Button if remaining */}
        {visibleCount < sortedProducts.length && (
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button
              onClick={() => setVisibleCount((prev) => prev + 12)}
              style={{
                padding: '14px 36px',
                borderRadius: '999px',
                background: '#FFFFFF',
                border: '1.5px solid #B8956A',
                color: '#1D1D1F',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1D1D1F';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.color = '#1D1D1F';
              }}
            >
              <span>Discover More Formulations ({sortedProducts.length - visibleCount} Left)</span>
              <FiArrowRight />
            </button>
          </div>
        )}
      </div>

      {/* OLFACTORY QUICK VIEW MODAL POPUP */}
      {quickViewProduct && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            style={{
              position: 'relative',
              background: '#FFFFFF',
              border: '1.5px solid rgba(184, 149, 106, 0.3)',
              borderRadius: '28px',
              maxWidth: '840px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.25)',
              display: 'grid',
              gridTemplateColumns: '1fr 1.2fr',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Modal Button */}
            <button
              onClick={() => setQuickViewProduct(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.05)',
                border: 'none',
                color: '#1D1D1F',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}
            >
              <FiX style={{ fontSize: '18px' }} />
            </button>

            {/* Modal Product Image */}
            <div style={{ height: '100%', minHeight: '420px', position: 'relative', background: '#F6F3EE' }}>
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>

            {/* Modal Product Info */}
            <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#B8956A',
                    fontWeight: 700,
                    marginBottom: '8px',
                  }}
                >
                  {quickViewProduct.family} • {quickViewProduct.category}
                </div>

                <h2
                  style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    color: '#1D1D1F',
                    marginBottom: '12px',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {quickViewProduct.name}
                </h2>

                <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#6E6E73', marginBottom: '24px' }}>
                  {quickViewProduct.description}
                </p>

                {/* Notes Accord Breakdown */}
                {quickViewProduct.notes && (
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.03)',
                      borderRadius: '16px',
                      padding: '16px',
                      marginBottom: '24px',
                      border: '1px solid rgba(184, 149, 106, 0.2)',
                    }}
                  >
                    <div style={{ fontSize: '11px', marginBottom: '6px' }}>
                      <strong style={{ color: '#B8956A' }}>Top:</strong>{' '}
                      <span style={{ color: '#1D1D1F' }}>{quickViewProduct.notes.top}</span>
                    </div>
                    <div style={{ fontSize: '11px', marginBottom: '6px' }}>
                      <strong style={{ color: '#B8956A' }}>Heart:</strong>{' '}
                      <span style={{ color: '#1D1D1F' }}>{quickViewProduct.notes.heart}</span>
                    </div>
                    <div style={{ fontSize: '11px' }}>
                      <strong style={{ color: '#B8956A' }}>Base:</strong>{' '}
                      <span style={{ color: '#1D1D1F' }}>{quickViewProduct.notes.base}</span>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#8E8E93', textTransform: 'uppercase' }}>
                    Standard 50ML Extrait
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#1D1D1F' }}>
                    ${quickViewProduct.price} <span style={{ fontSize: '12px', color: '#8E8E93' }}>USD</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleAddToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  style={{
                    padding: '14px 28px',
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, #1D1D1F 0%, #000000 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '13px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <FiShoppingBag />
                  <span>Reserve Flacon</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LuxuryProductGrid;
