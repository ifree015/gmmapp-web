import React, { useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import Alert from '@mui/material/Alert';
import dayjs from 'dayjs';
// import useAlert from '@common/hooks/useAlert';
import useConfirm from '@common/hooks/useConfirm';
import useAlertSnackbar from '@common/hooks/useAlertSnackbar';
import useError from '@common/hooks/useError';
import useUser from '@common/hooks/useUser';
import useRole from '@common/hooks/useRole';
import LoadingSpinner from '@components/LoadingSpinner';
import { useMutation } from '@common/queries/query';
import { deleteTrcnDsblSgn } from '@features/trcndsbl/trcnDsblAPI';
import { API_ROOT_URL } from '@common/constants/appEnv';

export default function TrcnDsblSignatureTab2({ trcnDsbl, sgns, refetch }) {
  const theme = useTheme();
  // const openAlert = useAlert();
  const openConfirm = useConfirm();
  const openAlertSnackbar = useAlertSnackbar();
  const openError = useError();
  const user = useUser();
  const userRole = useRole();

  const {
    mutate,
    isLoading,
    reset: deleteErrorReset,
  } = useMutation(deleteTrcnDsblSgn, {
    onError: (err) => {
      openError(err, deleteErrorReset);
    },
    onSuccess: (data, variables) => {
      // queryClient.invalidateQueries(['fetchTrcnDsblSgnList']);
      (async () => {
        // await openAlert(data.message);
        refetch();
        await openAlertSnackbar('info', data.message, true);
      })();
    },
  });

  const handleDelete = useCallback(
    (trcnDsblSgn) => {
      if (userRole.isSelector()) {
        openAlertSnackbar('warning', '조회권한자는 서명 삭제가 불가능합니다.');
      } else if (trcnDsbl.dltYn === 'Y') {
        openAlertSnackbar('error', '이미 취소된 건입니다!');
      } else if (
        user.userId !== trcnDsblSgn.aproId &&
        !userRole.isCenterLeader() &&
        !userRole.isManager()
      ) {
        openAlertSnackbar('warning', '서명 사원이거나 센터장 또는 팀장만 삭제가 가능합니다.');
      } else if (trcnDsblSgn.imgSno < trcnDsblSgn.lstImgSno) {
        openAlertSnackbar('warning', '현재 서명 이후 등록된 결재 서명이 존재합니다.');
      } else {
        if (user.dprtId !== trcnDsbl.dprtId) {
          openAlertSnackbar('warning', '같은 부서가 아닙니다.');
        }
        (async () => {
          const confirmed = await openConfirm('서명', '삭제하시겠습니다?');
          if (confirmed) {
            mutate({
              stlmAreaCd: trcnDsblSgn.stlmAreaCd,
              dsblAcptNo: trcnDsblSgn.dsblAcptNo,
              crtnDtm: trcnDsblSgn.crtnDtm,
            });
          }
        })();
      }
    },
    [trcnDsbl, openAlertSnackbar, openConfirm, mutate, user, userRole]
  );

  return (
    <React.Fragment>
      <LoadingSpinner open={isLoading} />
      <ImageList cols={1} gap={16} sx={{ width: 'calc(100% - 32px)', m: 2 }}>
        {sgns?.data.length > 0 ? (
          sgns.data.map((trcnDsblSgn) => {
            const queryParams = new URLSearchParams({
              stlmAreaCd: trcnDsblSgn.stlmAreaCd,
              dsblAcptNo: trcnDsblSgn.dsblAcptNo,
              crtnDtm: trcnDsblSgn.crtnDtm,
            });
            return (
              <ImageListItem
                key={trcnDsblSgn.crtnDtm}
                sx={{
                  '&.MuiImageListItem-root:last-child': { mb: 2 },
                  '& .MuiImageListItem-img': {
                    objectFit: 'scale-down',
                  },
                  'backgroundColor': (theme) =>
                    theme.palette.mode === 'light'
                      ? theme.palette.grey[50]
                      : theme.palette.grey[700],
                }}
              >
                {trcnDsblSgn.imgCnt > 1 ? (
                  <img
                    src={`${API_ROOT_URL}/trcndsbl/LoadTrcnDsblSgn.ajax?${queryParams.toString()}&imgSno=${
                      trcnDsblSgn.imgSno - 1
                    }`}
                    alt={trcnDsblSgn.crtnDtm + '-name'}
                    // loading="lazy"
                    style={{
                      border: `1px solid ${theme.palette.divider}`,
                      borderBottom: 'none',
                      height: trcnDsblSgn.imgHght,
                    }}
                  />
                ) : null}
                <img
                  src={`${API_ROOT_URL}/trcndsbl/LoadTrcnDsblSgn.ajax?${queryParams.toString()}&imgSno=${
                    trcnDsblSgn.imgSno
                  }`}
                  alt={trcnDsblSgn.crtnDtm + '-sign'}
                  // loading="lazy"
                  style={{
                    border: `1px solid ${theme.palette.divider}`,
                    height: trcnDsblSgn.imgHght,
                  }}
                />
                <ImageListItemBar
                  actionIcon={
                    <IconButton onClick={() => handleDelete(trcnDsblSgn)}>
                      <ClearOutlinedIcon />
                    </IconButton>
                  }
                  position="top"
                  sx={{ bgcolor: 'transparent' }}
                />
                <ImageListItemBar
                  actionIcon={
                    <IconButton color="inherit">
                      <HistoryOutlinedIcon />
                    </IconButton>
                  }
                  actionPosition="left"
                  title={`${dayjs(trcnDsblSgn.crtnDtm, 'YYYYMMDDHHmmss').format(
                    'YYYY.MM.DD HH:mm'
                  )}, ${trcnDsblSgn.aproName}`}
                  subtitle={trcnDsblSgn.picOpnCtt}
                  position="below"
                  sx={{
                    // 'background': 'linear-gradient(to left, #81d4fa, #03a9f4)', //info.light(#03a9f4)
                    'backgroundColor': (theme) =>
                      theme.palette.mode === 'light' ? 'info.light' : 'info.dark',
                    'color': (theme) => theme.palette.text.secondary2,
                    '& .MuiImageListItemBar-subtitle': { whiteSpace: 'wrap', pr: 1 },
                  }}
                />
              </ImageListItem>
            );
          })
        ) : (
          <Box>
            <Alert severity="info" sx={{ flexGrow: 1, mb: 2 }}>
              등록된 서명이 없습니다.
            </Alert>
          </Box>
        )}
      </ImageList>
    </React.Fragment>
  );
}
