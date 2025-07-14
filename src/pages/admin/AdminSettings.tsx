import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Save, 
  Upload, 
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Truck,
  Shield,
  Bell
} from 'lucide-react';

const AdminSettings: React.FC = () => {
  const { t } = useTranslation();
  
  const [settings, setSettings] = useState({
    // Store Information
    storeName: 'CraftWorks',
    storeDescription: "Nepal's leading online store for tools and furniture",
    storeEmail: 'info@craftworks.com.np',
    storePhone: '+977 01-4567890',
    storeAddress: 'Newroad, Kathmandu, Nepal',
    
    // Business Settings
    currency: 'NPR',
    taxRate: 13,
    freeShippingThreshold: 10000,
    
    // Payment Settings
    enableCOD: true,
    enableEsewa: true,
    enableKhalti: true,
    enableBankTransfer: true,
    
    // Shipping Settings
    standardShippingCost: 500,
    expressShippingCost: 1000,
    shippingDays: '3-7',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    lowStockNotifications: true,
    
    // SEO Settings
    metaTitle: 'CraftWorks - Nepal\'s Premium Tool & Furniture Store',
    metaDescription: 'Shop quality woodworking tools, furniture, and workshop equipment with fast delivery across Nepal.',
    metaKeywords: 'tools, furniture, woodworking, workshop, Nepal, online shopping'
  });
  
  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSave = () => {
    // Here you would save settings to your backend
    console.log('Saving settings:', settings);
    alert(t('admin.settings_saved', 'Settings saved successfully!'));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('admin.settings', 'Settings')}</h1>
        <button 
          onClick={handleSave}
          className="btn btn-primary flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {t('admin.save_settings', 'Save Settings')}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t('admin.store_information', 'Store Information')}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('admin.store_name', 'Store Name')}</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => handleInputChange('storeName', e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">{t('admin.store_description', 'Store Description')}</label>
              <textarea
                value={settings.storeDescription}
                onChange={(e) => handleInputChange('storeDescription', e.target.value)}
                rows={3}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">{t('admin.store_email', 'Store Email')}</label>
              <input
                type="email"
                value={settings.storeEmail}
                onChange={(e) => handleInputChange('storeEmail', e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">{t('admin.store_phone', 'Store Phone')}</label>
              <input
                type="tel"
                value={settings.storePhone}
                onChange={(e) => handleInputChange('storePhone', e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">{t('admin.store_address', 'Store Address')}</label>
              <textarea
                value={settings.storeAddress}
                onChange={(e) => handleInputChange('storeAddress', e.target.value)}
                rows={2}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
              />
            </div>
          </div>
        </div>
        
        {/* Business Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {t('admin.business_settings', 'Business Settings')}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('admin.currency', 'Currency')}</label>
              <select
                value={settings.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
              >
                <option value="NPR">Nepalese Rupee (NPR)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">{t('admin.tax_rate', 'Tax Rate')} (%)</label>
              <input
                type="number"
                value={settings.taxRate}
                onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value))}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">{t('admin.free_shipping_threshold', 'Free Shipping Threshold')}</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => handleInputChange('freeShippingThreshold', parseFloat(e.target.value))}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
              />
            </div>
          </div>
        </div>
        
        {/* Payment Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {t('admin.payment_settings', 'Payment Settings')}
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>{t('admin.cash_on_delivery', 'Cash on Delivery')}</span>
              <input
                type="checkbox"
                checked={settings.enableCOD}
                onChange={(e) => handleInputChange('enableCOD', e.target.checked)}
                className="rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span>eSewa</span>
              <input
                type="checkbox"
                checked={settings.enableEsewa}
                onChange={(e) => handleInputChange('enableEsewa', e.target.checked)}
                className="rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span>Khalti</span>
              <input
                type="checkbox"
                checked={settings.enableKhalti}
                onChange={(e) => handleInputChange('enableKhalti', e.target.checked)}
                className="rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span>{t('admin.bank_transfer', 'Bank Transfer')}</span>
              <input
                type="checkbox"
                checked={settings.enableBankTransfer}
                onChange={(e) => handleInputChange('enableBankTransfer', e.target.checked)}
                className="rounded"
              />
            </div>
          </div>
        </div>
        
        {/* Shipping Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5" />
            {t('admin.shipping_settings', 'Shipping Settings')}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('admin.standard_shipping_cost', 'Standard Shipping Cost')}</label>
              <input
                type="number"
                value={settings.standardShippingCost}
                onChange={(e) => handleInputChange('standardShippingCost', parseFloat(e.target.value))}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">{t('admin.express_shipping_cost', 'Express Shipping Cost')}</label>
              <input
                type="number"
                value={settings.expressShippingCost}
                onChange={(e) => handleInputChange('expressShippingCost', parseFloat(e.target.value))}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">{t('admin.delivery_time', 'Delivery Time (days)')}</label>
              <input
                type="text"
                value={settings.shippingDays}
                onChange={(e) => handleInputChange('shippingDays', e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
              />
            </div>
          </div>
        </div>
        
        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t('admin.notification_settings', 'Notification Settings')}
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>{t('admin.email_notifications', 'Email Notifications')}</span>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                className="rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span>{t('admin.sms_notifications', 'SMS Notifications')}</span>
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                className="rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span>{t('admin.order_notifications', 'Order Notifications')}</span>
              <input
                type="checkbox"
                checked={settings.orderNotifications}
                onChange={(e) => handleInputChange('orderNotifications', e.target.checked)}
                className="rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span>{t('admin.low_stock_notifications', 'Low Stock Notifications')}</span>
              <input
                type="checkbox"
                checked={settings.lowStockNotifications}
                onChange={(e) => handleInputChange('lowStockNotifications', e.target.checked)}
                className="rounded"
              />
            </div>
          </div>
        </div>
        
        {/* SEO Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t('admin.seo_settings', 'SEO Settings')}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('admin.meta_title', 'Meta Title')}</label>
              <input
                type="text"
                value={settings.metaTitle}
                onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">{t('admin.meta_description', 'Meta Description')}</label>
              <textarea
                value={settings.metaDescription}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                rows={3}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">{t('admin.meta_keywords', 'Meta Keywords')}</label>
              <input
                type="text"
                value={settings.metaKeywords}
                onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;