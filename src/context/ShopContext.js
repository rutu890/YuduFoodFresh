import React, { createContext, useContext, useMemo, useState } from 'react';

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState(['r1', 'r2']);
  const [orders, setOrders] = useState([
    { id: 'YD-20481', restaurant: 'Spice Garden', items: ['Chicken Dum Biryani', 'Paneer Tikka'], total: 649, status: 'On Delivery', date: 'Today, 7:18 PM' },
    { id: 'YD-20376', restaurant: 'Dosa Corner', items: ['Ghee Podi Dosa', 'Filter Coffee'], total: 318, status: 'Delivered', date: 'Yesterday, 8:05 PM' },
    { id: 'YD-20291', restaurant: 'Pizza Planet', items: ['Margherita Pizza'], total: 449, status: 'Cancelled', date: 'Nov 18, 9:40 PM' },
  ]);
  const [activeOrder, setActiveOrder] = useState(null);

  const addToCart = (item) => {
    setCart(current => {
      const key = `${item.id}-${item.portion || 'Regular'}-${(item.extras || []).join(',')}`;
      const found = current.find(row => row.key === key);
      if (found) return current.map(row => row.key === key ? { ...row, quantity: row.quantity + 1 } : row);
      return [...current, { ...item, key, quantity: 1 }];
    });
  };
  const changeQuantity = (key, delta) => setCart(current =>
    current.map(row => row.key === key ? { ...row, quantity: row.quantity + delta } : row).filter(row => row.quantity > 0)
  );
  const removeFromCart = key => setCart(current => current.filter(row => row.key !== key));
  const toggleFavorite = id => setFavorites(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]);
  const placeOrder = (paymentMethod, address) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = cart.length ? 100 : 0;
    const order = {
      id: `YD-${Math.floor(20000 + Math.random() * 70000)}`,
      restaurant: cart[0]?.restaurant || 'YUDU Food',
      items: cart.map(item => `${item.quantity} × ${item.name}`),
      total: Math.max(0, subtotal + 25 + 43 - discount),
      status: 'On Delivery',
      date: 'Just now',
      paymentMethod,
      address,
    };
    setOrders(current => [order, ...current]);
    setActiveOrder(order);
    setCart([]);
    return order;
  };

  const value = useMemo(() => ({
    cart, favorites, orders, activeOrder, addToCart, changeQuantity,
    removeFromCart, toggleFavorite, placeOrder, setActiveOrder,
  }), [cart, favorites, orders, activeOrder]);
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const value = useContext(ShopContext);
  if (!value) throw new Error('useShop must be used inside ShopProvider');
  return value;
}
