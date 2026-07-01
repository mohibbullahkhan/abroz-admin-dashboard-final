import { baseApi } from '../api/baseApi';
import { User } from '@/types';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface ProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

// ── Profile API slice ──────────────────────────────────────────────────────────
export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // PATCH /user/profile
    updateUserProfile: builder.mutation<ProfileResponse, FormData>({
      query: (formData) => ({
        url: '/user/profile',
        method: 'PATCH',
        body: formData,
        // Let browser set Content-Type to multipart/form-data with boundary
      }),
      invalidatesTags: ['Auth'], // Invalidate Auth tag so getMe will refetch
    }),

  }),
  overrideExisting: false,
});

export const {
  useUpdateUserProfileMutation,
} = profileApi;
