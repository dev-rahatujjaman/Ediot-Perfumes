import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { productService } from '../../services/productService';
import { getProductDetails, updateProduct, resetProductDetails, resetSuccess } from '../../store/slices/productSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import {
  FiArrowLeft,
  FiUploadCloud,
  FiSave,
  FiBox,
  FiTag,
  FiDollarSign,
  FiLayers
} from 'react-icons/fi';

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const { product, loading, error, successUpdate } = useSelector((state) => state.products || state.product || {});

  useEffect(() => {
    if (successUpdate) {
      dispatch(resetSuccess());
      toast.success('Fragrance formulation updated successfully');
      navigate('/admin/products');
    } else {
      const currentProduct = product?.data || product;
      if (!currentProduct || (currentProduct._id !== id && currentProduct.id !== id)) {
        dispatch(getProductDetails(id));
      } else {
        setName(currentProduct.name || '');
        setPrice(currentProduct.price || 0);
        setImage(currentProduct.image || '');
        setBrand(currentProduct.brand || '');
        setCategory(currentProduct.category || '');
        setCountInStock(currentProduct.countInStock !== undefined ? currentProduct.countInStock : (currentProduct.stock || 0));
        setDescription(currentProduct.description || '');
      }
    }
  }, [dispatch, id, product, successUpdate, navigate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const data = await productService.uploadProductImage(formData);
      setImage(data.image);
      setUploading(false);
      toast.success('Flacon artwork uploaded successfully');
    } catch (err) {
      setUploading(false);
      toast.error('Image upload failed');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        id,
        product: {
          name,
          price,
          image,
          brand,
          category,
          description,
          countInStock,
        },
      })
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '130px',
      paddingBottom: '100px',
      background: 'var(--color-cream, #FDFCFA)',
      color: '#1D1D1F',
    }}>
      <div className="container" style={{ maxWidth: '840px', margin: '0 auto', padding: '0 24px' }}>

        {/* Back Link */}
        <Link
          to="/admin/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
            color: '#B8956A',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.04em',
          }}
        >
          <FiArrowLeft />
          <span>Return to Catalog Ledger</span>
        </Link>

        <div style={{
          background: '#FFFFFF',
          borderRadius: '28px',
          border: '1.5px solid rgba(184, 149, 106, 0.3)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.04)',
          padding: 'clamp(24px, 4vw, 44px)',
        }}>
          <div style={{ marginBottom: '28px', borderBottom: '1px solid rgba(184, 149, 106, 0.2)', paddingBottom: '18px' }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B8956A', fontWeight: 700 }}>
              Formulation & Presentation Spec
            </span>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              color: '#1D1D1F',
              margin: '6px 0 0',
            }}>
              Refine Flacon Profile
            </h1>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}><Loader /></div>
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E73', marginBottom: '8px' }}>
                  Flacon Title / Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amber Nuit Extrait"
                  required
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    border: '1.5px solid rgba(184, 149, 106, 0.3)',
                    background: '#FAF8F5',
                    fontSize: '14px',
                    outline: 'none',
                    color: '#1D1D1F',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E73', marginBottom: '8px' }}>
                    Reserve Price ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '14px',
                      border: '1.5px solid rgba(184, 149, 106, 0.3)',
                      background: '#FAF8F5',
                      fontSize: '14px',
                      outline: 'none',
                      color: '#1D1D1F',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E73', marginBottom: '8px' }}>
                    Vault Units in Stock
                  </label>
                  <input
                    type="number"
                    value={countInStock}
                    onChange={(e) => setCountInStock(Number(e.target.value))}
                    required
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '14px',
                      border: '1.5px solid rgba(184, 149, 106, 0.3)',
                      background: '#FAF8F5',
                      fontSize: '14px',
                      outline: 'none',
                      color: '#1D1D1F',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E73', marginBottom: '8px' }}>
                    Maison / Brand
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Maison Royale"
                    required
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '14px',
                      border: '1.5px solid rgba(184, 149, 106, 0.3)',
                      background: '#FAF8F5',
                      fontSize: '14px',
                      outline: 'none',
                      color: '#1D1D1F',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E73', marginBottom: '8px' }}>
                    Olfactory Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Extrait de Parfum / Oriental"
                    required
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      borderRadius: '14px',
                      border: '1.5px solid rgba(184, 149, 106, 0.3)',
                      background: '#FAF8F5',
                      fontSize: '14px',
                      outline: 'none',
                      color: '#1D1D1F',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Image Input and Artwork Preview */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E73', marginBottom: '8px' }}>
                  Flacon Artwork Visual URL
                </label>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1', minWidth: '240px' }}>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://..."
                      required
                      style={{
                        width: '100%',
                        padding: '14px 18px',
                        borderRadius: '14px',
                        border: '1.5px solid rgba(184, 149, 106, 0.3)',
                        background: '#FAF8F5',
                        fontSize: '14px',
                        outline: 'none',
                        color: '#1D1D1F',
                        boxSizing: 'border-box',
                        marginBottom: '10px',
                      }}
                    />
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'rgba(184, 149, 106, 0.08)',
                      border: '1px dashed rgba(184, 149, 106, 0.4)',
                    }}>
                      <FiUploadCloud style={{ color: '#B8956A', fontSize: '18px' }} />
                      <input
                        type="file"
                        onChange={uploadFileHandler}
                        style={{ fontSize: '12px', color: '#6E6E73', cursor: 'pointer' }}
                      />
                    </div>
                    {uploading && <p style={{ fontSize: '12px', color: '#B8956A', marginTop: '6px', fontWeight: 600 }}>Uploading artwork...</p>}
                  </div>

                  {image && (
                    <div style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1.5px solid rgba(184, 149, 106, 0.3)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    }}>
                      <img
                        src={image}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6E6E73', marginBottom: '8px' }}>
                  Olfactory & Maceration Description
                </label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed fragrance composition notes..."
                  required
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    border: '1.5px solid rgba(184, 149, 106, 0.3)',
                    background: '#FAF8F5',
                    fontSize: '14px',
                    outline: 'none',
                    color: '#1D1D1F',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                ></textarea>
              </div>

              <button
                type="submit"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '12px',
                  padding: '16px',
                  borderRadius: '999px',
                  background: '#1D1D1F',
                  color: '#FFFFFF',
                  border: '1px solid rgba(184, 149, 106, 0.4)',
                  fontSize: '14px',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#B8956A';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#1D1D1F';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
              >
                <FiSave style={{ fontSize: '16px' }} />
                <span>Publish Formulation Updates</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductEditPage;
