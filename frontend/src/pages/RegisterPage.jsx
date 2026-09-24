import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiArrowRight } from 'react-icons/fi';
import { authService } from '../services/authService';
import {
  registerRequest,
  registerSuccess,
  registerFail,
} from '../store/slices/authSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, userInfo } = useSelector((state) => state.auth);

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      dispatch(registerRequest());
      const data = await authService.register(name, email, password);
      dispatch(registerSuccess(data));
      toast.success('Registration successful!');
    } catch (err) {
      const msg =
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
      dispatch(registerFail(msg));
      toast.error(msg);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '140px',
      paddingBottom: '100px',
      background: 'var(--color-cream)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className="container" style={{ maxWidth: '480px', width: '100%' }}>
        <div style={{
          background: 'var(--color-warm-white)',
          borderRadius: '24px',
          padding: '48px 40px',
          border: '0.5px solid rgba(0, 0, 0, 0.04)',
          boxShadow: '0 8px 32px var(--color-soft-shadow)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              fontWeight: 600,
              marginBottom: '12px',
            }}>
              Join The Club
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 600 }}>Create Account</h2>
          </div>

          {error && <div style={{ marginBottom: '20px' }}><Message variant="error">{error}</Message></div>}
          {loading && <div style={{ textAlign: 'center', marginBottom: '20px' }}><Loader /></div>}

          <form onSubmit={submitHandler}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                marginBottom: '8px',
                color: 'var(--color-charcoal)',
              }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                marginBottom: '8px',
                color: 'var(--color-charcoal)',
              }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                marginBottom: '8px',
                color: 'var(--color-charcoal)',
              }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                marginBottom: '8px',
                color: 'var(--color-charcoal)',
              }}>
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              disabled={loading}
              style={{ width: '100%', padding: '14px', fontSize: '16px' }}
            >
              Create Account <FiArrowRight />
            </button>
          </form>

          <div style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            textAlign: 'center',
            fontSize: '14px',
            color: 'var(--color-grey)',
          }}>
            Already have an account?{' '}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : '/login'}
              style={{ color: 'var(--color-gold)', fontWeight: 600 }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
