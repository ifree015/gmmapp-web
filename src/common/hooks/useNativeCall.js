import { useState, useEffect } from 'react';
import nativeApp from '@common/utils/nativeApp';

export default function useNativeCall(methodName, data) {
  const [result, setResult] = useState(undefined);

  useEffect(() => {
    if (!nativeApp.isNativeApp()) return;
    if (!nativeApp.isAsync()) {
      setResult(nativeApp[methodName](data));
    } else {
      (async () => {
        setResult(await nativeApp[methodName](data));
      })();
    }
  }, [methodName, data]);

  return result;
}
