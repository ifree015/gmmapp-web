import React, { useEffect, useReducer, useMemo, forwardRef } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import FormHelperText from '@mui/material/FormHelperText';
import { IMaskInput } from 'react-imask';
// import PatternFormat from 'react-number-format';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Formik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import produce from 'immer';
import { debounce } from 'lodash';
import { useQuery } from '@common/queries/query';
import useAsyncCmmCode from '@common/hooks/useAsyncCmmCode';
import useCmnCodes from '@common/hooks/useCmnCodes';
import { fetchSrchBusBsfcList, fetchSrchVhclList } from '@features/common/commonAPI';
import useUser from '@common/hooks/useUser';
import useError from '@common/hooks/useError';

const TextFieldMaskInput = forwardRef(({ onChange, ...other }, ref) => {
  return (
    <IMaskInput
      {...other}
      inputRef={ref}
      mask="@#$-0000-0000"
      definitions={{
        '@': /0/,
        '#': /1/,
        '$': /0/,
      }}
      unmask
      placeholder="010-0000-0000"
      onAccept={(value) => onChange({ target: { name: other.name, value } })}
      overwrite
    />
    // <PatternFormat
    //   {...other}
    //   getInputRef={ref}
    //   format="010-####-####"
    //   placeholder="010-0000-0000"
    //   onValueChange={(values) => {
    //     onChange({
    //       target: {
    //         name: other.name,
    //         value: values.value,
    //       },
    //     });
    //   }}
    // />
  );
});

const initialState = {
  busBsfcSrchKwd: '',
  vhclSrchKwd: '',
  busTrcnErrTypCd: false,
  emp: false,
};

function reducer(state, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'BUS_BSFC_SEARCH':
        draft.busBsfcSrchKwd = action.payload;
        break;
      case 'VHCL_SEARCH':
        draft.vhclSrchKwd = action.payload;
        break;
      case 'BUS_TRCN_ERR_TYP_CD':
        draft.busTrcnErrTypCd = action.payload;
        break;
      case 'EMP':
        draft.emp = action.payload;
        break;
      default:
        return draft;
    }
  });
}

const TrcnDsblRgtStep1 = forwardRef(({ trcnDsbl, modifyTrcnDsbl, handleNext }, ref) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const user = useUser();
  const openError = useError();

  const [[dsblAcptDvsCds, trcnDvsCds]] = useCmnCodes([
    { cmnCdId: 'DSBL_ACPT_DVS_CD-RGT', params: { cdId: '236', includes: '3|4|5' } },
    { cmnCdId: 'TRCN_DVS_CD', params: { cdId: '009' } },
  ]);

  const initParams = useMemo(
    () => ({
      intgAstsBzDvsCd: trcnDsbl.intgAstsBzDvsCd ?? '',
      stlmAreaCd: trcnDsbl.stlmAreaCd ?? '',
      dsblAcptDtm: trcnDsbl.dsblAcptDtm ?? dayjs().format('YYYYMMDDHHmm') + '00',
      dsblAcptDvsCd: trcnDsbl.dsblAcptDvsCd ?? '',
      dsblAcptReqrName: trcnDsbl.dsblAcptReqrName ?? user.userNm,
      dsblAcptReqrMbphNo: trcnDsbl.dsblAcptReqrMbphNo ?? '',
      tropId: trcnDsbl.tropId ?? '',
      busBsfcId: trcnDsbl.busBsfcId
        ? {
            tropId: trcnDsbl.tropId,
            tropNm: trcnDsbl.tropNm,
            busBsfcId: trcnDsbl.busBsfcId,
            bsfcNm: trcnDsbl.bsfcNm,
          }
        : null,
      vhclId: trcnDsbl.vhclId
        ? {
            tropId: trcnDsbl.tropId,
            tropNm: trcnDsbl.tropNm,
            vhclId: trcnDsbl.vhclId,
            vhclNo: trcnDsbl.vhclNo,
          }
        : null,
      trcnDvsCd: trcnDsbl.trcnDvsCd ?? '',
      busTrcnErrTypCd: trcnDsbl.busTrcnErrTypCd
        ? { code: trcnDsbl.busTrcnErrTypCd, name: trcnDsbl.busTrcnErrTypNm }
        : null,
      drvrDrcsDsblYn: trcnDsbl.drvrDrcsDsblYn === 'Y',
      rideTrcnDsblYn: trcnDsbl.rideTrcnDsblYn === 'Y',
      alghTrcnDsblYn: trcnDsbl.alghTrcnDsblYn === 'Y',
      gpsDsblYn: trcnDsbl.gpsDsblYn === 'Y',
      recpIssuDsblYn: trcnDsbl.recpIssuDsblYn === 'Y',
      etcDsblYn: trcnDsbl.etcDsblYn === 'Y',
      dsblPt: trcnDsbl.dsblPt ?? '',
      dsblAcptAnswCtt: trcnDsbl.dsblAcptAnswCtt ?? '',
      dsblPrcgPicId: trcnDsbl.dsblPrcgPicId
        ? {
            code: trcnDsbl.dsblPrcgPicId,
            name: trcnDsbl.dsblPrsrName,
            dprtId: trcnDsbl.dprtId,
            dprtNm: trcnDsbl.dprtNm,
            intgAstsBzDvsCd: trcnDsbl.intgAstsBzDvsCd,
          }
        : null,
    }),
    [trcnDsbl, user.userNm]
  );

  const {
    data: busBsfcs,
    refetch: refetchBusBsfc,
    remove: removeBusBsfc,
  } = useQuery(
    ['fetchSrchBusBsfcList'],
    () =>
      fetchSrchBusBsfcList({
        tropId: ref.current.values.vhclId?.tropId ?? '',
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

  const {
    data: vhcls,
    refetch: refetchVhcl,
    remove: removeVhcl,
  } = useQuery(
    ['fetchSrchVhclList'],
    () =>
      fetchSrchVhclList({
        tropId: ref.current.values.busBsfcId?.tropId ?? '',
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
      if (state.tropSrchKwd !== '') {
        debouncedRefetchVhcl.cancel();
        removeVhcl();
      }
    } else if (/^[가-힣|a-z|A-Z|0-9]+$/.test(trimmedValue)) {
      debouncedRefetchVhcl();
    }
  };

  const [busTrcnErrTypCds, fetchBusTrcnErrTypCds] = useAsyncCmmCode(
    'BUS_TRCN_ERR_TYP_CD' +
      (ref.current?.values.trcnDvsCd ? '-' + ref.current?.values.trcnDvsCd : ''),
    {
      trcnDvsCd: ref.current?.values.trcnDvsCd ?? '',
    },
    trcnDsbl.busTrcnErrTypCd
      ? [{ code: trcnDsbl.busTrcnErrTypCd, name: trcnDsbl.busTrcnErrTypNm }]
      : []
  );
  const busTrcnErrTypCdLoadingable = state.busTrcnErrTypCd && busTrcnErrTypCds.length <= 1;
  const [emps, fetchEmps] = useAsyncCmmCode(
    'CENT_EMP' +
      (ref.current?.values.intgAstsBzDvsCd ? '-' + ref.current?.values.intgAstsBzDvsCd : ''),
    { intgAstsBzDvsCd: ref.current?.values.intgAstsBzDvsCd ?? '' },
    trcnDsbl.dsblPrcgPicId
      ? [
          {
            code: trcnDsbl.dsblPrcgPicId,
            name: trcnDsbl.dsblPrsrName,
            dprtId: trcnDsbl.dprtId,
            dprtNm: trcnDsbl.dprtNm,
            intgAstsBzDvsCd: trcnDsbl.intgAstsBzDvsCd,
          },
        ]
      : user.isCenterUser()
      ? [
          {
            code: user.userId,
            name: user.userNm,
            dprtId: user.dprtId,
            dprtNm: user.dprtNm,
            intgAstsBzDvsCd: user.intgAstsBzDvsCd,
          },
        ]
      : []
  );
  const empLoadingable = state.emp && emps.length <= 1;

  useEffect(() => {
    if (busTrcnErrTypCdLoadingable) {
      fetchBusTrcnErrTypCds();
    }
  }, [busTrcnErrTypCdLoadingable, fetchBusTrcnErrTypCds]);
  useEffect(() => {
    if (empLoadingable) {
      fetchEmps();
    }
  }, [empLoadingable, fetchEmps]);

  return (
    <React.Fragment>
      <Formik
        innerRef={ref}
        enableReinitialize
        initialValues={initParams}
        validationSchema={yup.object({
          dsblAcptDtm: yup.date().typeError('유효하지 않는 접수일시입니다.'),
          dsblAcptDvsCd: yup.string().required('접수구분을 선택해주세요.'),
          dsblAcptReqrName: yup.string().min(3, '신고자를 입력해주세요.'),
          dsblAcptReqrMbphNo: yup.string().nullable().min(11, '휴대폰 번호가 유효하지 않습니다.'),
          busBsfcId: yup.object().nullable().required('버스영업소를 선택해주세요.'),
          vhclId: yup.object().nullable().required('차량을 선택해주세요.'),
          trcnDvsCd: yup.string().required('단말기가 설치된 차량을 선택해주세요.'),
          busTrcnErrTypCd: yup.object().nullable().required('접수오류유형을 선택해주세요.'),
          dsblPrcgPicId: yup.object().nullable().required('배정사원을 선택해주세요.'),
        })}
        onSubmit={(values) => {
          let modifiedTrcnDsbl = {
            stlmAreaCd: values.stlmAreaCd,
            dsblAcptDtm: values.dsblAcptDtm,
            dsblAcptDvsCd: values.dsblAcptDvsCd,
            dsblAcptReqrName: values.dsblAcptReqrName,
            dsblAcptReqrMbphNo: values.dsblAcptReqrMbphNo,
            tropId: values.vhclId.tropId,
            tropNm: values.vhclId.tropNm,
            busBsfcId: values.busBsfcId.busBsfcId,
            bsfcNm: values.busBsfcId.bsfcNm,
            vhclId: values.vhclId.vhclId,
            vhclNo: values.vhclId.vhclNo,
            trcnDvsCd: values.trcnDvsCd,
            busTrcnErrTypCd: values.busTrcnErrTypCd.code,
            busTrcnErrTypNm: values.busTrcnErrTypCd.name,
            drvrDrcsDsblYn: values.drvrDrcsDsblYn ? 'Y' : 'N',
            rideTrcnDsblYn: values.rideTrcnDsblYn ? 'Y' : 'N',
            alghTrcnDsblYn: values.alghTrcnDsblYn ? 'Y' : 'N',
            gpsDsblYn: values.gpsDsblYn ? 'Y' : 'N',
            recpIssuDsblYn: values.recpIssuDsblYn ? 'Y' : 'N',
            etcDsblYn: values.etcDsblYn ? 'Y' : 'N',
            dsblPt: values.dsblPt,
            dsblAcptAnswCtt: values.dsblAcptAnswCtt,
            dsblPrcgPicId: values.dsblPrcgPicId.code,
            dsblPrsrName: values.dsblPrcgPicId.name,
            dprtId: values.dsblPrcgPicId.dprtId,
            dprtNm: values.dsblPrcgPicId.dprtNm,
          };
          if (modifiedTrcnDsbl.trcnDvsCd !== trcnDsbl.trcnDvsCd) {
            modifiedTrcnDsbl.trcnErrPrcgTypCd = '';
            modifiedTrcnDsbl.trcnErrPrcgTypNm = '';
            modifiedTrcnDsbl.atlDsblTypVal = '';
            modifiedTrcnDsbl.atlDsblTypNm = '';
          }
          modifyTrcnDsbl(modifiedTrcnDsbl);
          handleNext();
        }}
      >
        {(formik) => (
          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ px: 2, py: 1 }}>
              <Grid item xs={12}>
                <ListItemButton disableGutters>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <AssignmentOutlinedIcon color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="접수 정보"
                    primaryTypographyProps={{ variant: 'subtitle2' }}
                  />
                </ListItemButton>
              </Grid>
              <Grid item xs={12}>
                <DesktopDateTimePicker
                  label="접수일시"
                  inputFormat="YYYY-MM-DD HH:mm"
                  id="dsblAcptDtm"
                  value={formik.values.dsblAcptDtm}
                  onChange={(newValue) => {
                    formik.setFieldValue('dsblAcptDtm', newValue?.format('YYYYMMDDHHmmss') ?? '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      fullWidth
                      variant="standard"
                      required
                      error={formik.touched.dsblAcptDtm && Boolean(formik.errors.dsblAcptDtm)}
                      helperText={formik.touched.dsblAcptDtm && formik.errors.dsblAcptDtm}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  error={formik.touched.dsblAcptDvsCd && Boolean(formik.errors.dsblAcptDvsCd)}
                  required
                  variant="standard"
                >
                  <FormLabel id="dsblAcptDvsCd-label">접수구분</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="dsblAcptDvsCd-label"
                    id="dsblAcptDvsCd"
                    name="dsblAcptDvsCd"
                    value={formik.values.dsblAcptDvsCd}
                    onChange={(event) => {
                      formik.setFieldValue('dsblAcptDvsCd', event.target.value);
                    }}
                  >
                    {dsblAcptDvsCds.map((dsblAcptDvsCd) => (
                      <FormControlLabel
                        key={dsblAcptDvsCd.code}
                        value={dsblAcptDvsCd.code}
                        control={<Radio size="small" />}
                        label={dsblAcptDvsCd.name}
                      />
                    ))}
                  </RadioGroup>
                  <FormHelperText>
                    {formik.touched.dsblAcptDvsCd && formik.errors.dsblAcptDvsCd}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <TextField
                  label="신고자"
                  size="small"
                  fullWidth
                  required
                  id="dsblAcptReqrName"
                  value={formik.values.dsblAcptReqrName}
                  onChange={formik.handleChange}
                  variant="standard"
                  error={formik.touched.dsblAcptReqrName && Boolean(formik.errors.dsblAcptReqrName)}
                  helperText={formik.touched.dsblAcptReqrName && formik.errors.dsblAcptReqrName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="신고자휴대폰"
                  size="small"
                  fullWidth
                  name="dsblAcptReqrMbphNo"
                  id="dsblAcptReqrMbphNo"
                  value={formik.values.dsblAcptReqrMbphNo}
                  onChange={formik.handleChange}
                  variant="standard"
                  InputProps={{
                    inputComponent: TextFieldMaskInput,
                  }}
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                  }}
                  error={
                    formik.touched.dsblAcptReqrMbphNo && Boolean(formik.errors.dsblAcptReqrMbphNo)
                  }
                  helperText={formik.touched.dsblAcptReqrMbphNo && formik.errors.dsblAcptReqrMbphNo}
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Autocomplete
                  disablePortal
                  size="small"
                  selectOnFocus={false}
                  isOptionEqualToValue={(option, value) =>
                    option.tropId === value.tropId && option.vhclId === value.vhclId
                  }
                  getOptionLabel={(option) => `${option.vhclNo} - ${option.tropNm}`}
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
                    formik.setFieldValue('intgAstsBzDvsCd', newValue?.intgAstsBzDvsCd ?? '');
                    formik.setFieldValue('stlmAreaCd', newValue?.stlmAreaCd ?? '');
                    formik.setFieldValue('tropId', newValue?.tropId ?? '');
                    if (newValue && !formik.values.busBsfcId) {
                      formik.setFieldValue('busBsfcId', newValue);
                    }
                    formik.setFieldValue('trcnDvsCd', newValue?.trcnDvsCd ?? '');
                    formik.setFieldValue('busTrcnErrTypCd', null);
                    if (
                      newValue &&
                      newValue.intgAstsBzDvsCd !== formik.values.dsblPrcgPicId?.intgAstsBzDvsCd
                    ) {
                      formik.setFieldValue('dsblPrcgPicId', null);
                    }
                    formik.setFieldValue('vhclId', newValue);
                    if (newValue) {
                      Promise.resolve().then(() => formik.setFieldTouched('vhclId'));
                    }
                  }}
                  inputValue={state.vhclSrchKwd}
                  onInputChange={(event, newInputValue) => {
                    handleVhclChange(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      required
                      label="차량번호"
                      error={formik.touched.vhclId && Boolean(formik.errors.vhclId)}
                      helperText={formik.touched.vhclId && formik.errors.vhclId}
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
                    formik.setFieldValue('intgAstsBzDvsCd', newValue?.intgAstsBzDvsCd ?? '');
                    formik.setFieldValue('stlmAreaCd', newValue?.stlmAreaCd ?? '');
                    formik.setFieldValue('tropId', newValue?.tropId ?? '');
                    formik.setFieldValue('busBsfcId', newValue);
                  }}
                  inputValue={state.busBsfcSrchKwd}
                  onInputChange={(event, newInputValue) => {
                    handleBusBsfcChange(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      required
                      label="버스영업소"
                      error={formik.touched.busBsfcId && Boolean(formik.errors.busBsfcId)}
                      helperText={formik.touched.busBsfcId && formik.errors.busBsfcId}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  error={formik.touched.trcnDvsCd && Boolean(formik.errors.trcnDvsCd)}
                  required
                  variant="standard"
                  size="small"
                  fullWidth
                  disabled
                >
                  <InputLabel id="trcnDvsCd-label">단말기구분</InputLabel>
                  <Select
                    labelId="trcnDvsCd-label"
                    value={formik.values.trcnDvsCd}
                    id="trcnDvsCd"
                    name="trcnDvsCd"
                    onChange={(event) => {
                      formik.setFieldValue('trcnDvsCd', event.target.value);
                    }}
                    label="단말기구분"
                    inputProps={{ readOnly: true }}
                  >
                    <MenuItem value="">전체</MenuItem>
                    {trcnDvsCds.map((trcnDvsCd) => (
                      <MenuItem value={trcnDvsCd.code} key={trcnDvsCd.code}>
                        {trcnDvsCd.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {formik.touched.trcnDvsCd && formik.errors.trcnDvsCd}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  disablePortal
                  size="small"
                  fullWidth
                  selectOnFocus={false}
                  open={state.busTrcnErrTypCd}
                  onOpen={() => {
                    dispatch({ type: 'BUS_TRCN_ERR_TYP_CD', payload: true });
                  }}
                  onClose={() => {
                    dispatch({ type: 'BUS_TRCN_ERR_TYP_CD', payload: false });
                  }}
                  loading={busTrcnErrTypCdLoadingable}
                  isOptionEqualToValue={(option, value) => option.code === value.code}
                  getOptionLabel={(option) => option.name}
                  options={busTrcnErrTypCds}
                  id="busTrcnErrTypCd"
                  value={formik.values.busTrcnErrTypCd}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('busTrcnErrTypCd', newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="선택해주세요"
                      variant="standard"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {busTrcnErrTypCdLoadingable ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                      required
                      label="접수오류유형"
                      error={
                        formik.touched.busTrcnErrTypCd && Boolean(formik.errors.busTrcnErrTypCd)
                      }
                      helperText={formik.touched.busTrcnErrTypCd && formik.errors.busTrcnErrTypCd}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset" variant="standard">
                  <FormLabel component="legend">장애 장비</FormLabel>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          id="drvrDrcsDsblYn"
                          checked={formik.values.drvrDrcsDsblYn}
                          onChange={formik.handleChange}
                        />
                      }
                      label="메인"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          id="rideTrcnDsblYn"
                          checked={formik.values.rideTrcnDsblYn}
                          onChange={formik.handleChange}
                        />
                      }
                      label="승차"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          id="alghTrcnDsblYn"
                          checked={formik.values.alghTrcnDsblYn}
                          onChange={formik.handleChange}
                        />
                      }
                      label="하차"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          id="gpsDsblYn"
                          checked={formik.values.gpsDsblYn}
                          onChange={formik.handleChange}
                        />
                      }
                      label="GPS"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          id="etcDsblYn"
                          checked={formik.values.etcDsblYn}
                          onChange={formik.handleChange}
                        />
                      }
                      label="기타"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          id="recpIssuDsblYn"
                          checked={formik.values.recpIssuDsblYn}
                          onChange={formik.handleChange}
                        />
                      }
                      label="영수증프린터"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="문의내용"
                  multiline
                  size="small"
                  rows={3}
                  fullWidth
                  id="dsblPt"
                  value={formik.values.dsblPt}
                  onChange={formik.handleChange}
                  error={formik.touched.dsblPt && Boolean(formik.errors.dsblPt)}
                  helperText={formik.touched.dsblPt && formik.errors.dsblPt}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="답변내용"
                  multiline
                  size="small"
                  rows={3}
                  fullWidth
                  id="dsblAcptAnswCtt"
                  value={formik.values.dsblAcptAnswCtt}
                  onChange={formik.handleChange}
                  error={formik.touched.dsblAcptAnswCtt && Boolean(formik.errors.dsblAcptAnswCtt)}
                  helperText={formik.touched.dsblAcptAnswCtt && formik.errors.dsblAcptAnswCtt}
                />
              </Grid>
              <Grid item xs={12}>
                <ListItemButton disableGutters>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <AssignmentIndOutlinedIcon color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="배정 정보"
                    primaryTypographyProps={{ variant: 'subtitle2' }}
                  />
                </ListItemButton>
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  disablePortal
                  size="small"
                  fullWidth
                  selectOnFocus={false}
                  open={state.emp}
                  onOpen={() => {
                    dispatch({ type: 'EMP', payload: true });
                  }}
                  onClose={() => {
                    dispatch({ type: 'EMP', payload: false });
                  }}
                  loading={empLoadingable}
                  isOptionEqualToValue={(option, value) => option.code === value.code}
                  getOptionKey={(option) => option.code}
                  getOptionLabel={(option) => `${option.name} - ${option.dprtNm}`}
                  options={
                    emps
                      ? emps
                          .map((emp) => ({
                            ...emp,
                            prmtSrsq: emp.dprtId === trcnDsbl.dprtId ? 0 : emp.prmtSrsq,
                          }))
                          .sort((a, b) => a.prmtSrsq - b.prmtSrsq)
                      : null
                  }
                  id="dsblPrcgPicId"
                  value={formik.values.dsblPrcgPicId}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('dsblPrcgPicId', newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="선택해주세요"
                      variant="standard"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {empLoadingable ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                      required
                      label="배정사원"
                      error={formik.touched.dsblPrcgPicId && Boolean(formik.errors.dsblPrcgPicId)}
                      helperText={formik.touched.dsblPrcgPicId && formik.errors.dsblPrcgPicId}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </Formik>
    </React.Fragment>
  );
});

export default TrcnDsblRgtStep1;
