import React, { createContext, useState, useContext, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { toast } from 'react-hot-toast';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number; 
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
 const [cartItems, setCartItems] = useState<CartItem[]>(() => {
  try {
    const savedCart = localStorage.getItem('cart');
    const parsed = savedCart ? JSON.parse(savedCart) : [];
    
    if (Array.isArray(parsed)) {
      // Validate and clean cart items to ensure proper structure
      return parsed.filter(item => 
        item && 
        item.product && 
        item.productId && 
        typeof item.quantity === 'number'
      ).map(item => ({
        ...item,
        product: {
          ...item.product,
          specifications: item.product.specifications || {}
        }
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Failed to parse cart from localStorage', error);
    return [];
  }
});


  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === product.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        
        if (newQuantity > product.stockQuantity) {
          toast.error('Cannot add more than available stock');
          return prevItems;
        }
        
        toast.success('Item quantity updated in cart');
        return prevItems.map((item) => 
          item.productId === product.id 
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      
      // Ensure product has proper specifications structure
      const productWithSpecs = {
        ...product,
        specifications: product.specifications || {}
      };
      
      toast.success('Item added to cart');
      return [...prevItems, { productId: product.id, product: productWithSpecs, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      return removeFromCart(productId);
    }
    
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.productId === productId) {
          if (quantity > item.product.stockQuantity) {
            toast.error('Cannot add more than available stock');
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCartItems([]);
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

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        getCartTotal,
        getCartCount 
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