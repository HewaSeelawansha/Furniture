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
    tagTypes: ['Payments', 'Reservations'], // Include Reservations tag to invalidate reservation cache
    endpoints: (builder) => ({
        // Process payment for a reservation
        processPayment: builder.mutation({
            query: ({ reservationId, paymentMethod = 'card' }) => ({
                url: `/${reservationId}/process`,
                method: 'POST',
                body: { paymentMethod }
            }),
            // Invalidate both Payments and Reservations since we update both
            invalidatesTags: (result, error, { reservationId }) => [
                { type: 'Payments', id: reservationId },
                { type: 'Reservations', id: reservationId }
            ],
        }),

        // Get payment history for a reservation
        getPaymentsByReservation: builder.query({
            query: (reservationId) => `/${reservationId}`,
            providesTags: (result, error, reservationId) => [
                { type: 'Payments', id: reservationId }
            ],
        }),
    })
});

// Export hooks for usage in components
export const {
    useProcessPaymentMutation,
    useGetPaymentsByReservationQuery,
} = paymentsApi;

export default paymentsApi;