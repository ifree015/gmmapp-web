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
import { fetchSrchTropList, fetchSrchVhclList } from '@features/common/commonAPI';
// import LoadingSpinner from '@components/LoadingSpinner';
import useError from '@common/hooks/useError';
// import ErrorDialog from '@components/ErrorDialog';

const initialState = {
  tropSrchKwd: '',
  vhclSrchKwd: '',
};

function reducer(state, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'TROP_SEARCH':
        draft.tropSrchKwd = action.payload;
        break;
      case 'VHCL_SEARCH':
        draft.vhclSrchKwd = action.payload;
        break;
      default:
        return draft;
    }
  });
}

export default function TrcnSearchCondition({ open, onClose }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchParams, setSearchParams] = useSearchParams();
  const [[intgAstsBzDvsCds, locIds, trcnDvsCds, eqpmDvsCds, dvcDvsCds, intgTrcnStaCds]] =
    useCmnCodes([
      { cmnCdId: 'INTG_ASTS_BZ_DVS_CD' },
      { cmnCdId: 'LOC' },
      { cmnCdId: 'TRCN_DVS_CD', params: { cdId: '009', mngAttrCtt2: '1' } },
      { cmnCdId: 'EQPM_DVS_CD', params: { cdId: '046', includes: '14|15|80|81' } },
      { cmnCdId: 'DVC_DVS_CD', params: { cdId: '221', mngAttrCtt1: '1' } },
      { cmnCdId: 'ASTS_INTG_TRCN_STA_CD', params: { hgrnCmnCdNm: 'INTG_TRCN_STA_CD' } },
    ]);
  const formRef = useRef();
  const openError = useError();

  const initParams = useMemo(
    () => ({
      srchKwd: searchParams.get('srchKwd') ?? '',
      intgAstsBzDvsCd: searchParams.get('intgAstsBzDvsCd') ?? '',
      prsLocId: searchParams.get('prsLocId')
        ? { code: searchParams.get('prsLocId'), name: searchParams.get('prsLocNm') }
        : null,
      trcnDvsCd: searchParams.get('trcnDvsCd') ?? '',
      eqpmDvsCd: searchParams.get('eqpmDvsCd') ?? '',
      dvcDvsCd: searchParams.get('dvcDvsCd') ?? '',
      intgTrcnStaCd: searchParams.get('intgTrcnStaCd') ?? '',
      tropId: searchParams.get('tropId')
        ? { tropId: searchParams.get('tropId'), tropNm: searchParams.get('tropNm') }
        : null,
      vhclId: searchParams.get('vhclId')
        ? {
            tropId: searchParams.get('tropId'),
            vhclId: searchParams.get('vhclId'),
            vhclNo: searchParams.get('vhclNo'),
          }
        : null,
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
    data: vhcls,
    refetch: refetchVhcl,
    remove: removeVhcl,
  } = useQuery(
    ['fetchSrchVhclList'],
    () =>
      fetchSrchVhclList({
        tropId: formRef.current.values.tropId?.tropId ?? '',
        srchKwd: state.vhclSrchKwd,
        rowCnt: 3,
      }),
    {
      suspense: false,
      useErrorBoundary: false,
      enabled: false,
      cacheTime: 0,
      onError: (err) => {
        openError(err, 'fetchSrchVhclList');
      },
    }
  );

  const debouncedRefetchVhcl = useMemo(
    () =>
      debounce(() => {
        refetchVhcl();
      }, 300),
    [refetchVhcl]
  );

  const handleVhclChange = (value) => {
    dispatch({ type: 'VHCL_SEARCH', payload: value });
    const trimmedValue = value.trim();
    if (trimmedValue === '') {
      dispatch({ type: 'VHCL_SEARCH', payload: trimmedValue });
      if (state.vhclSrchKwd !== '') {
        debouncedRefetchVhcl.cancel();
        removeVhcl();
      }
    } else if (/^[가-힣|a-z|A-Z|0-9]+$/.test(trimmedValue)) {
      debouncedRefetchVhcl();
    }
  };

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
            if (queryParams.intgAstsBzDvsCd)
              queryParams.intgAstsBzDvsNm = intgAstsBzDvsCds.find(
                (intgAstsBzDvsCd) => intgAstsBzDvsCd.code === queryParams.intgAstsBzDvsCd
              ).name;
            queryParams.prsLocId = values.prsLocId?.code ?? '';
            queryParams.prsLocNm = values.prsLocId?.name ?? '';
            if (queryParams.trcnDvsCd)
              queryParams.trcnDvsNm = trcnDvsCds.find(
                (trcnDvsCd) => trcnDvsCd.code === queryParams.trcnDvsCd
              ).name;
            if (queryParams.eqpmDvsCd)
              queryParams.eqpmDvsNm = eqpmDvsCds.find(
                (eqpmDvsCd) => eqpmDvsCd.code === queryParams.eqpmDvsCd
              ).name;
            if (queryParams.dvcDvsCd)
              queryParams.dvcDvsNm = dvcDvsCds.find(
                (dvcDvsCd) => dvcDvsCd.code === queryParams.dvcDvsCd
              ).name;
            if (queryParams.intgTrcnStaCd)
              queryParams.intgTrcnStaNm = intgTrcnStaCds.find(
                (intgTrcnStaCd) => intgTrcnStaCd.code === queryParams.intgTrcnStaCd
              ).name;
            queryParams.tropId = values.tropId?.tropId ?? '';
            queryParams.tropNm = values.tropId?.tropNm ?? '';
            queryParams.vhclId = values.vhclId?.vhclId ?? '';
            queryParams.vhclNo = values.vhclId?.vhclNo ?? '';
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
                placeholder="단말기 또는 차량번호 단말기."
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
                    <InputLabel id="intgAstsBzDvsCd-label">지역구분</InputLabel>
                    <Select
                      labelId="intgAstsBzDvsCd-label"
                      id="intgAstsBzDvsCd"
                      name="intgAstsBzDvsCd"
                      value={formik.values.intgAstsBzDvsCd}
                      onChange={(event) => {
                        formik.setFieldValue('intgAstsBzDvsCd', event.target.value);
                        formik.setFieldValue('prsLocId', null);
                      }}
                      label="지역구분"
                    >
                      <MenuItem value="">전체</MenuItem>
                      {intgAstsBzDvsCds.map((intgAstsBzDvsCd) => (
                        <MenuItem value={intgAstsBzDvsCd.code} key={intgAstsBzDvsCd.code}>
                          {intgAstsBzDvsCd.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    disablePortal
                    size="small"
                    selectOnFocus={false}
                    isOptionEqualToValue={(option, value) => option.code === value.code}
                    getOptionLabel={(option) => option.name}
                    options={
                      formik.values.intgAstsBzDvsCd
                        ? locIds.filter(
                            (locId) => locId.intgAstsBzDvsCd === formik.values.intgAstsBzDvsCd
                          )
                        : locIds
                    }
                    id="prsLocId"
                    value={formik.values.prsLocId}
                    onChange={(event, newValue) => {
                      formik.setFieldValue('prsLocId', newValue);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} variant="standard" label="현재위치" />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl variant="standard" size="small" fullWidth>
                    <InputLabel id="trcnDvsCd-label">단말기구분</InputLabel>
                    <Select
                      labelId="trcnDvsCd-label"
                      id="trcnDvsCd"
                      name="trcnDvsCd"
                      value={formik.values.trcnDvsCd}
                      onChange={formik.handleChange}
                      label="단말기구분"
                    >
                      <MenuItem value="">전체</MenuItem>
                      {trcnDvsCds.map((trcnDvsCd) => (
                        <MenuItem value={trcnDvsCd.code} key={trcnDvsCd.code}>
                          {trcnDvsCd.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl variant="standard" size="small" fullWidth>
                    <InputLabel id="eqpmDvsCd-label">장비구분</InputLabel>
                    <Select
                      labelId="eqpmDvsCd-label"
                      id="eqpmDvsCd"
                      name="eqpmDvsCd"
                      value={formik.values.eqpmDvsCd}
                      onChange={formik.handleChange}
                      label="장비구분"
                    >
                      <MenuItem value="">전체</MenuItem>
                      {eqpmDvsCds.map((eqpmDvsCd) => (
                        <MenuItem value={eqpmDvsCd.code} key={eqpmDvsCd.code}>
                          {eqpmDvsCd.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl variant="standard" size="small" fullWidth>
                    <InputLabel id="dvcDvsCd-label">장치구분</InputLabel>
                    <Select
                      labelId="dvcDvsCd-label"
                      id="dvcDvsCd"
                      name="dvcDvsCd"
                      value={formik.values.dvcDvsCd}
                      onChange={formik.handleChange}
                      label="장치구분"
                    >
                      <MenuItem value="">전체</MenuItem>
                      {dvcDvsCds.map((dvcDvsCd) => (
                        <MenuItem value={dvcDvsCd.code} key={dvcDvsCd.code}>
                          {dvcDvsCd.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl variant="standard" size="small" fullWidth>
                    <InputLabel id="intgTrcnStaCd-label">통합단말기상태</InputLabel>
                    <Select
                      labelId="intgTrcnStaCd-label"
                      id="intgTrcnStaCd"
                      name="intgTrcnStaCd"
                      value={formik.values.intgTrcnStaCd}
                      onChange={formik.handleChange}
                      label="통합단말기상태"
                    >
                      <MenuItem value="">전체</MenuItem>
                      {intgTrcnStaCds.map((intgTrcnStaCd) => (
                        <MenuItem value={intgTrcnStaCd.code} key={intgTrcnStaCd.code}>
                          {intgTrcnStaCd.name}
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
                      formik.setFieldValue('vhclId', null);
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
