import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  app: { moappVer: '' },
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setApp: (state, action) => {
      state.app = action.payload;
    },
  },
});

export const { setApp } = appSlice.actions;

export const selectApp = (state) => (state.app.app.moappVer ? state.app.app : null);

export default appSlice.reducer;
