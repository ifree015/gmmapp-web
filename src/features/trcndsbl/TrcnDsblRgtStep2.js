import React, { useEffect, useReducer, forwardRef } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HandymanIcon from '@mui/icons-material/Handyman';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Collapse from '@mui/material/Collapse';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { Formik } from 'formik';
import * as yup from 'yup';
import produce from 'immer';
import dayjs from 'dayjs';
// import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@common/queries/query';
import { registerTrcnDsbl } from '@features/trcndsbl/trcnDsblAPI';
import useAsyncCmmCode from '@common/hooks/useAsyncCmmCode';
import useAlert from '@common/hooks/useAlert';
import useConfirm from '@common/hooks/useConfirm';
import useError from '@common/hooks/useError';
import BuildCircleOutlinedIcon from '@mui/icons-material/BuildCircleOutlined';

const NSMT_DVS_CD_CNT = 6;
const initialState = {
  dsblPrcgDelyRsnCd: false,
  trcnErrPrcgTypCd: false,
  atlDsblTypVal: false,
  collapse: true,
  nsmtDvsCds: Array.from({ length: NSMT_DVS_CD_CNT }, () => false),
};

function reducer(state, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'DSBL_PRCG_DELY_RSN_CD':
        draft.dsblPrcgDelyRsnCd = action.payload;
        break;
      case 'TRCN_ERR_PRCG_TYP_CD':
        draft.trcnErrPrcgTypCd = action.payload;
        break;
      case 'ATL_DSBL_TYP_VAL':
        draft.atlDsblTypVal = action.payload;
        break;
      case 'COLLAPSE':
        draft.collapse = action.payload;
        break;
      case 'NSMT_DVS_CD_OPEN':
        draft.nsmtDvsCds[action.payload] = true;
        break;
      case 'NSMT_DVS_CD_CLOSE':
        draft.nsmtDvsCds[action.payload] = false;
        break;
      default:
        return draft;
    }
  });
}

const TrcnDsblRgtStep2 = forwardRef(
  ({ trcnDsbl, modifyTrcnDsbl, onChangeStatus, onClose }, ref) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    // const queryClient = useQueryClient();
    const openAlert = useAlert();
    const openConfirm = useConfirm();
    const openError = useError();

    const [dsblPrcgDelyRsnCds, fetchDsblPrcgDelyRsnCds] = useAsyncCmmCode(
      'DSBL_PRCG_DELY_RSN_CD',
      { cdId: '275' },
      trcnDsbl.dsblPrcgDelyRsnCd
        ? [{ code: trcnDsbl.dsblPrcgDelyRsnCd, name: trcnDsbl.dsblPrcgDelyRsnNm }]
        : []
    );
    const dsblPrcgDelyRsnCdLoadingable = state.dsblPrcgDelyRsnCd && dsblPrcgDelyRsnCds.length <= 1;
    const [trcnErrPrcgTypCds, fetchTrcnErrPrcgTypCds] = useAsyncCmmCode(
      'TRCN_ERR_PRCG_TYP_CD' + (trcnDsbl.trcnDvsCd ? '-' + trcnDsbl.trcnDvsCd : ''),
      {
        trcnDvsCd: trcnDsbl.trcnDvsCd,
      },
      trcnDsbl.trcnErrPrcgTypCd
        ? [{ code: trcnDsbl.trcnErrPrcgTypCd, name: trcnDsbl.trcnErrPrcgTypNm }]
        : []
    );
    const trcnErrPrcgTypCdLoadingable = state.trcnErrPrcgTypCd && trcnErrPrcgTypCds.length <= 1;
    const [atlDsblTypVals, fetchAtlDsblTypVals] = useAsyncCmmCode(
      'BUS_TRCN_ERR_TYP_CD' + (trcnDsbl.trcnDvsCd ? '-' + trcnDsbl.trcnDvsCd : ''),
      {
        trcnDvsCd: trcnDsbl.trcnDvsCd,
      },
      trcnDsbl.atlDsblTypVal
        ? [{ code: trcnDsbl.atlDsblTypVal, name: trcnDsbl.atlDsblTypValNm }]
        : []
    );
    const atlDsblTypValLoadingable = state.atlDsblTypVal && atlDsblTypVals.length <= 1;
    const [nsmtDvsCds, fetchNsmtDvsCds] = useAsyncCmmCode(
      'CSM_TYP_CD' + (trcnDsbl.trcnDvsCd ? '-' + trcnDsbl.trcnDvsCd : ''),
      {
        trcnDvsCd: trcnDsbl.trcnDvsCd,
      },
      Array.from(Array(NSMT_DVS_CD_CNT), (v, i) => i + 1)
        .map((number) => ({
          code: trcnDsbl['nsmtDvsCd' + number],
          name: trcnDsbl['nsmtDvsNm' + number],
        }))
        .filter((nsmtDvsCd) => !!nsmtDvsCd.code)
        .map((e) => ({
          code: e.code,
          name: e.name.replaceAll('&#34;', '"'),
        })),
      true
    );
    const nsmtDvsCdsLoadingable = Array.from(
      Array(NSMT_DVS_CD_CNT),
      (v, i) => state.nsmtDvsCds[i] && nsmtDvsCds.length <= NSMT_DVS_CD_CNT
    );
    const nsmtDvsCdLoadingable = nsmtDvsCdsLoadingable.some((value) => value);

    useEffect(() => {
      if (dsblPrcgDelyRsnCdLoadingable) {
        fetchDsblPrcgDelyRsnCds();
      }
    }, [dsblPrcgDelyRsnCdLoadingable, fetchDsblPrcgDelyRsnCds]);
    useEffect(() => {
      if (trcnErrPrcgTypCdLoadingable) {
        fetchTrcnErrPrcgTypCds();
      }
    }, [trcnErrPrcgTypCdLoadingable, fetchTrcnErrPrcgTypCds]);
    useEffect(() => {
      if (atlDsblTypValLoadingable) {
        fetchAtlDsblTypVals();
      }
    }, [atlDsblTypValLoadingable, fetchAtlDsblTypVals]);
    useEffect(() => {
      if (nsmtDvsCdLoadingable) {
        fetchNsmtDvsCds();
      }
    }, [nsmtDvsCdLoadingable, fetchNsmtDvsCds]);

    useEffect(() => {
      if (state.collapse && trcnDsbl.nsmtDvsCd1) {
        dispatch({ type: 'COLLAPSE', payload: !state.collapse });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trcnDsbl]);

    const { mutate, reset } = useMutation(registerTrcnDsbl, {
      useErrorBoundary: false,
      onMutate: () => {
        onChangeStatus('loading');
      },
      onError: (err) => {
        onChangeStatus('idle');
        openError(err, reset);
      },
      onSuccess: (data) => {
        onChangeStatus('idle');
        (async () => {
          await openAlert(data.message);
          onClose();
        })();
      },
    });

    return (
      <React.Fragment>
        <Formik
          innerRef={ref}
          //enableReinitialize
          initialValues={{
            dsblPrcgDelyRsnCd: trcnDsbl.dsblPrcgDelyRsnCd ?? '',
            vstAdjsDtm: trcnDsbl.vstAdjsDtm ?? '',
            vstArvlDtm: trcnDsbl.vstArvlDtm ?? '',
            dsblPrcgSttDtm: trcnDsbl.dsblPrcgSttDtm ?? '',
            dsblPrcgFnDtm: trcnDsbl.dsblPrcgFnDtm ?? '',
            trcnErrPrcgTypCd:
              trcnErrPrcgTypCds.find((cmdCode) => cmdCode.code === trcnDsbl.trcnErrPrcgTypCd) ??
              null,
            atlDsblTypVal:
              atlDsblTypVals.find((cmdCode) => cmdCode.code === trcnDsbl.atlDsblTypVal) ?? null,
            nsmtDvsCd1: nsmtDvsCds.find((cmdCode) => cmdCode.code === trcnDsbl.nsmtDvsCd1) ?? null,
            nsmtDvsCd2: nsmtDvsCds.find((cmdCode) => cmdCode.code === trcnDsbl.nsmtDvsCd2) ?? null,
            nsmtDvsCd3: nsmtDvsCds.find((cmdCode) => cmdCode.code === trcnDsbl.nsmtDvsCd3) ?? null,
            nsmtDvsCd4: nsmtDvsCds.find((cmdCode) => cmdCode.code === trcnDsbl.nsmtDvsCd4) ?? null,
            nsmtDvsCd5: nsmtDvsCds.find((cmdCode) => cmdCode.code === trcnDsbl.nsmtDvsCd5) ?? null,
            nsmtDvsCd6: nsmtDvsCds.find((cmdCode) => cmdCode.code === trcnDsbl.nsmtDvsCd6) ?? null,
            dsblPrcgDtlCtt: trcnDsbl.dsblPrcgDtlCtt ?? '',
            dsblEtcErrCtt: trcnDsbl.dsblEtcErrCtt ?? '',
          }}
          validationSchema={yup.object({
            vstAdjsDtm: yup
              .date()
              .typeError('유효하지 않는 방문조정일시입니다.')
              .min(trcnDsbl.dsblAcptDtm, '방문조정일시는 접수일시보다 이후이어야 합니다.'),
            vstArvlDtm: yup
              .date()
              .typeError('유효하지 않는 방문도착일시입니다.')
              .min(trcnDsbl.dsblAcptDtm, '방문도착일시는 접수일시보다 이후이어야 합니다.'),
            dsblPrcgSttDtm: yup
              .date()
              .typeError('유효하지 않는 처리시작일시입니다.')
              .when('vstArvlDtm', {
                is: (val) => val && dayjs(val).isValid(),
                then: (schema) =>
                  schema.min(
                    yup.ref('vstArvlDtm'),
                    '처리시작일시는 방문도착일시 이후이어야 합니다.'
                  ),
              })
              .test('dsblPrcgSttDtm', '처리시작일시를 입력해주세요.', function (value) {
                return this.parent.dsblPrcgFnDtm && dayjs(this.parent.dsblPrcgFnDtm).isValid()
                  ? !!value
                  : true;
              }),
            dsblPrcgFnDtm: yup
              .date()
              .typeError('유효하지 않는 처리완료일시입니다.')
              .when('dsblPrcgSttDtm', (dsblPrcgSttDtm, schema) => {
                if (dsblPrcgSttDtm && dayjs(dsblPrcgSttDtm).isValid()) {
                  return schema
                    .required('처리완료일시를 입력해주세요.')
                    .min(dsblPrcgSttDtm, '처리완료일시는 처리시작일시 이후이어야 합니다.');
                }
                return schema;
              }),
            trcnErrPrcgTypCd: yup
              .object()
              .nullable()
              .when('dsblPrcgFnDtm', {
                is: (val) => val && dayjs(val).isValid(),
                then: (schema) => schema.required('현장처리유형을 선택해주세요.'),
              }),
            dsblPrcgDtlCtt: yup.string().when('dsblPrcgFnDtm', {
              is: (val) => val && dayjs(val).isValid(),
              then: (schema) => schema.required('처리내용을 입력해주세요.'),
            }),
          })}
          onSubmit={(values) => {
            let modifiedTrcnDsbl = {
              ...trcnDsbl,
              dsblPrcgDelyRsnCd: values.dsblPrcgDelyRsnCd,
              dsblPrcgDelyRsnNm:
                dsblPrcgDelyRsnCds.filter(
                  (dsblPrcgDelyRsnCd) => dsblPrcgDelyRsnCd.code === values.dsblPrcgDelyRsnCd
                )?.name ?? '',
              vstAdjsDtm: values.vstAdjsDtm,
              vstArvlDtm: values.vstArvlDtm,
              dsblPrcgSttDtm: values.dsblPrcgSttDtm,
              dsblPrcgFnDtm: values.dsblPrcgFnDtm,
              trcnErrPrcgTypCd: values.trcnErrPrcgTypCd?.code ?? '',
              trcnErrPrcgTypNm: values.trcnErrPrcgTypCd?.name ?? '',
              atlDsblTypVal: values.atlDsblTypVal?.code ?? '',
              atlDsblTypNm: values.atlDsblTypVal?.name ?? '',
              nsmtDvsCd1: values.nsmtDvsCd1?.code ?? '',
              nsmtDvsNm1: values.nsmtDvsCd1?.name ?? '',
              nsmtDvsCd2: values.nsmtDvsCd2?.code ?? '',
              nsmtDvsNm2: values.nsmtDvsCd2?.name ?? '',
              nsmtDvsCd3: values.nsmtDvsCd3?.code ?? '',
              nsmtDvsNm3: values.nsmtDvsCd3?.name ?? '',
              nsmtDvsCd4: values.nsmtDvsCd4?.code ?? '',
              nsmtDvsNm4: values.nsmtDvsCd4?.name ?? '',
              nsmtDvsCd5: values.nsmtDvsCd5?.code ?? '',
              nsmtDvsNm5: values.nsmtDvsCd5?.name ?? '',
              nsmtDvsCd6: values.nsmtDvsCd6?.code ?? '',
              nsmtDvsNm6: values.nsmtDvsCd6?.name ?? '',
              dsblPrcgDtlCtt: values.dsblPrcgDtlCtt,
              dsblEtcErrCtt: values.dsblEtcErrCtt,
            };
            modifyTrcnDsbl(modifiedTrcnDsbl);
            (async () => {
              const confirmed = await openConfirm('단말기 장애', '등록하시겠습니다?');
              if (confirmed) {
                mutate(modifiedTrcnDsbl);
              }
            })();
          }}
        >
          {(formik) => (
            <Box component="form" onSubmit={formik.handleSubmit} noValidate>
              <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ px: 2, pt: 2, pb: 1 }}>
                <Grid item xs={12}>
                  <FormControl variant="standard" size="small" fullWidth>
                    <InputLabel id="dsblPrcgDelyRsnCd-label">지연사유</InputLabel>
                    <Select
                      open={state.dsblPrcgDelyRsnCd}
                      onOpen={() => {
                        dispatch({ type: 'DSBL_PRCG_DELY_RSN_CD', payload: true });
                      }}
                      onClose={() => {
                        dispatch({ type: 'DSBL_PRCG_DELY_RSN_CD', payload: false });
                      }}
                      labelId="dsblPrcgDelyRsnCd-label"
                      id="dsblPrcgDelyRsnCd"
                      value={formik.values.dsblPrcgDelyRsnCd}
                      onChange={(event) => {
                        formik.setFieldValue('dsblPrcgDelyRsnCd', event.target.value);
                      }}
                    >
                      <MenuItem value="">선택해주세요</MenuItem>
                      {dsblPrcgDelyRsnCds.map((dsblPrcgDelyRsnCd) => (
                        <MenuItem value={dsblPrcgDelyRsnCd.code} key={dsblPrcgDelyRsnCd.code}>
                          {dsblPrcgDelyRsnCd.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <DesktopDateTimePicker
                    label="방문조정일시"
                    inputFormat="YYYY-MM-DD HH:mm"
                    id="vstAdjsDtm"
                    value={formik.values.vstAdjsDtm}
                    onChange={(newValue) => {
                      formik.setFieldValue('vstAdjsDtm', newValue?.format('YYYYMMDDHHmmss') ?? '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        fullWidth
                        variant="standard"
                        error={formik.touched.vstAdjsDtm && Boolean(formik.errors.vstAdjsDtm)}
                        helperText={formik.touched.vstAdjsDtm && formik.errors.vstAdjsDtm}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DesktopDateTimePicker
                    label="방문도착일시"
                    inputFormat="YYYY-MM-DD HH:mm"
                    id="vstArvlDtm"
                    value={formik.values.vstArvlDtm}
                    onChange={(newValue) => {
                      formik.setFieldValue('vstArvlDtm', newValue?.format('YYYYMMDDHHmmss') ?? '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        fullWidth
                        variant="standard"
                        error={formik.touched.vstArvlDtm && Boolean(formik.errors.vstArvlDtm)}
                        helperText={formik.touched.vstArvlDtm && formik.errors.vstArvlDtm}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ListItemButton disableGutters>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <HandymanIcon color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary="처리 정보"
                      primaryTypographyProps={{ variant: 'subtitle2' }}
                    />
                  </ListItemButton>
                </Grid>
                <Grid item xs={12}>
                  <DesktopDateTimePicker
                    label="처리시작일시"
                    inputFormat="YYYY-MM-DD HH:mm"
                    id="dsblPrcgSttDtm"
                    value={formik.values.dsblPrcgSttDtm}
                    onChange={(newValue) => {
                      formik.setFieldValue(
                        'dsblPrcgSttDtm',
                        newValue?.format('YYYYMMDDHHmmss') ?? ''
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        fullWidth
                        variant="standard"
                        error={
                          formik.touched.dsblPrcgSttDtm && Boolean(formik.errors.dsblPrcgSttDtm)
                        }
                        helperText={formik.touched.dsblPrcgSttDtm && formik.errors.dsblPrcgSttDtm}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DesktopDateTimePicker
                    label="처리완료일시"
                    inputFormat="YYYY-MM-DD HH:mm"
                    id="dsblPrcgFnDtm"
                    value={formik.values.dsblPrcgFnDtm}
                    onChange={(newValue) => {
                      formik.setFieldValue(
                        'dsblPrcgFnDtm',
                        newValue?.format('YYYYMMDDHHmmss') ?? ''
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        fullWidth
                        variant="standard"
                        error={formik.touched.dsblPrcgFnDtm && Boolean(formik.errors.dsblPrcgFnDtm)}
                        helperText={formik.touched.dsblPrcgFnDtm && formik.errors.dsblPrcgFnDtm}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    disablePortal
                    size="small"
                    fullWidth
                    selectOnFocus={false}
                    open={state.trcnErrPrcgTypCd}
                    onOpen={() => {
                      dispatch({ type: 'TRCN_ERR_PRCG_TYP_CD', payload: true });
                    }}
                    onClose={() => {
                      dispatch({ type: 'TRCN_ERR_PRCG_TYP_CD', payload: false });
                    }}
                    loading={trcnErrPrcgTypCdLoadingable}
                    isOptionEqualToValue={(option, value) => option.code === value.code}
                    getOptionLabel={(option) => option.name}
                    options={trcnErrPrcgTypCds}
                    id="trcnErrPrcgTypCd"
                    value={formik.values.trcnErrPrcgTypCd}
                    onChange={(event, newValue) => {
                      formik.setFieldValue('trcnErrPrcgTypCd', newValue);
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
                              {trcnErrPrcgTypCdLoadingable ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                        label="현장처리유형"
                        error={
                          formik.touched.trcnErrPrcgTypCd && Boolean(formik.errors.trcnErrPrcgTypCd)
                        }
                        helperText={
                          formik.touched.trcnErrPrcgTypCd && formik.errors.trcnErrPrcgTypCd
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    disablePortal
                    size="small"
                    fullWidth
                    selectOnFocus={false}
                    open={state.atlDsblTypVal}
                    onOpen={() => {
                      dispatch({ type: 'ATL_DSBL_TYP_VAL', payload: true });
                    }}
                    onClose={() => {
                      dispatch({ type: 'ATL_DSBL_TYP_VAL', payload: false });
                    }}
                    loading={atlDsblTypValLoadingable}
                    isOptionEqualToValue={(option, value) => option.code === value.code}
                    getOptionLabel={(option) => option.name}
                    options={atlDsblTypVals}
                    id="atlDsblTypVal"
                    value={formik.values.atlDsblTypVal}
                    onChange={(event, newValue) => {
                      formik.setFieldValue('atlDsblTypVal', newValue);
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
                              {atlDsblTypValLoadingable ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                        label="현장확인장애"
                        error={formik.touched.atlDsblTypVal && Boolean(formik.errors.atlDsblTypVal)}
                        helperText={formik.touched.atlDsblTypVal && formik.errors.atlDsblTypVal}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ListItemButton
                    disableGutters
                    onClick={(event) => {
                      dispatch({ type: 'COLLAPSE', payload: !state.collapse });
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <BuildCircleOutlinedIcon color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary="소모품"
                      primaryTypographyProps={{ color: 'text.secondary' }}
                    />
                    {state.collapse ? (
                      <ExpandMoreOutlinedIcon color="action" />
                    ) : (
                      <ExpandLessOutlinedIcon color="action" />
                    )}
                  </ListItemButton>
                </Grid>
                <Collapse in={!state.collapse} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
                  <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ pl: 1, py: 1 }}>
                    {Array.from({ length: NSMT_DVS_CD_CNT }, (v, i) => i + 1).map(
                      (number, index) => (
                        <Grid item xs={12} key={number}>
                          <Autocomplete
                            disablePortal
                            fullWidth
                            size="small"
                            selectOnFocus={false}
                            open={state.nsmtDvsCds[index]}
                            onOpen={() => {
                              dispatch({
                                type: 'NSMT_DVS_CD_OPEN',
                                payload: index,
                              });
                            }}
                            onClose={() => {
                              dispatch({
                                type: 'NSMT_DVS_CD_CLOSE',
                                payload: index,
                              });
                            }}
                            loading={nsmtDvsCdsLoadingable[index]}
                            isOptionEqualToValue={(option, value) => option.code === value.code}
                            getOptionLabel={(option) => option.name}
                            options={nsmtDvsCds}
                            id={`nsmtDvsCd${number}`}
                            value={formik.values['nsmtDvsCd' + number]}
                            onChange={(event, newValue) => {
                              formik.setFieldValue(`nsmtDvsCd${number}`, newValue);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                // placeholder="선택해주세요"
                                label={`소모품${number}`}
                                variant="standard"
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <React.Fragment>
                                      {nsmtDvsCdsLoadingable[index + 1] ? (
                                        <CircularProgress color="inherit" size={20} />
                                      ) : null}
                                      {params.InputProps.endAdornment}
                                    </React.Fragment>
                                  ),
                                }}
                                error={
                                  formik.touched['nsmtDvsCd' + number] &&
                                  Boolean(formik.errors['nsmtDvsCd' + number])
                                }
                                helperText={
                                  formik.touched['nsmtDvsCd' + number] &&
                                  formik.errors['nsmtDvsCd' + number]
                                }
                              />
                            )}
                          />
                        </Grid>
                      )
                    )}
                  </Grid>
                </Collapse>
                <Grid item xs={12}>
                  <TextField
                    label="처리내용"
                    multiline
                    size="small"
                    rows={3}
                    fullWidth
                    id="dsblPrcgDtlCtt"
                    value={formik.values.dsblPrcgDtlCtt}
                    onChange={formik.handleChange}
                    error={formik.touched.dsblPrcgDtlCtt && Boolean(formik.errors.dsblPrcgDtlCtt)}
                    helperText={formik.touched.dsblPrcgDtlCtt && formik.errors.dsblPrcgDtlCtt}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="기타오류내용"
                    multiline
                    size="small"
                    rows={3}
                    fullWidth
                    id="dsblEtcErrCtt"
                    value={formik.values.dsblEtcErrCtt}
                    onChange={formik.handleChange}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </Formik>
      </React.Fragment>
    );
  }
);

export default TrcnDsblRgtStep2;
