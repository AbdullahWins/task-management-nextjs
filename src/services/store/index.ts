import { configureStore } from "@reduxjs/toolkit";
import { api } from "./modules/api";
import authReducer from "./modules/authSlice";

export const store = configureStore({
  reducer: {
    api: api.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
