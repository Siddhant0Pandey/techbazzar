import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ChevronLeft, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatters';
import { Address, PaymentMethod } from '../types';
import toast from 'react-hot-toast';

const provinces = [
  'Province 1', 
  'Madhesh Province', 
  'Bagmati Province', 
  'Gandaki Province', 
  'Lumbini Province', 
  'Karnali Province',
  'Sudurpashchim Province'
];

const paymentMethods: { id: PaymentMethod; name: string; logo?: string }[] = [
  { id: 'cash_on_delivery', name: 'Cash on Delivery' },
  { 
    id: 'esewa', 
    name: 'eSewa',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Esewa_logo.png'
  },
  { 
    id: 'khalti', 
    name: 'Khalti',
    logo: 'https://play-lh.googleusercontent.com/sLhRuUmFX6m4-3uS5lMlDzApUFLZK2C9U4VL6GzYtFSQJRJg5qe7mfPouOAM_pZzpg4'
  },
  { id: 'bank_transfer', name: 'Bank Transfer' },
  { id: 'card', name: 'Card Payment' }
];

const CheckoutPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  const [step, setStep] = useState<'address' | 'payment' | 'confirmation'>('address');
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('cash_on_delivery');
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Form state for new address
  const [addressForm, setAddressForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    province: '',
    district: '',
    municipality: '',
    ward: '',
    street: ''
  });
  
  const currentLanguage = i18n.language;
  
  // Calculate order summary
  const subtotal = getCartTotal();
  const shipping = subtotal > 10000 ? 0 : 500;
  const tax = Math.round(subtotal * 0.13); // 13% VAT in Nepal
  const total = subtotal + shipping + tax;
  
  // Handle address form change
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Validate address form
  const validateAddressForm = () => {
    const requiredFields = ['name', 'phone', 'province', 'district', 'municipality', 'ward', 'street'];
    return requiredFields.every(field => Boolean(addressForm[field as keyof typeof addressForm]));
  };
  
  // Handle address submission
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateAddressForm()) {
      // Create new address
      const newAddress: Address = {
        id: Math.random().toString(36).substring(2, 9),
        name: addressForm.name,
        phone: addressForm.phone,
        province: addressForm.province,
        district: addressForm.district,
        municipality: addressForm.municipality,
        ward: addressForm.ward,
        street: addressForm.street,
        isDefault: false
      };
      
      setSelectedAddress(newAddress);
      setStep('payment');
    } else {
      toast.error(t('checkout.fill_all_fields', 'Please fill all required fields'));
    }
  };
  
  // Handle payment method selection
  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedPayment(method);
  };
  
  // Handle payment submission
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirmation');
  };
  
  // Handle order placement
  const handlePlaceOrder = () => {
    // Here we would send the order to an API
    toast.success(t('checkout.order_placed', 'Order placed successfully!'));
    setFormSubmitted(true);
    clearCart();
    
    // In a real app, we would redirect to an order confirmation page
    // but for now, we'll just show a success message
  };
  
  // If no items in cart, redirect to products
  if (cartItems.length === 0 && !formSubmitted) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl text-muted mb-4">
          {t('cart.empty_cart')}
        </p>
        <Link to="/products" className="btn btn-primary">
          {t('cart.continue_shopping')}
        </Link>
      </div>
    );
  }
  
  // After successful order
  if (formSubmitted) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl mx-auto text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="w-16 h-16 mx-auto bg-success bg-opacity-20 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck className="h-8 w-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold mb-4">{t('checkout.order_confirmed', 'Order Confirmed!')}</h1>
          <p className="text-muted mb-6">
            {t('checkout.order_confirmation_message', 'Your order has been placed successfully. We have sent you an email with order details.')}
          </p>
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold mb-1">{t('checkout.order_id', 'Order ID')}</p>
            <p className="text-lg font-mono bg-surface p-2 rounded inline-block">#ORD-{Math.floor(Math.random() * 1000000)}</p>
          </div>
          <div className="flex justify-center gap-4">
            <Link to="/" className="btn btn-primary">
              {t('common.home')}
            </Link>
            <Link to="/products" className="btn btn-outline">
              {t('cart.continue_shopping')}
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">{t('common.checkout')}</h1>
        <Link 
          to="/cart"
          className="flex items-center text-sm text-primary font-medium hover:text-primary-dark"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {t('cart.return_to_cart', 'Return to Cart')}
        </Link>
      </div>
      
      {/* Checkout Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className={`flex items-center ${step === 'address' ? 'text-primary font-medium' : 'text-muted'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mr-2 ${step === 'address' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
            1
          </div>
          <span>{t('checkout.shipping_address')}</span>
        </div>
        <div className="w-16 h-px bg-gray-300 dark:bg-gray-700 mx-3"></div>
        <div className={`flex items-center ${step === 'payment' ? 'text-primary font-medium' : 'text-muted'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mr-2 ${step === 'payment' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
            2
          </div>
          <span>{t('checkout.payment_method')}</span>
        </div>
        <div className="w-16 h-px bg-gray-300 dark:bg-gray-700 mx-3"></div>
        <div className={`flex items-center ${step === 'confirmation' ? 'text-primary font-medium' : 'text-muted'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mr-2 ${step === 'confirmation' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
            3
          </div>
          <span>{t('checkout.confirmation')}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {/* Shipping Address Step */}
            {step === 'address' && (
              <form onSubmit={handleAddressSubmit} className="p-6">
                <h2 className="text-lg font-bold mb-4">{t('checkout.shipping_address')}</h2>
                
                {isAuthenticated && user?.addresses && user.addresses.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-3">{t('checkout.saved_addresses', 'Saved Addresses')}</h3>
                    <div className="space-y-3">
                      {user.addresses.map((address) => (
                        <div key={address.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-start">
                            <input 
                              type="radio" 
                              id={`address-${address.id}`}
                              name="savedAddress"
                              value={address.id}
                              className="mt-1"
                              checked={selectedAddress?.id === address.id}
                              onChange={() => setSelectedAddress(address)}
                            />
                            <label htmlFor={`address-${address.id}`} className="ml-3">
                              <p className="font-medium">{address.name}</p>
                              <p className="text-sm text-muted">{address.phone}</p>
                              <p className="text-sm text-muted mt-1">
                                {address.street}, {address.ward}, {address.municipality}, {address.district}, {address.province}
                              </p>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-3">
                    {user?.addresses && user.addresses.length > 0
                      ? t('checkout.add_new_address', 'Add a new address')
                      : t('checkout.enter_shipping_address', 'Enter shipping address')}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">{t('auth.name')} *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={addressForm.name}
                        onChange={handleAddressChange}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1">{t('auth.phone')} *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={addressForm.phone}
                        onChange={handleAddressChange}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
                        placeholder="98XXXXXXXX"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="province" className="block text-sm font-medium mb-1">{t('checkout.province', 'Province')} *</label>
                      <select
                        id="province"
                        name="province"
                        value={addressForm.province}
                        onChange={handleAddressChange}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
                        required
                      >
                        <option value="">{t('checkout.select_province', 'Select Province')}</option>
                        {provinces.map((province) => (
                          <option key={province} value={province}>{province}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="district" className="block text-sm font-medium mb-1">{t('checkout.district', 'District')} *</label>
                      <input
                        type="text"
                        id="district"
                        name="district"
                        value={addressForm.district}
                        onChange={handleAddressChange}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="municipality" className="block text-sm font-medium mb-1">{t('checkout.municipality', 'Municipality/VDC')} *</label>
                      <input
                        type="text"
                        id="municipality"
                        name="municipality"
                        value={addressForm.municipality}
                        onChange={handleAddressChange}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="ward" className="block text-sm font-medium mb-1">{t('checkout.ward', 'Ward No.')} *</label>
                      <input
                        type="text"
                        id="ward"
                        name="ward"
                        value={addressForm.ward}
                        onChange={handleAddressChange}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="street" className="block text-sm font-medium mb-1">{t('checkout.street_address', 'Street Address')} *</label>
                      <input
                        type="text"
                        id="street"
                        name="street"
                        value={addressForm.street}
                        onChange={handleAddressChange}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
                        placeholder="Street name, House no., Landmark"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {t('checkout.continue_to_payment', 'Continue to Payment')}
                  </button>
                </div>
              </form>
            )}
            
            {/* Payment Method Step */}
            {step === 'payment' && (
              <form onSubmit={handlePaymentSubmit} className="p-6">
                <div className="flex items-center mb-6">
                  <button
                    type="button"
                    onClick={() => setStep('address')}
                    className="text-sm text-primary font-medium hover:text-primary-dark flex items-center"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    {t('checkout.back', 'Back')}
                  </button>
                  <h2 className="text-lg font-bold ml-4">{t('checkout.payment_method')}</h2>
                </div>
                
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div 
                      key={method.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedPayment === method.id 
                          ? 'border-primary' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => handlePaymentSelect(method.id)}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id={`payment-${method.id}`}
                          name="paymentMethod"
                          checked={selectedPayment === method.id}
                          onChange={() => handlePaymentSelect(method.id)}
                          className="mr-3"
                        />
                        <label htmlFor={`payment-${method.id}`} className="flex items-center flex-grow cursor-pointer">
                          {method.logo ? (
                            <img 
                              src={method.logo} 
                              alt={method.name} 
                              className="h-6 mr-3" 
                            />
                          ) : (
                            <CreditCard className="h-5 w-5 mr-3 text-muted" />
                          )}
                          <span>{t(`checkout.${method.id}`, method.name)}</span>
                        </label>
                      </div>
                      
                      {selectedPayment === method.id && (
                        <div className="mt-3 pl-6">
                          {method.id === 'cash_on_delivery' && (
                            <p className="text-sm text-muted">{t('checkout.cod_info', 'Pay with cash upon delivery. Our delivery personnel will collect the payment.')}</p>
                          )}
                          {method.id === 'esewa' && (
                            <p className="text-sm text-muted">{t('checkout.esewa_info', 'You will be redirected to eSewa to complete your payment.')}</p>
                          )}
                          {method.id === 'khalti' && (
                            <p className="text-sm text-muted">{t('checkout.khalti_info', 'You will be redirected to Khalti to complete your payment.')}</p>
                          )}
                          {method.id === 'bank_transfer' && (
                            <div className="text-sm text-muted">
                              <p>{t('checkout.bank_info', 'Please transfer the total amount to the following bank account:')}</p>
                              <p className="mt-2">
                                <span className="font-medium">{t('checkout.bank_name', 'Bank Name')}:</span> Nepal Bank Ltd.<br />
                                <span className="font-medium">{t('checkout.account_name', 'Account Name')}:</span> TechBazaar Pvt. Ltd.<br />
                                <span className="font-medium">{t('checkout.account_number', 'Account Number')}:</span> 01234567890<br />
                              </p>
                            </div>
                          )}
                          {method.id === 'card' && (
                            <p className="text-sm text-muted">{t('checkout.card_info', 'You will be redirected to our secure payment gateway to enter your card details.')}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {t('checkout.review_order', 'Review Order')}
                  </button>
                </div>
              </form>
            )}
            
            {/* Confirmation Step */}
            {step === 'confirmation' && (
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <button
                    type="button"
                    onClick={() => setStep('payment')}
                    className="text-sm text-primary font-medium hover:text-primary-dark flex items-center"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    {t('checkout.back', 'Back')}
                  </button>
                  <h2 className="text-lg font-bold ml-4">{t('checkout.order_review', 'Order Review')}</h2>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-3">{t('checkout.shipping_address')}</h3>
                  {selectedAddress && (
                    <div className="bg-surface p-3 rounded">
                      <p className="font-medium">{selectedAddress.name}</p>
                      <p className="text-sm text-muted">{selectedAddress.phone}</p>
                      <p className="text-sm text-muted mt-1">
                        {selectedAddress.street}, {selectedAddress.ward}, {selectedAddress.municipality}, {selectedAddress.district}, {selectedAddress.province}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-3">{t('checkout.payment_method')}</h3>
                  <div className="bg-surface p-3 rounded">
                    <p>
                      {paymentMethods.find(method => method.id === selectedPayment)?.name}
                    </p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-3">{t('checkout.items', 'Items')}</h3>
                  <div className="bg-surface p-3 rounded">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {cartItems.map((item) => {
                        const displayTitle = currentLanguage === 'np' && item.product.titleNp 
                          ? item.product.titleNp 
                          : item.product.title;
                          
                        return (
                          <li key={item.productId} className="py-2 flex justify-between">
                            <div>
                              <p>{displayTitle} x {item.quantity}</p>
                              <p className="text-sm text-muted">{item.product.specifications.storage || ''}</p>
                            </div>
                            <p className="font-medium">
                              रु{formatPrice((item.product.discountPrice || item.product.price) * item.quantity)}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handlePlaceOrder}
                    className="btn btn-primary py-3 px-6"
                  >
                    {t('checkout.place_order')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden sticky top-24">
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4">{t('checkout.order_summary')}</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted">{t('cart.subtotal')}</span>
                  <span>रु{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">{t('cart.shipping')}</span>
                  {shipping === 0 ? (
                    <span className="text-success">{t('cart.free')}</span>
                  ) : (
                    <span>रु{formatPrice(shipping)}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">{t('cart.tax')} (13%)</span>
                  <span>रु{formatPrice(tax)}</span>
                </div>
                
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-4"></div>
                
                <div className="flex justify-between font-bold">
                  <span>{t('cart.total')}</span>
                  <span className="text-primary">रु{formatPrice(total)}</span>
                </div>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="flex">
                  <Truck className="h-5 w-5 text-muted mr-3 flex-shrink-0" />
                  <p className="text-muted">
                    {t('checkout.delivery_time', 'Delivery within 3-7 business days depending on your location')}
                  </p>
                </div>
                <div className="flex">
                  <ShieldCheck className="h-5 w-5 text-muted mr-3 flex-shrink-0" />
                  <p className="text-muted">
                    {t('checkout.secure_payment_info', 'All transactions are secure and encrypted')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;