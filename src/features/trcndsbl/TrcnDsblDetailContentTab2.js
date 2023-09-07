import React, { useEffect, useReducer, forwardRef } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import FormControl from '@mui/material/FormControl';
// import InputLabel from '@mui/material/InputLabel';
// import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Formik } from 'formik';
import * as yup from 'yup';
import produce from 'immer';
import dayjs from 'dayjs';
import { useQueryClient } from '@tanstack/react-query';
import { useQuery, useMutation } from '@common/queries/query';
import useAsyncCmmCode from '@common/hooks/useAsyncCmmCode';
import { fetchTrcnRplcInf, processTrcnDsbl } from '@features/trcndsbl/trcnDsblAPI';
import useAlert from '@common/hooks/useAlert';
import useConfirm from '@common/hooks/useConfirm';
import useAlertSnackbar from '@common/hooks/useAlertSnackbar';
import useError from '@common/hooks/useError';
import useSmUp from '@common/hooks/useSmUp';
import Stack from '@mui/material/Stack';
import BuildCircleOutlinedIcon from '@mui/icons-material/BuildCircleOutlined';

function LabelTableCell({ children }) {
  return (
    <TableCell component="th" scope="row" sx={{ whiteSpace: 'nowrap', pr: { xs: 0, sm: 2 } }}>
      {children}
    </TableCell>
  );
}

const NSMT_DVS_CD_CNT = 6;
const initialState = {
  dsblPrcgDelyRsnCdOpen: false,
  trcnErrPrcgTypCdOpen: false,
  atlDsblTypValOpen: false,
  nsmtDvsCdsOpen: Array.from({ length: NSMT_DVS_CD_CNT }, () => false),
  trcnRplcInfStatus: 'idle',
};

function reducer(state, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'DSBL_PRCG_DELY_RSN_CD_OPEN':
        draft.dsblPrcgDelyRsnCdOpen = true;
        break;
      case 'DSBL_PRCG_DELY_RSN_CD_CLOSE':
        draft.dsblPrcgDelyRsnCdOpen = false;
        break;
      case 'TRCN_ERR_PRCG_TYP_CD_OPEN':
        draft.trcnErrPrcgTypCdOpen = true;
        break;
      case 'TRCN_ERR_PRCG_TYP_CD_CLOSE':
        draft.trcnErrPrcgTypCdOpen = false;
        break;
      case 'ATL_DSBL_TYP_VAL_OPEN':
        draft.atlDsblTypValOpen = true;
        break;
      case 'ATL_DSBL_TYP_VAL_CLOSE':
        draft.atlDsblTypValOpen = false;
        break;
      case 'NSMT_DVS_CD_OPEN':
        draft.nsmtDvsCdsOpen[action.payload] = true;
        break;
      case 'NSMT_DVS_CD_CLOSE':
        draft.nsmtDvsCdsOpen[action.payload] = false;
        break;
      case 'TRCN_RPLC_INF':
        draft.trcnRplcInfStatus = action.payload;
        break;
      default:
        return draft;
    }
  });
}

const TrcnDsblDetailContentTab2 = forwardRef(({ trcnDsbl, otherCached, onChangeStatus }, ref) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const queryClient = useQueryClient();
  const openAlert = useAlert();
  const openConfirm = useConfirm();
  const openAlertSnackbar = useAlertSnackbar();
  const openError = useError();
  const isSmUp = useSmUp();

  const [dsblPrcgDelyRsnCds, fetchDsblPrcgDelyRsnCds] = useAsyncCmmCode(
    '275',
    {},
    trcnDsbl.dsblPrcgDelyRsnCd
      ? [{ code: trcnDsbl.dsblPrcgDelyRsnCd, name: trcnDsbl.dsblPrcgDelyRsnNm }]
      : []
  );
  const dsblPrcgDelyRsnCdLoadingable =
    state.dsblPrcgDelyRsnCdOpen && dsblPrcgDelyRsnCds.length <= 1;
  const [trcnErrPrcgTypCds, fetchTrcnErrPrcgTypCds] = useAsyncCmmCode(
    'TRCN_ERR_PRCG_TYP_CD' + (trcnDsbl.trcnDvsCd ? '-' + trcnDsbl.trcnDvsCd : ''),
    {
      trcnDvsCd: trcnDsbl.trcnDvsCd,
    },
    trcnDsbl.trcnErrPrcgTypCd
      ? [{ code: trcnDsbl.trcnErrPrcgTypCd, name: trcnDsbl.trcnErrPrcgTypNm }]
      : []
  );
  const trcnErrPrcgTypCdLoadingable = state.trcnErrPrcgTypCdOpen && trcnErrPrcgTypCds.length <= 1;
  const [atlDsblTypVals, fetchAtlDsblTypVals] = useAsyncCmmCode(
    'BUS_TRCN_ERR_TYP_CD' + (trcnDsbl.trcnDvsCd ? '-' + trcnDsbl.trcnDvsCd : ''),
    {
      trcnDvsCd: trcnDsbl.trcnDvsCd,
    },
    trcnDsbl.atlDsblTypVal ? [{ code: trcnDsbl.atlDsblTypVal, name: trcnDsbl.atlDsblTypValNm }] : []
  );
  const atlDsblTypValLoadingable = state.atlDsblTypValOpen && atlDsblTypVals.length <= 1;
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
    (v, i) => state.nsmtDvsCdsOpen[i] && nsmtDvsCds.length <= NSMT_DVS_CD_CNT
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

  const { refetch } = useQuery(
    ['readTrcnRplcInf'],
    () =>
      fetchTrcnRplcInf({
        stlmAreaCd: trcnDsbl.stlmAreaCd,
        dsblAcptNo: trcnDsbl.dsblAcptNo,
      }),
    {
      suspense: false,
      enabled: false,
      onError: (err) => {
        dispatch({
          type: 'TRCN_RPLC_INF',
          payload: 'idle',
        });
      },
      onSuccess: ({ data }) => {
        dispatch({
          type: 'TRCN_RPLC_INF',
          payload: 'idle',
        });
        if (!data.trcnRplcInf) {
          openAlertSnackbar('warning', '교체 이력이 없습니다.');
        } else if (ref.current.values.dsblPrcgDtlCtt.indexOf(data.trcnRplcInf) >= 0) {
          openAlertSnackbar('warning', '이미 이력이 반영되었습니다.');
        } else {
          ref.current.setFieldValue(
            'dsblPrcgDtlCtt',
            ref.current.values.dsblPrcgDtlCtt
              ? ref.current.values.dsblPrcgDtlCtt + '\n' + data.trcnRplcInf
              : data.trcnRplcInf
          );
        }
      },
    }
  );

  const addTrcnRplcInf = () => {
    dispatch({
      type: 'TRCN_RPLC_INF',
      payload: 'loading',
    });
    refetch();
  };

  const { mutate, reset } = useMutation(processTrcnDsbl, {
    useErrorBoundary: false,
    onMutate: () => {
      onChangeStatus('loading');
    },
    onError: (err) => {
      onChangeStatus('idle');
      openError(err, reset);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['readTrcnDsbl']);
      onChangeStatus('idle');
      openAlert(data.message);
      // openAlertSnackbar('info', data.message, true);
    },
  });

  return (
    <React.Fragment>
      <Formik
        innerRef={ref}
        enableReinitialize={true}
        initialValues={{
          vstAdjsDtm: trcnDsbl.vstAdjsDtm ?? '',
          vstArvlDtm: trcnDsbl.vstArvlDtm ?? '',
          dsblPrcgSttDtm: trcnDsbl.dsblPrcgSttDtm ?? '',
          dsblPrcgFnDtm: trcnDsbl.dsblPrcgFnDtm ?? '',
          dsblPrcgDelyRsnCd: trcnDsbl.dsblPrcgDelyRsnCd ?? '',
          trcnErrPrcgTypCd: otherCached
            ? null
            : trcnErrPrcgTypCds.find((cmdCode) => cmdCode.code === trcnDsbl.trcnErrPrcgTypCd) ??
              null,
          atlDsblTypVal: otherCached
            ? null
            : atlDsblTypVals.find((cmdCode) => cmdCode.code === trcnDsbl.atlDsblTypVal) ?? null,
          nsmtDvsCd1: otherCached
            ? null
            : nsmtDvsCds.find((cmdCode) => cmdCode.code === trcnDsbl.nsmtDvsCd1) ?? null,
          nsmtDvsCd2: otherCached
            ? null
            : nsmtDvsCds.find((cmdCode) => cmdCode.code === trcnDsbl.nsmtDvsCd2) ?? null,
          nsmtDvsCd3: otherCached
            ? null
            : nsmtDvsCds.find((cmdCode) => cmdCode.code === trcnDsbl.nsmtDvsCd3) ?? null,
          nsmtDvsCd4: otherCached
            ? null
            : nsmtDvsCds.find((cmdCode) => cmdCode.code === trcnDsbl.nsmtDvsCd4) ?? null,
          nsmtDvsCd5: otherCached
            ? null
            : nsmtDvsCds.find((cmdCode) => cmdCode.code === trcnDsbl.nsmtDvsCd5) ?? null,
          nsmtDvsCd6: otherCached
            ? null
            : nsmtDvsCds.find((cmdCode) => cmdCode.code === trcnDsbl.nsmtDvsCd6) ?? null,
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
            .required('처리시작일시를 입력해주세요.')
            .typeError('유효하지 않는 처리시작일시입니다.')
            .when('vstArvlDtm', {
              is: (val) => val && dayjs(val).isValid(),
              then: (schema) =>
                schema.min(yup.ref('vstArvlDtm'), '처리시작일시는 방문도착일시 이후이어야 합니다.'),
            }),
          dsblPrcgFnDtm: yup
            .date()
            .required('처리완료일시를 입력해주세요.')
            .typeError('유효하지 않는 처리완료일시입니다.')
            .when('dsblPrcgSttDtm', (dsblPrcgSttDtm, schema) => {
              if (dsblPrcgSttDtm && dayjs(dsblPrcgSttDtm).isValid()) {
                return schema.min(dsblPrcgSttDtm, '처리완료일시는 처리시작일시 이후이어야 합니다.');
              }
              return schema;
            }),
          trcnErrPrcgTypCd: yup.object().nullable().required('처리유형을 선택해주세요.'),
          dsblPrcgDtlCtt: yup.string().required('처리내용을 입력해주세요.'),
        })}
        onSubmit={(values) => {
          (async () => {
            const confirmed = await openConfirm('단말기 장애', '처리하시겠습니다?');
            if (confirmed) {
              mutate({
                stlmAreaCd: trcnDsbl.stlmAreaCd,
                dsblAcptNo: trcnDsbl.dsblAcptNo,
                vstAdjsDtm: values.vstAdjsDtm,
                vstArvlDtm: values.vstArvlDtm,
                dsblPrcgSttDtm: values.dsblPrcgSttDtm,
                dsblPrcgFnDtm: values.dsblPrcgFnDtm,
                dsblPrcgDelyRsnCd: values.dsblPrcgDelyRsnCd,
                trcnErrPrcgTypCd: values.trcnErrPrcgTypCd.code,
                atlDsblTypVal: values.atlDsblTypVal?.code ?? '',
                nsmtDvsCd1: values.nsmtDvsCd1?.code ?? '',
                nsmtDvsCd2: values.nsmtDvsCd2?.code ?? '',
                nsmtDvsCd3: values.nsmtDvsCd3?.code ?? '',
                nsmtDvsCd4: values.nsmtDvsCd4?.code ?? '',
                nsmtDvsCd5: values.nsmtDvsCd5?.code ?? '',
                nsmtDvsCd6: values.nsmtDvsCd6?.code ?? '',
                dsblPrcgDtlCtt: values.dsblPrcgDtlCtt,
                dsblEtcErrCtt: values.dsblEtcErrCtt,
              });
            }
          })();
        }}
      >
        {/* {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => ( */}
        {(formik) => (
          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <TableContainer>
              <Table>
                <colgroup>
                  <col style={{ width: isSmUp ? 112 : 104 }} />
                  <col />
                </colgroup>
                <TableBody>
                  <TableRow>
                    <LabelTableCell>장애처리자</LabelTableCell>
                    <TableCell>{trcnDsbl.dsblPrcgFnDtm ? trcnDsbl.dsblPrsrName : ''}</TableCell>
                  </TableRow>
                  <TableRow>
                    <LabelTableCell>방문조정일시</LabelTableCell>
                    <TableCell>
                      <DesktopDateTimePicker
                        inputFormat="YYYY-MM-DD HH:mm"
                        id="vstAdjsDtm"
                        value={formik.values.vstAdjsDtm}
                        onChange={(newValue) => {
                          formik.setFieldTouched('vstAdjsDtm');
                          formik.setFieldValue(
                            'vstAdjsDtm',
                            newValue?.format('YYYYMMDDHHmmss') ?? ''
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            fullWidth
                            sx={{
                              maxWidth: 300,
                            }}
                            error={formik.touched.vstAdjsDtm && Boolean(formik.errors.vstAdjsDtm)}
                            helperText={formik.touched.vstAdjsDtm && formik.errors.vstAdjsDtm}
                          />
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <LabelTableCell>방문도착일시</LabelTableCell>
                    <TableCell>
                      <DesktopDateTimePicker
                        inputFormat="YYYY-MM-DD HH:mm"
                        id="vstArvlDtm"
                        value={formik.values.vstArvlDtm}
                        onChange={(newValue) => {
                          formik.setFieldTouched('vstArvlDtm');
                          formik.setFieldValue(
                            'vstArvlDtm',
                            newValue?.format('YYYYMMDDHHmmss') ?? ''
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            fullWidth
                            sx={{
                              maxWidth: 300,
                            }}
                            error={formik.touched.vstArvlDtm && Boolean(formik.errors.vstArvlDtm)}
                            helperText={formik.touched.vstArvlDtm && formik.errors.vstArvlDtm}
                          />
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <LabelTableCell>처리시작일시*</LabelTableCell>
                    <TableCell>
                      <DesktopDateTimePicker
                        inputFormat="YYYY-MM-DD HH:mm"
                        id="dsblPrcgSttDtm"
                        value={formik.values.dsblPrcgSttDtm}
                        onChange={(newValue) => {
                          formik.setFieldTouched('dsblPrcgSttDtm');
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
                            required
                            sx={{
                              maxWidth: 300,
                            }}
                            error={
                              formik.touched.dsblPrcgSttDtm && Boolean(formik.errors.dsblPrcgSttDtm)
                            }
                            helperText={
                              formik.touched.dsblPrcgSttDtm && formik.errors.dsblPrcgSttDtm
                            }
                          />
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <LabelTableCell>처리완료일시*</LabelTableCell>
                    <TableCell>
                      <DesktopDateTimePicker
                        inputFormat="YYYY-MM-DD HH:mm"
                        id="dsblPrcgFnDtm"
                        value={formik.values.dsblPrcgFnDtm}
                        onChange={(newValue) => {
                          formik.setFieldTouched('dsblPrcgFnDtm');
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
                            required
                            sx={{
                              maxWidth: 300,
                            }}
                            error={
                              formik.touched.dsblPrcgFnDtm && Boolean(formik.errors.dsblPrcgFnDtm)
                            }
                            helperText={formik.touched.dsblPrcgFnDtm && formik.errors.dsblPrcgFnDtm}
                          />
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <LabelTableCell>지연사유</LabelTableCell>
                    <TableCell>
                      <FormControl
                        variant="standard"
                        size="small"
                        fullWidth
                        sx={{ maxWidth: { xs: 'calc(100vw - 170.5px)', sm: 300 } }}
                        // error={
                        //   formik.touched.dsblPrcgDelyRsnCd &&
                        //   Boolean(formik.errors.dsblPrcgDelyRsnCd)
                        // }
                      >
                        {/* <InputLabel id="dsblPrcgDelyRsnCd-label">지연사유</InputLabel> */}
                        <Select
                          // labelId="dsblPrcgDelyRsnCd-label"
                          // displayEmpty
                          open={state.dsblPrcgDelyRsnCdOpen}
                          onOpen={() => {
                            dispatch({ type: 'DSBL_PRCG_DELY_RSN_CD_OPEN' });
                          }}
                          onClose={() => {
                            dispatch({ type: 'DSBL_PRCG_DELY_RSN_CD_CLOSE' });
                          }}
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
                        {/* {formik.touched.dsblPrcgDelyRsnCd &&
                        Boolean(formik.errors.dsblPrcgDelyRsnCd) ? (
                          <FormHelperText>
                            {formik.touched.dsblPrcgDelyRsnCd && formik.errors.dsblPrcgDelyRsnCd}
                          </FormHelperText>
                        ) : null} */}
                      </FormControl>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <LabelTableCell>처리유형*</LabelTableCell>
                    <TableCell>
                      <Autocomplete
                        disablePortal
                        size="small"
                        selectOnFocus={false}
                        open={state.busTrcnErrTypCdOpen}
                        onOpen={() => {
                          dispatch({ type: 'TRCN_ERR_PRCG_TYP_CD_OPEN' });
                        }}
                        onClose={() => {
                          dispatch({ type: 'TRCN_ERR_PRCG_TYP_CD_CLOSE' });
                        }}
                        loading={trcnErrPrcgTypCdLoadingable}
                        isOptionEqualToValue={(option, value) => option.code === value.code}
                        getOptionLabel={(option) => option.name}
                        options={trcnErrPrcgTypCds}
                        id="trcnErrPrcgTypCd"
                        value={formik.values.trcnErrPrcgTypCd}
                        onChange={(event, newValue) => {
                          formik.setFieldTouched('trcnErrPrcgTypCd');
                          formik.setFieldValue('trcnErrPrcgTypCd', newValue);
                        }}
                        sx={{
                          maxWidth: 300,
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
                            required
                            error={
                              formik.touched.trcnErrPrcgTypCd &&
                              Boolean(formik.errors.trcnErrPrcgTypCd)
                            }
                            helperText={
                              formik.touched.trcnErrPrcgTypCd && formik.errors.trcnErrPrcgTypCd
                            }
                          />
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <LabelTableCell>실제장애유형</LabelTableCell>
                    <TableCell>
                      <Autocomplete
                        disablePortal
                        size="small"
                        selectOnFocus={false}
                        open={state.empOpen}
                        onOpen={() => {
                          dispatch({ type: 'ATL_DSBL_TYP_VAL_OPEN' });
                        }}
                        onClose={() => {
                          dispatch({ type: 'ATL_DSBL_TYP_VAL_CLOSE' });
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
                        sx={{
                          maxWidth: 300,
                          // '& .MuiAutocomplete-input': {
                          //   fontSize: (theme) => theme.typography.fontSize,
                          // },
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            // placeholder="선택해주세요"
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
                            error={
                              formik.touched.atlDsblTypVal && Boolean(formik.errors.atlDsblTypVal)
                            }
                            helperText={formik.touched.atlDsblTypVal && formik.errors.atlDsblTypVal}
                          />
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>
                      <Autocomplete
                        disablePortal
                        size="small"
                        selectOnFocus={false}
                        open={state.nsmtDvsCdsOpen[0]}
                        onOpen={() => {
                          dispatch({
                            type: 'NSMT_DVS_CD_OPEN',
                            payload: 0,
                          });
                        }}
                        onClose={() => {
                          dispatch({
                            type: 'NSMT_DVS_CD_CLOSE',
                            payload: 0,
                          });
                        }}
                        loading={nsmtDvsCdsLoadingable[0]}
                        isOptionEqualToValue={(option, value) => option.code === value.code}
                        getOptionLabel={(option) => option.name}
                        options={nsmtDvsCds}
                        id="nsmtDvsCd1"
                        value={formik.values.nsmtDvsCd1}
                        onChange={(event, newValue) => {
                          formik.setFieldValue('nsmtDvsCd1', newValue);
                        }}
                        sx={
                          {
                            // maxWidth: 300,
                            // '& .MuiAutocomplete-input': {
                            //   fontSize: (theme) => theme.typography.fontSize,
                            // },
                          }
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            // placeholder="선택해주세요"
                            label="소모품1"
                            variant="standard"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <React.Fragment>
                                  {nsmtDvsCdsLoadingable[0] ? (
                                    <CircularProgress color="inherit" size={20} />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </React.Fragment>
                              ),
                            }}
                            error={formik.touched.nsmtDvsCd1 && Boolean(formik.errors.nsmtDvsCd1)}
                            helperText={formik.touched.nsmtDvsCd1 && formik.errors.nsmtDvsCd1}
                          />
                        )}
                      />
                      <Accordion elevation={0} square sx={{ pt: 1 }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="csm-content"
                          sx={{
                            px: 0,
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <BuildCircleOutlinedIcon color="primary" />
                            <Typography variant="body2">
                              소모품{`(2~${NSMT_DVS_CD_CNT})`}
                            </Typography>
                          </Stack>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0 }}>
                          <Stack direction="column" spacing={1}>
                            {Array.from({ length: NSMT_DVS_CD_CNT - 1 }, (v, i) => i + 2).map(
                              (number, index) => (
                                <Autocomplete
                                  key={number}
                                  disablePortal
                                  size="small"
                                  selectOnFocus={false}
                                  open={state.nsmtDvsCdsOpen[index + 1]}
                                  onOpen={() => {
                                    dispatch({
                                      type: 'NSMT_DVS_CD_OPEN',
                                      payload: index + 1,
                                    });
                                  }}
                                  onClose={() => {
                                    dispatch({
                                      type: 'NSMT_DVS_CD_CLOSE',
                                      payload: index + 1,
                                    });
                                  }}
                                  loading={nsmtDvsCdsLoadingable[index + 1]}
                                  isOptionEqualToValue={(option, value) =>
                                    option.code === value.code
                                  }
                                  getOptionLabel={(option) => option.name}
                                  options={nsmtDvsCds}
                                  id={`nsmtDvsCd${number}`}
                                  value={formik.values['nsmtDvsCd' + number]}
                                  onChange={(event, newValue) => {
                                    formik.setFieldValue(`nsmtDvsCd${number}`, newValue);
                                  }}
                                  // sx={{
                                  //   maxWidth: 350,
                                  //   // '& .MuiAutocomplete-input': {
                                  //   //   fontSize: (theme) => theme.typography.fontSize,
                                  //   // },
                                  // }}
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
                              )
                            )}
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2} sx={{ textAlign: 'right' }}>
                      <LoadingButton
                        variant="outlined"
                        color="warning"
                        size="small"
                        loading={state.trcnRplcInfStatus === 'loading'}
                        loadingPosition="start"
                        startIcon={<PostAddOutlinedIcon />}
                        onClick={addTrcnRplcInf}
                        sx={{ mb: 0.5 }}
                      >
                        교체이력 반영
                      </LoadingButton>
                      <TextField
                        label="처리내용"
                        multiline
                        size="small"
                        rows={4}
                        fullWidth
                        required
                        id="dsblPrcgDtlCtt"
                        value={formik.values.dsblPrcgDtlCtt}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.dsblPrcgDtlCtt && Boolean(formik.errors.dsblPrcgDtlCtt)
                        }
                        helperText={formik.touched.dsblPrcgDtlCtt && formik.errors.dsblPrcgDtlCtt}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ '& td, & th': { border: 0 } }}>
                    <TableCell colSpan={2}>
                      <TextField
                        label="기타오류내용"
                        multiline
                        size="small"
                        rows={4}
                        fullWidth
                        id="dsblEtcErrCtt"
                        value={formik.values.dsblEtcErrCtt}
                        onChange={formik.handleChange}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Formik>
    </React.Fragment>
  );
});

export default TrcnDsblDetailContentTab2;
