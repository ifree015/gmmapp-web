import { useSelector, useDispatch } from 'react-redux';
import { selectCmnCode, addCmdCode } from '@features/common/cmnCodeSlice';
import { useQuery } from '@common/queries/query';
import { fetchCommonCode } from '@features/common/commonAPI';

export default function useAsyncCmmCode(cmnCdId, params, defaultCmnCode) {
  const cmnCode = useSelector((state) => {
    return selectCmnCode(state, cmnCdId);
  });

  const dispatch = useDispatch();
  const { refetch } = useQuery(
    ['cmnCode', cmnCdId],
    () => fetchCommonCode({ cmnCdId, ...params }),
    {
      suspense: false,
      // refetchOnMount, refetchOnReconnect, refetchOnWindowFocus, ...
      enabled: false,
      onSuccess: ({ data }) => {
        dispatch(addCmdCode({ cmnCdId: cmnCdId, cmnCd: data }));
      },
    }
  );

  return [cmnCode ?? defaultCmnCode, refetch];
}
