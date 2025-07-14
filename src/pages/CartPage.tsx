import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Trash, Plus, Minus, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';

const CartPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, loading } = useCart();
  
  const currentLanguage = i18n.language;
  
  // Calculate subtotal, tax, and total
  const subtotal = getCartTotal();
  const shipping = subtotal > 10000 ? 0 : 500;
  const tax = Math.round(subtotal * 0.13); // 13% VAT in Nepal
  const total = subtotal + shipping + tax;

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    await updateQuantity(productId, quantity);
  };

  const handleRemoveFromCart = async (productId: string) => {
    await removeFromCart(productId);
  };
  
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <ShoppingCart className="h-16 w-16 mx-auto mb-6 text-muted" />
          <h1 className="text-2xl font-bold mb-4">{t('cart.empty_cart')}</h1>
          <p className="text-muted mb-8">{t('cart.empty_cart_message', 'Your shopping cart is empty. Start shopping to add items to your cart.')}</p>
          <Link to="/products" className="btn btn-primary">
            {t('cart.continue_shopping')}
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">{t('cart.your_cart')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              {cartItems.map((item) => {
                // Display title based on language
                const displayTitle = currentLanguage === 'np' && item.product.titleNp 
                  ? item.product.titleNp 
                  : item.product.title;
                
                return (
                  <div 
                    key={item.productId}
                    className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b border-gray-200 dark:border-gray-700 last:border-none"
                  >
                    <div className="w-full sm:w-24 h-24 mb-4 sm:mb-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                      <img 
                        src={item.product.images[0]} 
                        alt={displayTitle}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <div className="flex-1 sm:ml-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <Link 
                            to={`/products/${item.productId}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {displayTitle}
                          </Link>
                          <p className="text-sm text-muted mt-1">
                            {item.product.brand} | {item.product.specifications?.storage || '-'}
                          </p>
                        </div>
                        
                        <div className="mt-2 sm:mt-0 sm:text-right">
                          <p className="font-semibold text-primary">
                            रु{formatPrice((item.product.discountPrice || item.product.price) * item.quantity)}
                          </p>
                          {item.product.discountPrice && (
                            <p className="text-sm text-muted line-through">
                              रु{formatPrice(item.product.price * item.quantity)}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4">
                        <div className="flex items-center mb-3 sm:mb-0">
                          <span className="mr-2 text-sm">{t('cart.quantity')}:</span>
                          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded">
                            <button 
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                              className="px-2 py-1 text-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1 || loading}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 py-1">{item.quantity}</span>
                            <button 
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                              className="px-2 py-1 text-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity >= item.product.stockQuantity || loading}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => handleRemoveFromCart(item.productId)}
                          className="flex items-center text-sm text-red-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={loading}
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          {t('cart.remove')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="bg-surface p-6">
              <Link 
                to="/products"
                className="flex items-center text-sm text-primary font-medium hover:text-primary-dark"
              >
                <ChevronRight className="h-4 w-4 mr-1 transform rotate-180" />
                {t('cart.continue_shopping')}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden sticky top-24">
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4">{t('checkout.order_summary')}</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted">{t('cart.subtotal')}</span>
                  <span>रु{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">{t('cart.shipping')}</span>
                  {shipping === 0 ? (
                    <span className="text-success">{t('cart.free')}</span>
                  ) : (
                    <span>रु{formatPrice(shipping)}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">{t('cart.tax')} (13%)</span>
                  <span>रु{formatPrice(tax)}</span>
                </div>
                
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-4"></div>
                
                <div className="flex justify-between font-bold">
                  <span>{t('cart.total')}</span>
                  <span className="text-primary">रु{formatPrice(total)}</span>
                </div>
              </div>
              
              <Link to="/checkout" className="btn btn-primary w-full py-3">
                {t('cart.proceed_to_checkout')}
              </Link>
              
              <p className="text-xs text-muted text-center mt-4">
                {t('cart.secure_checkout', 'Secure checkout with eSewa, Khalti, and COD')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;