import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {},
  // accessToken: '',
  auth: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      const { accessToken, refresToken, ...user } = action.payload;
      state.user = user;
      state.auth = true;
    },
    logout: (state) => {
      state = initialState;
      return state;
    },
    setPushRcvYn: (state, action) => {
      state.user.pushRcvYn = action.payload;
    },
  },
});

export const { login, logout, setPushRcvYn } = userSlice.actions;

export const selectAuth = (state) => state.user.auth;
export const selectUser = (state) => state.user.user;

export default userSlice.reducer;
