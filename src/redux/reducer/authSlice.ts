import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  signupData: User[];
  signupStatus: "idle" | "pending" | "success" | "duplicate";
  loginStatus: "idle" | "success" | "failed";
  errorMessage: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  signupData: [],
  signupStatus: "idle",
  loginStatus: "idle",
  errorMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signup: (state, action: PayloadAction<User>) => {
      if (!Array.isArray(state.signupData)) {
        state.signupData = [];
      }

      const existingMobileUser = state.signupData.find(
        (user) => user.mobileNumber === action.payload.mobileNumber,
      );

      const existingEmailUser = state.signupData.find(
        (user) =>
          user.email &&
          user.email.toLowerCase() === action.payload.email.toLowerCase(),
      );

      if (existingMobileUser) {
        state.signupStatus = "duplicate";
        state.errorMessage =
          "Mobile number already registered. Please use a different number.";
      } else if (existingEmailUser) {
        state.signupStatus = "duplicate";
        state.errorMessage =
          "Email address already registered. Please use a different email.";
      } else {
        state.signupData.push(action.payload);
        state.signupStatus = "success";
        state.errorMessage = null;
      }
    },

    resetSignupStatus: (state) => {
      state.signupStatus = "idle";
      state.errorMessage = null;
    },

    login: (
      state,
      action: PayloadAction<{ email: string; password: string }>,
    ) => {
      const { email, password } = action.payload;

      if (!Array.isArray(state.signupData)) {
        state.signupData = [];
      }

      if (!email || !password) {
        state.user = null;
        state.isLoggedIn = false;
        state.loginStatus = "failed";
        state.errorMessage = "Email and password are required.";
        return;
      }

      const user = state.signupData.find(
        (u) => u.email && u.email.toLowerCase() === email.toLowerCase(),
      );

      if (user && user.password === password) {
        state.user = user;
        state.isLoggedIn = true;
        state.loginStatus = "success";
        state.errorMessage = null;
      } else if (user && user.password !== password) {
        state.user = null;
        state.isLoggedIn = false;
        state.loginStatus = "failed";
        state.errorMessage = "Incorrect password. Please try again.";
      } else {
        state.user = null;
        state.isLoggedIn = false;
        state.loginStatus = "failed";
        state.errorMessage = "Email not registered. Please sign up first.";
      }
    },

    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { signup, login, logout, resetSignupStatus } = authSlice.actions;
export default authSlice.reducer;
