import { baseApi } from '../api/baseApi';
import { DashboardStats } from '@/types';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardStats;
}

// ── Dashboard API slice ────────────────────────────────────────────────────────
export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /stats/dashboard
    getDashboardStats: builder.query<DashboardResponse, void>({
      query: () => '/stats/dashboard',
      providesTags: ['Dashboard'],
    }),

  }),
  overrideExisting: false,
});

export const { useGetDashboardStatsQuery } = dashboardApi;
