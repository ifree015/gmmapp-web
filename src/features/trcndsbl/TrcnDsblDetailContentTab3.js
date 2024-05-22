import React, { useEffect, useReducer, useCallback } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import PublishedWithChangesOutlinedIcon from '@mui/icons-material/PublishedWithChangesOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import Alert from '@mui/material/Alert';
import produce from 'immer';
import { useQueryClient } from '@tanstack/react-query';
import { useQuery, useMutation } from '@common/queries/query';
import useAlert from '@common/hooks/useAlert';
import useConfirm from '@common/hooks/useConfirm';
import useAlertSnackbar from '@common/hooks/useAlertSnackbar';
import useError from '@common/hooks/useError';
import useUser from '@common/hooks/useUser';
import useRole from '@common/hooks/useRole';
import { fetchChcStpPsbTrcnList } from '@features/trcnmvmn/trcnMvmnAPI';
import { fetchDsblVhclTrcnList, replaceDsblTrcn } from '@features/trcndsbl/trcnDsblAPI';
import TrcnDsblReplacementHst from './TrcnDsblReplacementHst';

const trcnDvsRegexp = /B\d{3,}/gi;

const getInitialState = (length) => ({
  rplcTrcn: { open: false, status: 'idle', index: 0 }, // 교체단말기, 선택 건을 구별하기 위해 상태 값을 가져 감
  dvcTrcns: Array.from({ length: length }, () => []), // 장치단말기
  stpTrcns: new Array(length).fill(null), // 설치단말기
  validErrors: new Array(length).fill(false),
  replace: 'idle',
  replacementHistory: false,
});

function reducer(state, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'DVC_TRCN_OPEN':
        draft.rplcTrcn = { ...draft.rplcTrcn, open: true, index: action.payload };
        draft.validErrors[action.payload] = false;
        break;
      case 'DVC_TRCN_LOADING':
        draft.rplcTrcn = { open: true, status: 'loading', index: action.payload };
        draft.validErrors[action.payload] = false;
        break;
      case 'DVC_TRCN_SET':
        draft.rplcTrcn.status = 'idle';
        draft.dvcTrcns[draft.rplcTrcn.index] = action.payload.trcns;
        draft.stpTrcns[draft.rplcTrcn.index] = action.payload.stpTrcn;
        break;
      case 'DVC_TRCN_CLOSE':
        draft.rplcTrcn.open = false;
        break;
      case 'STP_TRCN':
        draft.stpTrcns[action.payload.index] = action.payload.stpTrcn;
        break;
      case 'VALID_ERROR':
        draft.validErrors[action.payload] = true;
        break;
      case 'REPLACE':
        draft.replace = action.payload;
        break;
      case 'REPLACE_SUCCESS':
        draft.replace = action.payload.status;
        draft.dvcTrcns[action.payload.index] = [];
        draft.stpTrcns[action.payload.index] = null;
        break;
      case 'REPLACEMENT_HISTORY':
        draft.replacementHistory = action.payload;
        break;
      default:
        return draft;
    }
  });
}

export default function TrcnDsblDetailContentTab3({ trcnDsbl }) {
  const [state, dispatch] = useReducer(reducer, getInitialState(6)); // 기본 6대 단말기
  const queryClient = useQueryClient();
  const openAlert = useAlert();
  const openConfirm = useConfirm();
  const openAlertSnackbar = useAlertSnackbar();
  const openError = useError();
  const user = useUser();
  const userRole = useRole();

  const {
    data: { data: vhclTrcnList },
  } = useQuery(['fetchDsblVhclTrcnList', trcnDsbl.stlmAreaCd, trcnDsbl.dsblAcptNo], () =>
    fetchDsblVhclTrcnList({ stlmAreaCd: trcnDsbl.stlmAreaCd, dsblAcptNo: trcnDsbl.dsblAcptNo })
  );

  const { refetch: fetchTrcns } = useQuery(
    ['fetchChcStpPsbTrcnList'],
    () =>
      fetchChcStpPsbTrcnList({
        eqpmDvsCd: vhclTrcnList[state.rplcTrcn.index].eqpmDvsCd,
        prsLocId: user.locId,
        tropId: trcnDsbl.tropId,
        vhclId: trcnDsbl.vhclId,
        trcnNo: vhclTrcnList[state.rplcTrcn.index].trcnNo,
      }),
    {
      suspense: false,
      enabled: false,
      onSuccess: ({ data }) => {
        const chcTrcn = data.find((trcn) => trcn.chcYn === 'Y');
        dispatch({
          type: 'DVC_TRCN_SET',
          payload: { trcns: data, stpTrcn: chcTrcn ?? null },
        });
      },
    }
  );
  const trcnLoadingable =
    state.rplcTrcn.open &&
    state.rplcTrcn.status === 'loading' &&
    state.dvcTrcns[state.rplcTrcn.index].length === 0;

  useEffect(() => {
    if (trcnLoadingable) {
      fetchTrcns();
    }
  }, [trcnLoadingable, fetchTrcns]);

  const { mutate, reset } = useMutation(replaceDsblTrcn, {
    onMutate: () => {
      dispatch({ type: 'REPLACE', payload: 'loading' });
    },
    onError: (err) => {
      dispatch({ type: 'REPLACE', payload: 'idle' });
      openError(err, reset);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['fetchDsblVhclTrcnList']);
      dispatch({ type: 'REPLACE_SUCCESS', payload: { status: 'idle', index: variables.index } });
      openAlert(data.message);
      // openAlertSnackbar('info', data.message, true);
    },
  });

  const handleReplace = (index) => {
    if (userRole.isSelector()) {
      openAlertSnackbar('warning', '조회권한자는 교체가 불가능합니다.');
    } else if (trcnDsbl.dltYn === 'Y') {
      openAlertSnackbar('error', '이미 취소된 건입니다!');
    } else if (!trcnDsbl.dsblPrcgPicId) {
      openAlertSnackbar('warning', '미배정 건은 교체가 불가능합니다. 먼저 배정 해주세요.');
    } else if (!state.stpTrcns[index]?.trcnId) {
      dispatch({ type: 'VALID_ERROR', payload: index });
    } else if (state.stpTrcns[index].stlmAreaCd !== trcnDsbl.stlmAreaCd) {
      openAlertSnackbar('warning', '차량과 설치 단말기의 정산지역이 다르면 교체가 불가능합니다.');
    } else {
      if (user.dprtId !== trcnDsbl.dprtId) {
        openAlertSnackbar('warning', '같은 부서가 아닙니다.');
      }
      (async () => {
        const confirmed = await openConfirm('단말기 교체', '교체하시겠습니다?');
        if (confirmed) {
          mutate({
            stlmAreaCd: trcnDsbl.stlmAreaCd,
            dsblAcptNo: trcnDsbl.dsblAcptNo,
            dsblTrcnId: vhclTrcnList[index].trcnId,
            stpTrcnId: state.stpTrcns[index].trcnId,
            index: index,
          });
        }
      })();
    }
  };

  const closeReplacementHistory = useCallback(() => {
    dispatch({
      type: 'REPLACEMENT_HISTORY',
      payload: false,
    });
  }, []);

  return (
    <React.Fragment>
      <Box component="form" noValidate>
        <List aria-label="단말기 정보">
          {vhclTrcnList.map((vhclTrcn, index) => (
            <React.Fragment key={vhclTrcn.trcnId}>
              <ListItem sx={{ flexWrap: 'wrap' }}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: ['11', '50', '80'].includes(vhclTrcn.dvcDvsCd) // 버스메인단말기, 운전자조작기, 표출단말기
                        ? 'success.light'
                        : 'warning.light',
                    }}
                  >
                    {vhclTrcn.dvcDvsNm?.substr(0, 1)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{ flexGrow: 1 }}
                  primaryTypographyProps={{
                    fontWeight: (theme) => theme.typography.fontWeightBold,
                    color: 'info.main',
                  }}
                  primary={`${vhclTrcn.dvcDvsNm} ${vhclTrcn.trcnDvsNm}`}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="subtitle2"
                        sx={{
                          fontWeight: (theme) => theme.typography.fontWeightBold,
                          pr: 1,
                        }}
                      >
                        {vhclTrcn.trcnId}
                      </Typography>
                      {vhclTrcn.eqpmDvsNm}
                    </React.Fragment>
                  }
                />
                <Stack direction="row" sx={{ width: '100%', mt: 1 }}>
                  <Autocomplete
                    disablePortal
                    size="small"
                    selectOnFocus={false}
                    open={state.rplcTrcn.index === index && state.rplcTrcn.open}
                    onOpen={() => {
                      if (state.dvcTrcns[index].length === 0) {
                        dispatch({
                          type: 'DVC_TRCN_LOADING',
                          payload: index,
                        });
                      } else {
                        dispatch({
                          type: 'DVC_TRCN_OPEN',
                          payload: index,
                        });
                      }
                    }}
                    onClose={() => {
                      dispatch({ type: 'DVC_TRCN_CLOSE' });
                    }}
                    loading={state.rplcTrcn.index === index && trcnLoadingable}
                    isOptionEqualToValue={(option, value) => option.trcnId === value.trcnId}
                    getOptionLabel={(option) =>
                      `${option.trcnId} - ${String(option.trcnDvsNm.match(trcnDvsRegexp)).substring(
                        0,
                        4
                      )}`
                    }
                    options={state.dvcTrcns[index]}
                    id={'trcnId' + (index + 1)}
                    value={state.stpTrcns[index]}
                    onChange={(event, newValue) => {
                      dispatch({
                        type: 'STP_TRCN',
                        payload: { index: index, stpTrcn: newValue },
                      });
                    }}
                    sx={{
                      flexGrow: 1,
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="선택해주세요"
                        variant="standard"
                        // type="number"
                        inputProps={{
                          ...params.inputProps,
                          inputMode: 'numeric',
                          pattern: '[0-9]*',
                        }}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {state.rplcTrcn.index === index && trcnLoadingable ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                        error={state.validErrors[index]}
                        helperText={
                          state.validErrors[index]
                            ? '단말기를 선택해주세요.'
                            : state.stpTrcns[index]?.eqpmDvsNm
                        }
                      />
                    )}
                  />
                  <LoadingButton
                    variant="outlined"
                    color="secondary"
                    size="small"
                    loading={state.rplcTrcn.index === index && state.replace === 'loading'}
                    loadingPosition="start"
                    startIcon={<PublishedWithChangesOutlinedIcon />}
                    sx={{ ml: 1 }}
                    onClick={() => {
                      handleReplace(index);
                    }}
                  >
                    교체
                  </LoadingButton>
                </Stack>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
          {vhclTrcnList.length === 0 ? (
            <ListItem>
              <Alert severity="info" sx={{ flexGrow: 1 }}>
                차량에 설치된 단말기가 없습니다.
              </Alert>
            </ListItem>
          ) : null}
        </List>
        {vhclTrcnList.length > 0 ? (
          <Button
            variant="outlined"
            color="warning"
            size="small"
            startIcon={<HistoryOutlinedIcon />}
            sx={{ ml: 2 }}
            onClick={() => dispatch({ type: 'REPLACEMENT_HISTORY', payload: true })}
          >
            교체 이력
          </Button>
        ) : null}
      </Box>
      <TrcnDsblReplacementHst
        open={state.replacementHistory}
        onClose={closeReplacementHistory}
        stlmAreaCd={trcnDsbl.stlmAreaCd}
        dsblAcptNo={trcnDsbl.dsblAcptNo}
      />
    </React.Fragment>
  );
}
