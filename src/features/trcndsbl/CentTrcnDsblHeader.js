import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import useRole from '@common/hooks/useRole';
import { USER_ROLE, CENT_TRCN_DSBL_CATEGORY } from '@common/constants/appConstants';
import { useInView } from 'react-intersection-observer';
import useSmUp from '@common/hooks/useSmUp';

const StickyStack = styled(Stack)(({ theme }) => ({
  margin: theme.spacing(2, -2, 0, -2),
  padding: theme.spacing(1, 2),
  position: 'sticky',
  top: 56,
  // justifyContent: 'center',
  [theme.breakpoints.up('sm')]: {
    margin: theme.spacing(2, -3, 0, -3),
    padding: theme.spacing(1, 3),
    top: 64,
    // justifyContent: 'flex-start',
  },
  zIndex: theme.zIndex.appBar + 1,
}));

export default function CentTrcnDsblHeader() {
  const [sticky, setSticky] = useState(undefined);
  const userRole = useRole();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = {
    categoryId: searchParams.get('categoryId'),
    dsblAcptDt: searchParams.get('dsblAcptDt'),
    dprtId: searchParams.get('dprtId') ?? '',
    dsblPrcgPicId: searchParams.get('dsblPrcgPicId'),
    dsblPrsrName: searchParams.get('dsblPrsrName'),
    dsblPrcgDt: searchParams.get('dsblPrcgDt'),
  };
  const isSmUp = useSmUp();
  const [ref, inView] = useInView({
    threshold: 1,
    rootMargin: isSmUp ? '-65px 0px 0px 0px' : '-57px 0px 0px 0px',
  });

  useEffect(() => {
    if (sticky === undefined) {
      setSticky(false);
    } else {
      setSticky(!inView);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <StickyStack
      direction="row"
      spacing={{ xs: 0.5, sm: 1 }}
      sx={{
        bgcolor: sticky ? 'background.paper' : 'inherit',
        // boxShadow: sticky ? 1 : 0,
      }}
      component="header"
      ref={ref}
    >
      {Object.entries(CENT_TRCN_DSBL_CATEGORY).map(([, category]) => {
        return (
          <Chip
            label={category.title}
            color="primary"
            variant={category.id === searchParams.get('categoryId') ? 'filled' : 'outlined'}
            onClick={
              category.id === searchParams.get('categoryId')
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
