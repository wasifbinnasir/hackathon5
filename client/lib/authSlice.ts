import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthUser = { id: string; name: string; email: string; roles?: string[] };
type AuthState = { token?: string | null; user?: AuthUser | null };

const isTokenValid = (token: string): boolean => {
  try {
    const [, payload] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    const expiryDate = new Date(decodedPayload.exp * 1000);
    return expiryDate > new Date();
  } catch {
    return false;
  }
};

// Initialize state from localStorage if available
const getInitialState = (): AuthState => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && isTokenValid(token)) {
      return {
        token,
        user: userStr ? JSON.parse(userStr) : null
      };
    }
    // Clear invalid token
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  return { token: null, user: null };
};

const slice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; user: AuthUser }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
    logout(state) {
      state.token = null;
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
  },
});

export const { setCredentials, logout } = slice.actions;
export default slice.reducer;