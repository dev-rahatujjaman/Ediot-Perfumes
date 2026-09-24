import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
  const { userInfo, user } = useSelector((state) => state.auth || {});
  const currentUser = userInfo || user;
  const isAdmin = currentUser?.isAdmin || currentUser?.data?.isAdmin;

  return isAdmin ? children : <Navigate to="/login" replace />;
};

export default AdminRoute;
