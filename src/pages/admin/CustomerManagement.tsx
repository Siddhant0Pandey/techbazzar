import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Filter, 
  Eye, 
  Mail, 
  Phone, 
  MapPin,
  ShoppingBag,
  Calendar,
  Users
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'active' | 'inactive';
}

const CustomerManagement: React.FC = () => {
  const { t } = useTranslation();
  
  // Mock customers data
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 'CUST-001',
      name: 'Ram Sharma',
      email: 'ram@example.com',
      phone: '9841234567',
      address: 'Kathmandu, Nepal',
      joinDate: '2023-06-15',
      totalOrders: 5,
      totalSpent: 450000,
      lastOrderDate: '2024-01-15',
      status: 'active'
    },
    {
      id: 'CUST-002',
      name: 'Sita Poudel',
      email: 'sita@example.com',
      phone: '9851234567',
      address: 'Pokhara, Nepal',
      joinDate: '2023-08-22',
      totalOrders: 3,
      totalSpent: 320000,
      lastOrderDate: '2024-01-10',
      status: 'active'
    },
    {
      id: 'CUST-003',
      name: 'Hari Thapa',
      email: 'hari@example.com',
      phone: '9861234567',
      address: 'Chitwan, Nepal',
      joinDate: '2023-03-10',
      totalOrders: 8,
      totalSpent: 680000,
      lastOrderDate: '2024-01-08',
      status: 'active'
    },
    {
      id: 'CUST-004',
      name: 'Maya Gurung',
      email: 'maya@example.com',
      phone: '9871234567',
      address: 'Lalitpur, Nepal',
      joinDate: '2023-11-05',
      totalOrders: 2,
      totalSpent: 180000,
      lastOrderDate: '2023-12-20',
      status: 'inactive'
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.phone.includes(searchQuery);
    const matchesStatus = !statusFilter || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const viewCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };
  
  const sendEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };
  
  const callCustomer = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('admin.customer_management', 'Customer Management')}</h1>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">{t('admin.total_customers', 'Total Customers')}</p>
              <p className="text-2xl font-bold">{customers.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">{t('admin.active_customers', 'Active Customers')}</p>
              <p className="text-2xl font-bold">{customers.filter(c => c.status === 'active').length}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">{t('admin.avg_order_value', 'Avg Order Value')}</p>
              <p className="text-2xl font-bold">रु{formatPrice(Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.totalOrders, 0)))}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">{t('admin.total_revenue', 'Total Revenue')}</p>
              <p className="text-2xl font-bold">रु{formatPrice(customers.reduce((sum, c) => sum + c.totalSpent, 0))}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('admin.search_customers', 'Search customers...')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">{t('admin.all_statuses', 'All Statuses')}</option>
            <option value="active">{t('admin.active', 'Active')}</option>
            <option value="inactive">{t('admin.inactive', 'Inactive')}</option>
          </select>
        </div>
      </div>
      
      {/* Customers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('admin.customer', 'Customer')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('admin.contact', 'Contact')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('admin.orders', 'Orders')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('admin.total_spent', 'Total Spent')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('admin.status', 'Status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('admin.actions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted">{customer.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm">{customer.email}</p>
                      <p className="text-sm text-muted">{customer.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{customer.totalOrders}</p>
                      <p className="text-sm text-muted">
                        {t('admin.last_order', 'Last order')}: {new Date(customer.lastOrderDate).toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">रु{formatPrice(customer.totalSpent)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => viewCustomerDetails(customer)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title={t('admin.view_details', 'View Details')}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => sendEmail(customer.email)}
                        className="p-1 text-green-600 hover:text-green-800"
                        title={t('admin.send_email', 'Send Email')}
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => callCustomer(customer.phone)}
                        className="p-1 text-purple-600 hover:text-purple-800"
                        title={t('admin.call_customer', 'Call Customer')}
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">{t('admin.no_customers_found', 'No customers found')}</p>
          </div>
        )}
      </div>
      
      {/* Customer Details Modal */}
      {showCustomerModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{t('admin.customer_details', 'Customer Details')}</h2>
                <button 
                  onClick={() => setShowCustomerModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t('admin.personal_information', 'Personal Information')}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{selectedCustomer.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{selectedCustomer.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{t('admin.joined', 'Joined')}: {new Date(selectedCustomer.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t('admin.order_statistics', 'Order Statistics')}</h3>
                  <div className="space-y-3">
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      <p className="text-sm text-muted">{t('admin.total_orders', 'Total Orders')}</p>
                      <p className="text-xl font-bold">{selectedCustomer.totalOrders}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      <p className="text-sm text-muted">{t('admin.total_spent', 'Total Spent')}</p>
                      <p className="text-xl font-bold">रु{formatPrice(selectedCustomer.totalSpent)}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      <p className="text-sm text-muted">{t('admin.avg_order_value', 'Average Order Value')}</p>
                      <p className="text-xl font-bold">रु{formatPrice(Math.round(selectedCustomer.totalSpent / selectedCustomer.totalOrders))}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      <p className="text-sm text-muted">{t('admin.last_order', 'Last Order')}</p>
                      <p className="text-lg font-medium">{new Date(selectedCustomer.lastOrderDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  onClick={() => sendEmail(selectedCustomer.email)}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  {t('admin.send_email', 'Send Email')}
                </button>
                <button 
                  onClick={() => callCustomer(selectedCustomer.phone)}
                  className="btn btn-outline flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  {t('admin.call_customer', 'Call Customer')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;