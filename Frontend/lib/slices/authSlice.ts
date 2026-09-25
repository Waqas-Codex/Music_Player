import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Role } from '@/types';

interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role?: Role | string;
  avatarUrl?: string | null;
}

const normalizeUser = (user: User | null | undefined): User | null => {
  if (!user) return null;

  const userId = user._id || user.id || '';

  return {
    ...user,
    _id: userId,
  };
};

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      const normalizedUser = normalizeUser(action.payload);
      state.user = normalizedUser;
      state.isAuthenticated = !!normalizedUser;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
    },
  },
});

export const { setAuthenticated, setUser, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;