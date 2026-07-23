'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { data: session, isPending } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    } else if (!isPending) {
      setUser(null);
    }
  }, [session, isPending]);

  const value = {
    user,
    session,
    isLoading: isPending,
    isAuthenticated: !!session?.user,
    role: session?.user?.role || null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
