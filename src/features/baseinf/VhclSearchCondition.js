import React, { useRef, useReducer, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import { Formik } from 'formik';
import produce from 'immer';
import { debounce } from 'lodash';
import useCmnCodes from '@common/hooks/useCmnCodes';
import { useQuery } from '@common/queries/query';
import { fetchSrchTropList, fetchSrchBusBsfcList } from '@features/common/commonAPI';
// import LoadingSpinner from '@components/LoadingSpinner';
import useError from '@common/hooks/useError';
// import ErrorDialog from '@components/ErrorDialog';

const initialState = {
  tropSrchKwd: '',
  busBsfcSrchKwd: '',
  vhclSrchKwd: '',
};

function reducer(state, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'TROP_SEARCH':
        draft.tropSrchKwd = action.payload;
        break;
      case 'BUS_BSFC_SEARCH':
        draft.busBsfcSrchKwd = action.payload;
        break;
      case 'VHCL_SEARCH':
        draft.vhclSrchKwd = action.payload;
        break;
      default:
        return draft;
    }
  });
}

export default function VhclSearchCondition({ open, onClose, searchParams }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [, setSearchParams] = useSearchParams();
  const [[stlmAreaCds, troaIds]] = useCmnCodes([
    { cmnCdId: 'STLM_AREA_CD' },
    { cmnCdId: 'TROA_ID' },
  ]);
  const formRef = useRef();
  const openError = useError();

  const initParams = useMemo(
    () => ({
      srchKwd: searchParams.get('srchKwd') ?? '',
      stlmAreaCd: searchParams.get('stlmAreaCd') ?? '',
      troaId: searchParams.get('troaId') ?? '',
      tropId: searchParams.get('tropId')
        ? { tropId: searchParams.get('tropId'), tropNm: searchParams.get('tropNm') }
        : null,
      busBsfcId: searchParams.get('busBsfcId')
        ? {
            tropId: searchParams.get('tropId'),
            busBsfcId: searchParams.get('busBsfcId'),
            bsfcNm: searchParams.get('bsfcNm'),
          }
        : null,
      // vhclId: searchParams.get('vhclId')
      //   ? {
      //       tropId: searchParams.get('tropId'),
      //       vhclId: searchParams.get('vhclId'),
      //       vhclNo: searchParams.get('vhclNo'),
      //     }
      //   : null,
      useYn: searchParams.get('useYn') ?? '',
    }),
    [searchParams]
  );

  const {
    data: trops,
    refetch: refetchTrop,
    remove: removeTrop,
  } = useQuery(
    ['fetchSrchTropList'],
    () =>
      fetchSrchTropList({
        stlmAreaCd: formRef.current.values.stlmAreaCd ?? '',
        troaId: formRef.current.values.troaId ?? '',
        srchKwd: state.tropSrchKwd,
        rowCnt: 3,
      }),
    {
      suspense: false,
      useErrorBoundary: false,
      enabled: false,
      cacheTime: 0,
      onError: (err) => {
        openError(err, 'fetchSrchTropList');
      },
    }
  );

  const debouncedRefetchTrop = useMemo(() => debounce(() => refetchTrop(), 300), [refetchTrop]);

  const handleTropChange = (value) => {
    dispatch({ type: 'TROP_SEARCH', payload: value });
    const trimmedValue = value.trim();
    if (trimmedValue === '') {
      dispatch({ type: 'TROP_SEARCH', payload: trimmedValue });
      if (state.tropSrchKwd !== '') {
        debouncedRefetchTrop.cancel();
        removeTrop();
      }
    } else if (/^[가-힣|a-z|A-Z|0-9|(|)]+$/.test(trimmedValue)) {
      debouncedRefetchTrop();
    }
  };

  const {
    data: busBsfcs,
    refetch: refetchBusBsfc,
    remove: removeBusBsfc,
  } = useQuery(
    ['fetchSrchBusBsfcList'],
    () =>
      fetchSrchBusBsfcList({
        stlmAreaCd: formRef.current.values.stlmAreaCd ?? '',
        troaId: formRef.current.values.troaId ?? '',
        tropId: formRef.current.values.tropId?.tropId ?? '',
        srchKwd: state.busBsfcSrchKwd,
        rowCnt: 3,
      }),
    {
      suspense: false,
      useErrorBoundary: false,
      enabled: false,
      cacheTime: 0,
      onError: (err) => {
        openError(err, 'fetchSrchBusBsfcList');
      },
    }
  );

  const debouncedRefetchBusBsfc = useMemo(
    () =>
      debounce(() => {
        refetchBusBsfc();
      }, 300),
    [refetchBusBsfc]
  );

  const handleBusBsfcChange = (value) => {
    dispatch({ type: 'BUS_BSFC_SEARCH', payload: value });
    const trimmedValue = value.trim();
    if (trimmedValue === '') {
      dispatch({ type: 'BUS_BSFC_SEARCH', payload: trimmedValue });
      if (state.busBsfcSrchKwd !== '') {
        debouncedRefetchBusBsfc.cancel();
        removeBusBsfc();
      }
    } else if (/^[가-힣|a-z|A-Z|0-9]+$/.test(trimmedValue)) {
      debouncedRefetchBusBsfc();
    }
  };

  // const {
  //   data: vhcls,
  //   refetch: refetchVhcl,
  //   remove: removeVhcl,
  // } = useQuery(
  //   ['fetchSrchVhclList'],
  //   () =>
  //     fetchSrchVhclList({
  //       tropId: formRef.current.values.tropId?.tropId ?? '',
  //       // srchTyp: formRef.current.values.busBsfcId?.busBsfcId ?? 'bfcs',
  //       // busBsfcId: formRef.current.values.busBsfcId?.busBsfcId ?? '',
  //       srchKwd: state.vhclSrchKwd,
  //       rowCnt: 3,
  //     }),
  //   {
  //     suspense: false,
  //     useErrorBoundary: false,
  //     enabled: false,
  //     cacheTime: 0,
  //     onError: (err) => {
  //       openError(err, 'fetchSrchVhclList');
  //     },
  //   }
  // );

  // const debouncedRefetchVhcl = useMemo(
  //   () =>
  //     debounce(() => {
  //       refetchVhcl();
  //     }, 300),
  //   [refetchVhcl]
  // );

  // const handleVhclChange = (value) => {
  //   dispatch({ type: 'VHCL_SEARCH', payload: value });
  //   const trimmedValue = value.trim();
  //   if (trimmedValue === '') {
  //     dispatch({ type: 'VHCL_SEARCH', payload: trimmedValue });
  //     if (state.vhclSrchKwd !== '') {
  //       debouncedRefetchVhcl.cancel();
  //       removeVhcl();
  //     }
  //   } else if (/^[가-힣|a-z|A-Z|0-9]+$/.test(trimmedValue)) {
  //     debouncedRefetchVhcl();
  //   }
  // };

  // if (open && isFetching) return <LoadingSpinner open={isFetching} />;
  return (
    <Drawer anchor="top" open={open} onClose={onClose}>
      {/* <ErrorDialog open={isError} error={error} /> */}
      <Container
        disableGutters
        maxWidth="sm"
        sx={{
          backgroundColor: (theme) => theme.palette.background.color,
        }}
      >
        <Formik
          innerRef={formRef}
          enableReinitialize
          initialValues={initParams}
          onSubmit={(values) => {
            const queryParams = { ...values };
            if (queryParams.srchKwd) queryParams.srchKwd = queryParams.srchKwd.trim();
            if (queryParams.stlmAreaCd)
              queryParams.stlmAreaNm = stlmAreaCds.find(
                (stlmAreaCd) => stlmAreaCd.code === queryParams.stlmAreaCd
              ).name;
            if (queryParams.troaId)
              queryParams.troaNm = troaIds.find(
                (troaId) => troaId.code === queryParams.troaId
              ).name;
            queryParams.tropId = values.tropId?.tropId ?? '';
            queryParams.tropNm = values.tropId?.tropNm ?? '';
            queryParams.busBsfcId = values.busBsfcId?.busBsfcId ?? '';
            queryParams.bsfcNm = values.busBsfcId?.bsfcNm ?? '';
            // queryParams.vhclId = values.vhclId?.vhclId ?? '';
            // queryParams.vhclNo = values.vhclId?.vhclNo ?? '';
            setSearchParams(new URLSearchParams(queryParams), { replace: true });
            onClose();
          }}
        >
          {(formik) => (
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              noValidate
              sx={{ bgcolor: 'background.paper' }}
            >
              <InputBase
                autoFocus
                fullWidth
                placeholder="차량번호 또는 운수사 차량번호."
                id="srchKwd"
                value={formik.values.srchKwd}
                onChange={formik.handleChange}
                sx={{ p: 1 }}
                startAdornment={
                  <InputAdornment position="start">
                    <IconButton aria-label="back" onClick={onClose}>
                      <ArrowBackOutlinedIcon />
                    </IconButton>
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton type="submit" color="secondary" aria-label="search">
                      <SearchOutlinedIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
              <Divider sx={{ borderColor: 'secondary.main' }} />
              <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ p: 2 }}>
                <Grid item xs={6}>
                  <FormControl variant="standard" size="small" fullWidth>
                    <InputLabel id="stlmAreaCd-label">정산지역</InputLabel>
                    <Select
                      labelId="stlmAreaCd-label"
                      id="stlmAreaCd"
                      name="stlmAreaCd"
                      value={formik.values.stlmAreaCd}
                      onChange={(event) => {
                        formik.setFieldValue('stlmAreaCd', event.target.value);
                        formik.setFieldValue('troaId', '');
                        formik.setFieldValue('tropId', null);
                        formik.setFieldValue('busBsfcId', null);
                        // formik.setFieldValue('vhclId', null);
                      }}
                      label="정산지역"
                    >
                      <MenuItem value="">전체</MenuItem>
                      {stlmAreaCds.map((stlmAreaCd) => (
                        <MenuItem value={stlmAreaCd.code} key={stlmAreaCd.code}>
                          {stlmAreaCd.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl variant="standard" size="small" fullWidth>
                    <InputLabel id="troaId-label">교통운영기관</InputLabel>
                    <Select
                      labelId="troaId-label"
                      value={formik.values.troaId}
                      id="troaId"
                      name="troaId"
                      onChange={(event) => {
                        formik.setFieldValue('troaId', event.target.value);
                        formik.setFieldValue('tropId', null);
                        formik.setFieldValue('busBsfcId', null);
                        // formik.setFieldValue('vhclId', null);
                      }}
                      label="교통운영기관"
                    >
                      <MenuItem value="">전체</MenuItem>
                      {(formik.values.stlmAreaCd
                        ? troaIds.filter((troaId) => troaId.stlmAreaCd === formik.values.stlmAreaCd)
                        : troaIds
                      ).map((troaId) => (
                        <MenuItem value={troaId.code} key={troaId.code}>
                          {troaId.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    disablePortal
                    size="small"
                    selectOnFocus={false}
                    isOptionEqualToValue={(option, value) => option.tropId === value.tropId}
                    getOptionLabel={(option) => option.tropNm}
                    options={
                      formik.values.tropId
                        ? trops?.data.length > 0
                          ? [
                              ...trops.data.filter(
                                (trop) => trop.tropId !== formik.values.tropId.tropId
                              ),
                              formik.values.tropId,
                            ]
                          : [formik.values.tropId]
                        : trops?.data ?? []
                    }
                    id="tropId"
                    value={formik.values.tropId}
                    onChange={(event, newValue) => {
                      formik.setFieldValue('tropId', newValue);
                      formik.setFieldValue('busBsfcId', null);
                      // formik.setFieldValue('vhclId', null);
                    }}
                    inputValue={state.tropSrchKwd}
                    onInputChange={(event, newInputValue) => {
                      handleTropChange(newInputValue);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} variant="standard" label="교통사업자" />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    disablePortal
                    size="small"
                    selectOnFocus={false}
                    isOptionEqualToValue={(option, value) =>
                      option.tropId === value.tropId && option.busBsfcId === value.busBsfcId
                    }
                    getOptionLabel={(option) => option.bsfcNm}
                    options={
                      formik.values.busBsfcId
                        ? busBsfcs?.data.length > 0
                          ? [
                              ...busBsfcs.data.filter(
                                (busBsfc) =>
                                  busBsfc.tropId !== formik.values.busBsfcId.tropId ||
                                  busBsfc.busBsfcId !== formik.values.busBsfcId.busBsfcId
                              ),
                              formik.values.busBsfcId,
                            ]
                          : [formik.values.busBsfcId]
                        : busBsfcs?.data ?? []
                    }
                    id="busBsfcId"
                    value={formik.values.busBsfcId}
                    onChange={(event, newValue) => {
                      if (newValue && !formik.values.tropId) {
                        formik.setFieldValue(
                          'tropId',
                          busBsfcs.data.find(
                            (busBsfc) =>
                              busBsfc.tropId === newValue.tropId &&
                              busBsfc.busBsfcId === newValue.busBsfcId
                          )
                        );
                      }
                      formik.setFieldValue('busBsfcId', newValue);
                    }}
                    inputValue={state.busBsfcSrchKwd}
                    onInputChange={(event, newInputValue) => {
                      handleBusBsfcChange(newInputValue);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} variant="standard" label="버스영업소" />
                    )}
                  />
                </Grid>
                {/* <Grid item xs={12}>
                  <Autocomplete
                    disablePortal
                    size="small"
                    selectOnFocus={false}
                    isOptionEqualToValue={(option, value) =>
                      option.tropId === value.tropId && option.vhclId === value.vhclId
                    }
                    getOptionLabel={(option) => option.vhclNo}
                    options={
                      formik.values.vhclId
                        ? vhcls?.data.length > 0
                          ? [
                              ...vhcls.data.filter(
                                (vhcl) =>
                                  vhcl.tropId !== formik.values.vhclId.tropId ||
                                  vhcl.vhclId !== formik.values.vhclId.vhclId
                              ),
                              formik.values.vhclId,
                            ]
                          : [formik.values.vhclId]
                        : vhcls?.data ?? []
                    }
                    id="vhclId"
                    value={formik.values.vhclId}
                    onChange={(event, newValue) => {
                      if (newValue && !formik.values.tropId) {
                        formik.setFieldValue(
                          'tropId',
                          vhcls.data.find(
                            (vhcl) =>
                              vhcl.tropId === newValue.tropId && vhcl.vhclId === newValue.vhclId
                          )
                        );
                      }
                      formik.setFieldValue('vhclId', newValue);
                    }}
                    inputValue={state.vhclSrchKwd}
                    onInputChange={(event, newInputValue) => {
                      handleVhclChange(newInputValue);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} variant="standard" label="차량번호" />
                    )}
                  />
                </Grid> */}
                <Grid item xs={12}>
                  <FormControl variant="standard" size="small" fullWidth>
                    <InputLabel id="useYn-label">사용여부</InputLabel>
                    <Select
                      labelId="useYn-label"
                      id="useYn"
                      name="useYn"
                      value={formik.values.useYn}
                      onChange={formik.handleChange}
                      label="사용여부"
                    >
                      {[
                        { code: 'A', name: '전체' },
                        { code: 'Y', name: '사용' },
                        { code: 'N', name: '미사용' },
                      ].map((useYn) => (
                        <MenuItem value={useYn.code} key={useYn.code}>
                          {useYn.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Button type="submit" fullWidth variant="contained" color="secondary">
                    조회
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Formik>
      </Container>
    </Drawer>
  );
}
