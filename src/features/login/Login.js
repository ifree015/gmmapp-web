import React, { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { useMutation } from '@common/queries/query';
import { useFormik } from 'formik';
import * as yup from 'yup';
import useAuth from '@common/hooks/useAuth';
import { getLocalItem, setLocalItem } from '@common/utils/storage';
import LoadingSpinner from '@components/LoadingSpinner';
import useError from '@common/hooks/useError';
// import ErrorDialog from '@components/ErrorDialog';
import Copyright from '@features/common/Copyright';
import { login } from '@features/user/userSlice';
import { fetchLogin, fetchAutoLogin } from './loginAPI';
import nativeApp from '@common/utils/nativeApp';
import useNativeCall from '@common/hooks/useNativeCall';
import { APP_NAME } from '@common/constants/appConstants';

export default function Loign() {
  const auth = useAuth();
  const dispatch = useDispatch();
  const location = useLocation();
  const from = location.state?.from
    ? location.state.from.pathname + location.state.from.search
    : '/';
  const openError = useError();
  const appInfo = useNativeCall('getAppInfo');

  const { mutate, isLoading, reset } = useMutation(fetchLogin, {
    // useErrorBoundary: false,
    onError: (err) => {
      openError(err, reset);
    },
    onSuccess: ({ data }) => {
      // console.log('success:', data);
      setLocalItem('remember', formik.values.remember);
      if (nativeApp.isIOS()) {
        data['remember'] = formik.values.remember;
        nativeApp.loggedIn(data);
      } else {
        dispatch(login(data));
      }
      // navigate(from, { replace: true });
    },
  });

  const validationSchema = yup.object({
    userId: yup.string().required('Id is required'),
    password: yup
      .string()
      .min(8, 'Password should be of minimum 8 characters length')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      userId: '',
      password: '',
      remember: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      mutate({ ...values, ...appInfo, moappNm: APP_NAME });
    },
  });

  const {
    mutate: autoLogin,
    isLoading: isAutoLoading,
    reset: mutateReset,
  } = useMutation(fetchAutoLogin, {
    useErrorBoundary: false,
    onError: (err) => {
      mutateReset();
    },
    onSuccess: ({ data }) => {
      setLocalItem('remember', true);
      if (nativeApp.isIOS()) {
        data['remember'] = formik.values.remember;
        nativeApp.loggedIn(data);
      } else {
        dispatch(login(data));
      }
      // mutateReset();
    },
  });

  useEffect(() => {
    if (!auth && getLocalItem('remember')) {
      if (nativeApp.isNativeApp() && !appInfo) return;
      setLocalItem('remember', false);
      autoLogin({ ...appInfo, moappNm: APP_NAME });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLogin, appInfo]);

  if (auth && !nativeApp.isIOS()) {
    return <Navigate to={from} repalce />;
  }
  if (getLocalItem('remember') || isAutoLoading) {
    return <LoadingSpinner open={getLocalItem('remember') || isAutoLoading} />;
  }

  return (
    <>
      <LoadingSpinner open={isLoading} />
      {/* <ErrorDialog open={isError} error={error} resetError={reset} /> */}
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            //justifyContent: "center",
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ my: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            단말기 현장관리
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="userId"
              label="Id"
              autoComplete="on"
              autoFocus
              value={formik.values.userId}
              onChange={formik.handleChange}
              error={formik.touched.userId && Boolean(formik.errors.userId)}
              helperText={formik.touched.userId && formik.errors.userId}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              // {...formik.getFieldProps('password')}
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <FormControlLabel
              control={
                <Checkbox
                  id="remember"
                  color="primary"
                  checked={formik.values.remember}
                  onChange={formik.handleChange}
                />
              }
              label="자동 로그인"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ mt: 3, mb: 2 }}
            >
              로그인
            </Button>
          </Box>
          <Copyright />
        </Box>
      </Container>
    </>
  );
}
