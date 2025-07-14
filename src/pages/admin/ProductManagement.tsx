import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { allProducts } from '../../data/mockData';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';

const ProductManagement: React.FC = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const categories = [...new Set(products.map(p => p.category))];
  
  // Filter products based on search and category with useMemo for performance
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = searchQuery === '' || 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);
  
  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };
  
  const handleDeleteProduct = (productId: string) => {
    if (confirm(t('admin.confirm_delete_product', 'Are you sure you want to delete this product?'))) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };
  
  const handleBulkDelete = () => {
    if (confirm(t('admin.confirm_bulk_delete', 'Are you sure you want to delete selected products?'))) {
      setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
    }
  };
  
  const getStockStatus = (product: Product) => {
    if (!product.inStock) return { status: 'out_of_stock', color: 'text-red-600', icon: XCircle };
    if (product.stockQuantity <= 5) return { status: 'low_stock', color: 'text-yellow-600', icon: AlertTriangle };
    return { status: 'in_stock', color: 'text-green-600', icon: CheckCircle };
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('admin.product_management', 'Product Management')}</h1>
          <p className="text-muted mt-1">Manage your product inventory and details</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn bg-primary hover:bg-primary-dark text-white flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t('admin.add_product', 'Add Product')}
        </button>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                placeholder={t('admin.search_products', 'Search products...')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">{t('admin.all_categories', 'All Categories')}</option>
              {categories.map(category => (
                <option key={category} value={category} className="capitalize">
                  {category}
                </option>
              ))}
            </select>
            
            {selectedProducts.length > 0 && (
              <button 
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                {t('admin.delete_selected', 'Delete Selected')} ({selectedProducts.length})
              </button>
            )}
          </div>
        </div>
        
        {/* Results count */}
        <div className="mt-4 text-sm text-muted">
          {t('admin.showing_products', 'Showing {{count}} products', { count: filteredProducts.length })} of {products.length} total
        </div>
      </div>
      
      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  {t('admin.product', 'Product')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  {t('admin.category', 'Category')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  {t('admin.price', 'Price')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  {t('admin.stock', 'Stock')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  {t('admin.status', 'Status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  {t('admin.actions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                const StatusIcon = stockStatus.icon;
                
                return (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img 
                          src={product.images[0]} 
                          alt={product.title}
                          className="w-12 h-12 rounded-lg object-cover mr-4 bg-gray-100 dark:bg-gray-700"
                        />
                        <div>
                          <p className="font-medium text-foreground">{product.title}</p>
                          <p className="text-sm text-muted">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-foreground">{product.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">रु{formatPrice(product.discountPrice || product.price)}</p>
                        {product.discountPrice && (
                          <p className="text-sm text-muted line-through">रु{formatPrice(product.price)}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${stockStatus.color}`}>{product.stockQuantity}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <StatusIcon className={`h-4 w-4 mr-2 ${stockStatus.color}`} />
                        <span className={`text-sm ${stockStatus.color}`}>
                          {t(`admin.${stockStatus.status}`, stockStatus.status.replace('_', ' '))}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted mb-4" />
            <p className="text-muted">{t('admin.no_products_found', 'No products found')}</p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-2 text-primary hover:text-primary-dark text-sm"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              {t('admin.previous', 'Previous')}
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              {t('admin.next', 'Next')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;