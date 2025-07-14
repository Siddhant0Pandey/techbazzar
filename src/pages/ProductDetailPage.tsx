import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, Truck, Shield, Package, ChevronRight, Minus, Plus, Heart, ShoppingCart } from 'lucide-react';
import { allProducts } from '../data/mockData';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import ProductGrid from '../components/product/ProductGrid';
import { formatPrice } from '../utils/formatters';
import toast from 'react-hot-toast';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { addToCart, loading } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  const currentLanguage = i18n.language;
  
  // Get product and related products
  useEffect(() => {
    if (id) {
      const foundProduct = allProducts.find(p => p.id === id) || null;
      setProduct(foundProduct);
      
      if (foundProduct) {
        // Find related products in the same category
        const related = allProducts
          .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
    }
  }, [id]);
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl text-muted">{t('products.product_not_found', 'Product not found')}</p>
        <Link to="/products" className="mt-4 btn btn-primary inline-block">
          {t('products.browse_products', 'Browse products')}
        </Link>
      </div>
    );
  }
  
  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(product.stockQuantity, quantity + value));
    setQuantity(newQuantity);
  };
  
  const handleAddToCart = async () => {
    await addToCart(product, quantity);
    // Toast notification is already handled in the addToCart function
  };
  
  const handleBuyNow = async () => {
    await addToCart(product, quantity);
    // Navigate to checkout
    window.location.href = '/checkout';
  };
  
  // Display title and description based on language
  const displayTitle = currentLanguage === 'np' && product.titleNp ? product.titleNp : product.title;
  const displayDescription = currentLanguage === 'np' && product.descriptionNp ? product.descriptionNp : product.description;
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center mb-6 text-sm">
        <Link to="/" className="text-muted hover:text-primary">{t('common.home')}</Link>
        <ChevronRight className="mx-2 h-4 w-4 text-muted" />
        <Link to="/products" className="text-muted hover:text-primary">{t('common.products')}</Link>
        <ChevronRight className="mx-2 h-4 w-4 text-muted" />
        <span className="text-foreground">{displayTitle}</span>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Images */}
          <div>
            <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
              <img 
                src={product.images[activeImageIndex]}
                alt={displayTitle}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button 
                  key={index} 
                  className={`aspect-square overflow-hidden rounded border-2 ${
                    activeImageIndex === index 
                      ? 'border-primary' 
                      : 'border-transparent'
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img 
                    src={image}
                    alt={`${displayTitle} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-2xl font-bold mb-2">{displayTitle}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) 
                        ? 'text-yellow-500 fill-yellow-500' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-muted">
                {product.rating} ({product.reviewCount} {t('products.reviews').toLowerCase()})
              </span>
            </div>
            
            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-primary">
                  रु{formatPrice(product.discountPrice || product.price)}
                </span>
                
                {product.discountPrice && (
                  <>
                    <span className="ml-2 text-lg text-muted line-through">
                      रु{formatPrice(product.price)}
                    </span>
                    <span className="ml-2 bg-secondary text-white text-xs px-2 py-1 rounded">
                      {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              
              <p className="mt-2 text-sm text-success">
                {product.inStock 
                  ? `${t('products.in_stock')} (${product.stockQuantity} ${t('cart.quantity').toLowerCase()})` 
                  : t('products.out_of_stock')}
              </p>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-foreground mb-4">{displayDescription}</p>
              
              <div className="grid grid-cols-1 gap-2 mb-4">
                <div className="flex items-center text-sm">
                  <span className="font-medium mr-2">{t('products.brand')}:</span>
                  <span>{product.brand}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium mr-2">{t('products.category')}:</span>
                  <span className="capitalize">{product.category}</span>
                </div>
              </div>
            </div>
            
            {product.inStock && (
              <>
                <div className="mb-6">
                  <div className="flex items-center">
                    <span className="mr-4 text-sm font-medium">{t('cart.quantity')}:</span>
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded">
                      <button 
                        onClick={() => handleQuantityChange(-1)}
                        className="px-3 py-1 border-r border-gray-300 dark:border-gray-600 text-foreground hover:bg-gray-100 dark:hover:bg-gray-700"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-1">{quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(1)}
                        className="px-3 py-1 border-l border-gray-300 dark:border-gray-600 text-foreground hover:bg-gray-100 dark:hover:bg-gray-700"
                        disabled={quantity >= product.stockQuantity}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <button 
                    onClick={handleAddToCart}
                    disabled={loading || !product?.inStock}
                    className="btn btn-primary py-3 flex-1 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="mr-2 w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ShoppingCart className="mr-2 h-5 w-5" />
                    )}
                    {loading ? t('common.loading', 'Loading...') : t('products.add_to_cart')}
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    disabled={loading || !product?.inStock}
                    className="btn btn-secondary py-3 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? t('common.loading', 'Loading...') : t('products.buy_now')}
                  </button>
                  <button 
                    className="btn btn-outline p-3 hidden sm:inline-flex"
                    aria-label={t('products.add_to_wishlist', 'Add to wishlist')}
                  >
                    <Heart className="h-5 w-5" />
                  </button>
                </div>
              </>
            )}
            
            <div className="mt-8 space-y-4">
              <div className="flex items-start">
                <Truck className="h-5 w-5 text-muted mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">{t('products.free_delivery', 'Free Delivery')}</p>
                  <p className="text-sm text-muted">{t('products.free_delivery_desc', 'For orders above रु10,000')}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Package className="h-5 w-5 text-muted mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">{t('products.return_policy', 'Easy Returns')}</p>
                  <p className="text-sm text-muted">{t('products.return_policy_desc', '7 days return policy')}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-muted mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">{t('products.warranty', 'Warranty')}</p>
                  <p className="text-sm text-muted">{t('products.warranty_desc', '1 year warranty')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Tabs */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="flex overflow-x-auto">
            <button
              className={`px-6 py-3 font-medium text-sm border-b-2 ${
                activeTab === 'description' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-muted hover:text-foreground'
              } transition-colors`}
              onClick={() => setActiveTab('description')}
            >
              {t('products.description')}
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm border-b-2 ${
                activeTab === 'specifications' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-muted hover:text-foreground'
              } transition-colors`}
              onClick={() => setActiveTab('specifications')}
            >
              {t('products.specifications')}
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm border-b-2 ${
                activeTab === 'reviews' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-muted hover:text-foreground'
              } transition-colors`}
              onClick={() => setActiveTab('reviews')}
            >
              {t('products.reviews')} ({product.reviewCount})
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose dark:prose-invert max-w-none">
                <p>{displayDescription}</p>
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {Object.entries(product.specifications || {}).map(([key, value]) => (
                      <tr key={key}>
                        <td className="py-3 text-sm font-medium text-foreground capitalize w-1/3">{key}</td>
                        <td className="py-3 text-sm text-muted">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold">{product.rating.toFixed(1)}</h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating) 
                              ? 'text-yellow-500 fill-yellow-500' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted mt-1">{product.reviewCount} {t('products.reviews').toLowerCase()}</p>
                  </div>
                  
                  <div className="flex-1">
                    <button className="btn btn-primary">
                      {t('products.write_review', 'Write a review')}
                    </button>
                  </div>
                </div>
                
                <p className="text-muted italic text-center py-8">
                  {t('products.reviews_coming_soon', 'Customer reviews will be displayed here.')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-6">{t('products.related_products')}</h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;