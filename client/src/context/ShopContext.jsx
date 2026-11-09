
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ShopContext = createContext(null);

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => read('guhasphere-cart', []));
  const [wishlist, setWishlist] = useState(() => read('guhasphere-wishlist', []));
  const [couponCode, setCouponCode] = useState(() => read('guhasphere-coupon', ''));

  // Calculate cart values BEFORE using them in effects
  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = cart.reduce(
    (sum, item) => sum + (Number(item?.product?.price) || 0) * item.quantity,
    0
  );

  const discount =
    couponCode === 'SPHERE10' && subtotal >= 999
      ? Math.round(subtotal * 0.10)
      : 0;

  // Persist shopping data
  useEffect(() => {
    localStorage.setItem('guhasphere-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('guhasphere-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('guhasphere-coupon', JSON.stringify(couponCode));
  }, [couponCode]);

  // Remove coupon when cart falls below minimum amount
  useEffect(() => {
    if (couponCode && subtotal < 999) {
      setCouponCode('');
    }
  }, [couponCode, subtotal]);

  const addToCart = (product, size = '', color = '') =>
    setCart((current) => {
      const key = `${product._id}-${size}-${color}`;
      const found = current.find((item) => item.key === key);

      if (found) {
        return current.map((item) =>
          item.key === key
            ? { ...item, quantity: Math.min(item.quantity + 1, 10) }
            : item
        );
      }

      return [
        ...current,
        {
          key,
          productId: product._id,
          product,
          size,
          color,
          quantity: 1,
        },
      ];
    });

  const updateQuantity = (key, quantity) =>
    setCart((current) =>
      current.map((item) =>
        item.key === key
          ? { ...item, quantity: Math.max(1, Math.min(10, quantity)) }
          : item
      )
    );

  const removeFromCart = (key) =>
    setCart((current) => current.filter((item) => item.key !== key));

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
  };

  const toggleWishlist = (product) =>
    setWishlist((current) =>
      current.some((item) => item._id === product._id)
        ? current.filter((item) => item._id !== product._id)
        : [...current, product]
    );

  const isWishlisted = (id) =>
    wishlist.some((item) => item._id === id);

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      couponCode,
      setCouponCode,
      cartCount,
      subtotal,
      discount,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
    }),
    [cart, wishlist, couponCode, cartCount, subtotal, discount]
  );

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);
