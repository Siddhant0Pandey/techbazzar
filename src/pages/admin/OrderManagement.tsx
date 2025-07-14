import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Truck, 
  Package,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled';
  paymentMethod: string;
  shippingAddress: string;
  orderDate: string;
  trackingNumber?: string;
}

const OrderManagement: React.FC = () => {
  const { t } = useTranslation();
  
  // Mock orders data
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      customer: {
        name: 'Ram Sharma',
        email: 'ram@example.com',
        phone: '9841234567'
      },
      items: [
        { name: 'iPhone 15 Pro', quantity: 1, price: 169999 }
      ],
      total: 169999,
      status: 'pending',
      paymentMethod: 'Cash on Delivery',
      shippingAddress: 'Kathmandu, Nepal',
      orderDate: '2024-01-15'
    },
    {
      id: 'ORD-002',
      customer: {
        name: 'Sita Poudel',
        email: 'sita@example.com',
        phone: '9851234567'
      },
      items: [
        { name: 'MacBook Air M2', quantity: 1, price: 190000 }
      ],
      total: 190000,
      status: 'processing',
      paymentMethod: 'eSewa',
      shippingAddress: 'Pokhara, Nepal',
      orderDate: '2024-01-14',
      trackingNumber: 'TRK123456'
    },
    {
      id: 'ORD-003',
      customer: {
        name: 'Hari Thapa',
        email: 'hari@example.com',
        phone: '9861234567'
      },
      items: [
        { name: 'Sony WH-1000XM5', quantity: 2, price: 59999 }
      ],
      total: 119998,
      status: 'shipped',
      paymentMethod: 'Khalti',
      shippingAddress: 'Chitwan, Nepal',
      orderDate: '2024-01-13',
      trackingNumber: 'TRK789012'
    },
    {
      id: 'ORD-004',
      customer: {
        name: 'Maya Gurung',
        email: 'maya@example.com',
        phone: '9871234567'
      },
      items: [
        { name: 'Dell XPS 15', quantity: 1, price: 210000 }
      ],
      total: 210000,
      status: 'delivered',
      paymentMethod: 'Bank Transfer',
      shippingAddress: 'Lalitpur, Nepal',
      orderDate: '2024-01-12',
      trackingNumber: 'TRK345678'
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'canceled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'processing': return AlertCircle;
      case 'shipped': return Truck;
      case 'delivered': return CheckCircle;
      case 'canceled': return XCircle;
      default: return Package;
    }
  };
  
  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };
  
  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('admin.order_management', 'Order Management')}</h1>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('admin.search_orders', 'Search orders...')}
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
            <option value="pending">{t('admin.pending', 'Pending')}</option>
            <option value="processing">{t('admin.processing', 'Processing')}</option>
            <option value="shipped">{t('admin.shipped', 'Shipped')}</option>
            <option value="delivered">{t('admin.delivered', 'Delivered')}</option>
            <option value="canceled">{t('admin.canceled', 'Canceled')}</option>
          </select>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('admin.order_id', 'Order ID')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('admin.customer', 'Customer')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('admin.total', 'Total')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('admin.status', 'Status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('admin.date', 'Date')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('admin.actions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                
                return (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        {order.trackingNumber && (
                          <p className="text-sm text-muted">Track: {order.trackingNumber}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-sm text-muted">{order.customer.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">रु{formatPrice(order.total)}</p>
                      <p className="text-sm text-muted">{order.paymentMethod}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <StatusIcon className={`h-4 w-4 mr-2 ${getStatusColor(order.status).split(' ')[0]}`} />
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm">{new Date(order.orderDate).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => viewOrderDetails(order)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                          className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="canceled">Canceled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">{t('admin.no_orders_found', 'No orders found')}</p>
          </div>
        )}
      </div>
      
      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{t('admin.order_details', 'Order Details')} - {selectedOrder.id}</h2>
                <button 
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">{t('admin.customer_information', 'Customer Information')}</h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p><strong>{t('admin.name', 'Name')}:</strong> {selectedOrder.customer.name}</p>
                  <p><strong>{t('admin.email', 'Email')}:</strong> {selectedOrder.customer.email}</p>
                  <p><strong>{t('admin.phone', 'Phone')}:</strong> {selectedOrder.customer.phone}</p>
                  <p><strong>{t('admin.address', 'Address')}:</strong> {selectedOrder.shippingAddress}</p>
                </div>
              </div>
              
              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold mb-3">{t('admin.order_items', 'Order Items')}</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted">{t('admin.quantity', 'Quantity')}: {item.quantity}</p>
                      </div>
                      <p className="font-medium">रु{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-3">{t('admin.order_summary', 'Order Summary')}</h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>{t('admin.subtotal', 'Subtotal')}:</span>
                    <span>रु{formatPrice(selectedOrder.total)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>{t('admin.shipping', 'Shipping')}:</span>
                    <span>रु0</span>
                  </div>
                  <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                    <div className="flex justify-between items-center font-bold">
                      <span>{t('admin.total', 'Total')}:</span>
                      <span>रु{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">{t('admin.payment_method', 'Payment Method')}</h4>
                  <p className="text-muted">{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{t('admin.order_status', 'Order Status')}</h4>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;