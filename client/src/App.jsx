import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Bag from './pages/Bag';
import Wishlist from './pages/Wishlist';
import Auth from './pages/Auth';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import Orders from './pages/Orders';
import OrderSuccess from './pages/OrderSuccess';
import Info from './pages/Info';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import { ToastProvider } from './context/ToastContext';

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname, search]);
  return null;
}
function Layout() {
  return <><ScrollToTop /><Header /><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/shop" element={<Shop />} />
    <Route path="/product/:slug" element={<ProductDetail />} />
    <Route path="/bag" element={<Bag />} />
    <Route path="/wishlist" element={<Wishlist />} />
    <Route path="/login" element={<Auth mode="login" />} />
    <Route path="/register" element={<Auth mode="register" />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/account" element={<Account />} />
    <Route path="/orders" element={<Orders />} />
    <Route path="/order-success/:id" element={<OrderSuccess />} />
    <Route path="/faq" element={<Info />} />
    <Route path="/privacy" element={<Info />} />
    <Route path="/terms" element={<Info />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes><Footer /></>;
}
export default function App() {
  return <BrowserRouter><ToastProvider><AuthProvider><ShopProvider><Layout /></ShopProvider></AuthProvider></ToastProvider></BrowserRouter>;
}
