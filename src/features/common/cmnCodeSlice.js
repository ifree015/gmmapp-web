import { createSlice } from '@reduxjs/toolkit';

const initialState = { cmnCds: {} };

export const cmnCodeSlice = createSlice({
  name: 'cmnCode',
  initialState,
  reducers: {
    addCmdCode: (state, action) => {
      state.cmnCds[action.payload.cmnCdId] = action.payload.cmnCd;
    },
  },
});

export const { addCmdCode } = cmnCodeSlice.actions;
export const selectCmnCode = (state, cmnCdId) => state.cmnCode.cmnCds[cmnCdId];
export const selectCmnCodes = (state, cmnCdIds) =>
  cmnCdIds.map((cmnCdId) => state.cmnCode.cmnCds[cmnCdId]);
export const selectCmnCodeName = (state, cmnCdId, code) =>
  state.cmnCode.cmnCds[cmnCdId]?.find((cmnCd) => cmnCd.code === code)?.name;

export default cmnCodeSlice.reducer;
