import React, { useRef, useReducer, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
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
import { Formik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import produce from 'immer';
import { debounce } from 'lodash';
import useCmnCodes from '@common/hooks/useCmnCodes';
import { useQuery } from '@common/queries/query';
import {
  fetchSrchTropList,
  fetchSrchBusBsfcList,
  fetchSrchBusRotList,
  fetchSrchVhclList,
} from '@features/common/commonAPI';
import LoadingSpinner from '@components/LoadingSpinner';
import useError from '@common/hooks/useError';
import ErrorDialog from '@components/ErrorDialog';

const initialState = {
  tropSrchKwd: '',
  busBsfcSrchKwd: '',
  busRotSrchKwd: '',
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
      case 'BUS_ROT_SEARCH':
        draft.busRotSrchKwd = action.payload;
        break;
      case 'VHCL_SEARCH':
        draft.vhclSrchKwd = action.payload;
        break;
      default:
        return draft;
    }
  });
}

function getDates(oprnDtDvsCd) {
  switch (oprnDtDvsCd) {
    case '1day':
      return [dayjs().subtract(1, 'day').format('YYYYMMDD'), dayjs().format('YYYYMMDD')];
    case '3day':
      return [dayjs().subtract(3, 'day').format('YYYYMMDD'), dayjs().format('YYYYMMDD')];
    case '1week':
      return [dayjs().subtract(1, 'week').format('YYYYMMDD'), dayjs().format('YYYYMMDD')];
    case '1month':
      return [dayjs().subtract(1, 'month').format('YYYYMMDD'), dayjs().format('YYYYMMDD')];
    default:
      return [];
  }
}

export default function TchmOpgtOcrnSearchCondition({ open, onClose }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFetching, isError, error, [stlmAreaCds, troaIds]] = useCmnCodes([
    { cmnCdId: 'STLM_AREA_CD' },
    { cmnCdId: 'TROA_ID' },
  ]);
  const formRef = useRef();
  const openError = useError();

  if (!searchParams.get('oprnSttDt')) {
    searchParams.append('oprnDtDvsCd', '1day');
    const dates = getDates(searchParams.get('oprnDtDvsCd'));
    searchParams.append('oprnSttDt', dates[0]);
    searchParams.append('oprnEndDt', dates[1]);
  }

  const initParams = useMemo(
    () => ({
      oprnDtDvsCd: searchParams.get('oprnDtDvsCd') ?? '',
      oprnSttDt: searchParams.get('oprnSttDt'),
      oprnEndDt: searchParams.get('oprnEndDt'),
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
      rotId: searchParams.get('rotId')
        ? {
            stlmAreaCd: searchParams.get('stlmAreaCd'),
            rotId: searchParams.get('rotId'),
            rotNm: searchParams.get('rotNm'),
          }
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
    reset: resetTrop,
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
    data: busBsfcs,
    reset: resetBusBsfc,
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
        openError(err, resetBusBsfc);
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

  const {
    data: busRots,
    reset: resetBusRot,
    refetch: refetchBusRot,
    remove: removeBusRot,
  } = useQuery(
    ['fetchSrchBusRotList'],
    () =>
      fetchSrchBusRotList({
        stlmAreaCd: formRef.current.values.stlmAreaCd ?? '',
        srchKwd: state.busRotSrchKwd,
        rowCnt: 3,
      }),
    {
      suspense: false,
      useErrorBoundary: false,
      enabled: false,
      cacheTime: 0,
      onError: (err) => {
        openError(err, resetBusRot);
      },
    }
  );

  const debouncedRefetchBusRot = useMemo(
    () =>
      debounce(() => {
        refetchBusRot();
      }, 300),
    [refetchBusRot]
  );

  const handleBusRotChange = (value) => {
    dispatch({ type: 'BUS_ROT_SEARCH', payload: value });
    const trimmedValue = value.trim();
    if (trimmedValue === '') {
      dispatch({ type: 'BUS_ROT_SEARCH', payload: trimmedValue });
      if (state.busRotSrchKwd !== '') {
        debouncedRefetchBusRot.cancel();
        removeBusRot();
      }
    } else if (/^[가-힣|a-z|A-Z|0-9]+$/.test(trimmedValue)) {
      debouncedRefetchBusRot();
    }
  };

  const {
    data: vhcls,
    reset: resetVhcl,
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
      if (state.vhclSrchKwd !== '') {
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
            oprnSttDt: yup
              .date()
              .required('운행시작일자를 입력해주세요.')
              .typeError('유효하지 않는 운행시작일자입니다.'),
            oprnEndDt: yup
              .date()
              .required('운행종료일자를 입력해주세요.')
              .typeError('유효하지 않는 운행종료일자입니다.')
              .when('oprnSttDt', (oprnSttDt, schema) => {
                if (oprnSttDt && dayjs(oprnSttDt).isValid()) {
                  return schema.min(oprnSttDt, '운행시작일자보다 이후이어야 합니다.');
                }
                return schema;
              })
              .test('inqrt-term', '조회 기간은 최대 31일 이내이어야 합니다.', function (value) {
                const dayDiff = dayjs(value).diff(dayjs(this.parent.oprnSttDt), 'day');
                return !dayDiff || dayDiff <= 31;
              }),
            tropId: yup.object().nullable().required('운수사를 선택해주세요.'),
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
            queryParams.tropId = values.tropId?.tropId ?? '';
            queryParams.tropNm = values.tropId?.tropNm ?? '';
            queryParams.busBsfcId = values.busBsfcId?.busBsfcId ?? '';
            queryParams.bsfcNm = values.busBsfcId?.bsfcNm ?? '';
            queryParams.rotId = values.rotId?.rotId ?? '';
            queryParams.rotNm = values.rotId?.rotNm ?? '';
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
              <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ p: 2 }}>
                <Grid item xs={12}>
                  <ToggleButtonGroup
                    color="warning"
                    id="oprnDtDvsCd"
                    value={formik.values.oprnDtDvsCd}
                    onChange={(event, newValue) => {
                      if (!newValue) return;
                      formik.setFieldValue('oprnDtDvsCd', newValue);
                      const dates = getDates(newValue);
                      formik.setFieldValue('oprnSttDt', dates[0]);
                      formik.setFieldTouched('oprnEndDt');
                      formik.setFieldValue('oprnEndDt', dates[1]);
                    }}
                    exclusive
                    size="small"
                    fullWidth
                  >
                    <ToggleButton value="1day">1일</ToggleButton>
                    <ToggleButton value="3day">3일</ToggleButton>
                    <ToggleButton value="1week">1주</ToggleButton>
                    <ToggleButton value="1month">1달</ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" sx={{ alignItems: 'center' }}>
                    <DesktopDatePicker
                      // label="운행시작일자"
                      id="oprnSttDt"
                      value={formik.values.oprnSttDt}
                      onChange={(newValue) => {
                        formik.setFieldValue('oprnDtDvsCd', '');
                        formik.setFieldTouched('oprnSttDt');
                        formik.setFieldValue('oprnSttDt', newValue?.format('YYYYMMDD') ?? '');
                      }}
                      inputFormat="YYYY-MM-DD"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          fullWidth
                          required
                          error={formik.touched.oprnSttDt && Boolean(formik.errors.oprnSttDt)}
                          helperText={formik.touched.oprnSttDt && formik.errors.oprnSttDt}
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
                      // label="운행종료일자"
                      id="oprnEndDt"
                      value={formik.values.oprnEndDt}
                      onChange={(newValue) => {
                        formik.setFieldValue('oprnDtDvsCd', '');
                        formik.setFieldTouched('oprnEndDt');
                        formik.setFieldValue('oprnEndDt', newValue?.format('YYYYMMDD') ?? '');
                      }}
                      inputFormat="YYYY-MM-DD"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          fullWidth
                          required
                          error={formik.touched.oprnEndDt && Boolean(formik.errors.oprnEndDt)}
                          helperText={formik.touched.oprnEndDt && formik.errors.oprnEndDt}
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
                        formik.setFieldValue('busBsfcId', null);
                        formik.setFieldValue('rotId', null);
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
                        formik.setFieldValue('busBsfcId', null);
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
                      formik.setFieldValue('busBsfcId', null);
                      formik.setFieldValue('vhclId', null);
                      formik.setFieldTouched('tropId');
                      formik.setFieldValue('tropId', newValue);
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
                        required
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
                <Grid item xs={12}>
                  <Autocomplete
                    disablePortal
                    size="small"
                    selectOnFocus={false}
                    isOptionEqualToValue={(option, value) =>
                      option.stlmAreaCd === value.stlmAreaCd && option.rotId === value.rotId
                    }
                    getOptionLabel={(option) => option.rotNm}
                    options={
                      formik.values.rotId
                        ? busRots?.data.length > 0
                          ? [
                              ...busRots.data.filter(
                                (busRot) =>
                                  busRot.stlmAreaCd !== formik.values.rotId.stlmAreaCd ||
                                  busRot.rotId !== formik.values.rotId.rotId
                              ),
                              formik.values.rotId,
                            ]
                          : [formik.values.rotId]
                        : busRots?.data ?? []
                    }
                    id="rotId"
                    value={formik.values.rotId}
                    onChange={(event, newValue) => {
                      if (newValue && !formik.values.stlmAreaCd) {
                        formik.setFieldValue(
                          'stlmAreaCd',
                          busRots.data.find(
                            (busRot) =>
                              busRot.stlmAreaCd === newValue.stlmAreaCd &&
                              busRot.rotId === newValue.rotId
                          ).stlmAreaCd
                        );
                      }
                      formik.setFieldValue('rotId', newValue);
                    }}
                    inputValue={state.busRotSrchKwd}
                    onInputChange={(event, newInputValue) => {
                      handleBusRotChange(newInputValue);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} variant="standard" label="버스노선" />
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
                <Grid item xs={6} sx={{ mt: 1 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    //color="secondary"
                    startIcon={<ArrowBackOutlinedIcon />}
                    onClick={onClose}
                  >
                    닫기
                  </Button>
                </Grid>
                <Grid item xs={6} sx={{ mt: 1 }}>
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
