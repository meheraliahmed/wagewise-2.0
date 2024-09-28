// src/features/signup/signupSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  rememberMe: false,
};

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetForm: () => initialState,
  },
});

export const { updateField, resetForm } = signupSlice.actions;
export default signupSlice.reducer;