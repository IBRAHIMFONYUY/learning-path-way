'use client';

import { createContext } from 'react';
import { useAuthInternal, type AuthContextType } from '@/hooks/use-auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthInternal();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
