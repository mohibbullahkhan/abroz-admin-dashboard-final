import { baseApi } from '../api/baseApi';
import { Customer } from '@/types';

// ── Types ─────────────────────────────────────────────────────────────────────
export type CreateCustomerRequest = Omit<Customer, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateCustomerRequest = { id: string; body: Partial<CreateCustomerRequest> };

export interface CreateBroadcastRequest {
  customerIds: string[];
  message: string;
  batchName?: string;
}

export interface BroadcastResponse {
  success: boolean;
  message: string;
  data: any;
}

export interface CustomerResponse {
  success: boolean;
  message: string;
  data: Customer;
}

export interface CustomersResponse {
  success: boolean;
  message: string;
  data: Customer[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GenericResponse {
  success: boolean;
  message: string;
}

export interface CustomerFilters {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: string;
}

// ── Customers API slice ───────────────────────────────────────────────────────
export const customersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /customer
    getCustomers: builder.query<CustomersResponse, CustomerFilters | void>({
      query: (params) => ({
        url: '/customer',
        params: params ?? {},
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Customers' as const, id: _id })),
              { type: 'Customers', id: 'LIST' },
            ]
          : [{ type: 'Customers', id: 'LIST' }],
    }),

    // GET /customer/:id
    getCustomer: builder.query<CustomerResponse, string>({
      query: (id) => `/customer/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Customers', id }],
    }),

    // POST /customer
    createCustomer: builder.mutation<CustomerResponse, CreateCustomerRequest>({
      query: (body) => ({
        url: '/customer',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Customers', id: 'LIST' }],
    }),

    // PATCH /customer/:id
    updateCustomer: builder.mutation<CustomerResponse, UpdateCustomerRequest>({
      query: ({ id, body }) => ({
        url: `/customer/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Customers', id },
        { type: 'Customers', id: 'LIST' },
      ],
    }),

    // DELETE /customer/:id
    deleteCustomer: builder.mutation<GenericResponse, string>({
      query: (id) => ({
        url: `/customer/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Customers', id },
        { type: 'Customers', id: 'LIST' },
      ],
    }),

    // POST /broadcast
    createBroadcast: builder.mutation<BroadcastResponse, CreateBroadcastRequest>({
      query: (body) => ({
        url: '/broadcast',
        method: 'POST',
        body,
      }),
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useCreateBroadcastMutation,
} = customersApi;
