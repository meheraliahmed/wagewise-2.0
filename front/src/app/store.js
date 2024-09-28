// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import signupReducer from '../features/signup/signupSlice';
import loginReducer from '../features/login/loginSlice';
import userProfileReducer from '../features/userProfile/userProfileSlice';

export const store = configureStore({
  reducer: {
    signup: signupReducer,
    login: loginReducer,
    userProfile: userProfileReducer,  // Add userProfileReducer to the store
  },
});