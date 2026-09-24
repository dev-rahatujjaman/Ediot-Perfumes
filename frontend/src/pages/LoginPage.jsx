import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiArrowRight, FiLock, FiMail, FiShield, FiUserCheck } from 'react-icons/fi';
import { authService } from '../services/authService';
import {
  loginRequest,
  loginSuccess,
  loginFail,
} from '../store/slices/authSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, userInfo, user } = useSelector((state) => state.auth || {});
  const currentUser = userInfo || user;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (currentUser) {
      navigate(redirect);
    }
  }, [navigate, currentUser, redirect]);

  const submitHandler = async (e) => {
    if (e) e.preventDefault();
    try {
      dispatch(loginRequest());
      const data = await authService.login(email, password);
      dispatch(loginSuccess(data));
      toast.success('Authenticated to Maison Portal');
      const isAdmin = data?.data?.isAdmin ?? data?.isAdmin;
      if (isAdmin && (redirect === '/' || redirect.includes('admin'))) {
        navigate('/admin/dashboard');
      } else {
        navigate(redirect);
      }
    } catch (err) {
      const msg =
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
      dispatch(loginFail(msg));
      toast.error(msg);
    }
  };

  const handleQuickLogin = async (roleEmail, rolePass, targetPath) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    try {
      dispatch(loginRequest());
      const data = await authService.login(roleEmail, rolePass);
      dispatch(loginSuccess(data));
      toast.success(`Signed in as ${roleEmail.includes('admin') ? 'Atelier Admin' : 'VIP Client'}`);
      navigate(targetPath || (roleEmail.includes('admin') ? '/admin/dashboard' : '/'));
    } catch (err) {
      const msg =
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
      dispatch(loginFail(msg));
      toast.error(msg);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '130px',
      paddingBottom: '100px',
      background: 'var(--color-cream, #FDFCFA)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className="container" style={{ maxWidth: '490px', width: '100%', padding: '0 20px' }}>
        <div style={{
          background: '#FFFFFF',
          borderRadius: '28px',
          padding: '44px 36px',
          border: '1.5px solid rgba(184, 149, 106, 0.3)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.05), 0 0 30px rgba(184, 149, 106, 0.08)',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#B8956A',
              fontWeight: 700,
              marginBottom: '10px',
            }}>
              <span>✦</span>
              <span>Client & Executive Access</span>
              <span>✦</span>
            </div>
            <h1 style={{
              fontSize: '30px',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: '#1D1D1F',
              margin: 0,
            }}>
              Maison Sign In
            </h1>
          </div>

          {/* Quick Demo Credentials Bar */}
          <div style={{
            background: 'var(--color-cream, #FDFCFA)',
            border: '1px solid rgba(184, 149, 106, 0.25)',
            borderRadius: '18px',
            padding: '16px',
            marginBottom: '26px',
          }}>
            <div style={{ fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B8956A', fontWeight: 700, marginBottom: '10px' }}>
              One-Click Executive & Demo Sign-In
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@example.com', 'password123', '/admin/dashboard')}
                style={{
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #1D1D1F 0%, #000000 100%)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(184, 149, 106, 0.4)',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <FiShield style={{ color: '#B8956A' }} />
                <span>Atelier Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('john@example.com', 'password123', '/profile')}
                style={{
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: '#FFFFFF',
                  color: '#1D1D1F',
                  border: '1px solid rgba(184, 149, 106, 0.35)',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
              >
                <FiUserCheck style={{ color: '#B8956A' }} />
                <span>VIP Client</span>
              </button>
            </div>
          </div>

          {error && <div style={{ marginBottom: '20px' }}><Message variant="danger">{error}</Message></div>}
          {loading && <div style={{ textAlign: 'center', marginBottom: '20px' }}><Loader /></div>}

          <form onSubmit={submitHandler}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '8px',
                color: '#6E6E73',
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    border: '1.5px solid rgba(184, 149, 106, 0.3)',
                    background: '#FAF8F5',
                    fontSize: '14px',
                    color: '#1D1D1F',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '26px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#6E6E73',
                }}>
                  Password
                </label>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  border: '1.5px solid rgba(184, 149, 106, 0.3)',
                  background: '#FAF8F5',
                  fontSize: '14px',
                  color: '#1D1D1F',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '999px',
                background: '#1D1D1F',
                color: '#FFFFFF',
                border: '1px solid rgba(184, 149, 106, 0.4)',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#B8956A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#1D1D1F';
              }}
            >
              <span>Authenticate</span>
              <FiArrowRight />
            </button>
          </form>

          <div style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            textAlign: 'center',
            fontSize: '13px',
            color: '#6E6E73',
          }}>
            New to Ediot Breeze?{' '}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : '/register'}
              style={{ color: '#B8956A', fontWeight: 700, textDecoration: 'none' }}
            >
              Create a VIP Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
