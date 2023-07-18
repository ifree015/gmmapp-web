import { useSelector, useDispatch } from 'react-redux';
import { selectCmnCode, addCmdCode } from '@features/common/cmnCodeSlice';
import { useQuery } from '@common/queries/query';
import { fetchCommonCode } from '@features/common/commonAPI';

export default function useCmmCode(cmnCdId, params) {
  const cmnCode = useSelector((state) => {
    return selectCmnCode(state, cmnCdId);
  });

  const dispatch = useDispatch();
  useQuery(['cmnCode', cmnCdId], () => fetchCommonCode({ cmnCdId, ...params }), {
    enabled: cmnCode ? false : true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    onSuccess: ({ data }) => {
      dispatch(addCmdCode({ cmnCdId: cmnCdId, cmnCd: data }));
    },
  });

  return cmnCode;
}
