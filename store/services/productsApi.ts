import { baseApi } from '../api/baseApi';
import { Product } from '@/types';

// ── Types ─────────────────────────────────────────────────────────────────────
export type CreateProductRequest = Omit<Product, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateProductRequest = { _id: string; body: any };

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
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

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: string;
}

// ── Products API slice ─────────────────────────────────────────────────────────
export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /product
    getProducts: builder.query<ProductsResponse, ProductFilters | void>({
      query: (params) => ({
        url: '/product',
        params: params ?? {},
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Products' as const, id: _id })),
              { type: 'Products', id: 'LIST' },
            ]
          : [{ type: 'Products', id: 'LIST' }],
    }),

    // GET /product/:id
    getProduct: builder.query<ProductResponse, string>({
      query: (id) => `/product/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Products', id }],
    }),

    // POST /product
    createProduct: builder.mutation<ProductResponse, any>({
      query: (body) => ({
        url: '/product',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }],
    }),

    // PATCH /product/:id
    updateProduct: builder.mutation<ProductResponse, UpdateProductRequest>({
      query: ({ _id, body }) => ({
        url: `/product/${_id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { _id }) => [
        { type: 'Products', id: _id },
        { type: 'Products', id: 'LIST' },
      ],
    }),

    // DELETE /product/:id
    deleteProduct: builder.mutation<GenericResponse, string>({
      query: (id) => ({
        url: `/product/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Products', id },
        { type: 'Products', id: 'LIST' },
      ],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
