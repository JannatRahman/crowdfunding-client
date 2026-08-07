'use client';

import { createContext, useContext, useEffect, useState, Component } from 'react';
import { useSession } from '@/lib/auth-client';

const AuthContext = createContext(null);

function AuthErrorFallback({ children }) {
  return (
    <AuthContext.Provider value={{ user: null, session: null, isLoading: false, isAuthenticated: false, role: null }}>
      {children}
    </AuthContext.Provider>
  );
}

class AuthErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.warn('AuthProvider crashed, rendering without auth:', error?.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <AuthContext.Provider value={{ user: null, session: null, isLoading: false, isAuthenticated: false, role: null }}>
          {this.props.children}
        </AuthContext.Provider>
      );
    }
    return this.props.children;
  }
}

function AuthProviderInner({ children }) {
  let sessionData = { data: null, isPending: true };
  try {
    sessionData = useSession();
  } catch (e) {
    console.warn('useSession failed:', e?.message);
  }

  const { data: session, isPending } = sessionData;
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

export function AuthProvider({ children }) {
  return (
    <AuthErrorBoundary>
      <AuthProviderInner>
        {children}
      </AuthProviderInner>
    </AuthErrorBoundary>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return { user: null, session: null, isLoading: false, isAuthenticated: false, role: null };
  }
  return context;
}
