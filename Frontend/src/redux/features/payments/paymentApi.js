import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../../../utils/baseURL';

const baseQuery = fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/payments`,
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
});

const paymentsApi = createApi({
    reducerPath: 'paymentsApi',
    baseQuery,
    tagTypes: ['Payments', 'Reservations'], 
    endpoints: (builder) => ({
        processPayment: builder.mutation({
            query: ({ reservationId, paymentMethod = 'card' }) => ({
                url: `/${reservationId}/process`,
                method: 'POST',
                body: { paymentMethod }
            }),
            invalidatesTags: (result, error, { reservationId }) => [
                { type: 'Payments', id: reservationId },
                { type: 'Reservations', id: reservationId }
            ],
        }),

        getPaymentsByReservation: builder.query({
            query: (reservationId) => `/${reservationId}`,
            providesTags: (result, error, reservationId) => [
                { type: 'Payments', id: reservationId }
            ],
        }),
    })
});

export const {
    useProcessPaymentMutation,
    useGetPaymentsByReservationQuery,
} = paymentsApi;

export default paymentsApi;