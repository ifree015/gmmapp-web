import React, { useEffect, useState, useCallback, useRef } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
// import { css } from '@emotion/react';
import SignatureCanvas from 'react-signature-canvas';
import useAlert from '@common/hooks/useAlert';
import useConfirm from '@common/hooks/useConfirm';
import useAlertSnackbar from '@common/hooks/useAlertSnackbar';
import useError from '@common/hooks/useError';
import useUser from '@common/hooks/useUser';
import { useMutation } from '@common/queries/query';
import { addTrcnDsblSgn } from '@features/trcndsbl/trcnDsblAPI';
import styles from './TrcnDsblSignature.module.css';

// const styles = {
//   signature: css`
//     position: 'absolute';
//     width: '100%';
//     height: '100%';
//   `,
// };

// function toBlob(dataURL) {
//   const binStr = window.atob(dataURL.split(',')[1]);
//   const arr = new Uint8Array(binStr.length);
//   for (let i = 0; i < binStr.length; i++) {
//     arr[i] = binStr.charCodeAt(i);
//   }
//   return new Blob([arr], { type: 'iamge/png' });
// }

export default function TrcnDsblSignatureTab1({ trcnDsbl, canvasStatus, refetch }) {
  const [status, setStatus] = useState('idle');
  const openAlert = useAlert();
  const openConfirm = useConfirm();
  const openAlertSnackbar = useAlertSnackbar();
  const openError = useError();
  const user = useUser();
  const nameCanvasRef = useRef(null);
  const signCanvasRef = useRef(null);

  const { mutate, reset } = useMutation(addTrcnDsblSgn, {
    onMutate: () => {
      setStatus('loading');
    },
    onError: (err) => {
      setStatus('idle');
      openError(err, reset);
    },
    onSuccess: (data, variables) => {
      // queryClient.invalidateQueries(['fetchTrcnDsblSgnList']);
      refetch();
      setStatus('idle');
      (async () => {
        await openAlert(data.message);
        // await openAlertSnackbar('info', data.message, true);
        initCanvas();
      })();
    },
  });

  const initCanvas = useCallback(() => {
    if (nameCanvasRef.current) {
      nameCanvasRef.current.clear();
    }
    if (signCanvasRef.current) {
      signCanvasRef.current.clear();
      // const ctx = signCanvasRef.current.getCanvas().getContext('2d', { willReadFrequently: true });
      // font-style font-variant font-weight font-size line-height font-family
      // ctx.font = '600 24px ' + theme.typography.fontFamily;
      // ctx.fillText('(서명)', signCanvasRef.current.getCanvas().offsetWidth - 96, 80);
    }
  }, []);

  const handleAdd = useCallback(() => {
    if (trcnDsbl.dltYn === 'Y') {
      openAlertSnackbar('error', '이미 취소된 건입니다!');
    } else if (!trcnDsbl.busTrcnErrTypCd || !trcnDsbl.dsblPrcgPicId) {
      openAlertSnackbar(
        'warning',
        '미접수/배정 건은 서명이 불가능합니다. 먼저 접수/배정 해주세요.'
      );
    } else if (user.dprtId !== trcnDsbl.dprtId) {
      openAlertSnackbar('warning', '같은 부서 센터장 또는 사원만 등록이 가능합니다.');
    } else if (signCanvasRef.current.isEmpty()) {
      openAlertSnackbar('warning', '서명을 적어 주세요.');
    } else {
      (async () => {
        const confirmed = await openConfirm('서명', '등록하시겠습니다?');
        if (confirmed) {
          const formData = new FormData();
          formData.append('stlmAreaCd', trcnDsbl.stlmAreaCd);
          formData.append('dsblAcptNo', trcnDsbl.dsblAcptNo);

          if (!nameCanvasRef.current.isEmpty()) {
            const imageBlob = await new Promise((resolve) => {
              //const trimmedCanvas = nameCanvasRef.current.getTrimmedCanvas();
              const trimmedCanvas = nameCanvasRef.current.getCanvas();
              formData.append('imgWide1', trimmedCanvas.width);
              //formData.append('imgHght1', trimmedCanvas.height);
              formData.append('imgHght1', 120);
              // toBlob(trimmedCanvas.toDataURL('image/png'));
              trimmedCanvas.toBlob(resolve, 'image/png');
            });
            formData.append(
              'signature1',
              imageBlob,
              `${trcnDsbl.stlmAreaCd}-${trcnDsbl.dsblAcptNo}-signature-name.png`
            );
            // formData.append('fileSiz1', imageBlob.size);
          }

          const imageBlob = await new Promise((resolve) => {
            //const trimmedCanvas = signCanvasRef.current.getTrimmedCanvas();
            const trimmedCanvas = signCanvasRef.current.getCanvas();
            formData.append('imgWide2', trimmedCanvas.width);
            // formData.append('imgHght2', trimmedCanvas.height);
            formData.append('imgHght2', 120);
            trimmedCanvas.toBlob(resolve, 'image/png');
          });
          formData.append(
            'signature2',
            imageBlob,
            `${trcnDsbl.stlmAreaCd}-${trcnDsbl.dsblAcptNo}-signature-sign.png`
          );
          // formData.append('fileSiz2', signImageBlob.size);

          mutate(formData);
        }
      })();
    }
  }, [trcnDsbl, openAlertSnackbar, openConfirm, mutate, user]);

  useEffect(() => {
    if (canvasStatus === 'init') {
      initCanvas();
    }
  }, [canvasStatus, initCanvas]);

  return (
    <React.Fragment>
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        spacing={0.5}
        mt={2}
        mr={2}
      >
        <Button
          variant="outlined"
          align="right"
          size="small"
          startIcon={<DeleteOutlinedIcon />}
          onClick={initCanvas}
        >
          지우기
        </Button>
        <LoadingButton
          variant="outlined"
          color="secondary"
          size="small"
          // disabled={userRole === USER_ROLE.SELECTOR || trcnDsbl.dltYn === 'Y'}
          disabled={trcnDsbl.dltYn === 'Y'}
          loading={status === 'loading'}
          loadingPosition="start"
          startIcon={<SaveOutlinedIcon />}
          onClick={handleAdd}
        >
          등록
        </LoadingButton>
      </Stack>
      <Paper
        sx={{
          position: 'relative',
          width: 'calc(100% - 32px)',
          height: 120,
          my: 1,
          mx: 2,
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[700],
        }}
      >
        <Grid container sx={{ position: 'absolute', width: '100%', height: '100%' }}>
          <Grid item xs={4} sx={{ my: 1 }}>
            <Divider orientation="vertical" sx={{ ml: 'auto' }} />
          </Grid>
          <Grid item xs={4} sx={{ my: 1 }}>
            <Divider orientation="vertical" sx={{ ml: 'auto' }} />
          </Grid>
        </Grid>
        <SignatureCanvas
          canvasProps={{
            className: styles.signature,
          }}
          ref={nameCanvasRef}
          backgroundColor="rgba(0, 0, 0, 0)"
        />
      </Paper>
      <Paper
        sx={{
          position: 'relative',
          width: 'calc((100% - 32px) * 1)',
          height: 120,
          my: 1,
          mx: 2,
          ml: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[700],
        }}
      >
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: 32 }}
        >
          (서명)
        </Typography>
        <SignatureCanvas
          canvasProps={{
            className: styles.signature,
          }}
          ref={signCanvasRef}
          backgroundColor="rgba(0, 0, 0, 0)"
        />
      </Paper>
      <Typography
        variant="caption"
        align="left"
        color="text.secondary"
        sx={{
          display: 'block',
          ml: 2,
          mb: 1,
          fontWeight: (theme) => theme.typography.fontWeightBold,
        }}
      >
        이름과 서명을 적어 주세요.
      </Typography>
    </React.Fragment>
  );
}
