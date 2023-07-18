import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  app: { moappVer: '' },
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setMoappVer: (state, action) => {
      state.app.moappVer = action.payload;
    },
  },
});

export const { setMoappVer } = appSlice.actions;

export const selectMoappVer = (state) => state.app.app.moappVer;

export default appSlice.reducer;
