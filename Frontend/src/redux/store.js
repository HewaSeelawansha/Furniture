import { configureStore } from '@reduxjs/toolkit';
import authSlice from './features/auth/authSlice'; 
import usersApi from './features/users/usersApi';
import furnituresApi from './features/furnitures/furnituresApi';
import reservationApi from './features/reservations/reservationApi';
import paymentApi from './features/payments/paymentApi';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    [usersApi.reducerPath]: usersApi.reducer,
    [furnituresApi.reducerPath]: furnituresApi.reducer,
    [reservationApi.reducerPath]: reservationApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(
        usersApi.middleware,
        furnituresApi.middleware,
        reservationApi.middleware,
        paymentApi.middleware,
      ),
});

export default store;
