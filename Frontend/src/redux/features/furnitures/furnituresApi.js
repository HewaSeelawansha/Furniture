import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import getBaseUrl from '../../../utils/baseURL';

const baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/furnitures`,
    credentials: 'include',
    prepareHeaders: (Headers) => {
        const token = localStorage.getItem('token');
        if(token) {
            Headers.set('Authorization', `Bearer ${token}`);
        }
        return Headers;
    }
})

const furnituresApi = createApi({
    reducerPath: 'furnitureApi',
    baseQuery,
    tagTypes: ['Furnitures'],
    endpoints: (builder) => ({
        fetchAllFurnitures: builder.query({
            query: () => "/",
            providesTags: (result) =>
            result
                ? [{ type: 'Furnitures' }, ...result.map(({ _id }) => ({ type: 'Furnitures', id: _id }))]
                : [{ type: 'Furnitures' }],
        }),
        fetchFurnitureById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (results, error, id) => [{type: "Furnitures", id}]
        }),
        addFurniture: builder.mutation({
            query: (furnitureData) => ({
                url: '/create-furniture',
                method: "POST",
                body: furnitureData
            }),
            invalidatesTags: ["Furnitures"]
        }),
        updateFurniture: builder.mutation({
            query: ({id, updatedData}) => ({
                url: `/update/${id}`,
                method: "PUT",
                body: updatedData
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Furnitures', id }],
        }),
        deleteFurniture: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Furnitures"]
        })
    })
})

export const { useFetchAllFurnituresQuery, useFetchFurnitureByIdQuery, useAddFurnitureMutation, useUpdateFurnitureMutation, useDeleteFurnitureMutation } = furnituresApi;
export default furnituresApi;