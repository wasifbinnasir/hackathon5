'use client';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { setCredentials } from './authSlice';
import { apiBase } from './apiBase';
import { Provider } from 'react-redux';

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      [apiBase.reducerPath]: apiBase.reducer,
    },
    middleware: (gDM) => gDM().concat(apiBase.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const store = makeStore();
  // Try to load token from localStorage (CSR only)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      store.dispatch(setCredentials({ token, user: JSON.parse(user) }));
    }
  }
  return <Provider store={store}>{children}</Provider>;
}