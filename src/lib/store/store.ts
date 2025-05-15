import { configureStore } from '@reduxjs/toolkit';
import { sponsorsApi } from './sponsorsApi';

export const store = configureStore({
  reducer: {
    [sponsorsApi.reducerPath]: sponsorsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sponsorsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
