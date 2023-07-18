import { useCallback } from 'react';
import { useStore, useDispatch } from 'react-redux';
import { confirmDialog } from '@features/common/dialogSlice';

const useConfirm = () => {
  const store = useStore();
  const dispatch = useDispatch();
  const openConfirm = useCallback(async (title, message) => {
    const { payload } = await dispatch(confirmDialog({ payload: { title, message }, store }));
    return payload;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return openConfirm;
};

export default useConfirm;
