import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// 1. Define the shape of the user profile and the context
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  exp: number; // Token expiration timestamp
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  logout: () => void;
}

// 2. Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create the Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/admin/signin');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<UserProfile>(token);

        // Check if the token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser(decodedToken);
        }
      } catch (error) {
        console.error('Invalid token found:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const value = { user, loading, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 4. Create a custom hook for easy access to the context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}