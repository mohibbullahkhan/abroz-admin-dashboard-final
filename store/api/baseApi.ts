import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ── Base API ──────────────────────────────────────────────────────────────────
// Single RTK Query base — all feature slices inject their endpoints here.
// Base URL: https://abroz-machinery-server.vercel.app/api/v1
// Auth: JWT stored in the `token` cookie (set by server on login)
// ─────────────────────────────────────────────────────────────────────────────

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    // Using '/api/v1' hits the Next.js rewrite (proxy) in next.config.ts,
    // which forwards to the backend. This prevents third-party cookie blocks.
    baseUrl: "https://abroz-machinery-server.vercel.app/api/v1",

    // Send cookies with every request so the server can read the `token` cookie
    credentials: "include",

    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      return headers;
    },
  }),

  // Global cache tag types
  tagTypes: [
    "Auth",
    "Products",
    "Categories",
    "Dashboard",
    "Settings",
    "Profile",
    "AdminProfile",
    "SMS",
    "Customers",
  ],

  endpoints: () => ({}),
});
