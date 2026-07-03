import { baseApi } from '../api/baseApi';
import { AdminInfo } from '@/types';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface AdminInfoResponse {
  success: boolean;
  message: string;
  data: AdminInfo;
}

export type UpdateAdminProfileRequest = {
  businessName?: string;
  businessDescription?: string;
  businessAddress?: string;
  shippingInfo?: string;
  social?: {
    facebookPage1?: string;
    facebookPage2?: string;
    messengerId?: string;
    whatsappNumber?: string;
    emailAddress?: string;
    websiteLink?: string;
  };
};

export type UpdateAdminClicksRequest = {
  type: 'whatsapp' | 'messenger';
};

export interface GenericResponse {
  success: boolean;
  message: string;
}

// ── Admin API slice ────────────────────────────────────────────────────────────
export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /admin/info
    getAdminInfo: builder.query<AdminInfoResponse, void>({
      query: () => '/admin/info',
      providesTags: ['AdminProfile'],
    }),

    // PATCH /admin/profile
    updateAdminProfile: builder.mutation<AdminInfoResponse, UpdateAdminProfileRequest>({
      query: (body) => ({
        url: '/admin/profile',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['AdminProfile'],
    }),

    // PATCH /admin/clicks
    updateAdminClicks: builder.mutation<GenericResponse, UpdateAdminClicksRequest>({
      query: (body) => ({
        url: '/admin/clicks',
        method: 'PATCH',
        body,
      }),
      // Fire-and-forget for clicks, no need to invalidate heavy queries unless necessary
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetAdminInfoQuery,
  useUpdateAdminProfileMutation,
  useUpdateAdminClicksMutation,
} = adminApi;
