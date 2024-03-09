import React, { useState, useEffect } from 'react';
import StickyStack from '@components/StickyStack';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { useInView } from 'react-intersection-observer';
import useRole from '@common/hooks/useRole';
import useAlertSnackbar from '@common/hooks/useAlertSnackbar';

export default function TropDetailContentHeader({ tabIndex, updateStatus, onUpdate }) {
  const [sticky, setSticky] = useState(undefined);
  const userRole = useRole();
  const openAlertSnackbar = useAlertSnackbar();
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

  const handleUpdate = () => {
    if (userRole.isSelector()) {
      openAlertSnackbar('warning', '조회권한자는 수정이 불가능합니다.');
    } else {
      onUpdate();
    }
  };

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
          color="secondary"
          size="small"
          disabled={tabIndex !== 0}
          loading={updateStatus === 'loading'}
          loadingPosition="start"
          startIcon={<SaveOutlinedIcon />}
          onClick={handleUpdate}
        >
          수정
        </LoadingButton>
      </StickyStack>
    </React.Fragment>
  );
}
