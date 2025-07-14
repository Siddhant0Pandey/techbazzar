import React, { createContext, useState, useContext, useEffect } from 'react';

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
  adminLogin: (email: string, password: string) => Promise<void>;
  adminLogout: () => void;
  updateAdminProfile: (userData: Partial<AdminUser>) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Check if admin is already logged in from local storage
    const storedAdmin = localStorage.getItem('adminUser');
    if (storedAdmin) {
      try {
        const adminData = JSON.parse(storedAdmin);
        setAdminUser(adminData);
        setIsAdminAuthenticated(true);
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('adminUser');
      }
    }
  }, []);

  const adminLogin = async (email: string, password: string) => {
    // Mock admin login - would be replaced with actual API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Check for admin credentials
        if (email === 'admin@techbazaar.com' && password === 'admin123') {
          const mockAdmin: AdminUser = {
            id: 'admin-1',
            name: 'Admin User',
            email,
            role: 'admin'
          };
          
          setAdminUser(mockAdmin);
          setIsAdminAuthenticated(true);
          localStorage.setItem('adminUser', JSON.stringify(mockAdmin));
          resolve();
        } else if (email === 'superadmin@techbazaar.com' && password === 'super123') {
          const mockSuperAdmin: AdminUser = {
            id: 'admin-2',
            name: 'Super Admin',
            email,
            role: 'super_admin'
          };
          
          setAdminUser(mockSuperAdmin);
          setIsAdminAuthenticated(true);
          localStorage.setItem('adminUser', JSON.stringify(mockSuperAdmin));
          resolve();
        } else {
          reject(new Error('Invalid admin credentials'));
        }
      }, 1000);
    });
  };

  const updateAdminProfile = (userData: Partial<AdminUser>) => {
    if (adminUser) {
      const updatedAdmin = { ...adminUser, ...userData };
      setAdminUser(updatedAdmin);
      localStorage.setItem('adminUser', JSON.stringify(updatedAdmin));
    }
  };

  const adminLogout = () => {
    setAdminUser(null);
    setIsAdminAuthenticated(false);
    localStorage.removeItem('adminUser');
  };

  return (
    <AdminAuthContext.Provider value={{ 
      adminUser, 
      isAdminAuthenticated, 
      adminLogin, 
      adminLogout, 
      updateAdminProfile 
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};