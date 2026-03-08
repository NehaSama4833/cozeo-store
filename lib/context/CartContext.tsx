'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CartItem, CartContextType } from '@/lib/types';

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'cozeo-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error parsing cart:', error);
        }
      }
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const generateItemId = (productId: string, size: string, color: string) => {
    return `${productId}-${size}-${color}`;
  };

  const addItem = useCallback((newItem: Omit<CartItem, 'id'>) => {
    const itemId = generateItemId(newItem.product_id, newItem.size, newItem.color);
    
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === itemId);
      
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      
      return [...currentItems, { ...newItem, id: itemId }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
