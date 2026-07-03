import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ── Base API ──────────────────────────────────────────────────────────────────
// Single RTK Query base — all feature slices inject their endpoints here.
// Base URL: https://abroz-machinery-server.vercel.app/api/v1
// Auth: JWT stored in the `token` cookie (set by server on login)
// ─────────────────────────────────────────────────────────────────────────────

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    // Using the direct backend API URL as requested by the user.
    // Note: This may require allowing third-party cookies in browser settings during local development.
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://abroz-machinery-server.vercel.app/api/v1",

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
