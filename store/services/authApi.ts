import { baseApi } from '../api/baseApi';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string; // the doc says _id, but response example shows id
  name: string;
  email: string;
  role: string;
  isActive?: boolean;
  image?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface GenericResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

// ── Auth API slice ─────────────────────────────────────────────────────────────
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // POST /auth/login
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

    // POST /auth/forget-password
    forgotPassword: builder.mutation<GenericResponse, ForgotPasswordRequest>({
      query: (body) => ({
        url: '/auth/forget-password',
        method: 'POST',
        body,
      }),
    }),

    // POST /auth/verify-email
    verifyOtp: builder.mutation<GenericResponse, VerifyOtpRequest>({
      query: (body) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body,
      }),
    }),

    // POST /auth/reset-password
    resetPassword: builder.mutation<GenericResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),

    // GET /auth/me
    getMe: builder.query<{ success: boolean; data: User }, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),

  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useGetMeQuery,
} = authApi;
