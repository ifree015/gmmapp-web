import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useMutation } from '@common/queries/query';
import { logout } from '@features/user/userSlice';
import { processLogout } from '@features/login/loginAPI';
import useError from '@common/hooks/useError';
import { setLocalItem, setSessionItem } from '@common/utils/storage';
import LoadingSpinner from '@components/LoadingSpinner';
import nativeApp from '@common/utils/nativeApp';

const MenuLogout = () => {
  const dispatch = useDispatch();
  const openError = useError();
  const navigate = useNavigate();

  const { mutate, isLoading, reset } = useMutation(processLogout, {
    onError: (err) => {
      openError(err, reset);
    },
    onSuccess: ({ data }) => {
      dispatch(logout(data));
      setLocalItem('remember', false);
      setSessionItem('userInfo', null);
      if (nativeApp.isIOS()) {
        nativeApp.loggedOut();
      } else {
        navigate('/login');
      }
    },
  });

  return (
    <React.Fragment>
      <LoadingSpinner open={isLoading} />
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
        startIcon={<LogoutOutlinedIcon />}
        onClick={() => mutate()}
      >
        로그아웃
      </Button>
    </React.Fragment>
  );
};

export default React.memo(MenuLogout);
