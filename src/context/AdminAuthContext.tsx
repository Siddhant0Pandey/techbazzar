import React, { createContext, useState, useContext, useEffect } from 'react';
import { adminAPI } from '../lib/api';
import toast from 'react-hot-toast';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
  avatar?: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  loading: boolean;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminLogout: () => void;
  updateAdminProfile: (userData: Partial<AdminUser>) => void;
}

interface AdminAuthResponse {
  user: AdminUser;
  token: string;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAdminAuth = async () => {
      const storedAdmin = localStorage.getItem('adminUser');
      const adminToken = localStorage.getItem('adminToken');
      
      if (storedAdmin && adminToken) {
        try {
          // Verify admin token with backend
          const response = await adminAPI.getDashboard(); // This will verify admin access
          if (response.success) {
            const adminData = JSON.parse(storedAdmin);
            setAdminUser(adminData);
            setIsAdminAuthenticated(true);
          } else {
            // Invalid token, clear storage
            localStorage.removeItem('adminUser');
            localStorage.removeItem('adminToken');
          }
        } catch (error) {
          console.error('Admin auth verification failed:', error);
          localStorage.removeItem('adminUser');
          localStorage.removeItem('adminToken');
        }
      }
      setLoading(false);
    };

    initAdminAuth();
  }, []);

  const adminLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await adminAPI.login(email, password);
      
      if (response.success && response.data) {
        const authData = response.data as AdminAuthResponse;
        
        setAdminUser(authData.user);
        setIsAdminAuthenticated(true);
        localStorage.setItem('adminUser', JSON.stringify(authData.user));
        localStorage.setItem('adminToken', authData.token);
        // Also set regular token for API calls
        localStorage.setItem('token', authData.token);
        
        toast.success(`Welcome back, ${authData.user.name}!`);
      } else {
        throw new Error(response.message || 'Admin login failed');
      }
    } catch (error: any) {
      console.error('Admin login error:', error);
      const errorMessage = error.message || 'Admin login failed. Please check your credentials.';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateAdminProfile = async (userData: Partial<AdminUser>) => {
    try {
      // Use regular profile update API for admin
      const response = await adminAPI.updateUser(adminUser?.id || '', userData);
      
      if (response.success && response.data) {
        const updatedAdmin = { ...adminUser, ...response.data } as AdminUser;
        setAdminUser(updatedAdmin);
        localStorage.setItem('adminUser', JSON.stringify(updatedAdmin));
        toast.success('Admin profile updated successfully!');
      }
    } catch (error: any) {
      console.error('Admin profile update error:', error);
      const errorMessage = error.message || 'Failed to update admin profile';
      toast.error(errorMessage);
      throw error;
    }
  };

  const adminLogout = () => {
    setAdminUser(null);
    setIsAdminAuthenticated(false);
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');
    toast.success('Admin logged out successfully!');
  };

  return React.createElement(
    AdminAuthContext.Provider,
    { 
      value: { 
        adminUser, 
        isAdminAuthenticated, 
        loading,
        adminLogin, 
        adminLogout, 
        updateAdminProfile 
      }
    },
    children
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};