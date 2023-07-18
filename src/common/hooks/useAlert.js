import { useCallback } from 'react';
import { useStore, useDispatch } from 'react-redux';
import { alertDialog } from '@features/common/dialogSlice';

const useAlert = () => {
  const store = useStore();
  const dispatch = useDispatch();
  const openAlert = useCallback(async (message) => {
    await dispatch(alertDialog({ payload: message, store }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return openAlert;
};

export default useAlert;
