import { useCallback } from 'react';
import { useStore, useDispatch } from 'react-redux';
import { alertSnackbar } from '@features/common/dialogSlice';

const useAlertSnackbar = () => {
  const store = useStore();
  const dispatch = useDispatch();
  const openAlertSnackbar = useCallback(async (severity, message, isSlidable, autoHideDuration) => {
    await dispatch(
      alertSnackbar({
        payload: {
          severity,
          message,
          isSlidable: isSlidable ?? false,
          autoHideDuration: autoHideDuration ?? 2500,
        },
        store,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return openAlertSnackbar;
};

export default useAlertSnackbar;
