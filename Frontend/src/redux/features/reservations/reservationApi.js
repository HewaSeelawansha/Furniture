import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../../../utils/baseURL';

const baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/reservations`,
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
});

const reservationsApi = createApi({
    reducerPath: 'reservationsApi',
    baseQuery,
    tagTypes: ['Reservations'],
    endpoints: (builder) => ({
        fetchAllReservations: builder.query({
            query: () => '/',
            providesTags: (result) =>
                result
                    ? [{ type: 'Reservations' }, ...result.map(({ _id }) => ({ type: 'Reservations', id: _id }))]
                    : [{ type: 'Reservations' }],
        }),

        fetchReservationsByNIC: builder.query({
            query: (nic) => `/nic/${nic}`,
            providesTags: (result) =>
                result
                    ? [{ type: 'Reservations' }, ...result.map(({ _id }) => ({ type: 'Reservations', id: _id }))]
                    : [{ type: 'Reservations' }],
        }),

        fetchReservationById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Reservations', id }],
        }),

        addReservation: builder.mutation({
            query: (reservationData) => ({
                url: '/create',
                method: 'POST',
                body: reservationData
            }),
            invalidatesTags: ['Reservations']
        }),

        updateReservationStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/update-status/${id}`,
                method: 'PUT',
                body: { status }
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Reservations', id }],
        }),
    })
});

export const {
    useFetchAllReservationsQuery,
    useFetchReservationsByNICQuery,
    useAddReservationMutation,
    useUpdateReservationStatusMutation,
    useFetchReservationByIdQuery,
} = reservationsApi;

export default reservationsApi;