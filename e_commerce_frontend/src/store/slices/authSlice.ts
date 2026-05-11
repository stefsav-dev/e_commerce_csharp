import { createSlice } from '@reduxjs/toolkit';
import type {PayloadAction} from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const getInitialState = (): AuthState => {
  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    console.log('Loading initial state - token:', token ? 'exists' : 'null');
    console.log('Loading initial state - userStr:', userStr);
    
    let user: User | null = null;
    if (userStr) {
      try {
        const parsedUser = JSON.parse(userStr) as Partial<User> & { role?: string };
        if (parsedUser?.id && parsedUser.email && parsedUser.name) {
          user = {
            id: parsedUser.id,
            email: parsedUser.email,
            name: parsedUser.name,
            role: parsedUser.role?.toLowerCase() === 'admin' ? 'admin' : 'user',
          };
        }
        console.log('Parsed user from localStorage:', user);
      } catch (parseError) {
        console.error('Error parsing user from localStorage:', parseError);
        localStorage.removeItem('user');
      }
    }
    
    const isAuthenticated = !!token && !!user;
    console.log('Initial isAuthenticated:', isAuthenticated);
    
    return {
      user: user,
      token: token,
      isAuthenticated: isAuthenticated,
      isLoading: false,
      error: null,
    };
  } catch (error) {
    console.error('Error in getInitialState:', error);
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    };
  }
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      console.log('loginSuccess payload:', action.payload);
      
      // Normalize role to lowercase
      const normalizedUser: User = {
        ...action.payload.user,
        role: action.payload.user.role === 'admin' ? 'admin' : 'user'
      };
      
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = normalizedUser;
      state.token = action.payload.token;
      state.error = null;
      
      // Save to localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      
      console.log('Saved to localStorage - user:', normalizedUser);
      console.log('Saved to localStorage - token:', action.payload.token.substring(0, 20) + '...');
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('Logout - cleared localStorage');
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
