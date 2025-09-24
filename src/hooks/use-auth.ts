'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/auth-provider';

type User = {
  name: string;
  email: string;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  signup: (name: string, email: string, pass: string) => boolean;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook that implements the auth logic
export const useAuthInternal = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const userJson = localStorage.getItem('adapt-learn-user');
      if (userJson) {
        setUser(JSON.parse(userJson));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email: string, pass: string): boolean => {
    try {
      const usersJson = localStorage.getItem('adapt-learn-users');
      const users = usersJson ? JSON.parse(usersJson) : {};
      if (users[email] && users[email].password === pass) {
        const loggedInUser = { name: users[email].name, email };
        localStorage.setItem('adapt-learn-user', JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  const signup = (name: string, email: string, pass: string): boolean => {
    try {
      const usersJson = localStorage.getItem('adapt-learn-users');
      const users = usersJson ? JSON.parse(usersJson) : {};
      if (users[email]) {
        return false; // User already exists
      }
      users[email] = { name, password: pass };
      localStorage.setItem('adapt-learn-users', JSON.stringify(users));
      
      const newUser = { name, email };
      localStorage.setItem('adapt-learn-user', JSON.stringify(newUser));
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Signup failed', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adapt-learn-user');
    setUser(null);
    router.push('/login');
  };

  return { user, loading, login, logout, signup };
};

// To avoid confusion, the hook that components should import is named useAuth,
// but the implementation is in useAuthInternal. use-auth.ts exports both, 
// but the provider uses useAuthInternal. Let's adjust the context provider to use it.
export { useAuthInternal as useAuth };
