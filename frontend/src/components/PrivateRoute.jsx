import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const { userInfo, user } = useSelector((state) => state.auth || {});
  const currentUser = userInfo || user;

  return currentUser ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
