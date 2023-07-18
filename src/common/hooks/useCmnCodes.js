import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCmnCodes, addCmdCode } from '@features/common/cmnCodeSlice';
import { useQueries } from '@common/queries/query';
import { fetchCommonCode } from '@features/common/commonAPI';

export default function useCmnCodes(cmnCdParams) {
  const cmnCodes = useSelector((state) => {
    return selectCmnCodes(
      state,
      cmnCdParams.map((cmnCdParam) => cmnCdParam.cmnCdId)
    );
  });

  const dispatch = useDispatch();
  const queries = useMemo(
    () =>
      cmnCdParams
        .filter((cmnCdParam, index) => !cmnCodes[index])
        .map((cmnCdParam) => ({
          queryKey: ['cmnCode', cmnCdParam.cmnCdId],
          queryFn: () => fetchCommonCode({ cmnCdId: cmnCdParam.cmnCdId, ...cmnCdParam.params }),
          enabled: true,
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
          onSuccess: ({ data }) => {
            dispatch(addCmdCode({ cmnCdId: cmnCdParam.cmnCdId, cmnCd: data }));
          },
        })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const results = useQueries({
    queries: queries,
  });

  const isFetching = results.some((result) => result.isFetching);
  const isError = results.some((result) => result.isError);
  return [
    isFetching,
    isError,
    isError ? results.find((result) => result.isError).error : null,
    cmnCodes,
  ];
}
