import React, { useRef, useReducer, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Divider from '@mui/material/Divider';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import { Formik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import produce from 'immer';
import { debounce } from 'lodash';
import useCmnCodes from '@common/hooks/useCmnCodes';
import { useQuery } from '@common/queries/query';
import { fetchSrchTropList, fetchSrchVhclList } from '@features/common/commonAPI';
import LoadingSpinner from '@components/LoadingSpinner';
import useError from '@common/hooks/useError';
import ErrorDialog from '@components/ErrorDialog';
import useUser from '@common/hooks/useUser';

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

function getDates(dsblAcptDtDvs) {
  switch (dsblAcptDtDvs) {
    case '1month':
      return [dayjs().subtract(1, 'month').format('YYYYMMDD'), dayjs().format('YYYYMMDD')];
    case '3month':
      return [dayjs().subtract(3, 'month').format('YYYYMMDD'), dayjs().format('YYYYMMDD')];
    case '6month':
      return [dayjs().subtract(6, 'month').format('YYYYMMDD'), dayjs().format('YYYYMMDD')];
    case '1year':
      return [dayjs().subtract(1, 'year').format('YYYYMMDD'), dayjs().format('YYYYMMDD')];
    default:
      return [];
  }
}

export default function TrcnDsblSearchCondition({ open, onClose }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFetching, isError, error, [stlmAreaCds, troaIds, dsblAcptDvsCds, dprtIds]] = useCmnCodes(
    [
      { cmnCdId: 'STLM_AREA_CD' },
      { cmnCdId: 'TROA_ID' },
      { cmnCdId: 'DSBL_ACPT_DVS_CD' },
      { cmnCdId: 'CENT' },
    ]
  );
  const formRef = useRef();
  const openError = useError();
  const user = useUser();

  if (!searchParams.get('dsblAcptDtDvs')) {
    searchParams.append('dsblAcptDtDvs', '3month');
    searchParams.append('dsblAcptSttDt', dayjs().subtract(3, 'month').format('YYYYMMDD'));
    searchParams.append('dsblAcptEndDt', dayjs().format('YYYYMMDD'));
    searchParams.append('dprtId', user.trcnDsblCentYn === 'Y' ? user.dprtId : '');
    searchParams.append('dprtNm', user.trcnDsblCentYn === 'Y' ? user.dprtNm : '');
  }

  const initParams = useMemo(
    () => ({
      dsblAcptDtDvs: searchParams.get('dsblAcptDtDvs') ?? '',
      dsblAcptSttDt: searchParams.get('dsblAcptSttDt'),
      dsblAcptEndDt: searchParams.get('dsblAcptEndDt'),
      srchKwd: searchParams.get('srchKwd') ?? '',
      stlmAreaCd: searchParams.get('stlmAreaCd') ?? '',
      troaId: searchParams.get('troaId') ?? '',
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
      dsblAcptDvsCd: searchParams.get('dsblAcptDvsCd') ?? '',
      dprtId: searchParams.get('dprtId') ?? '',
      dprtNm: searchParams.get('dprtNm') ?? '',
      asgtYn: searchParams.get('asgtYn') ?? '',
      dsblPrcgFnYn: searchParams.get('dsblPrcgFnYn') ?? '',
      dsblPrsrName: searchParams.get('dsblPrsrName') ?? '',
      backButton: searchParams.get('backButton') ?? '',
    }),
    [searchParams]
  );

  const {
    data: trops,
    reset: resetTrop,
    refetch: refetchTrop,
    remove: removeTrop,
  } = useQuery(
    ['readSrchTropList'],
    () =>
      fetchSrchTropList({
        stlmAreaCd: formRef.current.values.stlmAreaCd,
        troaId: formRef.current.values.troaId,
        srchKwd: state.tropSrchKwd,
        rowCnt: 3,
      }),
    {
      suspense: false,
      useErrorBoundary: false,
      enabled: false,
      cacheTime: 0,
      onError: (err) => {
        openError(err, resetTrop);
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
    reset: resetVhcl,
    refetch: refetchVhcl,
    remove: removeVhcl,
  } = useQuery(
    ['readSrchVhclList'],
    () =>
      fetchSrchVhclList({
        stlmAreaCd: formRef.current.values.stlmAreaCd,
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
        openError(err, resetVhcl);
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
      if (state.tropSrchKwd !== '') {
        debouncedRefetchVhcl.cancel();
        removeVhcl();
      }
    } else if (/^[가-힣|a-z|A-Z|0-9]+$/.test(trimmedValue)) {
      debouncedRefetchVhcl();
    }
  };

  if (open && isFetching) return <LoadingSpinner open={isFetching} />;
  return (
    <Drawer anchor="top" open={open} onClose={onClose}>
      <ErrorDialog open={isError} error={error} />
      <Container
        disableGutters={true}
        maxWidth="sm"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          // overflowY: 'auto',
        }}
      >
        <Formik
          innerRef={formRef}
          enableReinitialize={true}
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
          })}
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
            queryParams.vhclId = values.vhclId?.vhclId ?? '';
            queryParams.vhclNo = values.vhclId?.vhclNo ?? '';
            if (queryParams.dsblAcptDvsCd)
              queryParams.dsblAcptDvsNm = dsblAcptDvsCds.find(
                (dsblAcptDvsCd) => dsblAcptDvsCd.code === queryParams.dsblAcptDvsCd
              ).name;
            if (queryParams.dprtId)
              queryParams.dprtNm = dprtIds.find(
                (dprtId) => dprtId.code === queryParams.dprtId
              ).name;
            if (queryParams.dsblPrsrName)
              queryParams.dsblPrsrName = queryParams.dsblPrsrName.trim();
            queryParams.backButton = searchParams.get('backButton') ?? '';
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
                      <ArrowBackIcon />
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
                    id="dsblAcptDtDvs"
                    value={formik.values.dsblAcptDtDvs}
                    onChange={(event, newValue) => {
                      if (!newValue) return;
                      formik.setFieldValue('dsblAcptDtDvs', newValue);
                      const dates = getDates(newValue);
                      formik.setFieldValue('dsblAcptSttDt', dates[0]);
                      formik.setFieldTouched('dsblAcptEndDt');
                      formik.setFieldValue('dsblAcptEndDt', dates[1]);
                    }}
                    exclusive
                    size="small"
                    fullWidth={true}
                  >
                    <ToggleButton value="1month">1개월</ToggleButton>
                    <ToggleButton value="3month">3개월</ToggleButton>
                    <ToggleButton value="6month">6개월</ToggleButton>
                    <ToggleButton value="1year">1년</ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" sx={{ alignItems: 'center' }}>
                    <DesktopDatePicker
                      inputFormat="YYYY-MM-DD"
                      id="dsblAcptSttDt"
                      value={formik.values.dsblAcptSttDt}
                      onChange={(newValue) => {
                        formik.setFieldValue('dsblAcptDtDvs', '');
                        formik.setFieldTouched('dsblAcptSttDt');
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
                        formik.setFieldValue('dsblAcptDtDvs', '');
                        formik.setFieldTouched('dsblAcptEndDt');
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
                        formik.setFieldValue('dprtId', '');
                      }}
                      label="정산지역"
                    >
                      <MenuItem value="">전체</MenuItem>
                      {stlmAreaCds?.map((stlmAreaCd) => (
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
                      {troaIds &&
                        (formik.values.stlmAreaCd
                          ? troaIds.filter(
                              (troaId) => troaId.stlmAreaCd === formik.values.stlmAreaCd
                            )
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
                    isOptionEqualToValue={(option, value) => option.vhclId === value.vhclId}
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
                      {dsblAcptDvsCds?.map((dsblAcptDvsCd) => (
                        <MenuItem value={dsblAcptDvsCd.code} key={dsblAcptDvsCd.code}>
                          {dsblAcptDvsCd.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl variant="standard" size="small" fullWidth>
                    <InputLabel id="dprtId-label">배정부서</InputLabel>
                    <Select
                      labelId="dprtId-label"
                      id="dprtId"
                      name="dprtId"
                      value={formik.values.dprtId}
                      onChange={formik.handleChange}
                      label="배정부서"
                    >
                      <MenuItem value="">전체</MenuItem>
                      {dprtIds &&
                        (formik.values.stlmAreaCd
                          ? dprtIds.filter(
                              (dprtId) =>
                                dprtId.intgAstsBzDvsCd ===
                                stlmAreaCds.find(
                                  (stlmAreaCd) => stlmAreaCd.code === formik.values.stlmAreaCd
                                ).intgAstsBzDvsCd
                            )
                          : dprtIds
                        ).map((dprtId) => (
                          <MenuItem value={dprtId.code} key={dprtId.code}>
                            {dprtId.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl variant="standard" size="small" fullWidth>
                    <InputLabel id="asgtYn-label">배정여부</InputLabel>
                    <Select
                      labelId="asgtYn-label"
                      id="asgtYn"
                      name="asgtYn"
                      value={formik.values.asgtYn}
                      onChange={formik.handleChange}
                      label="배정여부"
                    >
                      {[
                        { code: '', name: '전체' },
                        { code: 'Y', name: '배정' },
                        { code: 'N', name: '오배정' },
                      ].map((asgtYn) => (
                        <MenuItem value={asgtYn.code} key={asgtYn.code}>
                          {asgtYn.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl variant="standard" size="small" fullWidth>
                    <InputLabel id="dsblPrcgFnYn-label">완료여부</InputLabel>
                    <Select
                      labelId="dsblPrcgFnYn-label"
                      id="dsblPrcgFnYn"
                      name="dsblPrcgFnYn"
                      value={formik.values.dsblPrcgFnYn}
                      onChange={formik.handleChange}
                      label="완료여부"
                    >
                      {[
                        { code: '', name: '전체' },
                        { code: 'Y', name: '완료' },
                        { code: 'N', name: '미완료' },
                      ].map((dsblPrcgFnYn) => (
                        <MenuItem value={dsblPrcgFnYn.code} key={dsblPrcgFnYn.code}>
                          {dsblPrcgFnYn.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="standard"
                    size="small"
                    fullWidth
                    id="dsblPrsrName"
                    label="처리자"
                    autoComplete="on"
                    value={formik.values.dsblPrsrName}
                    onChange={formik.handleChange}
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
