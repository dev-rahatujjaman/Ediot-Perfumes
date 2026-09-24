import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { userService } from '../../services/userService';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import {
  FiUsers,
  FiTrash2,
  FiCheck,
  FiX,
  FiShield,
  FiMail,
  FiUserCheck,
  FiSearch,
  FiRefreshCw,
  FiUserPlus,
  FiAward
} from 'react-icons/fi';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL'); // ALL, ADMIN, VIP
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { userInfo, user } = useSelector((state) => state.auth || {});
  const currentUser = userInfo || user;
  const currentUserId = currentUser?._id || currentUser?.data?._id;

  const fetchUsers = async (showToast = false) => {
    try {
      if (showToast) setIsRefreshing(true);
      setLoading(true);
      const data = await userService.getUsers();
      const userArray = data?.data || (Array.isArray(data) ? data : []);
      setUsers(userArray);
      setLoading(false);
      if (showToast) {
        setIsRefreshing(false);
        toast.success('VIP Connoisseur directory updated from Atlas');
      }
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteHandler = async (id, name) => {
    if (id === currentUserId) {
      toast.error('You cannot revoke access for your currently logged-in account.');
      return;
    }

    if (window.confirm(`Are you sure you wish to revoke access for client account "${name || 'User'}"?`)) {
      try {
        await userService.deleteUser(id);
        toast.success('Client account revoked successfully');
        fetchUsers();
      } catch (err) {
        toast.error(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        );
      }
    }
  };

  const safeUsers = Array.isArray(users) ? users : [];

  // Summary Metrics
  const totalUsers = safeUsers.length;
  const adminCount = safeUsers.filter(u => u.isAdmin).length;
  const vipCount = totalUsers - adminCount;

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return safeUsers.filter(u => {
      const name = (u.name || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const id = (u._id || '').toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      const matchesQuery = !q || name.includes(q) || email.includes(q) || id.includes(q);
      if (!matchesQuery) return false;

      if (roleFilter === 'ADMIN') return u.isAdmin;
      if (roleFilter === 'VIP') return !u.isAdmin;

      return true;
    });
  }, [safeUsers, searchQuery, roleFilter]);

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '130px',
      paddingBottom: '120px',
      background: 'var(--color-cream, #FDFCFA)',
      color: '#1D1D1F',
    }}>
      <div className="container" style={{ maxWidth: '1340px', margin: '0 auto', padding: '0 24px' }}>

        {/* TOP BAR / NAVIGATION TABS */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '36px',
          paddingBottom: '24px',
          borderBottom: '1px solid rgba(184, 149, 106, 0.25)',
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#B8956A',
              fontWeight: 700,
              marginBottom: '6px',
            }}>
              <span>✦</span>
              <span>Maison Executive Control</span>
              <span>✦</span>
            </div>
            <h1 style={{
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              color: '#1D1D1F',
              margin: 0,
            }}>
              VIP Client Directory
            </h1>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#FFFFFF',
            padding: '6px',
            borderRadius: '999px',
            border: '1px solid rgba(184, 149, 106, 0.3)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
          }}>
            <Link
              to="/admin/dashboard"
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                background: 'transparent',
                color: '#6E6E73',
                textDecoration: 'none',
                fontSize: '12.5px',
                fontWeight: 600,
                transition: 'color 0.2s ease',
              }}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/products"
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                background: 'transparent',
                color: '#6E6E73',
                textDecoration: 'none',
                fontSize: '12.5px',
                fontWeight: 600,
                transition: 'color 0.2s ease',
              }}
            >
              Fragrances
            </Link>
            <Link
              to="/admin/orders"
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                background: 'transparent',
                color: '#6E6E73',
                textDecoration: 'none',
                fontSize: '12.5px',
                fontWeight: 600,
                transition: 'color 0.2s ease',
              }}
            >
              Orders
            </Link>
            <Link
              to="/admin/users"
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                background: '#1D1D1F',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontSize: '12.5px',
                fontWeight: 700,
                letterSpacing: '0.04em',
              }}
            >
              Clients ({safeUsers.length})
            </Link>
          </div>
        </div>

        {/* 1. DIRECTORY KPI CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '22px',
            border: '1.5px solid rgba(184, 149, 106, 0.3)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
          }}>
            <span style={{ fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B8956A', fontWeight: 700 }}>
              Registered Connoisseurs
            </span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#1D1D1F', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
              {totalUsers} Accounts
            </div>
            <div style={{ fontSize: '11.5px', color: '#6E6E73', marginTop: '4px' }}>
              VIP customers across global salons
            </div>
          </div>

          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '22px',
            border: '1px solid rgba(184, 149, 106, 0.25)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
          }}>
            <span style={{ fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B8956A', fontWeight: 700 }}>
              Atelier Administrators
            </span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#B8956A', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
              {adminCount} Admins
            </div>
            <div style={{ fontSize: '11.5px', color: '#6E6E73', marginTop: '4px' }}>
              Full access to formulation catalog & finances
            </div>
          </div>

          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '22px',
            border: '1px solid rgba(184, 149, 106, 0.25)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
          }}>
            <span style={{ fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B8956A', fontWeight: 700 }}>
              Private VIP Clients
            </span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#1D1D1F', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
              {vipCount} Clients
            </div>
            <div style={{ fontSize: '11.5px', color: '#6E6E73', marginTop: '4px' }}>
              Members with private allocation privileges
            </div>
          </div>
        </div>

        {/* 2. SEARCH & FILTER BAR */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}>
          {/* Search */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            border: '1.5px solid rgba(184, 149, 106, 0.35)',
            borderRadius: '999px',
            padding: '10px 18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}>
            <FiSearch style={{ color: '#B8956A', fontSize: '15px' }} />
            <input
              type="text"
              placeholder="Search by client name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '13px',
                color: '#1D1D1F',
                width: '280px',
              }}
            />
          </div>

          {/* Role Filter Tabs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#FFFFFF',
            padding: '5px',
            borderRadius: '999px',
            border: '1px solid rgba(184, 149, 106, 0.3)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}>
            {[
              { label: 'All Connoisseurs', value: 'ALL' },
              { label: 'Atelier Admins', value: 'ADMIN' },
              { label: 'VIP Clients', value: 'VIP' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setRoleFilter(tab.value)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '999px',
                  background: roleFilter === tab.value ? '#1D1D1F' : 'transparent',
                  color: roleFilter === tab.value ? '#FFFFFF' : '#6E6E73',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Refresh Action */}
          <button
            onClick={() => fetchUsers(true)}
            disabled={isRefreshing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '999px',
              background: '#FFFFFF',
              border: '1.5px solid rgba(184, 149, 106, 0.3)',
              color: '#1D1D1F',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <FiRefreshCw style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none', color: '#B8956A' }} />
            <span>Sync</span>
          </button>
        </div>

        {/* 3. USER DIRECTORY TABLE */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}><Loader /></div>
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <div style={{
            background: '#FFFFFF',
            borderRadius: '28px',
            border: '1.5px solid rgba(184, 149, 106, 0.3)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.04)',
            overflow: 'hidden',
          }}>
            {filteredUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6E6E73' }}>
                <p style={{ fontSize: '15px', fontWeight: 600 }}>No client accounts match your search.</p>
              </div>
            ) : (
              <div className="table-responsive-wrapper" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px', minWidth: '700px' }}>
                  <thead>
                    <tr style={{ background: 'rgba(184, 149, 106, 0.05)', borderBottom: '1.5px solid rgba(184, 149, 106, 0.25)', color: '#6E6E73' }}>
                      <th style={{ padding: '16px 20px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }}>Client ID</th>
                      <th style={{ padding: '16px 20px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }}>Connoisseur Name</th>
                      <th style={{ padding: '16px 20px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }}>Direct Contact</th>
                      <th style={{ padding: '16px 20px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }}>Executive Privilege</th>
                      <th style={{ padding: '16px 20px', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => {
                      const isSelf = user._id === currentUserId;
                      return (
                        <tr
                          key={user._id}
                          style={{
                            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                            transition: 'background 0.2s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(184, 149, 106, 0.03)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <td style={{ padding: '16px 20px', fontFamily: 'monospace', color: '#6E6E73', fontWeight: 600 }}>
                            #{user._id?.slice(-8).toUpperCase()}
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: 700, color: '#1D1D1F', fontSize: '14.5px' }}>{user.name}</span>
                              {isSelf && (
                                <span style={{
                                  fontSize: '10px',
                                  background: '#1D1D1F',
                                  color: '#FFFFFF',
                                  padding: '2px 8px',
                                  borderRadius: '999px',
                                  fontWeight: 700,
                                  letterSpacing: '0.04em',
                                }}>
                                  You
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            <a
                              href={`mailto:${user.email}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                color: '#B8956A',
                                textDecoration: 'none',
                                fontWeight: 600,
                                fontSize: '13px',
                              }}
                            >
                              <FiMail style={{ fontSize: '13px' }} />
                              <span>{user.email}</span>
                            </a>
                          </td>
                          <td style={{ padding: '16px 20px' }}>
                            {user.isAdmin ? (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '5px 12px',
                                borderRadius: '999px',
                                background: 'rgba(184, 149, 106, 0.15)',
                                color: '#B8956A',
                                fontSize: '11.5px',
                                fontWeight: 700,
                              }}>
                                <FiShield /> Atelier Admin
                              </span>
                            ) : (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '5px 12px',
                                borderRadius: '999px',
                                background: 'rgba(29, 29, 31, 0.05)',
                                color: '#6E6E73',
                                fontSize: '11.5px',
                                fontWeight: 600,
                              }}>
                                <FiUserCheck /> VIP Connoisseur
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                            {!isSelf ? (
                              <button
                                onClick={() => deleteHandler(user._id, user.name)}
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  background: 'rgba(217, 83, 79, 0.1)',
                                  border: '1px solid rgba(217, 83, 79, 0.2)',
                                  color: '#D9534F',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  fontSize: '13px',
                                  transition: 'all 0.2s ease',
                                }}
                                title="Revoke Connoisseur Access"
                              >
                                <FiTrash2 />
                              </button>
                            ) : (
                              <span style={{ fontSize: '11.5px', color: '#A1A1A6', fontStyle: 'italic', fontWeight: 600 }}>Active Session</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserListPage;
