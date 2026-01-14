import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '@/services/auth/authService';
import { tokenManager } from '@/utils/auth/tokenManager';
import type { AdminLogin } from '@/types';

interface AuthContextType {
  user: AdminLogin['data'] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenManager.clearTokens();
      queryClient.clear();
      navigate('/login');
    }
  }, [navigate, queryClient]);

  // Fetch current user
  const {
    data: userResponse,
    isLoading: isUserLoading,
    refetch,
  } = useQuery<AdminLogin | null>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      if (!tokenManager.isAuthenticated()) {
        return null;
      }
      try {
        return await authService.getCurrentUser();
      } catch (error) {
        console.error('Failed to fetch user:', error);
        await handleLogout();
        return null;
      }
    },
    enabled: tokenManager.isAuthenticated(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Normalize user object
  const user = userResponse?.data ?? null;

  const refreshUser = useCallback(async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, [queryClient]);

  // Initialize once
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (tokenManager.isAuthenticated()) {
          await refetch();
        }
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();

    // Subscribe to token refresh
    const unsubscribe = tokenManager.subscribeToRefresh((newToken) => {
      console.log('Token refreshed:', newToken);
      refetch();
    });

    return () => {
      unsubscribe();
    };
  }, [refetch]);

  const login = async (credentials: any) => {
    try {
      console.log('🔵 AuthProvider: Starting login...');
      const response = await authService.login(credentials);
      console.log('🔵 AuthProvider: Login response:', response);
      
      // Backend returns: { status: true, data: { token, ... }, message: "...", toast: true }
      // authService.login() returns the full response object
      if (!response || !response.data) {
        console.error('❌ AuthProvider: Invalid response structure', response);
        throw new Error('Invalid response from server');
      }
      
      const { data } = response;
      console.log('🔵 AuthProvider: Extracted data:', data);
      console.log('🔵 AuthProvider: Token:', data.token);
      console.log('🔵 AuthProvider: Full name:', data.full_name);
      
      if (!data.token) {
        console.error('❌ AuthProvider: Token not found in response');
        throw new Error('Token not found in response');
      }
      
      tokenManager.setTokens(data.token);
      console.log('🔵 AuthProvider: Token saved');
      
      // Set user data immediately in query cache so isAuthenticated becomes true
      // This ensures AuthGuard allows navigation to /dashboard
      queryClient.setQueryData<AdminLogin>(['currentUser'], response);
      console.log('🔵 AuthProvider: User data set in cache immediately');
      
      // Also refetch in background to ensure data is fresh
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      console.log('🔵 AuthProvider: Queries invalidated for background refetch');
      
      toast.success(`Welcome back, ${data.full_name || 'Admin'}`);
      console.log('🔵 AuthProvider: Toast shown');
      
      // Navigate immediately - user data is already in cache
      navigate('/dashboard');
      console.log('🔵 AuthProvider: Navigation to /dashboard called');
    } catch (error: any) {
      console.error('❌ AuthProvider: Login error:', error);
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  if (!isInitialized) {
    return null; // Or a loader component
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading: isUserLoading,
    login,
    logout: handleLogout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
