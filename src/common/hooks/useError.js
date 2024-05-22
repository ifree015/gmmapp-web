import { useCallback } from 'react';
import { useStore, useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { errorDialog } from '@features/common/dialogSlice';

const useError = () => {
  const store = useStore();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
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
    if (Array.isArray(resetError)) {
      queryClient.resetQueries(resetError);
    } else if (typeof resetError === 'string') {
      queryClient.resetQueries([resetError]);
    } else if (resetError) {
      resetError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return openAlert;
};

export default useError;
