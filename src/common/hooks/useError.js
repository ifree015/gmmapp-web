import { useCallback } from 'react';
import { useStore, useDispatch } from 'react-redux';
import { errorDialog } from '@features/common/dialogSlice';

const useError = () => {
  const store = useStore();
  const dispatch = useDispatch();
  const openAlert = useCallback(async (error, resetError) => {
    await dispatch(
      errorDialog({
        payload: {
          code: error?.code,
          message: error instanceof Error ? error.message : error?.toString(),
        },
        store,
      })
    );
    if (resetError) resetError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return openAlert;
};

export default useError;
