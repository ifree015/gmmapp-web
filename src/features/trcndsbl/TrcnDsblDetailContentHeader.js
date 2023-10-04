import React, { useState, useEffect, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import CancelIcon from '@mui/icons-material/Cancel';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { useInView } from 'react-intersection-observer';
import useUser from '@common/hooks/useUser';
import useRole from '@common/hooks/useRole';
import useAlert from '@common/hooks/useAlert';
import useConfirm from '@common/hooks/useConfirm';
import useAlertSnackbar from '@common/hooks/useAlertSnackbar';
import useError from '@common/hooks/useError';
import { USER_ROLE } from '@common/constants/appConstants';
// import ErrorDialog from '@components/ErrorDialog';
import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@common/queries/query';
import { cancelTrcnDsbl } from '@features/trcndsbl/trcnDsblAPI';
import TrcnDsblSignatureDialog from './TrcnDsblSignatureDialog';
import nativeApp from '@common/utils/nativeApp';

const StickyStack = styled(Stack)(({ theme }) => ({
  margin: theme.spacing(0, -2, 0, -2),
  padding: theme.spacing(1, 2),
  position: 'sticky',
  top: 0,
  // justifyContent: 'center',
  [theme.breakpoints.up('sm')]: {
    margin: theme.spacing(0, -3, 0, -3),
    padding: theme.spacing(1, 3),
    top: 0,
    // justifyContent: 'flex-start',
  },
  zIndex: theme.zIndex.appBar + 1,
}));

export default function TrcnDsblDetailContentHeader({
  trcnDsbl,
  tabIndex,
  acceptStatus,
  onAccept,
  processStatus,
  onProcess,
}) {
  const [sticky, setSticky] = useState(undefined);
  const [signature, setSignature] = useState(false);
  const user = useUser();
  const userRole = useRole();
  const openAlert = useAlert();
  const openConfirm = useConfirm();
  const openAlertSnackbar = useAlertSnackbar();
  const openError = useError();
  const queryClient = useQueryClient();
  const [ref, inView] = useInView({
    threshold: 1,
    initialInView: true,
    rootMargin: '-1px 0px 0px 0px',
  });

  useEffect(() => {
    if (sticky === undefined) {
      setSticky(false);
    } else {
      setSticky(!inView);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const { mutate, isLoading, reset } = useMutation(cancelTrcnDsbl, {
    onError: (err) => {
      openError(err, reset);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['readTrcnDsbl']);
      openAlert(data.message);
      // openAlertSnackbar('info', data.message, true);
    },
  });

  const handleCancel = () => {
    if (trcnDsbl.dltYn === 'Y') {
      openAlertSnackbar('error', '이미 취소된 건입니다!');
    } else if (trcnDsbl.dsblPrcgFnDtm) {
      openAlertSnackbar('warning', '처리된 건은 취소가 불가능합니다.');
    } else if (
      user.dprtId !== trcnDsbl.dprtId ||
      (userRole !== USER_ROLE.MANAGER && user.userId !== trcnDsbl.dsblPrcgPicId)
    ) {
      openAlertSnackbar('warning', '같은 부서 센터장 또는 배정 사원만 취소가 가능합니다.');
    } else {
      (async () => {
        const confirmed = await openConfirm('단말기 장애', '취소하시겠습니다?');
        if (confirmed) {
          mutate({ stlmAreaCd: trcnDsbl.stlmAreaCd, dsblAcptNo: trcnDsbl.dsblAcptNo });
        }
      })();
    }
  };

  const handleAccept = () => {
    if (trcnDsbl.dltYn === 'Y') {
      openAlertSnackbar('error', '이미 취소된 건입니다!');
    } else if (trcnDsbl.dsblPrcgFnDtm) {
      openAlertSnackbar('warning', '처리된 건은 접수가 불가능합니다.');
    } else if (
      !trcnDsbl.dprtId &&
      (userRole !== USER_ROLE.MANAGER || user.intgAstsBzDvsCd !== trcnDsbl.intgAstsBzDvsCd)
    ) {
      openAlertSnackbar('warning', '오배정 건은 같은 지역 센터장만 접수가 가능합니다.');
    } else if (trcnDsbl.dprtId && user.dprtId !== trcnDsbl.dprtId) {
      openAlertSnackbar('warning', '같은 부서 센터장 또는 사원만 접수가 가능합니다.');
    } else {
      onAccept();
    }
  };

  const handleProcess = () => {
    if (trcnDsbl.dltYn === 'Y') {
      openAlertSnackbar('error', '이미 취소된 건입니다!');
    } else if (!trcnDsbl.busTrcnErrTypCd || !trcnDsbl.dsblPrcgPicId) {
      openAlertSnackbar(
        'warning',
        '미접수/배정 건은 처리가 불가능합니다. 먼저 접수/배정 해주세요.'
      );
    } else if (user.dprtId !== trcnDsbl.dprtId) {
      openAlertSnackbar('warning', '같은 부서 센터장 또는 사원만 처리가 가능합니다.');
    } else {
      onProcess();
    }
  };

  const handleSignature = () => {
    if (nativeApp.isIOS()) {
      nativeApp.modalView(
        `/trcndsbl/trcndsblsignature/${trcnDsbl.stlmAreaCd}/${trcnDsbl.dsblAcptNo}`,
        {
          title: '서명',
          presentationStyle: 'overFull',
        }
      );
    } else {
      setSignature(true);
    }
  };

  const closeSignature = useCallback(() => {
    setSignature(false);
  }, []);

  return (
    <React.Fragment>
      <StickyStack
        component="header"
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        spacing={0.5}
        mt={3}
        sx={{
          bgcolor: sticky ? 'background.paper' : 'inherit',
          // boxShadow: sticky ? 1 : 0,
        }}
        ref={ref}
      >
        <LoadingButton
          variant="contained"
          color="warning"
          size="small"
          // disabled={userRole === USER_ROLE.SELECTOR || trcnDsbl.dltYn === 'Y'}
          disabled={trcnDsbl.dltYn === 'Y'}
          loading={isLoading}
          loadingPosition="start"
          startIcon={<CancelIcon />}
          onClick={handleCancel}
        >
          취소
        </LoadingButton>
        <LoadingButton
          variant="contained"
          color="secondary"
          size="small"
          // disabled={userRole === USER_ROLE.SELECTOR || trcnDsbl.dltYn === 'Y' || tabIndex !== 0}
          disabled={trcnDsbl.dltYn === 'Y' || tabIndex !== 0}
          loading={acceptStatus === 'loading'}
          loadingPosition="start"
          startIcon={<AssignmentIndIcon />}
          onClick={handleAccept}
        >
          접수/배정
        </LoadingButton>
        <LoadingButton
          variant="contained"
          color="secondary"
          size="small"
          // disabled={userRole === USER_ROLE.SELECTOR || trcnDsbl.dltYn === 'Y' || tabIndex !== 1}
          disabled={trcnDsbl.dltYn === 'Y' || tabIndex !== 1}
          loading={processStatus === 'loading'}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          onClick={handleProcess}
        >
          처리
        </LoadingButton>
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<EditIcon />}
          onClick={handleSignature}
        >
          서명
        </Button>
      </StickyStack>
      <TrcnDsblSignatureDialog open={signature} onClose={closeSignature} trcnDsbl={trcnDsbl} />
    </React.Fragment>
  );
}
