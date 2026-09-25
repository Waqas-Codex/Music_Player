'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { setUser, setLoading } from '@/lib/slices/authSlice';
import { authService } from '@/services/auth.service';

export function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          const user = await authService.getCurrentUser();
          dispatch(setUser(user));
        } catch (error) {
          // Token might be invalid, clear it
          localStorage.removeItem('authToken');
          document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          dispatch(setUser(null));
        }
      } else {
        dispatch(setUser(null));
      }
      
      dispatch(setLoading(false));
    };

    initializeAuth();
  }, [dispatch]);

  return null;
}