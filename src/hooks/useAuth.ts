import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in from local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setLoading(false);
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('user');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const signIn = async (email: string, password: string) => {
    // Mock login - replace with actual API call to your MongoDB backend
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const mockUser: User = {
            id: '1',
            name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
            email,
            phone: '9841000000'
          };
          
          setUser(mockUser);
          localStorage.setItem('user', JSON.stringify(mockUser));
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const signUp = async (name: string, email: string, password: string, phone?: string) => {
    // Mock registration - replace with actual API call to your MongoDB backend
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (name && email && password) {
          const mockUser: User = {
            id: Date.now().toString(),
            name,
            email,
            phone
          };
          
          setUser(mockUser);
          localStorage.setItem('user', JSON.stringify(mockUser));
          resolve();
        } else {
          reject(new Error('Invalid registration information'));
        }
      }, 1000);
    });
  };

  return {
    user,
    loading,
    signOut,
    signIn,
    signUp,
    isAuthenticated: !!user,
  };
};