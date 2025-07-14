import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  Heart,
  Sun,
  Moon,
  ChevronDown,
  Globe,
  LogOut,
  Crown
} from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';

interface CategoryType {
  id: string;
  name: string;
  nameNp: string;
  icon: React.FC<{ className?: string }>;
}

interface HeaderProps {
  categories: CategoryType[];
}

const Header: React.FC<HeaderProps> = ({ categories }) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, signOut } = useAuth();
  const { getCartCount } = useCart();
  const { isActive, plan } = useSubscription();
  const navigate = useNavigate();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const cartCount = getCartCount();
  const currentLanguage = i18n.language;
  
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'np' : 'en';
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate('/');
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors duration-200">
      {/* Top Bar */}
      <div className="bg-primary px-4 py-1 text-white text-xs md:text-sm">
        <div className="container mx-auto flex justify-between items-center">
          <p className="hidden sm:block">
            {t('home.free_delivery', 'Free delivery on orders over रु10,000')}
          </p>
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleLanguage}
              className="flex items-center text-white hover:text-gray-200"
            >
              <Globe className="w-4 h-4 mr-1" />
              {currentLanguage === 'en' ? 'नेपाली' : 'English'}
            </button>
            <button 
              onClick={toggleTheme}
              className="flex items-center text-white hover:text-gray-200"
              aria-label={theme === 'dark' ? t('common.light_mode') : t('common.dark_mode')}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="container mx-auto py-4 px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <ShoppingCart className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold text-foreground">TechBazaar</span>
          </Link>
          
          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative w-full">
                <input
                  type="text"
                  className="w-full py-2 px-4 pr-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-foreground"
                  placeholder={t('common.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <Search className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </form>
          </div>
          
          {/* Navigation Icons */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            {/* Subscription Status */}
            {isAuthenticated && isActive && plan && (
              <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full">
                <Crown className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-primary">{plan.name}</span>
              </div>
            )}
            
            <Link to="/wishlist" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <Heart className="h-5 w-5 text-foreground" />
            </Link>
            
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <ShoppingCart className="h-5 w-5 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <div className="relative">
              <button 
                className="flex items-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                {isAuthenticated && user ? (
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {getUserInitials(user.user_metadata?.name || user.email || 'U')}
                  </div>
                ) : (
                  <User className="h-5 w-5 text-foreground" />
                )}
              </button>
              
              {/* User Menu Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-foreground">{user?.user_metadata?.name || user?.email}</p>
                        <p className="text-xs text-muted">{user?.email}</p>
                      </div>
                      <Link 
                        to="/profile"
                        className="block px-4 py-2 text-sm text-foreground hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        {t('common.profile')}
                      </Link>
                      <Link 
                        to="/subscription"
                        className="block px-4 py-2 text-sm text-foreground hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Subscription
                      </Link>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={handleLogout}
                      >
                        <span className="flex items-center">
                          <LogOut className="h-4 w-4 mr-2" />
                          {t('common.logout')}
                        </span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/login"
                        className="block px-4 py-2 text-sm text-foreground hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        {t('common.login')}
                      </Link>
                      <Link 
                        to="/register"
                        className="block px-4 py-2 text-sm text-foreground hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        {t('common.register')}
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-foreground" />
              ) : (
                <Menu className="h-5 w-5 text-foreground" />
              )}
            </button>
          </div>
        </div>
        
        {/* Navigation Links - Desktop */}
        <nav className="hidden md:flex items-center space-x-6 mt-4">
          <Link to="/" className="text-foreground font-medium hover:text-primary">
            {t('common.home')}
          </Link>
          
          <div className="relative">
            <button 
              className="flex items-center text-foreground font-medium hover:text-primary"
              onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
            >
              {t('common.products')}
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            
            {categoryMenuOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                {categories.map((category) => (
                  <Link 
                    key={category.id}
                    to={`/products?category=${category.id}`}
                    className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setCategoryMenuOpen(false)}
                  >
                    <category.icon className="h-4 w-4 mr-2" />
                    {currentLanguage === 'en' ? category.name : category.nameNp}
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          <Link to="/products" className="text-foreground font-medium hover:text-primary">
            {t('New Arrivals')}
          </Link>
          
          <Link to="/products?filter=deals" className="text-foreground font-medium hover:text-primary">
            {t('home.special_offers')}
          </Link>
          
          <Link to="/subscription" className="text-foreground font-medium hover:text-primary">
            Subscription
          </Link>
        </nav>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto py-4 px-4">
            {/* Search Bar - Mobile */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative w-full">
                <input
                  type="text"
                  className="w-full py-2 px-4 pr-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-foreground"
                  placeholder={t('common.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <Search className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </form>
            
            {/* Mobile Nav Links */}
            <div className="space-y-3">
              <Link 
                to="/" 
                className="block py-2 text-foreground font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('common.home')}
              </Link>
              
              {categories.map((category) => (
                <Link 
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="flex items-center py-2 text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <category.icon className="h-4 w-4 mr-2" />
                  {currentLanguage === 'en' ? category.name : category.nameNp}
                </Link>
              ))}
              
              <Link 
                to="/products" 
                className="block py-2 text-foreground font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('products.new_arrivals')}
              </Link>
              
              <Link 
                to="/products?filter=deals" 
                className="block py-2 text-foreground font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('home.special_offers')}
              </Link>
              
              <Link 
                to="/subscription" 
                className="block py-2 text-foreground font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Subscription
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;