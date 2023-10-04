import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { useInView } from 'react-intersection-observer';
import { useQueryClient } from '@tanstack/react-query';
import { useQuery, useMutation } from '@common/queries/query';
import { fetchNtfcPtNcnt, deleteAllNtfcPt } from '@features/notification/notificationAPI';
import useUser from '@common/hooks/useUser';
import { NOTIFICATION_CATEGORY } from '@common/constants/appConstants';
import useSmUp from '@common/hooks/useSmUp';
// import useAlert from '@common/hooks/useAlert';
import useAlertSnackbar from '@common/hooks/useAlertSnackbar';
import useConfirm from '@common/hooks/useConfirm';
import useError from '@common/hooks/useError';
import LoadingSpinner from '@components/LoadingSpinner';
import nativeApp from '@common/utils/nativeApp';

const StickyStack = styled(Stack)(({ theme }) => ({
  margin: theme.spacing(0, -2, 0, -2),
  padding: theme.spacing(1, 2),
  position: 'sticky',
  top: 48,
  // justifyContent: 'center',
  [theme.breakpoints.up('sm')]: {
    margin: theme.spacing(0, -3, 0, -3),
    padding: theme.spacing(1, 3),
    top: 48,
    // justifyContent: 'flex-start',
  },
  zIndex: theme.zIndex.appBar + 1,
}));

export default function NotificationHeader({ queryParams, changeCategoryId }) {
  const [sticky, setSticky] = useState(false);
  const queryClient = useQueryClient();
  const user = useUser();
  const isSmUp = useSmUp();
  // const openAlert = useAlert();
  const openAlertSnackbar = useAlertSnackbar();
  const openConfirm = useConfirm();
  const openError = useError();
  const [ref, inView] = useInView({
    threshold: 1,
    initialInView: nativeApp.isIOS() ? false : true,
    rootMargin: isSmUp
      ? `-${nativeApp.isIOS() ? 1 : 49}px 0px 0px 0px`
      : `-${nativeApp.isIOS() ? 1 : 49}px 0px 0px 0px`,
  });
  const delayInView = useRef(false);

  const { data, refetch } = useQuery(
    ['readNtfcPtNcnt', queryParams.categoryId],
    () => fetchNtfcPtNcnt(queryParams),
    {
      suspense: false,
      useErrorBoundary: false,
      // onError: (err) => {},
    }
  );

  const { mutate, isLoading, reset } = useMutation(deleteAllNtfcPt, {
    onError: (err) => {
      openError(err, reset);
    },
    onSuccess: (data) => {
      (async () => {
        // await openAlert(data.message);
        refetch();
        queryClient.invalidateQueries(['readNtfcPtList', queryParams.categoryId]);
        await openAlertSnackbar('info', data.message, true);
      })();
    },
  });

  useEffect(() => {
    if (!inView && !delayInView.current) {
      delayInView.current = true;
    } else {
      setSticky(!inView);
    }
  }, [inView]);

  return (
    <React.Fragment>
      <LoadingSpinner open={isLoading} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mt: 2,
          py: 1,
        }}
      >
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}
        >
          {`${user.userId}(${user.userNm})`}
        </Typography>
        <ChevronRightOutlinedIcon sx={{ color: (theme) => theme.palette.grey[500] }} />
        {data?.data.ntfcNcnt > 0 ? (
          <Chip
            label="전체삭제"
            size="small"
            sx={{ ml: 'auto' }}
            onDelete={() => {
              (async () => {
                const confirmed = await openConfirm('알림', '전체 삭제하시겠습니다?');
                if (confirmed) {
                  mutate(queryParams);
                }
              })();
            }}
          />
        ) : null}
      </Box>
      <StickyStack
        direction="row"
        spacing={{ xs: 0.5, sm: 1 }}
        sx={{
          bgcolor: sticky ? 'background.paper' : 'inherit',
          top: { xs: `${nativeApp.isIOS() ? 0 : 48}px`, sm: `${nativeApp.isIOS() ? 0 : 48}px` },
        }}
        component="header"
        ref={ref}
      >
        {Object.entries(NOTIFICATION_CATEGORY).map(([, category]) => {
          return (
            <Chip
              label={category.title}
              color="primary"
              variant={category.id === queryParams.categoryId ? 'filled' : 'outlined'}
              onClick={
                category.id === queryParams.categoryId
                  ? null
                  : () => {
                      changeCategoryId(category.id);
                    }
              }
              key={category.id}
            ></Chip>
          );
        })}
      </StickyStack>
    </React.Fragment>
  );
}
