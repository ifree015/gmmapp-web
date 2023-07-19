import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
// import Autocomplete from '@mui/material/Autocomplete';
// import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
// import { useQueryClient } from '@tanstack/react-query';
import { useInfiniteQuery } from '@common/queries/query';
import { useInView } from 'react-intersection-observer';
import { fetchCentTrcnDsblList } from '@features/trcndsbl/trcnDsblAPI';
import useUser from '@common/hooks/useUser';
import useRole from '@common/hooks/useRole';
import useCmmCode from '@common/hooks/useCmnCode';
import { USER_ROLE, CENT_TRCN_DSBL_CATEGORY } from '@common/constants/appConstants';
import PartLoadingSpinner from '@components/PartLoadingSpinner';
import ErrorDialog from '@components/ErrorDialog';
import CentTrcnDsblListItem from './CentTrcnDsblListItem';
import dayjs from 'dayjs';

export default function CentTrcnDsblList() {
  const user = useUser();
  console.log(user?.userNm);
  const userRole = useRole();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = {
    categoryId: searchParams.get('categoryId') ?? CENT_TRCN_DSBL_CATEGORY.CENT_ALL.id,
    dsblAcptDt: searchParams.get('dsblAcptDt') ?? dayjs().format('YYYYMMDD'),
    dprtId: searchParams.get('dprtId') ?? userRole === USER_ROLE.SELECTOR ? '' : user.dprtId,
    dsblPrcgPicId: searchParams.get('dsblPrcgPicId') ?? user.userId,
    dsblPrsrName: searchParams.get('dsblPrsrName') ?? user.userNm,
    dsblPrcgDt: searchParams.get('dsblPrcgDt') ?? dayjs().format('YYYYMMDD'),
  };
  const [ref, inView] = useInView();
  const centCds = useCmmCode('CENT');
  // const queryClient = useQueryClient();
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isError, error, refetch } =
    useInfiniteQuery(
      ['readCentTrcnDsblList', searchParams.get('categoryId')],
      ({ pageParam = 1 }) =>
        fetchCentTrcnDsblList({
          ...queryParams,
          rowsPerPage: 15,
          page: pageParam,
        }),
      {
        getNextPageParam: (lastPage) => {
          const nextPage = Number(lastPage.page) + 1;
          return nextPage <= Number(lastPage.total) ? nextPage : undefined;
        },
        //staleTime: 1 * 60 * 1000,
      }
    );

  const defaultCentValue = useMemo(
    () => centCds && centCds.find((cmdCode) => cmdCode.code === user.dprtId),
    [centCds, user]
  );

  useEffect(() => {
    if (hasNextPage && inView) {
      fetchNextPage();
    }
  }, [hasNextPage, inView, fetchNextPage]);

  return (
    <React.Fragment>
      <ErrorDialog open={isError && !isFetchingNextPage} error={error} />
      <List
        sx={{ bgcolor: 'background.paper', mt: 2 }}
        subheader={
          <ListSubheader
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
          >
            {/* <Autocomplete
              disablePortal
              size="small"
              disabled={userRole !== USER_ROLE.SELECTOR}
              defaultValue={defaultCentValue}
              getOptionLabel={(option) => option.name}
              options={centCds}
              onChange={(event, newValue) => {
                queryParams.dprtId = newValue?.code ?? '';
                setSearchParams(new URLSearchParams(queryParams), { replace: true });
                //navigate('/centtrcndsbl?' + new URLSearchParams(queryParams).toString());
                //queryClient.invalidateQueries(['readCentTrcnDsblList']);
                refetch();
              }}
              sx={{
                minWidth: 160,
                paddingTop: 0.25,
                // '& .MuiAutocomplete-input': { fontSize: (theme) => theme.typography.fontSize },
                // '& .MuiInputLabel-root': { fontSize: (theme) => theme.typography.fontSize },
              }}
              renderInput={(params) => <TextField {...params} variant="standard" label="센터" />}
            /> */}
            <FormControl variant="standard" sx={{ minWidth: 160 }} size="small">
              <InputLabel id="select-cent-id-label">센터</InputLabel>
              <Select
                disabled={userRole !== USER_ROLE.SELECTOR}
                labelId="select-cent-id-label"
                defaultValue={defaultCentValue?.code ?? ''}
                onChange={(event) => {
                  queryParams.dprtId = event.target.value;
                  setSearchParams(new URLSearchParams(queryParams), { replace: true });
                  //navigate('/centtrcndsbl?' + new URLSearchParams(queryParams).toString());
                  //queryClient.invalidateQueries(['readCentTrcnDsblList']);
                  refetch();
                }}
                label="센터"
              >
                <MenuItem value="">전체</MenuItem>
                {centCds.map((centCd) => (
                  <MenuItem value={centCd.code} key={centCd.code}>
                    {centCd.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="subtitle2">
              건수: {new Intl.NumberFormat().format(data.pages[0]?.records)}
            </Typography>
          </ListSubheader>
        }
      >
        {data.pages.map((page, pageIndex) => {
          return page.data.map((trcnDsbl, index) => (
            <React.Fragment key={`${trcnDsbl.stlmAreaCd}-${trcnDsbl.dsblAcptNo}`}>
              {pageIndex > 0 || index > 0 ? <Divider variant="inset" component="li" /> : null}
              <CentTrcnDsblListItem
                trcnDsbl={trcnDsbl}
                ref={
                  data.pages.length === pageIndex + 1 && page.data.length === index + 1 ? ref : null
                }
              ></CentTrcnDsblListItem>
            </React.Fragment>
          ));
        })}
        {data.pages[0]?.records === '0' ? (
          <ListItem>
            <Alert severity="info" sx={{ flexGrow: 1 }}>
              접수된 장애내역이 없습니다.
            </Alert>
          </ListItem>
        ) : null}
      </List>
      {isFetchingNextPage ? <PartLoadingSpinner /> : null}
    </React.Fragment>
  );
}
