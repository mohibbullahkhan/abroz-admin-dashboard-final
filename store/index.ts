// ── Central barrel export ─────────────────────────────────────────────────────
// Import everything you need from here: hooks, store, and all RTK Query hooks.
// e.g.  import { useGetProductsQuery, useAppSelector } from '@/store';

// Store & hooks
export { store }              from './store';
export type { RootState, AppDispatch } from './store';
export { useAppDispatch, useAppSelector } from './hooks';

// Auth
export {
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useGetMeQuery,
} from './services/authApi';
export type {
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
} from './services/authApi';

// Products
export {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from './services/productsApi';
export type {
  ProductsResponse,
  ProductFilters,
  UpdateProductRequest,
} from './services/productsApi';

// Categories
export {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from './services/categoriesApi';

// Dashboard
export { useGetDashboardStatsQuery } from './services/dashboardApi';
export type { DashboardResponse } from './services/dashboardApi';

// Admin
export {
  useGetAdminInfoQuery,
  useUpdateAdminProfileMutation,
  useUpdateAdminClicksMutation,
} from './services/adminApi';

// Profile
export {
  useUpdateUserProfileMutation,
} from './services/profileApi';
