import React, { useEffect, useReducer, useCallback, forwardRef } from 'react';
import Box from '@mui/material/Box';
// import Chip from '@mui/material/Chip';
// import Stack from '@mui/material/Stack';
// import Tooltip from '@mui/material/Tooltip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import TextField from '@mui/material/TextField';
import { Formik } from 'formik';
import * as yup from 'yup';
import produce from 'immer';
import dayjs from 'dayjs';
import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@common/queries/query';
import useAsyncCmmCode from '@common/hooks/useAsyncCmmCode';
import { acceptTrcnDsbl } from '@features/trcndsbl/trcnDsblAPI';
import useUser from '@common/hooks/useUser';
import useAlert from '@common/hooks/useAlert';
// import useAlertSnackbar from '@common/hooks/useAlertSnackbar';
import useConfirm from '@common/hooks/useConfirm';
import useError from '@common/hooks/useError';
import TrcnDsblAssignmentHst from './TrcnDsblAssignmentHst';
import useSmUp from '@common/hooks/useSmUp';

function LabelTableCell({ children }) {
  return (
    <TableCell component="th" scope="row" sx={{ whiteSpace: 'nowrap', pr: { xs: 0, sm: 2 } }}>
      {children}
    </TableCell>
  );
}

const initialState = {
  busTrcnErrTypCdOpen: false,
  empOpen: false,
  assignmentHistory: false,
};

function reducer(state, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'BUS_TRCN_ERR_TYP_CD_OPEN':
        draft.busTrcnErrTypCdOpen = true;
        break;
      case 'BUS_TRCN_ERR_TYP_CD_CLOSE':
        draft.busTrcnErrTypCdOpen = false;
        break;
      case 'EMP_OPEN':
        draft.empOpen = true;
        break;
      case 'EMP_CLOSE':
        draft.empOpen = false;
        break;
      case 'ASSIGNMENT_HISTORY_OPEN':
        draft.assignmentHistory = true;
        break;
      case 'ASSIGNMENT_HISTORY_CLOSE':
        draft.assignmentHistory = false;
        break;
      default:
        return draft;
    }
  });
}

const TrcnDsblDetailContentTab1 = forwardRef(({ trcnDsbl, otherCached, onChangeStatus }, ref) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const user = useUser();
  const queryClient = useQueryClient();
  const openAlert = useAlert();
  // const openAlertSnackbar = useAlertSnackbar();
  const openConfirm = useConfirm();
  const openError = useError();
  const isSmUp = useSmUp();

  const [busTrcnErrTypCds, fetchBusTrcnErrTypCds] = useAsyncCmmCode(
    'BUS_TRCN_ERR_TYP_CD' + (trcnDsbl.trcnDvsCd ? '-' + trcnDsbl.trcnDvsCd : ''),
    {
      trcnDvsCd: trcnDsbl.trcnDvsCd,
    },
    trcnDsbl.busTrcnErrTypCd
      ? [{ code: trcnDsbl.busTrcnErrTypCd, name: trcnDsbl.busTrcnErrTypNm }]
      : []
  );
  const busTrcnErrTypCdLoadingable = state.busTrcnErrTypCdOpen && busTrcnErrTypCds.length <= 1;
  const [emps, fetchEmps] = useAsyncCmmCode(
    'EMP-' + (trcnDsbl.dprtId ? trcnDsbl.dprtId : user.dprtId),
    {
      dprtId: trcnDsbl.dprtId ? trcnDsbl.dprtId : user.dprtId,
    },
    trcnDsbl.dprtId ? [{ code: trcnDsbl.dsblPrcgPicId, name: trcnDsbl.dsblPrcgPicNm }] : []
  );
  const empLoadingable = state.empOpen && emps.length <= 1;

  const closeAssignmentHistory = useCallback(() => {
    dispatch({
      type: 'ASSIGNMENT_HISTORY_CLOSE',
    });
  }, []);

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

  const { mutate, reset } = useMutation(acceptTrcnDsbl, {
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
    // onSettled: (data, error) => {
    //   onChangeStatus('idle');
    // },
  });

  return (
    <React.Fragment>
      <Formik
        innerRef={ref}
        enableReinitialize={true}
        initialValues={{
          drvrDrcsDsblYn: trcnDsbl.drvrDrcsDsblYn === 'Y',
          rideTrcnDsblYn: trcnDsbl.rideTrcnDsblYn === 'Y',
          alghTrcnDsblYn: trcnDsbl.alghTrcnDsblYn === 'Y',
          gpsDsblYn: trcnDsbl.gpsDsblYn === 'Y',
          recpIssuDsblYn: trcnDsbl.recpIssuDsblYn === 'Y',
          etcDsblYn: trcnDsbl.etcDsblYn === 'Y',
          busTrcnErrTypCd: otherCached
            ? null
            : busTrcnErrTypCds.find((cmdCode) => cmdCode.code === trcnDsbl.busTrcnErrTypCd) ?? null,
          dsblPrcgPicId: otherCached
            ? null
            : emps.find((cmdCode) => cmdCode.code === trcnDsbl.dsblPrcgPicId) ?? null,
          dsblPt: trcnDsbl.dsblPt ?? '',
          dsblAcptAnswCtt: trcnDsbl.dsblAcptAnswCtt ?? '',
        }}
        validationSchema={yup.object({
          busTrcnErrTypCd: yup.object().nullable().required('오류유형을 선택해주세요.'),
          dsblPrcgPicId: yup.object().nullable().required('배정사원을 선택해주세요.'),
          dsblAcptAnswCtt: yup.string().required('답변내용을 입력해주세요.'),
        })}
        onSubmit={(values) => {
          (async () => {
            const confirmed = await openConfirm('단말기 장애', '접수/배정하시겠습니다?');
            if (confirmed) {
              mutate({
                stlmAreaCd: trcnDsbl.stlmAreaCd,
                dsblAcptNo: trcnDsbl.dsblAcptNo,
                drvrDrcsDsblYn: values.drvrDrcsDsblYn ? 'Y' : 'N',
                rideTrcnDsblYn: values.rideTrcnDsblYn ? 'Y' : 'N',
                alghTrcnDsblYn: values.alghTrcnDsblYn ? 'Y' : 'N',
                gpsDsblYn: values.gpsDsblYn ? 'Y' : 'N',
                recpIssuDsblYn: values.recpIssuDsblYn ? 'Y' : 'N',
                etcDsblYn: values.etcDsblYn ? 'Y' : 'N',
                busTrcnErrTypCd: values.busTrcnErrTypCd.code,
                dsblPrcgPicId: values.dsblPrcgPicId.code,
                dsblAcptAnswCtt: values.dsblAcptAnswCtt,
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
                {/* <TableHead>
                  <TableRow>
                    <TableCell colSpan="2" sx={{ py: 1 }}>
                      <Stack direction="row" spacing={0.5}>
                        <Chip
                          label={trcnDsbl.stlmAreaNm}
                          color="secondary"
                          sx={{
                            'height': 20,
                            'fontSize': 12,
                            '& .MuiChip-label': { px: 1 },
                          }}
                        ></Chip>
                        <Tooltip title={trcnDsbl.dprtNm}>
                          <Chip
                            label={trcnDsbl.dprtNm?.substring(0, 2)}
                            color="secondary"
                            sx={{
                              'height': 20,
                              'fontSize': 12,
                              '& .MuiChip-label': { px: 1 },
                            }}
                          ></Chip>
                        </Tooltip>
                        <Chip
                          label={trcnDsbl.dsblAcptDvsNm}
                          color="secondary"
                          sx={{
                            'height': 20,
                            'fontSize': 12,
                            '& .MuiChip-label': { px: 1 },
                          }}
                        ></Chip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                </TableHead> */}
                <TableBody>
                  <TableRow>
                    <LabelTableCell>접수번호</LabelTableCell>
                    <TableCell>{trcnDsbl.dsblAcptNo}</TableCell>
                  </TableRow>
                  <TableRow>
                    <LabelTableCell>접수일시</LabelTableCell>
                    <TableCell>
                      {dayjs(trcnDsbl.dsblAcptDtm, 'YYYYMMDDHHmmss').format('YYYY.MM.DD HH:mm:ss')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <LabelTableCell>교통사업자</LabelTableCell>
                    <TableCell>{trcnDsbl.tropNm}</TableCell>
                  </TableRow>
                  <TableRow>
                    <LabelTableCell>노선</LabelTableCell>
                    <TableCell>{trcnDsbl.rotNm}</TableCell>
                  </TableRow>
                  <TableRow>
                    <LabelTableCell>차량번호</LabelTableCell>
                    <TableCell>{trcnDsbl.vhclNo}</TableCell>
                  </TableRow>
                  <TableRow>
                    <LabelTableCell>장애장비</LabelTableCell>
                    <TableCell>
                      <FormGroup row={true}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              sx={{ py: 0, pr: 0.5 }}
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
                              sx={{ py: 0, pr: 0.5 }}
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
                              sx={{ py: 0, pr: 0.5 }}
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
                              sx={{ py: 0, pr: 0.5 }}
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
                              sx={{ py: 0, pr: 0.5 }}
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
                              sx={{ py: 0, pr: 0.5 }}
                              size="small"
                              id="recpIssuDsblYn"
                              checked={formik.values.recpIssuDsblYn}
                              onChange={formik.handleChange}
                            />
                          }
                          label="영수증프린터"
                        />
                      </FormGroup>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <LabelTableCell>오류유형*</LabelTableCell>
                    <TableCell>
                      <Autocomplete
                        disablePortal
                        size="small"
                        selectOnFocus={false}
                        open={state.busTrcnErrTypCdOpen}
                        onOpen={() => {
                          dispatch({ type: 'BUS_TRCN_ERR_TYP_CD_OPEN' });
                        }}
                        onClose={() => {
                          dispatch({ type: 'BUS_TRCN_ERR_TYP_CD_CLOSE' });
                        }}
                        loading={busTrcnErrTypCdLoadingable}
                        isOptionEqualToValue={(option, value) => option.code === value.code}
                        getOptionLabel={(option) => option.name}
                        options={busTrcnErrTypCds}
                        id="busTrcnErrTypCd"
                        value={formik.values.busTrcnErrTypCd}
                        onChange={(event, newValue) => {
                          formik.setFieldTouched('busTrcnErrTypCd');
                          formik.setFieldValue('busTrcnErrTypCd', newValue);
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
                            // label="오류유형"
                            // onBlur={formik.handleBlur}
                            error={
                              formik.touched.busTrcnErrTypCd &&
                              Boolean(formik.errors.busTrcnErrTypCd)
                            }
                            helperText={
                              formik.touched.busTrcnErrTypCd && formik.errors.busTrcnErrTypCd
                            }
                          />
                        )}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <LabelTableCell>배정사원*</LabelTableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Autocomplete
                          disablePortal
                          size="small"
                          selectOnFocus={false}
                          open={state.empOpen}
                          onOpen={() => {
                            dispatch({ type: 'EMP_OPEN' });
                          }}
                          onClose={() => {
                            dispatch({ type: 'EMP_CLOSE' });
                          }}
                          loading={empLoadingable}
                          isOptionEqualToValue={(option, value) => option.code === value.code}
                          getOptionLabel={(option) => option.name}
                          options={emps}
                          id="dsblPrcgPicId"
                          value={formik.values.dsblPrcgPicId}
                          onChange={(event, newValue) => {
                            formik.setFieldTouched('dsblPrcgPicId');
                            formik.setFieldValue('dsblPrcgPicId', newValue);
                          }}
                          sx={{
                            flexGrow: 1,
                            maxWidth: 226,
                            // 'flexBasis': 'auto',
                            // '& .MuiAutocomplete-input': {
                            //   fontSize: (theme) => theme.typography.fontSize,
                            // },
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
                                    {empLoadingable ? (
                                      <CircularProgress color="inherit" size={20} />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </React.Fragment>
                                ),
                              }}
                              required
                              error={
                                formik.touched.dsblPrcgPicId && Boolean(formik.errors.dsblPrcgPicId)
                              }
                              helperText={
                                formik.touched.dsblPrcgPicId && formik.errors.dsblPrcgPicId
                              }
                            />
                          )}
                        />
                        <Button
                          variant="outlined"
                          color="warning"
                          size="small"
                          startIcon={<HistoryOutlinedIcon />}
                          sx={{ ml: 1, whiteSpace: 'nowrap' }}
                          onClick={() => dispatch({ type: 'ASSIGNMENT_HISTORY_OPEN' })}
                        >
                          이력
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <LabelTableCell>신고자</LabelTableCell>
                    <TableCell>{trcnDsbl.dsblAcptReqrName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>
                      <TextField
                        label="문의내용"
                        multiline
                        size="small"
                        rows={4}
                        fullWidth
                        InputProps={{ readOnly: true }}
                        // sx={{ '& .MuiOutlinedInput-root': { typography: 'body1' } }}
                        sx={{ color: 'text.secondary' }}
                        id="dsblPt"
                        value={formik.values.dsblPt}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ '& td, & th': { border: 0 } }}>
                    <TableCell colSpan={2}>
                      <TextField
                        label="답변내용"
                        multiline
                        size="small"
                        rows={4}
                        fullWidth
                        required
                        // sx={{ '& .MuiOutlinedInput-root': { typography: 'body2' } }}
                        id="dsblAcptAnswCtt"
                        value={formik.values.dsblAcptAnswCtt}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.dsblAcptAnswCtt && Boolean(formik.errors.dsblAcptAnswCtt)
                        }
                        helperText={formik.touched.dsblAcptAnswCtt && formik.errors.dsblAcptAnswCtt}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Formik>
      <TrcnDsblAssignmentHst
        open={state.assignmentHistory}
        onClose={closeAssignmentHistory}
        stlmAreaCd={trcnDsbl.stlmAreaCd}
        dsblAcptNo={trcnDsbl.dsblAcptNo}
      />
    </React.Fragment>
  );
});

export default TrcnDsblDetailContentTab1;
