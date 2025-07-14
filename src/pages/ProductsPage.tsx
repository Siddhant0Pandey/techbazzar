import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import { productAPI } from '../lib/api';
import { Product } from '../types';
import { categories } from '../components/layout/Layout';

const ProductsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const currentLanguage = i18n.language;
  
  // Extract search parameters
  const categoryParam = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  const filterType = searchParams.get('filter');
  const sortBy = searchParams.get('sort') || 'newest';
  
  // Price range filter
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 300000
  });
  
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  
  // Fetch products from database
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params: any = {};
      
      if (categoryParam) params.category = categoryParam;
      if (searchQuery) params.search = searchQuery;
      if (filterType === 'featured') params.featured = 'true';
      if (filterType === 'new') params.new = 'true';
      if (priceRange.min > 0) params.minPrice = priceRange.min;
      if (priceRange.max < 300000) params.maxPrice = priceRange.max;
      
      // Set sort parameter
      let sortParam = '-createdAt'; // default newest first
      switch (sortBy) {
        case 'price-low':
          sortParam = 'price';
          break;
        case 'price-high':
          sortParam = '-price';
          break;
        case 'rating':
          sortParam = '-rating';
          break;
        case 'name':
          sortParam = 'title';
          break;
        case 'newest':
        default:
          sortParam = '-createdAt';
          break;
      }
      params.sort = sortParam;
      
      const response = await productAPI.getAll(params);
      
      if (response.success && response.data) {
        let fetchedProducts = response.data.products || response.data;
        
        // Apply client-side brand filtering if needed
        if (selectedBrands.length > 0) {
          fetchedProducts = fetchedProducts.filter((product: Product) => 
            selectedBrands.includes(product.brand)
          );
        }
        
        setProducts(fetchedProducts);
      } else {
        console.error('Failed to fetch products:', response.message);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, [categoryParam, searchQuery, filterType, sortBy, priceRange.min, priceRange.max, selectedBrands]);
  
  // Get all available brands from products
  const brands = [...new Set(products.map(product => product.brand.toLowerCase()))];
  
  // Update sort parameter
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', e.target.value);
    setSearchParams(newParams);
  };
  
  // Update price range
  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  // Toggle brand selection
  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => {
      if (prev.includes(brand)) {
        return prev.filter(b => b !== brand);
      } else {
        return [...prev, brand];
      }
    });
  };
  
  // Clear all filters
  const clearFilters = () => {
    setPriceRange({ min: 0, max: 300000 });
    setSelectedBrands([]);
    
    const newParams = new URLSearchParams();
    if (searchQuery) newParams.set('search', searchQuery);
    setSearchParams(newParams);
  };
  
  // Get current category
  const currentCategory = categoryParam
    ? categories.find(cat => cat.id === categoryParam)
    : null;
  
  // Generate page title
  let pageTitle = t('common.products');
  
  if (searchQuery) {
    pageTitle = `${t('products.search_results', 'Search Results')}: "${searchQuery}"`;
  } else if (currentCategory) {
    pageTitle = currentLanguage === 'en' ? currentCategory.name : currentCategory.nameNp;
  } else if (filterType) {
    switch (filterType) {
      case 'featured':
        pageTitle = t('home.featured_products');
        break;
      case 'new':
        pageTitle = t('home.new_arrivals');
        break;
      case 'deals':
        pageTitle = t('home.special_offers');
        break;
      case 'bestsellers':
        pageTitle = t('home.bestsellers');
        break;
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">{pageTitle}</h1>
        {searchQuery && (
          <p className="text-muted mt-2">
            {products.length} {t('products.items_found', 'items found')}
          </p>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <button 
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="w-full btn-outline flex items-center justify-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {filtersOpen ? t('products.hide_filters', 'Hide Filters') : t('products.show_filters', 'Show Filters')}
          </button>
        </div>
        
        {/* Filters Sidebar */}
        <div className={`md:w-1/4 lg:w-1/5 ${filtersOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                {t('products.filter')}
              </h2>
              <button 
                onClick={clearFilters}
                className="text-sm text-primary hover:text-primary-dark"
              >
                {t('products.clear_filters')}
              </button>
            </div>
            
            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-md font-medium mb-3">{t('products.price_range')}</h3>
              <div className="flex gap-2 mb-3">
                <div className="flex-1">
                  <label className="text-xs text-muted mb-1 block">Min</label>
                  <input 
                    type="number" 
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-800"
                    value={priceRange.min}
                    onChange={(e) => handlePriceChange('min', parseInt(e.target.value))}
                    min="0"
                    step="1000"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-muted mb-1 block">Max</label>
                  <input 
                    type="number" 
                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-800"
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
                    min="0"
                    step="5000"
                  />
                </div>
              </div>
              <input 
                type="range" 
                min="0" 
                max="300000" 
                step="5000"
                value={priceRange.max}
                onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            {/* Brands */}
            <div className="mb-6">
              <h3 className="text-md font-medium mb-3">{t('products.brands', 'Brands')}</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="rounded text-primary"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                    />
                    <span className="ml-2 text-sm capitalize">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Availability */}
            <div className="mb-6">
              <h3 className="text-md font-medium mb-3">{t('products.availability', 'Availability')}</h3>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="rounded text-primary"
                />
                <span className="ml-2 text-sm">{t('products.in_stock')}</span>
              </label>
            </div>
            
            {/* On mobile, add close button */}
            <div className="md:hidden mt-4">
              <button 
                onClick={() => setFiltersOpen(false)}
                className="w-full btn-outline flex items-center justify-center gap-2"
              >
                <X className="h-4 w-4" />
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
        
        {/* Products */}
        <div className="md:w-3/4 lg:w-4/5">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-sm text-muted">
                  {t('products.showing', 'Showing')} {products.length} {t('products.of', 'of')} {products.length} {t('products.items')}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="sort" className="text-sm">{t('products.sort_by')}:</label>
                <div className="relative">
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={handleSortChange}
                    className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-foreground rounded pl-3 pr-8 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="newest">{t('products.newest')}</option>
                    <option value="price_low_high">{t('products.price_low_high')}</option>
                    <option value="price_high_low">{t('products.price_high_low')}</option>
                    <option value="popular">{t('products.popular')}</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <p className="text-lg text-muted mb-4">{t('products.loading_products', 'Loading products...')}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <p className="text-lg text-muted mb-4">{t('products.no_products_found', 'No products found')}</p>
              <button 
                onClick={clearFilters}
                className="btn btn-primary"
              >
                {t('products.clear_filters')}
              </button>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;