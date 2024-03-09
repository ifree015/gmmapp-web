import React, { useState, useEffect, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import useApp from '@common/hooks/useApp';
import { useQuery } from '@common/queries/query';
import { fetchLstAppVer } from '@features/app/appAPI';

export default function AppVerCheck() {
  const [open, setOpen] = useState(true);
  const appInfo = useApp();

  const { data, refetch } = useQuery(['fetchLstAppVer'], () => fetchLstAppVer(appInfo), {
    enabled: false,
    suspense: false,
    useErrorBoundary: false,
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
    setOpen(false);
  }, []);

  const ntfcTtlNm = data?.data.ntfcTtlNm ?? 'App Update 알림';
  const ntfcCtt =
    data?.data.ntfcCtt ??
    `새 버전<strong>(${data?.data.moappVer})</strong>의 App을 설치하시겠습니까?`;

  if (!data?.data.moappVer || (appInfo && data?.data.moappVer === appInfo.moappVer)) return null;
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
