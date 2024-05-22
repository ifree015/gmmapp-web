import React, { useReducer, useEffect, useCallback, useRef, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Divider from '@mui/material/Divider';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import produce from 'immer';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { useQuery } from '@common/queries/query';
import ErrorDialog from '@components/ErrorDialog';
import { ErrorBoundary } from 'react-error-boundary';
import { fetchCpTrcnDsbl } from '@features/trcndsbl/trcnDsblAPI';
import PartLoadingSpinner from '@components/PartLoadingSpinner';
import nativeApp from '@common/utils/nativeApp';
import TrcnDsblRgtStep1 from './TrcnDsblRgtStep1';
import TrcnDsblRgtStep2 from './TrcnDsblRgtStep2';

const steps = ['접수 정보', '처리 정보'];

// function getStepContent(step, trcnDsbl, setTrcnDsbl, ref) {
//   switch (step) {
//     case 0:
//       return <TrcnDsblRgtStep1 trcnDsbl={trcnDsbl} setTrcnDsbl={setTrcnDsbl} ref={ref} />;
//     case 1:
//       return <TrcnDsblRgtStep2 trcnDsbl={trcnDsbl} setTrcnDsbl={setTrcnDsbl} ref={ref} />;
//     default:
//       throw new Error('Unknown step');
//   }
// }

const initialState = {
  activeStep: 0,
  trcnDsbl: {},
  registerStatus: 'idle',
};

function reducer(state, action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'ACTIVE_STEP':
        draft.activeStep = action.payload;
        break;
      case 'TRCN_DSBL':
        draft.trcnDsbl = { ...draft.trcnDsbl, ...action.payload };
        break;
      case 'REGISTER':
        draft.registerStatus = action.payload;
        break;
      default:
        return draft;
    }
  });
}

export default function TrcnDsblRgtContent({ open = true, onClose }) {
  const { reset } = useQueryErrorResetBoundary();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { stlmAreaCd, dsblAcptNo } = useParams();

  const { isError, error, refetch } = useQuery(
    ['fetchCpTrcnDsbl'],
    () => fetchCpTrcnDsbl({ stlmAreaCd, dsblAcptNo }),
    {
      suspense: false,
      useErrorBoundary: false,
      enabled: false,
      cacheTime: 0,
      onSuccess: ({ data }) => {
        dispatch({
          type: 'TRCN_DSBL',
          payload: { ...data, ...state.trcnDsbl },
        });
      },
    }
  );

  const stepBoxRef = useRef();
  const stepRef = useRef();

  const handleClose = useCallback(() => {
    if (nativeApp.isIOS()) {
      nativeApp.goBack();
    } else {
      onClose();
    }
  }, [onClose]);

  const handleBack = () => {
    dispatch({
      type: 'ACTIVE_STEP',
      payload: state.activeStep - 1,
    });
  };

  const handleNext = useCallback(() => {
    dispatch({
      type: 'ACTIVE_STEP',
      payload: state.activeStep + 1,
    });
  }, [state.activeStep]);

  const handleStep = () => {
    stepRef.current.handleSubmit();
  };

  const modifyTrcnDsbl = useCallback((trcnDsbl) => {
    dispatch({ type: 'TRCN_DSBL', payload: trcnDsbl });
  }, []);

  const changeRegisterStatus = useCallback((registerStatus) => {
    dispatch({ type: 'REGISTER', payload: registerStatus });
  }, []);

  useEffect(() => {
    stepBoxRef.current.scrollTo(0, 0);
  }, [state.activeStep]);

  useEffect(() => {
    if (open && stlmAreaCd) {
      refetch();
    }
  }, [open, stlmAreaCd, refetch]);

  return (
    <React.Fragment>
      <ErrorDialog open={isError} error={error} resetError={['fetchCpTrcnDsbl']} />
      <Paper
        elevation={0}
        sx={{
          maxHeight: '100vh', // height: 100%
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack
          direction="row"
          sx={{ px: 2, pr: 1, py: 0.5 }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: (theme) => theme.typography.fontWeightBold,
            }}
            component="span"
          >
            단말기장애 등록
          </Typography>
          <IconButton aria-label="close" onClick={handleClose}>
            <CloseOutlinedIcon />
          </IconButton>
        </Stack>
        <Divider />
        <Stepper activeStep={state.activeStep} sx={{ p: 2, pb: 1 }}>
          {steps.map((label, index) => {
            return (
              <Step
                key={label}
                sx={{
                  ':first-of-type': { pl: 0 },
                  ':last-of-type': { pr: 0 },
                  // '& .MuiStepLabel-root .Mui-completed': { color: 'secondary.main' },
                  '& .MuiStepLabel-root .Mui-active': { color: 'secondary.main' },
                }}
              >
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <Box sx={{ overflowY: 'auto' /* flex: '1' */ }} ref={stepBoxRef}>
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ error, resetErrorBoundary }) => (
              <ErrorDialog open error={error} resetError={resetErrorBoundary} />
            )}
          >
            <Suspense fallback={<PartLoadingSpinner />}>
              {state.activeStep === 0 ? (
                <TrcnDsblRgtStep1
                  trcnDsbl={state.trcnDsbl}
                  modifyTrcnDsbl={modifyTrcnDsbl}
                  handleNext={handleNext}
                  ref={stepRef}
                />
              ) : (
                <TrcnDsblRgtStep2
                  trcnDsbl={state.trcnDsbl}
                  modifyTrcnDsbl={modifyTrcnDsbl}
                  onChangeStatus={changeRegisterStatus}
                  onClose={handleClose}
                  ref={stepRef}
                />
              )}
            </Suspense>
          </ErrorBoundary>
        </Box>
        <Stack direction="row" sx={{ p: 2, pt: 1 }}>
          {state.activeStep !== 0 && (
            <Button
              startIcon={<ChevronLeftOutlinedIcon />}
              onClick={handleBack}
              variant="text"
              sx={{ pl: 0 }}
            >
              이전
            </Button>
          )}
          <Box sx={{ ml: 'auto' }}>
            {state.activeStep === steps.length - 1 && (
              <LoadingButton
                variant="contained"
                color="secondary"
                loading={state.registerStatus === 'loading'}
                loadingPosition="start"
                startIcon={<SaveOutlinedIcon />}
                onClick={handleStep}
              >
                등록
              </LoadingButton>
            )}
            {state.activeStep !== steps.length - 1 && (
              <Button
                variant="contained"
                endIcon={<ChevronRightOutlinedIcon />}
                onClick={handleStep}
                sx={{ ml: 0.5 }}
              >
                다음
              </Button>
            )}
          </Box>
        </Stack>
      </Paper>
    </React.Fragment>
  );
}
