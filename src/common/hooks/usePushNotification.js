import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useMutation } from '@common/queries/query';
import useAuth from '@common/hooks/useAuth';
import { updateNtfcPtPrcgYn } from '@features/notification/notificationAPI';
import { getSessionItem, setSessionItem, removeSessionItem } from '@common/utils/storage';

const usePushNotification = () => {
  const [searchParams] = useSearchParams();
  const auth = useAuth();

  const { mutate, reset } = useMutation(updateNtfcPtPrcgYn, {
    onError: (err) => {
      reset();
    },
  });

  useEffect(() => {
    return () => {
      //   if (auth && getSessionItem('pushNtfcPt')) {
      removeSessionItem('pushNtfcPt');
      //   }
    };
  }, []);

  const searchPushNtfcPt = searchParams.get('pushNtfcPt');
  if (searchPushNtfcPt && auth && searchPushNtfcPt !== getSessionItem('pushNtfcPt')) {
    setSessionItem('pushNtfcPt', searchPushNtfcPt);
    const pushNtfcPt = searchPushNtfcPt.split('-');
    mutate({ userId: pushNtfcPt[0], ntfcDsptDtm: pushNtfcPt[1], ntfcSno: pushNtfcPt[2] });
    return pushNtfcPt;
  }

  return null;
};

export default usePushNotification;
