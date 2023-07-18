import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  alert: { open: false, message: '' },
  confirm: { open: false, title: '', message: '', confirmed: false },
  alertSnackbar: {
    open: false,
    severity: 'warning',
    message: '',
    isSlidable: false,
    autoHideDuration: 0,
  },
  error: { open: false, error: null },
};

export const alertDialog = createAsyncThunk(
  'alertDialog',
  ({ payload, store }, { getState, dispatch }) => {
    dispatch(openAlertDialog(payload));
    return new Promise((resolve) => {
      const unsubscribe = store.subscribe(() => {
        if (!getState().dialog.alert.open) {
          unsubscribe();
          resolve();
        }
      });
    });
  }
);

export const confirmDialog = createAsyncThunk(
  'confirmDialog',
  ({ payload, store }, { getState, dispatch }) => {
    dispatch(openConfirmDialog(payload));
    return new Promise((resolve) => {
      const unsubscribe = store.subscribe(() => {
        if (!getState().dialog.confirm.open) {
          unsubscribe();
          resolve(getState().dialog.confirm.confirmed);
        }
      });
    });
  }
);

export const alertSnackbar = createAsyncThunk(
  'alertSnackbar',
  ({ payload, store }, { getState, dispatch }) => {
    dispatch(openAlertSnackbar(payload));
    return new Promise((resolve) => {
      const unsubscribe = store.subscribe(() => {
        if (!getState().dialog.alertSnackbar.open) {
          unsubscribe();
          resolve();
        }
      });
    });
  }
);

export const errorDialog = createAsyncThunk(
  'errorDialog',
  ({ payload, store }, { getState, dispatch }) => {
    dispatch(openErrorDialog(payload));
    return new Promise((resolve) => {
      const unsubscribe = store.subscribe(() => {
        if (!getState().dialog.error.open) {
          unsubscribe();
          resolve();
        }
      });
    });
  }
);

export const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    openAlertDialog: (state, action) => {
      state.alert = { open: true, message: action.payload };
    },
    closeAlertDialog: (state, action) => {
      state.alert = { ...state.alert, open: false };
    },
    openConfirmDialog: (state, action) => {
      state.confirm = { open: true, ...action.payload };
    },
    closeConfirmDialog: (state, action) => {
      state.confirm = { ...state.confirm, open: false, confirmed: action.payload };
    },
    openAlertSnackbar: (state, action) => {
      state.alertSnackbar = { open: true, ...action.payload };
    },
    closeAlertSnackbar: (state, action) => {
      state.alertSnackbar = { ...state.alertSnackbar, open: false };
    },
    openErrorDialog: (state, action) => {
      state.error = { open: true, error: action.payload };
    },
    closeErrorDialog: (state, action) => {
      state.error = { ...state.error, open: false };
    },
  },
});

export const {
  openAlertDialog,
  closeAlertDialog,
  openConfirmDialog,
  closeConfirmDialog,
  openAlertSnackbar,
  closeAlertSnackbar,
  openErrorDialog,
  closeErrorDialog,
} = dialogSlice.actions;

export const selectAlert = (state) => state.dialog.alert;
export const selectConfirm = (state) => state.dialog.confirm;
export const selectAlertSnackbar = (state) => state.dialog.alertSnackbar;
export const selectError = (state) => state.dialog.error;

export default dialogSlice.reducer;
