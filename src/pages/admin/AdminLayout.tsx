import React, { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Menu, 
  X,
  LogOut,
  Home,
  Bell,
  Search,
  User
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { isAdminAuthenticated, adminUser, adminLogout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Redirect to admin login if not authenticated
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  const navigation = [
    { name: t('admin.dashboard', 'Dashboard'), href: '/admin', icon: BarChart3 },
    { name: t('admin.products', 'Products'), href: '/admin/products', icon: Package },
    { name: t('admin.orders', 'Orders'), href: '/admin/orders', icon: ShoppingCart },
    { name: t('admin.customers', 'Customers'), href: '/admin/customers', icon: Users },
    { name: t('admin.settings', 'Settings'), href: '/admin/settings', icon: Settings },
  ];
  
  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };
  
  const handleLogout = () => {
    adminLogout();
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement global search functionality here
    console.log('Searching for:', searchQuery);
  };

  // Get admin initials for avatar
  const getAdminInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-primary" />
            <span className="ml-2 text-lg font-bold text-foreground">TechBazaar</span>
          </div>
          <button
            className="lg:hidden text-muted hover:text-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary text-white'
                      : 'text-foreground hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/"
              className="group flex items-center px-3 py-2 text-sm font-medium text-foreground rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Home className="mr-3 h-5 w-5" />
              {t('admin.back_to_store', 'Back to Store')}
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full group flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              {t('admin.logout', 'Logout')}
            </button>
          </div>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button
              className="lg:hidden text-muted hover:text-foreground"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:block">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
                    <input
                      type="text"
                      placeholder={t('admin.search', 'Search...')}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm w-64 focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>
              </div>
              
              {/* Notifications */}
              <button className="relative p-2 text-muted hover:text-foreground rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Admin profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {adminUser ? getAdminInitials(adminUser.name) : 'A'}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-foreground">{adminUser?.name}</p>
                  <p className="text-xs text-muted capitalize">{adminUser?.role.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Page content */}
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;