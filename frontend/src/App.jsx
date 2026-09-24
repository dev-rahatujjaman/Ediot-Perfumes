import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useLenis } from './hooks/useLenis';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProductListPage from './pages/admin/ProductListPage';
import ProductEditPage from './pages/admin/ProductEditPage';
import OrderListPage from './pages/admin/OrderListPage';
import UserListPage from './pages/admin/UserListPage';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  // Initialize Lenis smooth scrolling
  useLenis();

  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search/:keyword" element={<HomePage />} />
          <Route path="/page/:pageNumber" element={<HomePage />} />
          <Route path="/search/:keyword/page/:pageNumber" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Private Routes */}
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/shipping" element={<PrivateRoute><ShippingPage /></PrivateRoute>} />
          <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
          <Route path="/placeorder" element={<PrivateRoute><PlaceOrderPage /></PrivateRoute>} />
          <Route path="/order/:id" element={<PrivateRoute><OrderPage /></PrivateRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminRoute><DashboardPage /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><ProductListPage /></AdminRoute>} />
          <Route path="/admin/product/:id/edit" element={<AdminRoute><ProductEditPage /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><OrderListPage /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><UserListPage /></AdminRoute>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
