import React, { useState, useEffect, useReducer, useCallback, forwardRef } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LabelValueListItem from '@components/LabelValueListItem';
import LabelListItem from '@components/LabelListItem';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import TextField from '@mui/material/TextField';
import Fade from '@mui/material/Fade';
import Chip from '@mui/material/Chip';
import ArrowPopper, { ArrowPopperArrow } from '@components/ArrowPopper';
import { Formik } from 'formik';
import * as yup from 'yup';
import produce from 'immer';
import dayjs from 'dayjs';
// import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@common/queries/query';
import useAsyncCmmCode from '@common/hooks/useAsyncCmmCode';
import { acceptTrcnDsbl, assignTrcnDsbl } from '@features/trcndsbl/trcnDsblAPI';
import useUser from '@common/hooks/useUser';
import useRole from '@common/hooks/useRole';
import useAlert from '@common/hooks/useAlert';
import useAlertSnackbar from '@common/hooks/useAlertSnackbar';
import useConfirm from '@common/hooks/useConfirm';
import useError from '@common/hooks/useError';
import TrcnDsblRgtDialog from './TrcnDsblRgtDialog';
import TrcnDsblAssignmentHst from './TrcnDsblAssignmentHst';
import nativeApp from '@common/utils/nativeApp';

const initialState = {
  trcnDsblRgt: false,
  busTrcnErrTypCd: false,
  emp: false,
  assignmentHistory: false,
};

function reducer(state, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'TRCN_DSBL_RGT':
        draft.trcnDsblRgt = action.payload;
        break;
      case 'BUS_TRCN_ERR_TYP_CD':
        draft.busTrcnErrTypCd = action.payload;
        break;
      case 'EMP':
        draft.emp = action.payload;
        break;
      case 'ASSIGNMENT_HISTORY':
        draft.assignmentHistory = action.payload;
        break;
      default:
        return draft;
    }
  });
}

const TrcnDsblDetailContentTab1 = forwardRef(({ trcnDsbl, onChangeStatus }, ref) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const user = useUser();
  const userRole = useRole();
  // const queryClient = useQueryClient();
  const openAlert = useAlert();
  const openAlertSnackbar = useAlertSnackbar();
  const openConfirm = useConfirm();
  const openError = useError();
  const [anchorEl, setAnchorEl] = useState(null);
  const [arrowRef, setArrowRef] = useState(null);
  // const arrowRef = useRef(null);

  const [busTrcnErrTypCds, fetchBusTrcnErrTypCds] = useAsyncCmmCode(
    'BUS_TRCN_ERR_TYP_CD' + (trcnDsbl.trcnDvsCd ? '-' + trcnDsbl.trcnDvsCd : ''),
    {
      trcnDvsCd: trcnDsbl.trcnDvsCd,
    },
    trcnDsbl.busTrcnErrTypCd
      ? [{ code: trcnDsbl.busTrcnErrTypCd, name: trcnDsbl.busTrcnErrTypNm }]
      : []
  );
  const busTrcnErrTypCdLoadingable = state.busTrcnErrTypCd && busTrcnErrTypCds.length <= 1;
  const [emps, fetchEmps] = useAsyncCmmCode(
    'CENT_EMP',
    { intgAstsBzDvsCd: trcnDsbl.intgAstsBzDvsCd },
    trcnDsbl.dprtId
      ? [
          {
            code: trcnDsbl.dsblPrcgPicId,
            name: trcnDsbl.dsblPrcgPicNm,
            intgAstsBzDvsCd: trcnDsbl.intgAstsBzDvsCd,
            intgAstsBzDvsNm: trcnDsbl.intgAstsBzDvsNm,
            dprtId: trcnDsbl.dprtId,
            dprtNm: trcnDsbl.dprtNm,
          },
        ]
      : []
  );
  const empLoadingable = state.emp && emps.length <= 1;

  const openTrcnDsblRgt = () => {
    if (nativeApp.isIOS()) {
      nativeApp.modalView(
        `/trcndsbl/trcndsbl/trcndsblrgt?stlmAreaCd=${trcnDsbl.stlmAreaCd}&dsblAcptNo=${trcnDsbl.dsblAcptNo}`,
        {
          title: '단말기장애 등록',
          presentationStyle: 'overFull',
        }
      );
    } else {
      dispatch({ type: 'TRCN_DSBL_RGT', payload: true });
    }
  };

  const closeTrcnDsblRgt = useCallback(() => {
    dispatch({
      type: 'TRCN_DSBL_RGT',
      payload: false,
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
      //queryClient.invalidateQueries(['fetchTrcnDsbl']);
      onChangeStatus('idle');
      openAlert(data.message);
      // openAlertSnackbar('info', data.message, true);
    },
  });

  const closeAssignmentHistory = useCallback(() => {
    dispatch({
      type: 'ASSIGNMENT_HISTORY',
      payload: false,
    });
  }, []);

  const {
    mutate: assign,
    isLoading,
    assignReset,
  } = useMutation(assignTrcnDsbl, {
    onError: (err) => {
      openError(err, assignReset);
    },
    onSuccess: (data) => {
      // queryClient.invalidateQueries(['fetchTrcnDsbl']);
      openAlert(data.message);
    },
  });

  const handleAssign = () => {
    if (userRole.isSelector()) {
      openAlertSnackbar('warning', '조회권한자는 배정이 불가능합니다.');
    } else if (trcnDsbl.dltYn === 'Y') {
      openAlertSnackbar('error', '이미 취소된 건입니다!');
    } else if (trcnDsbl.dsblPrcgFnDtm) {
      openAlertSnackbar('warning', '처리된 건은 배정이 불가능합니다.');
    } else if (!ref.current.values.dsblPrcgPicId) {
      openAlertSnackbar('warning', '배정사원을 선택해주세요!');
    } else if (ref.current.values.dsblPrcgPicId.code === trcnDsbl.dsblPrcgPicId) {
      openAlertSnackbar('warning', '배정사원을 변경해주세요!');
    } else {
      if (user.intgAstsBzDvsCd !== trcnDsbl.intgAstsBzDvsCd) {
        openAlertSnackbar('warning', `같은 지역(${trcnDsbl.intgAstsBzDvsNm}) 직원이 아닙니다.`);
      } else if (user.dprtId !== trcnDsbl.dprtId) {
        openAlertSnackbar('warning', '같은 부서가 아닙니다.');
      }
      (async () => {
        const confirmed = await openConfirm('단말기 장애', '배정하시겠습니다?');
        if (confirmed) {
          assign({
            stlmAreaCd: trcnDsbl.stlmAreaCd,
            dsblAcptNo: trcnDsbl.dsblAcptNo,
            dsblPrcgPicId: ref.current.values.dsblPrcgPicId.code,
          });
        }
      })();
    }
  };

  return (
    <React.Fragment>
      <Formik
        innerRef={ref}
        enableReinitialize
        initialValues={{
          drvrDrcsDsblYn: trcnDsbl.drvrDrcsDsblYn === 'Y',
          rideTrcnDsblYn: trcnDsbl.rideTrcnDsblYn === 'Y',
          alghTrcnDsblYn: trcnDsbl.alghTrcnDsblYn === 'Y',
          gpsDsblYn: trcnDsbl.gpsDsblYn === 'Y',
          recpIssuDsblYn: trcnDsbl.recpIssuDsblYn === 'Y',
          etcDsblYn: trcnDsbl.etcDsblYn === 'Y',
          busTrcnErrTypCd:
            busTrcnErrTypCds.find((cmdCode) => cmdCode.code === trcnDsbl.busTrcnErrTypCd) ?? null,
          dsblPrcgPicId: emps.find((cmdCode) => cmdCode.code === trcnDsbl.dsblPrcgPicId) ?? null,
          dsblPt: trcnDsbl.dsblPt ?? '',
          dsblAcptAnswCtt: trcnDsbl.dsblAcptAnswCtt ?? '',
        }}
        validationSchema={yup.object({
          busTrcnErrTypCd: yup.object().nullable().required('접수오류유형을 선택해주세요.'),
          dsblPrcgPicId: yup.object().nullable().required('배정사원을 선택해주세요.'),
          // dsblAcptAnswCtt: yup.string().required('답변내용을 입력해주세요.'),
        })}
        onSubmit={(values) => {
          (async () => {
            if (user.intgAstsBzDvsCd !== trcnDsbl.intgAstsBzDvsCd) {
              openAlertSnackbar(
                'warning',
                `같은 지역(${trcnDsbl.intgAstsBzDvsNm}) 직원이 아닙니다.`
              );
            } else if (user.dprtId !== trcnDsbl.dprtId) {
              openAlertSnackbar('warning', '같은 부서가 아닙니다.');
            }
            const confirmed = await openConfirm('단말기 장애', '접수하시겠습니다?');
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
                dsblPt: values.dsblPt,
                dsblAcptAnswCtt: values.dsblAcptAnswCtt,
              });
            }
          })();
        }}
      >
        {/* {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => ( */}
        {(formik) => (
          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <List aria-label="접수/배정 정보">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <AssignmentOutlinedIcon color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="접수 정보"
                    primaryTypographyProps={{ variant: 'subtitle2' }}
                  />
                </ListItemButton>
              </ListItem>
              <LabelValueListItem
                label="접수번호"
                value={trcnDsbl.dsblAcptNo}
                secondaryAction={
                  <IconButton color="secondary" edge="end" onClick={openTrcnDsblRgt}>
                    <AddCardOutlinedIcon />
                  </IconButton>
                }
                ref={setAnchorEl}
              />
              <ArrowPopper
                id="dsblAcptNo-popper"
                open={anchorEl != null && trcnDsbl.dltYn === 'Y'}
                anchorEl={anchorEl}
                color="warning"
                placement="top"
                transition
                modifiers={[
                  {
                    name: 'arrow',
                    enabled: true,
                    options: {
                      element: arrowRef,
                    },
                  },
                ]}
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={350}>
                    <Box>
                      <ArrowPopperArrow ref={setArrowRef} />
                      <Chip
                        label="삭제됨"
                        color="warning"
                        size="small"
                        sx={{
                          position: 'absolute',
                          bottom: 0, // top: -1
                          left: '50%',
                          transform: 'translateX(-50%)',
                        }}
                      />
                    </Box>
                  </Fade>
                )}
              </ArrowPopper>
              <LabelValueListItem
                label="접수일시"
                value={dayjs(trcnDsbl.dsblAcptDtm, 'YYYYMMDDHHmmss').format('YYYY.MM.DD HH:mm:ss')}
              />
              <LabelListItem label="신고자">
                <Stack>
                  <Typography component="span" variant="body2" color="text.primary">
                    {trcnDsbl.dsblAcptReqrName}
                  </Typography>
                  {trcnDsbl.dsblAcptReqrMbphNo ? (
                    <Link
                      href={`tel:${trcnDsbl.dsblAcptReqrMbphNo}`}
                      sx={{ fontSize: 'body2.fontSize' }}
                    >
                      {trcnDsbl.dsblAcptReqrMbphNo}
                    </Link>
                  ) : null}
                </Stack>
              </LabelListItem>
              <LabelValueListItem label="접수자" value={trcnDsbl.dsblAcprName} />
              <LabelValueListItem
                label="교통사업자"
                value={`${trcnDsbl.tropNm}\n${trcnDsbl.bsfcNm}`}
                preLine
              />
              <LabelValueListItem label="노선" value={trcnDsbl.rotNm ?? ''} />
              <LabelValueListItem
                label="차량번호"
                value={`${trcnDsbl.vhclNo}\n${trcnDsbl.trcnDvsNm}`}
                preLine
              />
              <ListItem>
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
              </ListItem>
              <Divider component="li" />
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <AssignmentIndOutlinedIcon color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="배정 정보"
                    primaryTypographyProps={{ variant: 'subtitle2' }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem>
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
                    formik.setFieldTouched('busTrcnErrTypCd');
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
              </ListItem>
              <ListItem sx={{ flexDirection: 'column' }}>
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{ justifyContent: 'flex-end', width: '100%' }}
                >
                  <Button
                    variant="outlined"
                    color="warning"
                    size="small"
                    startIcon={<HistoryOutlinedIcon />}
                    onClick={() => dispatch({ type: 'ASSIGNMENT_HISTORY', payload: true })}
                  >
                    이력
                  </Button>
                  <LoadingButton
                    variant="outlined"
                    color="secondary"
                    size="small"
                    loading={isLoading}
                    startIcon={<AssignmentIndOutlinedIcon />}
                    onClick={handleAssign}
                  >
                    배정
                  </LoadingButton>
                </Stack>
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
                    formik.setFieldTouched('dsblPrcgPicId');
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
              </ListItem>
              <ListItem>
                <TextField
                  label="문의내용"
                  multiline
                  size="small"
                  rows={5}
                  fullWidth
                  id="dsblPt"
                  value={formik.values.dsblPt}
                  onChange={formik.handleChange}
                />
              </ListItem>
              <ListItem>
                <TextField
                  label="답변내용"
                  multiline
                  size="small"
                  rows={5}
                  fullWidth
                  id="dsblAcptAnswCtt"
                  value={formik.values.dsblAcptAnswCtt}
                  onChange={formik.handleChange}
                  error={formik.touched.dsblAcptAnswCtt && Boolean(formik.errors.dsblAcptAnswCtt)}
                  helperText={formik.touched.dsblAcptAnswCtt && formik.errors.dsblAcptAnswCtt}
                />
              </ListItem>
            </List>
            {/* <TableContainer>
              <Table>
                <colgroup>
                  <col style={{ width: isSmUp ? 112 : 104 }} />
                  <col />
                </colgroup>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan="2" sx={{ py: 1 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <LabelTableCell>접수번호</LabelTableCell>
                    <TableCell>{trcnDsbl.dsblAcptNo}</TableCell>
                  </TableRow>
                  <TableRow sx={{ '& td, & th': { border: 0 } }}></TableRow>
                </TableBody>
              </Table>
            </TableContainer> */}
          </Box>
        )}
      </Formik>
      <TrcnDsblAssignmentHst
        open={state.assignmentHistory}
        onClose={closeAssignmentHistory}
        stlmAreaCd={trcnDsbl.stlmAreaCd}
        dsblAcptNo={trcnDsbl.dsblAcptNo}
      />
      <TrcnDsblRgtDialog open={state.trcnDsblRgt} onClose={closeTrcnDsblRgt} trcnDsbl={trcnDsbl} />
    </React.Fragment>
  );
});

export default TrcnDsblDetailContentTab1;
