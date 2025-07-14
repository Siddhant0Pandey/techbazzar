import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const currentLanguage = i18n.language;
  
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const displayTitle = currentLanguage === 'np' && product.titleNp 
    ? product.titleNp 
    : product.title;

  const calculateDiscount = () => {
    if (product.discountPrice) {
      const discount = Math.round(((product.price - product.discountPrice) / product.price) * 100);
      return `-${discount}%`;
    }
    return null;
  };

  const discountLabel = calculateDiscount();

  return (
    <div className="group relative rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
      {discountLabel && (
        <div className="absolute top-2 left-2 z-10 bg-secondary text-white text-xs font-medium px-2 py-1 rounded">
          {discountLabel}
        </div>
      )}
      
      {product.isNew && (
        <div className="absolute top-2 right-2 z-10 bg-accent text-white text-xs font-medium px-2 py-1 rounded">
          {t('products.new', 'New')}
        </div>
      )}
      
      <Link to={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={displayTitle}
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
          
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
          
          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-white hover:bg-primary hover:text-white transition-colors"
              aria-label={t('products.add_to_wishlist', 'Add to wishlist')}
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="mb-1">
            <span className="text-xs font-medium text-muted">{product.brand}</span>
          </div>
          
          <h3 className="text-sm font-medium mb-2 line-clamp-2 h-10">{displayTitle}</h3>
          
          <div className="flex items-baseline mb-2">
            <span className="text-primary font-semibold">
              रु{formatPrice(product.discountPrice || product.price)}
            </span>
            
            {product.discountPrice && (
              <span className="ml-2 text-sm text-muted line-through">
                रु{formatPrice(product.price)}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating) 
                        ? 'text-yellow-500' 
                        : 'text-gray-300'
                    }`}
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-1 text-xs text-muted">({product.reviewCount})</span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="p-2 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={t('products.add_to_cart')}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
          
          {!product.inStock && (
            <p className="text-error text-xs font-medium mt-2">{t('products.out_of_stock')}</p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;