import { configureStore } from '@reduxjs/toolkit';
import dialogReducer from '@features/common/dialogSlice';
import cmnCodeReducer from '@features/common/cmnCodeSlice';
import userReducer from '@features/user/userSlice';
import appReducer from '@features/app/appSlice';

export const store = configureStore({
  reducer: {
    dialog: dialogReducer,
    cmnCode: cmnCodeReducer,
    user: userReducer,
    app: appReducer,
  },
});
