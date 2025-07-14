import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BarChart3, 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  Eye,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  
  // Mock data for dashboard
  const stats = {
    totalRevenue: 2450000,
    totalOrders: 1234,
    totalProducts: 156,
    totalCustomers: 892,
    pendingOrders: 23,
    lowStockProducts: 8,
    revenueGrowth: 12.5,
    ordersGrowth: -3.2,
    productsGrowth: 8.1,
    customersGrowth: 15.3
  };
  
  const recentOrders = [
    { id: 'ORD-001', customer: 'Ram Sharma', amount: 45000, status: 'pending', date: '2024-01-15' },
    { id: 'ORD-002', customer: 'Sita Poudel', amount: 125000, status: 'processing', date: '2024-01-15' },
    { id: 'ORD-003', customer: 'Hari Thapa', amount: 89000, status: 'shipped', date: '2024-01-14' },
    { id: 'ORD-004', customer: 'Maya Gurung', amount: 67000, status: 'delivered', date: '2024-01-14' },
    { id: 'ORD-005', customer: 'Krishna Rai', amount: 156000, status: 'pending', date: '2024-01-13' }
  ];
  
  const topProducts = [
    { name: 'iPhone 15 Pro', sales: 45, revenue: 7650000 },
    { name: 'Samsung Galaxy S23', sales: 38, revenue: 6004000 },
    { name: 'MacBook Air M2', sales: 22, revenue: 4180000 },
    { name: 'Sony WH-1000XM5', sales: 67, revenue: 4019330 },
    { name: 'Dell XPS 15', sales: 15, revenue: 3150000 }
  ];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'processing': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'shipped': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'delivered': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'canceled': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };
  
  const StatCard = ({ title, value, growth, icon: Icon, color }: any) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        {growth >= 0 ? (
          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
        )}
        <span className={growth >= 0 ? 'text-green-500' : 'text-red-500'}>
          {Math.abs(growth)}%
        </span>
        <span className="text-muted ml-1">{t('admin.from_last_month', 'from last month')}</span>
      </div>
    </div>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('admin.dashboard', 'Dashboard')}</h1>
          <p className="text-muted mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('admin.total_revenue', 'Total Revenue')}
          value={`रु${formatPrice(stats.totalRevenue)}`}
          growth={stats.revenueGrowth}
          icon={DollarSign}
          color="bg-green-500"
        />
        
        <StatCard
          title={t('admin.total_orders', 'Total Orders')}
          value={stats.totalOrders}
          growth={stats.ordersGrowth}
          icon={ShoppingCart}
          color="bg-blue-500"
        />
        
        <StatCard
          title={t('admin.total_products', 'Total Products')}
          value={stats.totalProducts}
          growth={stats.productsGrowth}
          icon={Package}
          color="bg-purple-500"
        />
        
        <StatCard
          title={t('admin.total_customers', 'Total Customers')}
          value={stats.totalCustomers}
          growth={stats.customersGrowth}
          icon={Users}
          color="bg-orange-500"
        />
      </div>
      
      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                {stats.pendingOrders} {t('admin.pending_orders', 'Pending Orders')}
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                Orders waiting for processing
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                {stats.lowStockProducts} {t('admin.low_stock', 'Low Stock Items')}
              </h3>
              <p className="text-red-700 dark:text-red-300 text-sm">
                Products need restocking
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-foreground">{t('admin.recent_orders', 'Recent Orders')}</h2>
              <button className="text-primary hover:text-primary-dark text-sm font-medium">
                {t('admin.view_all', 'View All')}
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{order.id}</p>
                      <p className="text-sm text-muted">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">रु{formatPrice(order.amount)}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-foreground">{t('admin.top_products', 'Top Products')}</h2>
              <button className="text-primary hover:text-primary-dark text-sm font-medium">
                {t('admin.view_all', 'View All')}
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-muted">{product.sales} {t('admin.sales', 'sales')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">रु{formatPrice(product.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">{t('admin.quick_actions', 'Quick Actions')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
            <Package className="h-8 w-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-foreground">{t('admin.add_product', 'Add Product')}</p>
          </button>
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
            <ShoppingCart className="h-8 w-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-foreground">{t('admin.manage_orders', 'Manage Orders')}</p>
          </button>
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
            <Users className="h-8 w-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-foreground">{t('admin.view_customers', 'View Customers')}</p>
          </button>
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
            <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-foreground">{t('admin.analytics', 'Analytics')}</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;