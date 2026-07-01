import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';

// ── Import all service slices so they register their endpoints ─────────────────
// Each import calls `baseApi.injectEndpoints()` as a side-effect.
import './services/authApi';
import './services/productsApi';
import './services/categoriesApi';
import './services/dashboardApi';
import './services/smsApi';
import './services/profileApi';

// ── Store ─────────────────────────────────────────────────────────────────────
export const store = configureStore({
  reducer: {
    // RTK Query reducer (handles all cache, loading & error state)
    [baseApi.reducerPath]: baseApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// ── Inferred types ─────────────────────────────────────────────────────────────
export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
