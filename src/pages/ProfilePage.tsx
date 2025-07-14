import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { User, Settings, ShoppingBag, MapPin, Heart, LogOut, Edit, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  
  const handleLogout = () => {
    logout();
    toast.success(t('auth.logout_success', 'You have been logged out'));
    navigate('/');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(editForm);
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleEditCancel = () => {
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
    setIsEditing(false);
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
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl text-muted mb-4">
          {t('profile.not_logged_in', 'You are not logged in')}
        </p>
        <button 
          onClick={() => navigate('/login')}
          className="btn btn-primary"
        >
          {t('common.login')}
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">{t('profile.my_account', 'My Account')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Profile Navigation */}
        <div className="md:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-primary text-white">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-lg font-bold">
                    {getUserInitials(user.name)}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white text-primary rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
                <div className="ml-3">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm opacity-90">{user.email}</p>
                </div>
              </div>
            </div>
            
            <nav className="p-3">
              <button 
                className={`w-full flex items-center px-3 py-2 rounded-md mb-1 transition-colors ${
                  activeTab === 'profile' 
                    ? 'bg-primary bg-opacity-10 text-primary' 
                    : 'text-foreground hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                <User className="h-5 w-5 mr-3" />
                {t('profile.my_profile')}
              </button>
              
              <button 
                className={`w-full flex items-center px-3 py-2 rounded-md mb-1 transition-colors ${
                  activeTab === 'orders' 
                    ? 'bg-primary bg-opacity-10 text-primary' 
                    : 'text-foreground hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('orders')}
              >
                <ShoppingBag className="h-5 w-5 mr-3" />
                {t('profile.my_orders')}
              </button>
              
              <button 
                className={`w-full flex items-center px-3 py-2 rounded-md mb-1 transition-colors ${
                  activeTab === 'addresses' 
                    ? 'bg-primary bg-opacity-10 text-primary' 
                    : 'text-foreground hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('addresses')}
              >
                <MapPin className="h-5 w-5 mr-3" />
                {t('profile.address_book')}
              </button>
              
              <button 
                className={`w-full flex items-center px-3 py-2 rounded-md mb-1 transition-colors ${
                  activeTab === 'wishlist' 
                    ? 'bg-primary bg-opacity-10 text-primary' 
                    : 'text-foreground hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('wishlist')}
              >
                <Heart className="h-5 w-5 mr-3" />
                {t('profile.wishlist')}
              </button>
              
              <button 
                className={`w-full flex items-center px-3 py-2 rounded-md mb-1 transition-colors ${
                  activeTab === 'settings' 
                    ? 'bg-primary bg-opacity-10 text-primary' 
                    : 'text-foreground hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="h-5 w-5 mr-3" />
                {t('profile.account_settings', 'Account Settings')}
              </button>
              
              <button 
                className="w-full flex items-center px-3 py-2 rounded-md mb-1 text-error hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-3" />
                {t('common.logout')}
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-9">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden p-6">
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">{t('profile.my_profile')}</h2>
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="btn btn-outline flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      {t('profile.edit_profile')}
                    </button>
                  )}
                </div>
                
                {isEditing ? (
                  <form onSubmit={handleEditSubmit} className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center mb-8">
                      <div className="mb-4 md:mb-0 md:mr-8 flex-shrink-0">
                        <div className="relative">
                          <div className="w-24 h-24 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-2xl font-bold text-primary">
                            {getUserInitials(editForm.name || 'U')}
                          </div>
                          <button 
                            type="button"
                            className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors"
                          >
                            <Camera className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex-grow space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">{t('auth.name')}</label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">{t('auth.email')}</label>
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">{t('auth.phone')}</label>
                          <input
                            type="tel"
                            value={editForm.phone}
                            onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
                            placeholder="98XXXXXXXX"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                      <button 
                        type="button" 
                        onClick={handleEditCancel}
                        className="btn btn-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row md:items-center mb-8">
                      <div className="mb-4 md:mb-0 md:mr-8 flex-shrink-0">
                        <div className="w-24 h-24 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-2xl font-bold text-primary">
                          {getUserInitials(user.name)}
                        </div>
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold">{user.name}</h3>
                        <p className="text-muted">{user.email}</p>
                        {user.phone && <p className="text-muted">{user.phone}</p>}
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <h3 className="text-lg font-semibold mb-4">{t('profile.account_info', 'Account Information')}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-muted mb-1">{t('auth.name')}</p>
                          <p className="font-medium">{user.name}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted mb-1">{t('auth.email')}</p>
                          <p className="font-medium">{user.email}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted mb-1">{t('auth.phone')}</p>
                          <p className="font-medium">{user.phone || '-'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted mb-1">{t('profile.member_since', 'Member Since')}</p>
                          <p className="font-medium">{new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-bold mb-6">{t('profile.my_orders')}</h2>
                
                {user.orders && user.orders.length > 0 ? (
                  <div>Orders list would go here</div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 mx-auto text-muted mb-4" />
                    <h3 className="text-lg font-medium mb-2">{t('profile.no_orders', 'No Orders Yet')}</h3>
                    <p className="text-muted mb-4">{t('profile.no_orders_message', "You haven't placed any orders yet.")}</p>
                    <button 
                      onClick={() => navigate('/products')}
                      className="btn btn-primary"
                    >
                      {t('cart.start_shopping', 'Start Shopping')}
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'addresses' && (
              <div>
                <h2 className="text-xl font-bold mb-6">{t('profile.address_book')}</h2>
                
                {user.addresses && user.addresses.length > 0 ? (
                  <div>Address list would go here</div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 mx-auto text-muted mb-4" />
                    <h3 className="text-lg font-medium mb-2">{t('profile.no_addresses', 'No Saved Addresses')}</h3>
                    <p className="text-muted mb-4">{t('profile.no_addresses_message', "You haven't saved any delivery addresses yet.")}</p>
                    <button className="btn btn-primary">
                      {t('profile.add_address')}
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-xl font-bold mb-6">{t('profile.wishlist')}</h2>
                
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 mx-auto text-muted mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t('profile.empty_wishlist', 'Your Wishlist is Empty')}</h3>
                  <p className="text-muted mb-4">{t('profile.empty_wishlist_message', 'Save your favorite items to your wishlist for later.')}</p>
                  <button 
                    onClick={() => navigate('/products')}
                    className="btn btn-primary"
                  >
                    {t('cart.start_shopping', 'Start Shopping')}
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-bold mb-6">{t('profile.account_settings', 'Account Settings')}</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">{t('profile.change_password', 'Change Password')}</h3>
                    <form className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('profile.current_password', 'Current Password')}</label>
                        <input 
                          type="password" 
                          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('profile.new_password', 'New Password')}</label>
                        <input 
                          type="password" 
                          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('auth.confirm_password')}</label>
                        <input 
                          type="password" 
                          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
                        />
                      </div>
                      
                      <button className="btn btn-primary">
                        {t('profile.update_password', 'Update Password')}
                      </button>
                    </form>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-medium mb-4 text-error">{t('profile.danger_zone', 'Danger Zone')}</h3>
                    <button className="btn border border-error text-error hover:bg-error hover:text-white">
                      {t('profile.delete_account', 'Delete Account')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;