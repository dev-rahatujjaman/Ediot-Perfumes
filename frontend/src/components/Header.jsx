import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  FiSearch,
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
  FiArrowRight,
  FiCompass,
  FiMapPin,
  FiLogOut,
  FiPackage,
  FiSliders,
  FiAward,
  FiCheckCircle,
  FiPhoneCall,
  FiClock,
  FiStar,
  FiChevronRight
} from 'react-icons/fi';
import { logout } from '../store/slices/authSlice';

const TRENDING_SEARCHES = [
  'Only For You',
  'Morning Bloom',
  'Velvet Santal',
  'Grasse Rose Noire',
  'Imperial Ambergris',
  '32% Extrait',
  'Mysore Sandalwood',
  'Discovery Set'
];

const BOUTIQUES = [
  {
    city: 'Paris',
    flagship: 'Place Vendôme Flagship',
    address: '28 Place Vendôme, 75001 Paris, France',
    hours: 'Mon – Sat: 10:00 – 19:30',
    phone: '+33 1 42 68 55 00',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80',
    tag: 'Maison Mère'
  },
  {
    city: 'London',
    flagship: 'Mayfair Haute Salon',
    address: '44 Old Bond Street, Mayfair, London W1S 4QR',
    hours: 'Mon – Sat: 10:00 – 19:00',
    phone: '+44 20 7493 8000',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80',
    tag: 'Private Salon'
  },
  {
    city: 'New York',
    flagship: 'Madison Avenue Sanctuary',
    address: '780 Madison Avenue, New York, NY 10065',
    hours: 'Mon – Sun: 11:00 – 19:00',
    phone: '+1 212 555 0199',
    image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80',
    tag: 'Atelier & Lab'
  },
  {
    city: 'Tokyo',
    flagship: 'Ginza Maison d’Art',
    address: '6-10-1 Ginza, Chuo-ku, Tokyo 104-0061',
    hours: 'Everyday: 11:00 – 20:00',
    phone: '+81 3 3571 0000',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&q=80',
    tag: 'Artisanal Vault'
  }
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [boutiquesOpen, setBoutiquesOpen] = useState(false);
  const [selectedBoutique, setSelectedBoutique] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [cartAnimate, setCartAnimate] = useState(false);

  const searchInputRef = useRef(null);
  const accountRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { userInfo, user } = useSelector((state) => state.auth);
  const currentUser = userInfo || user;
  const { cartItems } = useSelector((state) => state.cart);

  const cartItemsCount = cartItems ? cartItems.reduce((acc, item) => acc + (item.qty || 1), 0) : 0;
  const isHomePage = location.pathname === '/';
  const isDarkHeader = !isHomePage || scrolled;

  // Trigger subtle bounce on cart count change
  useEffect(() => {
    if (cartItemsCount > 0) {
      setCartAnimate(true);
      const timer = setTimeout(() => setCartAnimate(false), 800);
      return () => clearTimeout(timer);
    }
  }, [cartItemsCount]);

  // Scroll listener for translucent frosted header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard accessibility: ESC key dismisses all popups
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMenuOpen(false);
        setAccountOpen(false);
        setBoutiquesOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus search input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 150);
    }
  }, [searchOpen]);

  // Click outside listener for account dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };
    if (accountOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [accountOpen]);

  // Smooth Navigation Helper
  const handleNav = (targetId) => {
    setMenuOpen(false);
    if (isHomePage) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollTo: targetId } });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${encodeURIComponent(keyword.trim())}`);
      setSearchOpen(false);
      setKeyword('');
    }
  };

  const handleQuickSearch = (term) => {
    setKeyword(term);
    navigate(`/search/${encodeURIComponent(term)}`);
    setSearchOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    setAccountOpen(false);
    navigate('/');
  };

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9990,
        transition: 'all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        background: isDarkHeader ? 'rgba(10, 10, 12, 0.92)' : 'transparent',
        backdropFilter: isDarkHeader ? 'saturate(180%) blur(20px)' : 'none',
        WebkitBackdropFilter: isDarkHeader ? 'saturate(180%) blur(20px)' : 'none',
        borderBottom: isDarkHeader ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
        boxShadow: isDarkHeader ? '0 10px 35px rgba(0, 0, 0, 0.25)' : 'none',
      }}>
        {/* TRANSPARENT MINIMALIST FLOATING NAVBAR */}
        <div>
          <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '76px',
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '0 36px',
          }}>
            {/* BRAND LOGO (Left) */}
            <Link
              to="/"
              onClick={() => {
                if (isHomePage) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none',
                position: 'relative',
                transition: 'transform 0.25s ease',
              }}
              className="logo-hover"
            >
              <img
                src="/images/logo.png"
                alt="EDIOT Haute Parfumerie"
                style={{
                  height: '95px',
                  width: 'auto',
                  objectFit: 'cover',
                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
                  transition: 'all 0.3s ease',
                }}
              />
            </Link>

            {/* CENTRAL FLOATING CAPSULE PILL (Center) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              borderRadius: '999px',
              padding: '5px 8px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.18)',
              transition: 'all 0.35s ease',
            }}>
              {/* Menu Toggle Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="header-pill-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 18px',
                  borderRadius: '999px',
                  background: menuOpen
                    ? '#FFFFFF'
                    : 'rgba(255, 255, 255, 0.16)',
                  color: menuOpen
                    ? '#1D1D1F'
                    : '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
              >
                {menuOpen ? <FiX style={{ fontSize: '15px' }} /> : <FiMenu style={{ fontSize: '15px' }} />}
                <span>{menuOpen ? 'Close' : 'Menu'}</span>
              </button>

              {/* Fragrances Link */}
              <button
                onClick={() => handleNav('fragrances')}
                className="header-nav-link"
                style={{
                  padding: '8px 18px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  textShadow: '0 1px 6px rgba(0,0,0,0.3)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '999px',
                  transition: 'all 0.25s ease',
                }}
              >
                Fragrances
              </button>

              {/* The Maison Link */}
              <button
                onClick={() => handleNav('maison')}
                className="header-nav-link"
                style={{
                  padding: '8px 18px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  textShadow: '0 1px 6px rgba(0,0,0,0.3)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '999px',
                  transition: 'all 0.25s ease',
                }}
              >
                The Maison
              </button>

              {/* Olfactory Notes Link */}
              <button
                onClick={() => handleNav('olfactory')}
                className="header-nav-link"
                style={{
                  padding: '8px 18px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  textShadow: '0 1px 6px rgba(0,0,0,0.3)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '999px',
                  transition: 'all 0.25s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <FiSliders style={{ color: '#D4AF37', fontSize: '13px' }} />
                <span>Olfactory Notes</span>
              </button>
            </div>

            {/* RIGHT ACTIONS GROUP (Right) */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {/* Where to Buy Boutiques Button */}
              <button
                onClick={() => setBoutiquesOpen(true)}
                className="header-action-btn"
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#FFFFFF',
                  textShadow: '0 1px 6px rgba(0,0,0,0.3)',
                  padding: '9px 18px',
                  borderRadius: '999px',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.25s ease',
                }}
              >
                <FiMapPin style={{ color: '#D4AF37', fontSize: '14px' }} />
                <span>Boutiques</span>
              </button>

              {/* Search Toggle Icon Button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search Fragrances"
                className="header-icon-btn"
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '17px',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                }}
              >
                <FiSearch />
              </button>

              {/* User Account / VIP Dropdown Container */}
              <div ref={accountRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  aria-label="Maison Account"
                  className="header-icon-btn"
                  style={{
                    background: currentUser
                      ? 'linear-gradient(135deg, rgba(212,175,55,0.35) 0%, rgba(255,255,255,0.2) 100%)'
                      : 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: currentUser
                      ? '1.5px solid #D4AF37'
                      : '1px solid rgba(255, 255, 255, 0.25)',
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '17px',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  }}
                >
                  <FiUser style={{ color: currentUser ? '#D4AF37' : '#FFFFFF' }} />
                </button>

                {/* Account Popover Menu */}
                {accountOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '52px',
                    right: 0,
                    width: '280px',
                    background: '#FFFFFF',
                    border: '1.5px solid rgba(184, 149, 106, 0.35)',
                    borderRadius: '20px',
                    padding: '20px',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.12), 0 0 30px rgba(184,149,106,0.1)',
                    color: '#1D1D1F',
                    zIndex: 9999,
                    animation: 'dropdownFadeIn 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}>
                    {currentUser ? (
                      <div>
                        {/* User Identity Header */}
                        <div style={{ paddingBottom: '14px', borderBottom: '1px solid rgba(0,0,0,0.08)', marginBottom: '14px' }}>
                          <div style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#B8956A', fontWeight: 700 }}>
                            {(currentUser?.isAdmin || currentUser?.data?.isAdmin) ? 'Maison Administrator' : 'VIP Connoisseur'}
                          </div>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: '#1D1D1F', marginTop: '2px' }}>
                            {currentUser.name || currentUser.data?.name}
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#6E6E73', wordBreak: 'break-all' }}>
                            {currentUser.email || currentUser.data?.email}
                          </div>
                        </div>

                        {/* User Navigation Links */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <Link
                            to="/profile"
                            onClick={() => setAccountOpen(false)}
                            className="account-menu-link"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '10px 12px',
                              borderRadius: '10px',
                              color: '#1D1D1F',
                              textDecoration: 'none',
                              fontSize: '13px',
                              fontWeight: 600,
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <FiPackage style={{ color: '#B8956A' }} />
                            <span>My Orders & Profile</span>
                          </Link>

                          {(currentUser?.isAdmin || currentUser?.data?.isAdmin) && (
                            <>
                              <Link
                                to="/admin/dashboard"
                                onClick={() => setAccountOpen(false)}
                                className="account-menu-link"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  padding: '10px 12px',
                                  borderRadius: '10px',
                                  color: '#1D1D1F',
                                  textDecoration: 'none',
                                  fontSize: '13px',
                                  fontWeight: 600,
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                <FiSliders style={{ color: '#B8956A' }} />
                                <span>Admin Dashboard</span>
                              </Link>
                              <Link
                                to="/admin/products"
                                onClick={() => setAccountOpen(false)}
                                className="account-menu-link"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  padding: '10px 12px',
                                  borderRadius: '10px',
                                  color: '#1D1D1F',
                                  textDecoration: 'none',
                                  fontSize: '13px',
                                  fontWeight: 500,
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                <FiAward style={{ color: '#B8956A' }} />
                                <span>Manage Inventory</span>
                              </Link>
                            </>
                          )}

                          <button
                            onClick={handleLogout}
                            className="account-menu-link"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '10px 12px',
                              borderRadius: '10px',
                              color: '#D9383A',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              width: '100%',
                              fontSize: '13px',
                              fontWeight: 600,
                              textAlign: 'left',
                              marginTop: '4px',
                              borderTop: '1px solid rgba(0,0,0,0.06)',
                              paddingTop: '12px',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <FiLogOut />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                          <div style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B8956A', fontWeight: 700 }}>
                            Maison Client Access
                          </div>
                          <p style={{ fontSize: '12px', color: '#6E6E73', marginTop: '4px', lineHeight: 1.4 }}>
                            Sign in to access your curated orders, complimentary perks & private harvest allocations.
                          </p>
                        </div>

                        <Link
                          to="/login"
                          onClick={() => setAccountOpen(false)}
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '999px',
                            background: 'linear-gradient(135deg, #1D1D1F 0%, #000000 100%)',
                            color: '#FFFFFF',
                            textDecoration: 'none',
                            fontWeight: 700,
                            fontSize: '13px',
                            textAlign: 'center',
                            letterSpacing: '0.04em',
                            marginBottom: '8px',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                          }}
                        >
                          Sign In
                        </Link>

                        <Link
                          to="/register"
                          onClick={() => setAccountOpen(false)}
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '10px 16px',
                            borderRadius: '999px',
                            background: '#FFFFFF',
                            border: '1px solid rgba(184, 149, 106, 0.35)',
                            color: '#1D1D1F',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '12.5px',
                            textAlign: 'center',
                            letterSpacing: '0.04em',
                          }}
                        >
                          Create VIP Account
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Shopping Bag Button with Animated Counter */}
              <Link
                to="/cart"
                aria-label="View Shopping Bag"
                className="header-icon-btn"
                style={{
                  position: 'relative',
                  background: '#FFFFFF',
                  border: '1px solid rgba(184, 149, 106, 0.3)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  color: '#1D1D1F',
                  textDecoration: 'none',
                  transition: 'all 0.25s ease',
                  transform: cartAnimate ? 'scale(1.15)' : 'scale(1)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                <FiShoppingBag />
                {cartItemsCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: 'linear-gradient(135deg, #B8956A 0%, #947148 100%)',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: 800,
                    minWidth: '19px',
                    height: '19px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    animation: cartAnimate ? 'cartPulse 0.6s ease' : 'none',
                  }}>
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* 3. LUXURY SLIDE-OUT MAISON DRAWER (Menu) */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 9998,
            display: 'flex',
            justifyContent: 'flex-end',
            animation: 'backdropFadeIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              width: '100%',
              maxWidth: '460px',
              height: '100%',
              padding: '48px 36px',
              boxShadow: '-20px 0 60px rgba(0, 0, 0, 0.15)',
              borderLeft: '1.5px solid rgba(184, 149, 106, 0.25)',
              position: 'relative',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              animation: 'drawerSlideIn 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar of Drawer */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' }}>
                <div>
                  <div style={{ fontSize: '10.5px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#B8956A', fontWeight: 700 }}>
                    Maison Directory
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#1D1D1F', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>
                    EDIOT BREEZE
                  </div>
                </div>

                <button
                  onClick={() => setMenuOpen(false)}
                  style={{
                    background: '#F5F5F7',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    color: '#1D1D1F',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotate(90deg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotate(0deg)')}
                >
                  <FiX />
                </button>
              </div>

              {/* Navigation Links List */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Haute Fragrance Collection', target: 'fragrances', icon: <FiAward />, tag: 'Private Reserve' },
                  { label: 'The Grasse Botanical Heritage', target: 'maison', icon: <FiCompass />, tag: 'Est. 1928' },
                  { label: 'Olfactory Accord Notes', target: 'olfactory', icon: <FiSliders />, tag: '32% Extrait' },
                ].map((item, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => handleNav(item.target)}
                      className="drawer-nav-item"
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        borderRadius: '16px',
                        background: 'var(--color-cream, #FDFCFA)',
                        border: '1px solid rgba(184, 149, 106, 0.25)',
                        color: '#1D1D1F',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: 'left',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ color: '#B8956A', fontSize: '16px' }}>{item.icon}</span>
                        <div>
                          <div style={{ fontSize: '15.5px', fontWeight: 600 }}>{item.label}</div>
                          <div style={{ fontSize: '10px', color: '#B8956A', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
                            {item.tag}
                          </div>
                        </div>
                      </div>
                      <FiChevronRight style={{ color: 'rgba(0,0,0,0.3)', fontSize: '18px' }} />
                    </button>
                  </li>
                ))}

                {/* Boutiques Action Button in Drawer */}
                <li>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setBoutiquesOpen(true);
                    }}
                    className="drawer-nav-item"
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, rgba(184,149,106,0.12) 0%, rgba(255,255,255,0.8) 100%)',
                      border: '1px solid rgba(184, 149, 106, 0.35)',
                      color: '#1D1D1F',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <FiMapPin style={{ color: '#B8956A', fontSize: '16px' }} />
                      <div>
                        <div style={{ fontSize: '15.5px', fontWeight: 600 }}>Global Flagship Boutiques</div>
                        <div style={{ fontSize: '10px', color: '#B8956A', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
                          Paris • London • New York • Tokyo
                        </div>
                      </div>
                    </div>
                    <FiChevronRight style={{ color: 'rgba(0,0,0,0.3)', fontSize: '18px' }} />
                  </button>
                </li>
              </ul>
            </div>

            {/* Bottom VIP Concierge Card */}
            <div style={{
              background: 'var(--color-warm-white, #FFFBF7)',
              border: '1px solid rgba(184, 149, 106, 0.25)',
              borderRadius: '18px',
              padding: '20px',
              marginTop: '32px',
            }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#B8956A', fontWeight: 700, marginBottom: '6px' }}>
                Maison Concierge Service
              </div>
              <p style={{ fontSize: '12px', color: '#6E6E73', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                Speak with our master Grasse perfumery advisors for custom flacon engraving & bridal bespoke consultations.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#1D1D1F', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FiPhoneCall style={{ color: '#B8956A' }} />
                  <span>+33 1 42 68 55 00</span>
                </span>
                <span style={{ color: '#8E8E93' }}>Available 24/7</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. LUXURY SEARCH OVERLAY DRAWER */}
      {searchOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 9998,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingTop: '110px',
            animation: 'backdropFadeIn 0.25s ease',
          }}
          onClick={() => setSearchOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '720px',
              margin: '0 24px',
              background: '#FFFFFF',
              borderRadius: '28px',
              padding: '36px',
              border: '1.5px solid rgba(184, 149, 106, 0.35)',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.15), 0 0 40px rgba(184,149,106,0.1)',
              animation: 'searchSlideDown 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              color: '#1D1D1F',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B8956A', fontWeight: 700 }}>
                Olfactory Search
              </span>
              <button
                onClick={() => setSearchOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8E8E93',
                  cursor: 'pointer',
                  fontSize: '18px',
                }}
              >
                <FiX />
              </button>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: '24px' }}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search botanical notes, editions, accords (e.g., Santal, Bergamot)..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '18px 56px 18px 24px',
                  fontSize: '15px',
                  background: 'var(--color-cream, #FDFCFA)',
                  border: '1.5px solid rgba(184, 149, 106, 0.4)',
                  borderRadius: '999px',
                  color: '#1D1D1F',
                  outline: 'none',
                  fontFamily: 'var(--font-text)',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.03)',
                  transition: 'border 0.2s',
                }}
              />
              <button
                type="submit"
                aria-label="Submit search"
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'linear-gradient(135deg, #1D1D1F 0%, #000000 100%)',
                  border: 'none',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
              >
                <FiSearch />
              </button>
            </form>

            {/* Curated Trending Search Tags */}
            <div>
              <div style={{ fontSize: '11px', color: '#6E6E73', marginBottom: '10px', fontWeight: 600, letterSpacing: '0.05em' }}>
                Curated Haute Accords & Editions:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {TRENDING_SEARCHES.map((term, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickSearch(term)}
                    className="trending-chip"
                    style={{
                      padding: '7px 14px',
                      borderRadius: '999px',
                      background: '#FFFFFF',
                      border: '1px solid rgba(184, 149, 106, 0.3)',
                      color: '#4A4A4E',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ color: '#B8956A', fontSize: '9px' }}>✦</span>
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. GLOBAL FLAGSHIP BOUTIQUES MODAL ("Where to Buy") */}
      {boutiquesOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 9998,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px',
            animation: 'backdropFadeIn 0.25s ease',
          }}
          onClick={() => setBoutiquesOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '860px',
              background: '#FFFFFF',
              borderRadius: '28px',
              padding: '36px',
              border: '1.5px solid rgba(184, 149, 106, 0.35)',
              boxShadow: '0 30px 90px rgba(0, 0, 0, 0.18), 0 0 50px rgba(184,149,106,0.1)',
              color: '#1D1D1F',
              position: 'relative',
              animation: 'modalZoomIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
              <div>
                <div style={{ fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#B8956A', fontWeight: 700, marginBottom: '4px' }}>
                  Where to Buy & Experience
                </div>
                <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#1D1D1F', margin: 0, fontFamily: 'var(--font-display)' }}>
                  Global Flagship Salons
                </h2>
              </div>

              <button
                onClick={() => setBoutiquesOpen(false)}
                style={{
                  background: '#F5F5F7',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  color: '#1D1D1F',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <FiX />
              </button>
            </div>

            {/* Boutique Selector Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '24px' }}>
              {BOUTIQUES.map((b, idx) => {
                const isSelected = selectedBoutique === idx;
                return (
                  <button
                    key={b.city}
                    onClick={() => setSelectedBoutique(idx)}
                    style={{
                      padding: '12px 10px',
                      borderRadius: '14px',
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(184,149,106,0.18) 0%, #FFFFFF 100%)'
                        : 'var(--color-cream, #FDFCFA)',
                      border: isSelected ? '1.5px solid #B8956A' : '1px solid rgba(184, 149, 106, 0.25)',
                      color: '#1D1D1F',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <div style={{ fontSize: '14px', fontWeight: 700 }}>{b.city}</div>
                    <div style={{ fontSize: '10px', color: isSelected ? '#B8956A' : '#6E6E73', marginTop: '2px', fontWeight: 600 }}>
                      {b.tag}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Boutique Showcase Panel */}
            {(() => {
              const b = BOUTIQUES[selectedBoutique];
              return (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr',
                  gap: '24px',
                  background: 'var(--color-cream, #FDFCFA)',
                  border: '1px solid rgba(184, 149, 106, 0.25)',
                  borderRadius: '20px',
                  padding: '24px',
                  alignItems: 'center',
                }}>
                  <div>
                    <div style={{ display: 'inline-block', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', background: 'rgba(184,149,106,0.15)', color: '#B8956A', padding: '3px 10px', borderRadius: '4px', fontWeight: 700, marginBottom: '10px' }}>
                      {b.tag}
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1D1D1F', marginBottom: '14px' }}>
                      {b.flagship}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#4A4A4E', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <FiMapPin style={{ color: '#B8956A', marginTop: '3px', flexShrink: 0 }} />
                        <span>{b.address}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiClock style={{ color: '#B8956A', flexShrink: 0 }} />
                        <span>{b.hours}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiPhoneCall style={{ color: '#B8956A', flexShrink: 0 }} />
                        <span>{b.phone}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setBoutiquesOpen(false);
                        handleNav('fragrances');
                      }}
                      style={{
                        padding: '12px 24px',
                        borderRadius: '999px',
                        background: 'linear-gradient(135deg, #1D1D1F 0%, #000000 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                      }}
                    >
                      <span>Book Private Scent Consultation</span>
                      <FiArrowRight />
                    </button>
                  </div>

                  <div style={{ height: '220px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(184, 149, 106, 0.25)' }}>
                    <img
                      src={b.image}
                      alt={b.flagship}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* GLOBAL KEYFRAME ANIMATIONS & HOVER STYLES */}
      <style>{`
        @keyframes headerTicker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes drawerSlideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes backdropFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes searchSlideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes modalZoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes dropdownFadeIn {
          from { transform: translateY(-8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes cartPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.35); }
          100% { transform: scale(1); }
        }

        .header-icon-btn:hover {
          transform: translateY(-2px);
          border-color: #B8956A !important;
          color: #B8956A !important;
        }
        .header-icon-btn:active {
          transform: scale(0.92);
        }
        .header-action-btn:hover {
          background: rgba(184, 149, 106, 0.15) !important;
          border-color: #B8956A !important;
          transform: translateY(-1px);
        }
        .header-action-btn:active {
          transform: scale(0.95);
        }
        .header-nav-link:hover {
          color: #B8956A !important;
          background: rgba(184, 149, 106, 0.08) !important;
        }
        .drawer-nav-item:hover {
          background: rgba(184, 149, 106, 0.12) !important;
          border-color: #B8956A !important;
          transform: translateX(4px);
        }
        .account-menu-link:hover {
          background: rgba(184, 149, 106, 0.08);
          color: #B8956A !important;
        }
        .trending-chip:hover {
          background: rgba(184, 149, 106, 0.15) !important;
          border-color: #B8956A !important;
          color: #1D1D1F !important;
        }
        .logo-hover:hover {
          opacity: 0.85;
        }

        @media (max-width: 900px) {
          .header-nav-link,
          button[style*="Boutiques"] {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
