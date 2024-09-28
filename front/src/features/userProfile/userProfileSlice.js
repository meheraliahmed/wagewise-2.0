// src/features/userProfile/userProfileSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: 'Janet O. Mattson',
  title: 'Graphic Designer/Product Designer',
  email: 'JanetOMattson@armyspy.com',
  profileImage: 'path_to_image.jpg'
};

export const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateProfile } = userProfileSlice.actions;

export default userProfileSlice.reducer;