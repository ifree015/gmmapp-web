import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import StickyStack from '@components/StickyStack';
import useUser from '@common/hooks/useUser';
import { CENT_TRCN_DSBL_CATEGORY } from '@common/constants/appConstants';
import { useInView } from 'react-intersection-observer';
import useSmUp from '@common/hooks/useSmUp';
import dayjs from 'dayjs';
import nativeApp from '@common/utils/nativeApp';

export default function CentTrcnDsblHeader() {
  const [sticky, setSticky] = useState(undefined);
  const user = useUser();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParams = {
    categoryId: searchParams.get('categoryId') ?? CENT_TRCN_DSBL_CATEGORY.CENT_UPRO.id,
    dsblAcptDt: searchParams.get('dsblAcptDt') ?? dayjs().format('YYYYMMDD'),
    dprtId:
      searchParams.get('dprtId') ??
      (!searchParams.get('categoryId') && user.isCenterUser() ? user.dprtId : ''),
    dsblPrcgPicId: searchParams.get('dsblPrcgPicId') ?? user.userId,
  };

  const isSmUp = useSmUp();
  const [ref, inView] = useInView({
    threshold: 1,
    initialInView: true,
    rootMargin: isSmUp
      ? `-${nativeApp.isIOS() ? 1 : 49}px 0px 0px 0px`
      : `-${nativeApp.isIOS() ? 1 : 49}px 0px 0px 0px`,
  });
  const [tabValue, setTabValue] = React.useState(queryParams.categoryId);

  useEffect(() => {
    // if (sticky === undefined) {
    //   setSticky(false);
    // } else {
    setSticky(!inView);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const handleChangeTab = useCallback((event, value) => {
    setTabValue(value);
  }, []);

  return (
    <StickyStack
      component="header"
      direction="row"
      // spacing={{ xs: 0.5, sm: 1 }}
      sx={{
        bgcolor: sticky ? 'background.paper' : 'inherit',
        top: { xs: `${nativeApp.isIOS() ? 0 : 48}px`, sm: `${nativeApp.isIOS() ? 0 : 48}px` },
        my: 1,
      }}
      ref={ref}
    >
      <Tabs
        value={tabValue}
        onChange={handleChangeTab}
        variant="scrollable"
        TabIndicatorProps={{
          style: { display: 'none' },
        }}
      >
        {CENT_TRCN_DSBL_CATEGORY.getDisplayCategories().map((category) => {
          return (
            <Tab
              sx={{ p: 0, pr: 0.5, minWidth: 'auto' }}
              key={category.id}
              value={category.id}
              label={
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
                    !user.isCenterUser() &&
                    [
                      CENT_TRCN_DSBL_CATEGORY.PIC_ALL.id,
                      CENT_TRCN_DSBL_CATEGORY.PIC_UPRO.id,
                      CENT_TRCN_DSBL_CATEGORY.PIC_PRCG_FN.id,
                    ].includes(category.id)
                  }
                  sx={{ fontSize: { xs: 12, sm: 'subtitle2.fontSize' } }}
                ></Chip>
              }
            />
          );
        })}
      </Tabs>
    </StickyStack>
  );
}
