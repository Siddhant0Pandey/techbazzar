// API client utility for making HTTP requests to the backend
const API_BASE_URL = '/api'; // Default to relative API path for proxy

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint);
  }

  // POST request
  async post<T>(endpoint: string, data?: any, customOptions?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...customOptions,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new ApiClient();

// Auth API calls
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  
  register: (name: string, email: string, password: string) =>
    apiClient.post('/auth/register', { name, email, password }),
  
  logout: () =>
    apiClient.post('/auth/logout'),
  
  getProfile: () =>
    apiClient.get('/auth/profile'),
  
  updateProfile: (userData: any) =>
    apiClient.put('/auth/profile', userData),
  
  refreshToken: () =>
    apiClient.post('/auth/refresh'),
};

// Product API calls
export const productAPI = {
  getAll: (params?: any) =>
    apiClient.get(`/products${params ? `?${new URLSearchParams(params)}` : ''}`),
  
  getById: (id: string) =>
    apiClient.get(`/products/${id}`),
  
  create: (productData: any) =>
    apiClient.post('/products', productData),
  
  update: (id: string, productData: any) =>
    apiClient.put(`/products/${id}`, productData),
  
  delete: (id: string) =>
    apiClient.delete(`/products/${id}`),
};

// Cart API calls
export const cartAPI = {
  get: () =>
    apiClient.get('/cart'),
  
  add: (productId: string, quantity: number = 1) =>
    apiClient.post('/cart/add', { productId, quantity }),
  
  update: (productId: string, quantity: number) =>
    apiClient.put('/cart/update', { productId, quantity }),
  
  remove: (productId: string) =>
    apiClient.delete(`/cart/remove/${productId}`),
  
  clear: () =>
    apiClient.delete('/cart/clear'),
};

// Order API calls
export const orderAPI = {
  getAll: () =>
    apiClient.get('/orders'),
  
  getById: (id: string) =>
    apiClient.get(`/orders/${id}`),
  
  create: (orderData: any) =>
    apiClient.post('/orders', orderData),
  
  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/orders/${id}/status`, { status }),
};

// Category API calls
export const categoryAPI = {
  getAll: () =>
    apiClient.get('/categories'),
  
  create: (categoryData: any) =>
    apiClient.post('/categories', categoryData),
  
  update: (id: string, categoryData: any) =>
    apiClient.put(`/categories/${id}`, categoryData),
  
  delete: (id: string) =>
    apiClient.delete(`/categories/${id}`),
};

// Wishlist API calls
export const wishlistAPI = {
  get: () =>
    apiClient.get('/wishlist'),
  
  add: (productId: string) =>
    apiClient.post('/wishlist/add', { productId }),
  
  remove: (productId: string) =>
    apiClient.delete(`/wishlist/remove/${productId}`),
};

// Review API calls
export const reviewAPI = {
  getByProduct: (productId: string) =>
    apiClient.get(`/reviews/product/${productId}`),
  
  create: (reviewData: any) =>
    apiClient.post('/reviews', reviewData),
  
  update: (id: string, reviewData: any) =>
    apiClient.put(`/reviews/${id}`, reviewData),
  
  delete: (id: string) =>
    apiClient.delete(`/reviews/${id}`),
};

// Admin API calls
export const adminAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/admin/login', { email, password }),
  
  getDashboard: () =>
    apiClient.get('/admin/dashboard'),
  
  getUsers: () =>
    apiClient.get('/admin/users'),
  
  updateUser: (id: string, userData: any) =>
    apiClient.put(`/admin/users/${id}`, userData),
  
  deleteUser: (id: string) =>
    apiClient.delete(`/admin/users/${id}`),
};

// Analytics API calls
export const analyticsAPI = {
  getSales: (period: string) =>
    apiClient.get(`/analytics/sales?period=${period}`),
  
  getProducts: () =>
    apiClient.get('/analytics/products'),
  
  getUsers: () =>
    apiClient.get('/analytics/users'),
  
  getRevenue: (period: string) =>
    apiClient.get(`/analytics/revenue?period=${period}`),
};

// Stripe API calls
export const stripeAPI = {
  createCheckoutSession: (sessionData: any) =>
    apiClient.post('/stripe/create-checkout-session', sessionData),
  
  createPaymentIntent: (paymentData: any) =>
    apiClient.post('/stripe/create-payment-intent', paymentData),
  
  webhookHandler: (rawBody: any, signature: string) =>
    apiClient.post('/stripe/webhook', rawBody, {
      headers: { 'stripe-signature': signature },
    }),
};