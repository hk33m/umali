'use client';

import { useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

const CART_STORAGE_KEY = 'waraq_cart';

export function useCart() {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.items.find((cartItem) => cartItem.id === item.id);

      let newItems: CartItem[];
      if (existingItem) {
        newItems = prevCart.items.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        newItems = [...prevCart.items, { ...item, quantity }];
      }

      const newTotal = newItems.reduce((sum, cartItem) => sum + cartItem.price * cartItem.quantity, 0);
      return { items: newItems, total: newTotal };
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter((item) => item.id !== itemId);
      const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { items: newItems, total: newTotal };
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { items: newItems, total: newTotal };
    });
  };

  const clearCart = () => {
    setCart({ items: [], total: 0 });
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isLoaded,
  };
}
