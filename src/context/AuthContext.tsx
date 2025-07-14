import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in from local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - would be replaced with actual API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simulate successful login
        if (email && password) {
          const mockUser: User = {
            id: '1',
            name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
            email,
            phone: '9841000000',
            addresses: [],
            orders: []
          };
          
          setUser(mockUser);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(mockUser));
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const register = async (name: string, email: string, password: string) => {
    // Mock registration - would be replaced with actual API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (name && email && password) {
          const mockUser: User = {
            id: Date.now().toString(),
            name,
            email,
            addresses: [],
            orders: []
          };
          
          setUser(mockUser);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(mockUser));
          resolve();
        } else {
          reject(new Error('Invalid registration information'));
        }
      }, 1000);
    });
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};