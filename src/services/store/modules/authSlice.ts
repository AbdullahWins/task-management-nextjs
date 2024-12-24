import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "./api";

interface AuthState {
  isAuthenticated: boolean;
  user: null | {
    _id: string;
    name: string;
    email: string;
    image?: string;
    username?: string;
  };
  accessToken: null | string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signinSuccess(
      state,
      action: PayloadAction<{ user: any; accessToken: string }>
    ) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("userId", action.payload.user._id);
    },
    hydrateAuth(state) {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        state.isAuthenticated = true;
        state.accessToken = accessToken;
        const userId = localStorage.getItem("userId");
        if (userId) {
        }
      }
    },
    signout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
    },
  },
});

export const { signinSuccess, signout, hydrateAuth } = authSlice.actions;

export default authSlice.reducer;
