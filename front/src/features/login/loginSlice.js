// src/features/signup/signupSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  rememberMe: false,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetForm: () => initialState,
  },
});

export const { updateField, resetForm } = loginSlice.actions;
export default loginSlice.reducer;