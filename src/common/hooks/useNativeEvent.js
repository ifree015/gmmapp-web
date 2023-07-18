import { useState, useEffect } from 'react';
import nativeApp from '@common/utils/nativeApp';

export default function useNativeEvent(eventHandler) {
  const [_nativeApp] = useState(nativeApp);

  useEffect(() => {
    if (!eventHandler) return;

    // const handleWebViewEvent = (event) => {
    //   eventHandler(event);
    // };

    window.addEventListener('webview', eventHandler);

    return () => {
      window.removeEventListener('webview', eventHandler);
    };
  }, [eventHandler]);

  return _nativeApp;
}
