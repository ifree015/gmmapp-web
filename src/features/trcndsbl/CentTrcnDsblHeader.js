import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import useUser from '@common/hooks/useUser';
import useRole from '@common/hooks/useRole';
import { USER_ROLE, CENT_TRCN_DSBL_CATEGORY } from '@common/constants/appConstants';
import { useInView } from 'react-intersection-observer';
import useSmUp from '@common/hooks/useSmUp';
import dayjs from 'dayjs';
import nativeApp from '@common/utils/nativeApp';

const StickyStack = styled(Stack)(({ theme }) => ({
  margin: theme.spacing(2, -2, 0, -2),
  padding: theme.spacing(1, 2),
  position: 'sticky',
  top: 48,
  // justifyContent: 'center',
  [theme.breakpoints.up('sm')]: {
    margin: theme.spacing(2, -3, 0, -3),
    padding: theme.spacing(1, 3),
    top: 48,
    // justifyContent: 'flex-start',
  },
  zIndex: theme.zIndex.appBar + 1,
}));

export default function CentTrcnDsblHeader() {
  const [sticky, setSticky] = useState(undefined);
  const user = useUser();
  const userRole = useRole();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParams = {
    categoryId: searchParams.get('categoryId') ?? CENT_TRCN_DSBL_CATEGORY.CENT_ALL.id,
    dsblAcptDt: searchParams.get('dsblAcptDt') ?? dayjs().format('YYYYMMDD'),
    dprtId: searchParams.get('dprtId')
      ? searchParams.get('dprtId')
      : userRole === USER_ROLE.SELECTOR
      ? ''
      : user.dprtId,
    dsblPrcgPicId: searchParams.get('dsblPrcgPicId') ?? user.userId,
    dsblPrsrName: searchParams.get('dsblPrsrName') ?? user.userNm,
    dsblPrcgDt: searchParams.get('dsblPrcgDt') ?? dayjs().format('YYYYMMDD'),
    backButton: searchParams.get('backButton') ?? '',
  };
  const isSmUp = useSmUp();
  const [ref, inView] = useInView({
    threshold: 1,
    initialInView: true,
    rootMargin: isSmUp
      ? `-${nativeApp.isIOS() ? 1 : 49}px 0px 0px 0px`
      : `-${nativeApp.isIOS() ? 1 : 49}px 0px 0px 0px`,
  });

  useEffect(() => {
    // if (sticky === undefined) {
    //   setSticky(false);
    // } else {
    setSticky(!inView);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <StickyStack
      direction="row"
      spacing={{ xs: 0.5, sm: 1 }}
      sx={{
        bgcolor: sticky ? 'background.paper' : 'inherit',
        // boxShadow: sticky ? 1 : 0,
        top: { xs: `${nativeApp.isIOS() ? 0 : 48}px`, sm: `${nativeApp.isIOS() ? 0 : 48}px` },
        my: 1.5,
      }}
      component="header"
      ref={ref}
    >
      {Object.entries(CENT_TRCN_DSBL_CATEGORY).map(([, category]) => {
        return (
          <Chip
            label={category.title}
            color="primary"
            variant={category.id === queryParams['categoryId'] ? 'filled' : 'outlined'}
            onClick={
              category.id === queryParams['categoryId']
                ? null
                : () => {
                    queryParams.categoryId = category.id;
                    setSearchParams(new URLSearchParams(queryParams), { replace: true });
                  }
            }
            disabled={
              userRole === USER_ROLE.SELECTOR &&
              [CENT_TRCN_DSBL_CATEGORY.UPRO.id, CENT_TRCN_DSBL_CATEGORY.PRCG_FN.id].includes(
                category.id
              )
            }
            key={category.id}
            sx={{ fontSize: { xs: 12, sm: 13 } }}
          ></Chip>
        );
      })}
    </StickyStack>
  );
}
