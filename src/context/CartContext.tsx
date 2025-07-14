import React, { createContext, useState, useContext, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { toast } from 'react-hot-toast';
import { cartAPI } from '../lib/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number; 
  getCartCount: () => number;
  loading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load cart from database when user logs in
  const loadCart = async () => {
    if (!isAuthenticated || !user) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      
      if (response.success && response.data?.cart?.items) {
        // Transform API cart items to match frontend CartItem interface
        const transformedItems = response.data.cart.items.map((item: any) => ({
          id: item._id,
          productId: item.productId._id,
          product: item.productId,
          quantity: item.quantity,
          price: item.price
        }));
        setCartItems(transformedItems);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Load cart when authentication state changes
  useEffect(() => {
    loadCart();
  }, [isAuthenticated, user]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to add items to cart');
      return;
    }

    try {
      setLoading(true);
      const response = await cartAPI.addToCart(product._id, quantity);
      
      if (response.success) {
        await loadCart(); // Refresh cart from database
        toast.success(`Added ${product.name} to cart`);
      } else {
        toast.error(response.message || 'Failed to add item to cart');
      }
    } catch (error: any) {
      console.error('Add to cart error:', error);
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to modify cart');
      return;
    }

    try {
      setLoading(true);
      const response = await cartAPI.removeFromCart(productId);
      
      if (response.success) {
        await loadCart(); // Refresh cart from database
        toast.success('Item removed from cart');
      } else {
        toast.error(response.message || 'Failed to remove item from cart');
      }
    } catch (error: any) {
      console.error('Remove from cart error:', error);
      toast.error(error.response?.data?.message || 'Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to modify cart');
      return;
    }

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      setLoading(true);
      const response = await cartAPI.updateQuantity(productId, quantity);
      
      if (response.success) {
        await loadCart(); // Refresh cart from database
        toast.success('Cart updated');
      } else {
        toast.error(response.message || 'Failed to update quantity');
      }
    } catch (error: any) {
      console.error('Update quantity error:', error);
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to clear cart');
      return;
    }

    try {
      setLoading(true);
      const response = await cartAPI.clearCart();
      
      if (response.success) {
        setCartItems([]);
        toast.success('Cart cleared');
      } else {
        toast.error(response.message || 'Failed to clear cart');
      }
    } catch (error: any) {
      console.error('Clear cart error:', error);
      toast.error(error.response?.data?.message || 'Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.discountPrice || item.product.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const refreshCart = async () => {
    await loadCart();
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        getCartTotal,
        getCartCount,
        loading,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};