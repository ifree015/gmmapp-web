import { useState, useEffect } from 'react';
import { getLocalItem, setLocalItem } from '@common/utils/storage';

export default function useLocalStorage(key, initialState) {
  const [state, setState] = useState(() => getLocalItem(key, initialState));

  useEffect(() => {
    setLocalItem(key, state);
  }, [key, state]);

  return [state, setState];
}
