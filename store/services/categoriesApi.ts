import { baseApi } from '../api/baseApi';
import { Category } from '@/types';

// ── Types ─────────────────────────────────────────────────────────────────────
export type CreateCategoryRequest = Pick<Category, 'name' | 'description'>;
export type UpdateCategoryRequest = Partial<CreateCategoryRequest> & { _id: string };

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export interface GenericResponse {
  success: boolean;
  message: string;
}

// ── Categories API slice ───────────────────────────────────────────────────────
export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /category
    getCategories: builder.query<CategoriesResponse, { limit?: number } | void>({
      query: (params) => ({
        url: '/category',
        params: params ? params : undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Categories' as const, id: _id })),
              { type: 'Categories', id: 'LIST' },
            ]
          : [{ type: 'Categories', id: 'LIST' }],
    }),

    // GET /category/:id
    getCategory: builder.query<CategoryResponse, string>({
      query: (id) => `/category/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Categories', id }],
    }),

    // POST /category
    createCategory: builder.mutation<CategoryResponse, CreateCategoryRequest>({
      query: (body) => ({
        url: '/category',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Categories', id: 'LIST' }],
    }),

    // PATCH /category/:id
    updateCategory: builder.mutation<CategoryResponse, UpdateCategoryRequest>({
      query: ({ _id, ...body }) => ({
        url: `/category/${_id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { _id }) => [
        { type: 'Categories', id: _id },
        { type: 'Categories', id: 'LIST' },
      ],
    }),

    // DELETE /category/:id
    deleteCategory: builder.mutation<GenericResponse, string>({
      query: (id) => ({
        url: `/category/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Categories', id },
        { type: 'Categories', id: 'LIST' },
      ],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
