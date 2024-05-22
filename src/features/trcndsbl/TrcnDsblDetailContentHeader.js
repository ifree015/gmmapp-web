import React, { useState, useEffect, useCallback } from 'react';
import StickyStack from '@components/StickyStack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
// import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import HandymanIcon from '@mui/icons-material/Handyman';
import { useInView } from 'react-intersection-observer';
import useUser from '@common/hooks/useUser';
import useRole from '@common/hooks/useRole';
import useAlert from '@common/hooks/useAlert';
import useConfirm from '@common/hooks/useConfirm';
import useAlertSnackbar from '@common/hooks/useAlertSnackbar';
import useError from '@common/hooks/useError';
// import { USER_ROLE } from '@common/constants/appConstants';
// import ErrorDialog from '@components/ErrorDialog';
import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@common/queries/query';
import { cancelTrcnDsbl } from '@features/trcndsbl/trcnDsblAPI';
import TrcnDsblSignatureDialog from './TrcnDsblSignatureDialog';
import nativeApp from '@common/utils/nativeApp';

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
      queryClient.invalidateQueries(['fetchTrcnDsbl']);
      openAlert(data.message);
      // openAlertSnackbar('info', data.message, true);
    },
  });

  const handleCancel = () => {
    if (userRole.isSelector()) {
      openAlertSnackbar('warning', '조회권한자는 취소가 불가능합니다.');
    } else if (trcnDsbl.dltYn === 'Y') {
      openAlertSnackbar('error', '이미 취소된 건입니다!');
    } else if (trcnDsbl.dsblPrcgFnDtm) {
      openAlertSnackbar('warning', '처리된 건은 취소가 불가능합니다.');
    } else {
      if (user.dprtId !== trcnDsbl.dprtId) {
        openAlertSnackbar('warning', '같은 부서가 아닙니다.');
      }
      (async () => {
        const confirmed = await openConfirm('단말기 장애', '취소하시겠습니다?');
        if (confirmed) {
          mutate({ stlmAreaCd: trcnDsbl.stlmAreaCd, dsblAcptNo: trcnDsbl.dsblAcptNo });
        }
      })();
    }
  };

  const handleAccept = () => {
    if (userRole.isSelector()) {
      openAlertSnackbar('warning', '조회권한자는 접수가 불가능합니다.');
    } else if (trcnDsbl.dltYn === 'Y') {
      openAlertSnackbar('error', '이미 취소된 건입니다!');
    } else if (trcnDsbl.dsblPrcgFnDtm) {
      openAlertSnackbar('warning', '처리된 건은 접수가 불가능합니다.');
      // } else if (user.intgAstsBzDvsCd !== trcnDsbl.intgAstsBzDvsCd) {
      //   openAlertSnackbar(
      //     'warning',
      //     `같은 지역(${trcnDsbl.intgAstsBzDvsNm}) 직원만 접수가 가능합니다.`
      //   );
    } else {
      onAccept();
    }
  };

  const handleProcess = () => {
    if (userRole.isSelector()) {
      openAlertSnackbar('warning', '조회권한자는 처리가 불가능합니다.');
    } else if (trcnDsbl.dltYn === 'Y') {
      openAlertSnackbar('error', '이미 취소된 건입니다!');
    } else if (!trcnDsbl.dsblPrcgPicId) {
      openAlertSnackbar('warning', '미배정 건은 처리가 불가능합니다. 먼저 배정 해주세요.');
      // } else if (user.intgAstsBzDvsCd !== trcnDsbl.intgAstsBzDvsCd) {
      //   openAlertSnackbar(
      //     'warning',
      //     `같은 지역(${trcnDsbl.intgAstsBzDvsNm}) 직원만 처리가 가능합니다.`
      //   );
    } else {
      onProcess();
    }
  };

  const handleSignature = () => {
    if (nativeApp.isIOS()) {
      nativeApp.modalView(
        `/trcndsbl/trcndsbl/${trcnDsbl.stlmAreaCd}/${trcnDsbl.dsblAcptNo}/trcndsblsgn`,
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
        sx={{
          bgcolor: sticky ? 'background.paper' : 'inherit',
          top: 0,
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
          startIcon={<CancelOutlinedIcon />}
          onClick={handleCancel}
        >
          취소
        </LoadingButton>
        <LoadingButton
          variant="contained"
          color="secondary"
          size="small"
          disabled={trcnDsbl.dltYn === 'Y' || tabIndex !== 0}
          loading={acceptStatus === 'loading'}
          loadingPosition="start"
          startIcon={<AssignmentOutlinedIcon />}
          onClick={handleAccept}
        >
          접수
        </LoadingButton>
        <LoadingButton
          variant="contained"
          color="secondary"
          size="small"
          disabled={trcnDsbl.dltYn === 'Y' || tabIndex !== 1}
          loading={processStatus === 'loading'}
          loadingPosition="start"
          startIcon={<HandymanIcon />}
          onClick={handleProcess}
        >
          처리
        </LoadingButton>
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<EditOutlinedIcon />}
          onClick={handleSignature}
        >
          서명
        </Button>
      </StickyStack>
      <TrcnDsblSignatureDialog open={signature} onClose={closeSignature} trcnDsbl={trcnDsbl} />
    </React.Fragment>
  );
}
