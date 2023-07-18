import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import { selectMoappVer, setMoappVer } from './appSlice';
import { useQuery } from '@common/queries/query';
import { fetchLstAppVer } from '@features/app/appAPI';
import useNativeCall from '@common/hooks/useNativeCall';

export default function AppVerCheck() {
  const [open, setOpen] = useState(true);
  const appInfo = useNativeCall('getAppInfo');
  const moappVer = useSelector(selectMoappVer);
  const dispatch = useDispatch();

  const { data, refetch } = useQuery(['readLstAppVer'], () => fetchLstAppVer(appInfo), {
    enabled: false,
    suspense: false,
    useErrorBoundary: false,
    // onError: (err) => {
    //   console.log(err);
    // },
  });

  useEffect(() => {
    if (appInfo) {
      refetch();
    }
  }, [appInfo, refetch]);

  const handleInstall = useCallback(() => {
    if (data.data.rnwlNedYn !== 'Y') {
      setOpen(false);
    }
    window.open(data.data.cnctMoappUrlVal, '_blank');
  }, [data]);

  const handleClose = useCallback(() => {
    dispatch(setMoappVer(data.data.moappVer));
    setOpen(false);
  }, [dispatch, data]);

  const ntfcTtlNm = data?.data.ntfcTtlNm ?? 'App Update 알림';
  const ntfcCtt =
    data?.data.ntfcCtt ??
    `새 버전<strong>(${data?.data.moappVer})</strong>의 App을 설치하시겠습니까?`;

  if (!data?.data.moappVer || data?.data.moappVer === moappVer) return null;
  return (
    <Dialog open={open} aria-describedby="app-dialog-description">
      <Alert severity="info">
        <AlertTitle>{ntfcTtlNm}</AlertTitle>
        <span dangerouslySetInnerHTML={{ __html: ntfcCtt }} />
      </Alert>
      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          autoFocus
          onClick={() => handleInstall()}
        >
          설치
        </Button>
        {data.data.rnwlNedYn !== 'Y' ? (
          <Button variant="contained" fullWidth onClick={handleClose}>
            취소
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  );
}
