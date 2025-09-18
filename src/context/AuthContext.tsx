import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/model';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Mock users for demonstration
  const mockUsers: User[] = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@modelgov.com',
      role: 'admin',
      fullName: 'Administrator',
      createdAt: '2024-01-01T00:00:00Z',
      lastLogin: new Date().toISOString(),
    },
    {
      id: '2',
      username: 'editor',
      email: 'editor@modelgov.com',
      role: 'editor',
      fullName: 'Editor User',
      createdAt: '2024-01-01T00:00:00Z',
      lastLogin: new Date().toISOString(),
    },
    {
      id: '3',
      username: 'viewer',
      email: 'viewer@modelgov.com',
      role: 'viewer',
      fullName: 'Viewer User',
      createdAt: '2024-01-01T00:00:00Z',
      lastLogin: new Date().toISOString(),
    }
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Mock authentication
    const foundUser = mockUsers.find(u => u.username === username);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const hasPermission = (action: string): boolean => {
    if (!user) return false;
    
    switch (user.role) {
      case 'admin':
        return true;
      case 'editor':
        return ['view', 'create', 'edit', 'register'].includes(action);
      case 'viewer':
        return ['view'].includes(action);
      default:
        return false;
    }
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};