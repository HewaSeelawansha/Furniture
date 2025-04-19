import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../../../utils/baseURL';

const baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/auth`,
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (token) {
            headers.set('Authorization', `Bearer ${token}`); // Add Bearer token to headers
        }
        return headers;
    },
});

const usersApi = createApi({
    reducerPath: 'userApi',
    baseQuery,
    tagTypes: ['Users'],
    endpoints: (builder) => ({
        signupUser: builder.mutation({
            query: (newUser) => ({
                url: '/signup',
                method: 'POST',
                body: newUser,
            }),
        }),
        loginUser: builder.mutation({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
        }),
        fetchAllUsers: builder.query({
            query: () => "/",
            providesTags: ["Users"]
        }),
        fetchUserById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (results, error, id) => [{type: "Users", id}]
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Users"]
        }),
        updateUser: builder.mutation({
            query: ({ id, updatedData }) => ({
                url: `/update/${id}`,
                method: 'PUT', // or 'PATCH', depending on your backend
                body: updatedData,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Users', id }],
        }),
    }),
});

export const {
    useSignupUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useFetchAllUsersQuery,
    useFetchUserByIdQuery,
    useDeleteUserMutation,
    useUpdateUserMutation
} = usersApi;
export default usersApi;
