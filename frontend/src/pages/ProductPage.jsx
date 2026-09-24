import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowLeft, FiMinus, FiPlus, FiShoppingBag, FiCheck, FiTruck, FiShield, FiStar, FiTarget, FiMaximize2, FiAlertCircle, FiSun, FiHeart, FiLayers, FiInfo } from 'react-icons/fi';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getProductDetails, createProductReview } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState('notes');

  const { product, loading, error, successReview } = useSelector((state) => state.products);
  const { userInfo, user } = useSelector((state) => state.auth);
  const currentUser = userInfo || user;

  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
    }
  }, [dispatch, id, successReview]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty: Number(qty) }));
    navigate('/cart');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    dispatch(createProductReview({ productId: id, review: { rating, comment } }));
  };

  if (loading) return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader /></div>;
  if (error) return <div className="container" style={{ paddingTop: '140px' }}><Message variant="error">{error}</Message></div>;
  if (!product) return null;

  return (
    <div style={{ paddingTop: '135px', paddingBottom: '100px', background: 'var(--color-cream)' }}>
      <div className="container">
        {/* Back Link */}
        <Link to="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '2rem',
          fontWeight: 600,
          color: 'var(--color-charcoal)'
        }}>
          <FiArrowLeft /> Back to fragrances
        </Link>

        {/* Product Hero Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '4rem',
          alignItems: 'start',
          marginBottom: '5rem'
        }}>
          {/* Product Image Card */}
          <div style={{
            background: 'var(--color-warm-white)',
            borderRadius: '24px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
          }}>
            <img
              src={product.image || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80'}
              alt={product.name}
              style={{
                maxWidth: '100%',
                maxHeight: '500px',
                objectFit: 'contain',
                borderRadius: '16px'
              }}
            />
          </div>

          {/* Product Details */}
          <div>
            <span className="badge" style={{ marginBottom: '1rem' }}>
              {product.category || 'Eau De Parfum'}
            </span>

            <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', marginBottom: '1rem', lineHeight: 1.2 }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <Rating value={product.rating || 5} text={`${product.numReviews || 0} reviews`} />
              <span style={{ color: 'var(--color-grey)' }}>•</span>
              <span style={{
                color: (product.countInStock ?? product.stock ?? 20) > 0 ? '#27ae60' : '#e74c3c',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}>
                {(product.countInStock ?? product.stock ?? 20) > 0 ? 'In Stock (Ready to Ship)' : 'Out of Stock'}
              </span>
            </div>

            <div style={{
              fontSize: '2.5rem',
              fontWeight: 600,
              color: 'var(--color-gold)',
              fontFamily: 'var(--font-display)',
              marginBottom: '1.5rem'
            }}>
              ${product.price}
            </div>

            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.8',
              color: 'var(--color-charcoal)',
              marginBottom: '2rem'
            }}>
              {product.description}
            </p>

            {/* Quantity Selector & Add to Cart */}
            {(product.countInStock ?? product.stock ?? 20) > 0 && (
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--color-warm-white)',
                  borderRadius: '50px',
                  border: '1px solid var(--color-beige)',
                  padding: '0.5rem 1rem'
                }}>
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    style={{ background: 'transparent', padding: '0.5rem', cursor: 'pointer' }}
                  >
                    <FiMinus />
                  </button>
                  <span style={{ padding: '0 1rem', fontWeight: 600, minWidth: '40px', textAlign: 'center' }}>
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(Math.min((product.countInStock ?? product.stock ?? 20), qty + 1))}
                    style={{ background: 'transparent', padding: '0.5rem', cursor: 'pointer' }}
                  >
                    <FiPlus />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="btn btn-primary"
                  style={{ flex: 1, minWidth: '200px', justifyContent: 'center' }}
                >
                  <FiShoppingBag /> Add to Cart — ${(product.price * qty).toFixed(2)}
                </button>
              </div>
            )}

            {/* Value Props */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              padding: '1.5rem',
              background: 'var(--color-warm-white)',
              borderRadius: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FiShield style={{ color: 'var(--color-gold)', fontSize: '1.25rem' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>100% Authentic Ingredients</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FiTruck style={{ color: 'var(--color-gold)', fontSize: '1.25rem' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Fast Express Delivery</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FiStar style={{ color: 'var(--color-gold)', fontSize: '1.25rem' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>5-Day Risk-Free Returns</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FiCheck style={{ color: 'var(--color-gold)', fontSize: '1.25rem' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>12+ Hours Longevity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Deep Dive Tabs */}
        <div style={{
          background: 'var(--color-warm-white)',
          borderRadius: '24px',
          padding: '3rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
          marginBottom: '5rem'
        }}>
          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            gap: '2rem',
            borderBottom: '1px solid var(--color-beige)',
            paddingBottom: '1rem',
            marginBottom: '2rem'
          }}>
            <button
              onClick={() => setActiveTab('notes')}
              style={{
                background: 'transparent',
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: activeTab === 'notes' ? 'var(--color-black)' : 'var(--color-grey)',
                borderBottom: activeTab === 'notes' ? '2px solid var(--color-black)' : 'none',
                paddingBottom: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Fragrance Pyramid
            </button>
            <button
              onClick={() => setActiveTab('usage')}
              style={{
                background: 'transparent',
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: activeTab === 'usage' ? 'var(--color-black)' : 'var(--color-grey)',
                borderBottom: activeTab === 'usage' ? '2px solid var(--color-black)' : 'none',
                paddingBottom: '0.5rem',
                cursor: 'pointer'
              }}
            >
              How to Use
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              style={{
                background: 'transparent',
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: activeTab === 'reviews' ? 'var(--color-black)' : 'var(--color-grey)',
                borderBottom: activeTab === 'reviews' ? '2px solid var(--color-black)' : 'none',
                paddingBottom: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Customer Reviews ({product.reviews?.length || 0})
            </button>
          </div>

          {/* Fragrance Notes Tab */}
          {activeTab === 'notes' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              <div className="card" style={{ background: 'var(--color-cream)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(184, 149, 106, 0.15)', color: 'var(--color-gold)', marginBottom: '0.75rem' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 3v18" />
                    <path d="M12 12l6.36-6.36" />
                    <path d="M12 12l6.36 6.36" />
                    <path d="M12 12L5.64 5.64" />
                    <path d="M12 12l-6.36 6.36" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', margin: '0.75rem 0' }}>Top Notes</h3>
                <p style={{ color: 'var(--color-grey)', fontSize: '0.95rem' }}>
                  Sweet Opening, Italian Bergamot, Crisp Citrus
                </p>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gold)', fontWeight: 600, display: 'block', marginTop: '1rem' }}>
                  First 15 - 30 Minutes
                </span>
              </div>
              <div className="card" style={{ background: 'var(--color-cream)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(184, 149, 106, 0.15)', color: 'var(--color-gold)', marginBottom: '0.75rem' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', margin: '0.75rem 0' }}>Heart Notes</h3>
                <p style={{ color: 'var(--color-grey)', fontSize: '0.95rem' }}>
                  Mild Aromatic, Madagascar Vanilla, French Lavender
                </p>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gold)', fontWeight: 600, display: 'block', marginTop: '1rem' }}>
                  2 - 4 Hours
                </span>
              </div>
              <div className="card" style={{ background: 'var(--color-cream)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(184, 149, 106, 0.15)', color: 'var(--color-gold)', marginBottom: '0.75rem' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', margin: '0.75rem 0' }}>Base Notes</h3>
                <p style={{ color: 'var(--color-grey)', fontSize: '0.95rem' }}>
                  Warm Amber, Roasted Tonka, Powdery Woods
                </p>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gold)', fontWeight: 600, display: 'block', marginTop: '1rem' }}>
                  8 - 12+ Hours
                </span>
              </div>
            </div>
          )}

          {/* Usage Guide Tab */}
          {activeTab === 'usage' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ padding: '1.5rem', background: 'var(--color-cream)', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                  <FiTarget style={{ color: 'var(--color-gold)', fontSize: '18px' }} />
                  <h4 style={{ margin: 0 }}>6 - 8 Sprays</h4>
                </div>
                <p style={{ color: 'var(--color-grey)', fontSize: '0.9rem' }}>Optimal coverage on pulse points & collar</p>
              </div>
              <div style={{ padding: '1.5rem', background: 'var(--color-cream)', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                  <FiMaximize2 style={{ color: 'var(--color-gold)', fontSize: '18px' }} />
                  <h4 style={{ margin: 0 }}>Spray at 0.5 ft</h4>
                </div>
                <p style={{ color: 'var(--color-grey)', fontSize: '0.9rem' }}>Allows fine mist dispersion without dripping</p>
              </div>
              <div style={{ padding: '1.5rem', background: 'var(--color-cream)', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                  <FiAlertCircle style={{ color: 'var(--color-gold)', fontSize: '18px' }} />
                  <h4 style={{ margin: 0 }}>Do Not Rub Wrists</h4>
                </div>
                <p style={{ color: 'var(--color-grey)', fontSize: '0.9rem' }}>Rubbing crushes top notes and alters the drydown</p>
              </div>
              <div style={{ padding: '1.5rem', background: 'var(--color-cream)', borderRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                  <FiInfo style={{ color: 'var(--color-gold)', fontSize: '18px' }} />
                  <h4 style={{ margin: 0 }}>Store in Dark & Cool</h4>
                </div>
                <p style={{ color: 'var(--color-grey)', fontSize: '0.9rem' }}>Protects delicate natural oils from oxidation</p>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              {product.reviews?.length === 0 && (
                <p style={{ color: 'var(--color-grey)', marginBottom: '2rem' }}>No reviews yet. Be the first to share your experience!</p>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                {product.reviews?.map((rev) => (
                  <div key={rev._id} style={{ padding: '1.5rem', background: 'var(--color-cream)', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong>{rev.name}</strong>
                      <Rating value={rev.rating} />
                    </div>
                    <p style={{ color: 'var(--color-charcoal)' }}>{rev.comment}</p>
                    <small style={{ color: 'var(--color-grey)' }}>{new Date(rev.createdAt).toLocaleDateString()}</small>
                  </div>
                ))}
              </div>

              {/* Add Review Form */}
              {currentUser ? (
                <form onSubmit={handleReviewSubmit} style={{ background: 'var(--color-cream)', padding: '2rem', borderRadius: '16px' }}>
                  <h4 style={{ marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>Leave Your Signature Review</h4>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Rating</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-beige)', width: '100%', maxWidth: '200px', fontFamily: 'var(--font-text)' }}
                    >
                      <option value="5">5 - Pure Luxury</option>
                      <option value="4">4 - Very Good</option>
                      <option value="3">3 - Decent</option>
                      <option value="2">2 - Fair</option>
                      <option value="1">1 - Poor</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Your Thoughts</label>
                    <textarea
                      rows="4"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Describe how the fragrance opens and evolves on your skin..."
                      required
                      style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-beige)', fontFamily: 'var(--font-text)' }}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">Submit Review</button>
                </form>
              ) : (
                <p>Please <Link to="/login" style={{ textDecoration: 'underline', fontWeight: 600 }}>sign in</Link> to write a review.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
