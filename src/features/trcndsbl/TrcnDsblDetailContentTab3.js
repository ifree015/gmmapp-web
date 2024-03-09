import React, { useEffect, useReducer, useCallback } from 'react';
import Box from '@mui/material/Box';
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
import { fetchChcStpPsbTrcnList } from '@features/trcnmvmn/trcnMvmnAPI';
import { fetchDsblVhclTrcnList, replaceDsblTrcn } from '@features/trcndsbl/trcnDsblAPI';
import TrcnDsblReplacementHst from './TrcnDsblReplacementHst';

const getInitialState = (length) => ({
  trcnOpen: { open: false, status: 'idle', index: 0 },
  dvcTrcns: Array.from({ length: length }, () => []),
  stpTrcns: new Array(length).fill(null),
  validErrors: new Array(length).fill(false),
  replaceStatus: 'idle',
  replacementHistory: false,
});

function reducer(state, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'REINIT':
        draft = getInitialState(action.payload);
        break;
      case 'DVC_TRCN_OPEN':
        draft.trcnOpen = { ...draft.trcnOpen, open: true, index: action.payload };
        draft.validErrors[action.payload] = false;
        break;
      case 'DVC_TRCN_LOADING':
        draft.trcnOpen = { open: true, status: 'loading', index: action.payload };
        draft.validErrors[action.payload] = false;
        break;
      case 'DVC_TRCN_SET':
        draft.trcnOpen.status = 'idle';
        draft.dvcTrcns[draft.trcnOpen.index] = action.payload.trcns;
        draft.stpTrcns[draft.trcnOpen.index] = action.payload.stpTrcn;
        break;
      case 'DVC_TRCN_CLOSE':
        draft.trcnOpen.open = false;
        break;
      case 'STP_TRCN':
        draft.stpTrcns[action.payload.index] = action.payload.stpTrcn;
        break;
      case 'VALID_ERROR':
        draft.validErrors[action.payload] = true;
        break;
      case 'REPLACE':
        draft.replaceStatus = action.payload;
        break;
      case 'REPLACE_SUCCESS':
        draft.replaceStatus = action.payload.status;
        draft.dvcTrcns[action.payload.index] = [];
        draft.stpTrcns[action.payload.index] = null;
        break;
      case 'REPLACEMENT_HISTORY_OPEN':
        draft.replacementHistory = true;
        break;
      case 'REPLACEMENT_HISTORY_CLOSE':
        draft.replacementHistory = false;
        break;
      default:
        return draft;
    }
  });
}

export default function TrcnDsblDetailContentTab3({ trcnDsbl, stlmAreaCd, dsblAcptNo }) {
  const queryClient = useQueryClient();
  const openAlert = useAlert();
  const openConfirm = useConfirm();
  const openAlertSnackbar = useAlertSnackbar();
  const openError = useError();
  const user = useUser();

  const {
    data: { data: vhclTrcnList },
  } = useQuery(['fetchDsblVhclTrcnList'], () =>
    fetchDsblVhclTrcnList({ stlmAreaCd: stlmAreaCd, dsblAcptNo: dsblAcptNo })
  );
  const [state, dispatch] = useReducer(reducer, getInitialState(6)); // 기본 6대 단말기

  const { refetch: fetchTrcns } = useQuery(
    ['fetchChcStpPsbTrcnList'],
    () =>
      fetchChcStpPsbTrcnList({
        eqpmDvsCd: vhclTrcnList[state.trcnOpen.index].eqpmDvsCd,
        prsLocId: user.locId,
        tropId: trcnDsbl.tropId,
        vhclId: trcnDsbl.vhclId,
        trcnNo: vhclTrcnList[state.trcnOpen.index].trcnNo,
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
    state.trcnOpen.open &&
    state.trcnOpen.status === 'loading' &&
    state.dvcTrcns[state.trcnOpen.index].length === 0;

  useEffect(() => {
    if (trcnLoadingable) {
      fetchTrcns();
    }
  }, [trcnLoadingable, fetchTrcns]);

  useEffect(() => {
    if (vhclTrcnList.length > state.dvcTrcns.length) return;
    dispatch({
      type: 'REINIT',
      payload: vhclTrcnList.length,
    });
  }, [vhclTrcnList, state.dvcTrcns.length]);

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
    if (trcnDsbl.dltYn === 'Y') {
      openAlertSnackbar('error', '이미 취소된 건입니다!');
    } else if (!trcnDsbl.busTrcnErrTypCd || !trcnDsbl.dsblPrcgPicId) {
      openAlertSnackbar(
        'warning',
        '미접수/배정 건은 교체가 불가능합니다. 먼저 접수/배정 해주세요.'
      );
    } else if (user.dprtId !== trcnDsbl.dprtId) {
      openAlertSnackbar('warning', '같은 부서 센터장 또는 사원만 교체가 가능합니다.');
    } else {
      (async () => {
        if (!state.stpTrcns[index]?.trcnId) {
          dispatch({ type: 'VALID_ERROR', payload: index });
          return;
        } else {
          const confirmed = await openConfirm('단말기 교체', '교체하시겠습니다?');
          if (confirmed) {
            mutate({
              stlmAreaCd: stlmAreaCd,
              dsblAcptNo: dsblAcptNo,
              dsblTrcnId: vhclTrcnList[index].trcnId,
              stpTrcnId: state.stpTrcns[index].trcnId,
              index: index,
            });
          }
        }
      })();
    }
  };

  const closeReplacementHistory = useCallback(() => {
    dispatch({
      type: 'REPLACEMENT_HISTORY_CLOSE',
    });
  }, []);

  return (
    <React.Fragment>
      <Box component="form" noValidate>
        <List sx={{ pt: 0 }}>
          {vhclTrcnList.map((vhclTrcn, index) => (
            <React.Fragment key={vhclTrcn.trcnId}>
              <ListItem sx={{ flexWrap: 'wrap' }}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: ['11', '50', '80'].includes(vhclTrcn.dvcDvsCd)
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
                  primary={vhclTrcn.dvcDvsNm}
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
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 1 }}>
                  <Autocomplete
                    disablePortal
                    size="small"
                    selectOnFocus={false}
                    open={state.trcnOpen.index === index && state.trcnOpen.open}
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
                    loading={state.trcnOpen.index === index && trcnLoadingable}
                    isOptionEqualToValue={(option, value) => option.trcnId === value.trcnId}
                    getOptionLabel={(option) => option.trcnId}
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
                        fullWidth
                        error={state.validErrors[index]}
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
                              {state.trcnOpen.index === index && trcnLoadingable ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
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
                    loading={state.trcnOpen.index === index && state.replaceStatus === 'loading'}
                    loadingPosition="start"
                    startIcon={<PublishedWithChangesOutlinedIcon />}
                    sx={{ ml: 1, whiteSpace: 'nowrap' }}
                    onClick={() => {
                      handleReplace(index);
                    }}
                  >
                    교체
                  </LoadingButton>
                </Box>
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
            onClick={() => dispatch({ type: 'REPLACEMENT_HISTORY_OPEN' })}
          >
            교체 이력
          </Button>
        ) : null}
      </Box>
      <TrcnDsblReplacementHst
        open={state.replacementHistory}
        onClose={closeReplacementHistory}
        stlmAreaCd={stlmAreaCd}
        dsblAcptNo={dsblAcptNo}
      />
    </React.Fragment>
  );
}
