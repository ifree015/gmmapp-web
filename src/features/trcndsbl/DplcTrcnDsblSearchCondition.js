import React, { useRef, useReducer, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Slider from '@mui/material/Slider';
import { Formik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
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

function getDates(dsblAcptDtDvsCd) {
  switch (dsblAcptDtDvsCd) {
    case '1week':
      return [dayjs().subtract(1, 'week').format('YYYYMMDD'), dayjs().format('YYYYMMDD')];
    case '1month':
      return [dayjs().subtract(1, 'month').format('YYYYMMDD'), dayjs().format('YYYYMMDD')];
    case '3month':
      return [dayjs().subtract(3, 'month').format('YYYYMMDD'), dayjs().format('YYYYMMDD')];
    case '6month':
      return [dayjs().subtract(6, 'month').format('YYYYMMDD'), dayjs().format('YYYYMMDD')];
    default:
      return [];
  }
}

const marks = [
  {
    value: 2,
    label: '2건',
  },
  {
    value: 3,
    label: '3건',
  },
  {
    value: 4,
    label: '4건',
  },
  {
    value: 5,
    label: '5건',
  },
];

export default function DplcTrcnDsblSearchCondition({ open, onClose, searchParams }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [, setSearchParams] = useSearchParams();
  const [[stlmAreaCds, troaIds, dsblAcptDvsCds, busTrcnErrTypCds]] = useCmnCodes([
    { cmnCdId: 'STLM_AREA_CD' },
    { cmnCdId: 'TROA_ID' },
    { cmnCdId: 'DSBL_ACPT_DVS_CD', params: { cdId: '236', excludes: '7|8' } },
    { cmnCdId: 'BUS_TRCN_ERR_TYP_CD' },
  ]);
  const formRef = useRef();
  const openError = useError();

  const initParams = useMemo(
    () => ({
      srchKwd: searchParams.get('srchKwd') ?? '',
      dsblAcptDtDvsCd: searchParams.get('dsblAcptDtDvsCd') ?? '',
      dsblAcptSttDt: searchParams.get('dsblAcptSttDt'),
      dsblAcptEndDt: searchParams.get('dsblAcptEndDt'),
      stlmAreaCd: searchParams.get('stlmAreaCd') ?? '',
      troaId: searchParams.get('troaId') ?? '',
      dsblAcptDvsCd: searchParams.get('dsblAcptDvsCd') ?? '',
      busTrcnErrTypCd: searchParams.get('busTrcnErrTypCd')
        ? { code: searchParams.get('busTrcnErrTypCd'), name: searchParams.get('busTrcnErrTypNm') }
        : null,
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
      acptNcnt: searchParams.get('acptNcnt') ? Number(searchParams.get('acptNcnt')) : 2,
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
    data: vhcls,
    refetch: refetchVhcl,
    remove: removeVhcl,
  } = useQuery(
    ['fetchSrchVhclList'],
    () =>
      fetchSrchVhclList({
        stlmAreaCd: formRef.current.values.stlmAreaCd ?? '',
        troaId: formRef.current.values.troaId ?? '',
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
          validationSchema={yup.object({
            dsblAcptSttDt: yup
              .date()
              .required('접수시작일자를 입력해주세요.')
              .typeError('유효하지 않는 접수시작일자입니다.'),
            dsblAcptEndDt: yup
              .date()
              .required('접수종료일자를 입력해주세요.')
              .typeError('유효하지 않는 접수종료일자입니다.')
              .when('dsblAcptSttDt', (dsblAcptSttDt, schema) => {
                if (dsblAcptSttDt && dayjs(dsblAcptSttDt).isValid()) {
                  return schema.min(dsblAcptSttDt, '접수시작일자보다 이후이어야 합니다.');
                }
                return schema;
              }),
            acptNcnt: yup.number().typeError('유효하지 않는 접수건수입니다.'),
          })}
          onSubmit={(values) => {
            const queryParams = { ...values };
            if (queryParams.stlmAreaCd)
              queryParams.stlmAreaNm = stlmAreaCds.find(
                (stlmAreaCd) => stlmAreaCd.code === queryParams.stlmAreaCd
              ).name;
            if (queryParams.troaId)
              queryParams.troaNm = troaIds.find(
                (troaId) => troaId.code === queryParams.troaId
              ).name;
            if (queryParams.dsblAcptDvsCd)
              queryParams.dsblAcptDvsNm = dsblAcptDvsCds.find(
                (dsblAcptDvsCd) => dsblAcptDvsCd.code === queryParams.dsblAcptDvsCd
              ).name;
            queryParams.busTrcnErrTypCd = values.busTrcnErrTypCd?.code ?? '';
            queryParams.busTrcnErrTypNm = values.busTrcnErrTypCd?.name ?? '';
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
                <Grid item xs={12}>
                  <ToggleButtonGroup
                    color="warning"
                    id="dsblAcptDtDvsCd"
                    value={formik.values.dsblAcptDtDvsCd}
                    onChange={(event, newValue) => {
                      if (!newValue) return;
                      formik.setFieldValue('dsblAcptDtDvsCd', newValue);
                      const dates = getDates(newValue);
                      formik.setFieldValue('dsblAcptSttDt', dates[0]);
                      formik.setFieldValue('dsblAcptEndDt', dates[1]);
                    }}
                    exclusive
                    size="small"
                    fullWidth
                  >
                    <ToggleButton value="1week">1주일</ToggleButton>
                    <ToggleButton value="1month">1개월</ToggleButton>
                    <ToggleButton value="3month">3개월</ToggleButton>
                    <ToggleButton value="6month">6개월</ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" sx={{ alignItems: 'center' }}>
                    <DesktopDatePicker
                      inputFormat="YYYY-MM-DD"
                      id="dsblAcptSttDt"
                      value={formik.values.dsblAcptSttDt}
                      onChange={(newValue) => {
                        formik.setFieldValue('dsblAcptDtDvsCd', '');
                        formik.setFieldValue('dsblAcptSttDt', newValue?.format('YYYYMMDD') ?? '');
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          fullWidth
                          required
                          error={
                            formik.touched.dsblAcptSttDt && Boolean(formik.errors.dsblAcptSttDt)
                          }
                          helperText={formik.touched.dsblAcptSttDt && formik.errors.dsblAcptSttDt}
                        />
                      )}
                    />
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                      sx={{ px: 1 }}
                    >
                      ~
                    </Typography>
                    <DesktopDatePicker
                      inputFormat="YYYY-MM-DD"
                      id="dsblAcptEndDt"
                      value={formik.values.dsblAcptEndDt}
                      onChange={(newValue) => {
                        formik.setFieldValue('dsblAcptDtDvsCd', '');
                        formik.setFieldValue('dsblAcptEndDt', newValue?.format('YYYYMMDD') ?? '');
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          fullWidth
                          required
                          error={
                            formik.touched.dsblAcptEndDt && Boolean(formik.errors.dsblAcptEndDt)
                          }
                          helperText={formik.touched.dsblAcptEndDt && formik.errors.dsblAcptEndDt}
                        />
                      )}
                    />
                  </Stack>
                </Grid>
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
                        formik.setFieldValue('vhclId', null);
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
                        formik.setFieldValue('vhclId', null);
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
                <Grid item xs={6}>
                  <FormControl variant="standard" size="small" fullWidth>
                    <InputLabel id="dsblAcptDvsCd-label">접수구분</InputLabel>
                    <Select
                      labelId="dsblAcptDvsCd-label"
                      id="dsblAcptDvsCd"
                      name="dsblAcptDvsCd"
                      value={formik.values.dsblAcptDvsCd}
                      onChange={formik.handleChange}
                      label="접수구분"
                    >
                      <MenuItem value="">전체</MenuItem>
                      {dsblAcptDvsCds.map((dsblAcptDvsCd) => (
                        <MenuItem value={dsblAcptDvsCd.code} key={dsblAcptDvsCd.code}>
                          {dsblAcptDvsCd.name}
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
                    options={busTrcnErrTypCds}
                    id="busTrcnErrTypCd"
                    value={formik.values.busTrcnErrTypCd}
                    onChange={(event, newValue) => {
                      formik.setFieldValue('busTrcnErrTypCd', newValue);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} variant="standard" label="버스단말기오류유형" />
                    )}
                  />
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
                      <TextField
                        {...params}
                        variant="standard"
                        label="교통사업자"
                        error={formik.touched.tropId && Boolean(formik.errors.tropId)}
                        helperText={formik.touched.tropId && formik.errors.tropId}
                      />
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
                <Grid item xs={12}>
                  <Stack spacing={1} direction="row" alignItems="center">
                    <InputLabel id="acptNcnt-label" sx={{ minWidth: 72 }}>
                      접수건수
                    </InputLabel>
                    <Slider
                      min={2}
                      max={5}
                      marks={marks}
                      valueLabelDisplay="auto"
                      id="acptNcnt"
                      name="acptNcnt"
                      value={formik.values.acptNcnt}
                      onChange={formik.handleChange}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    startIcon={<SearchOutlinedIcon />}
                  >
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
