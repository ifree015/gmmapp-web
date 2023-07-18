import { useSelector } from 'react-redux';
import { selectCmnCodeName } from '@features/common/cmnCodeSlice';

const useCmnCodeName = (cmnCdId, code) =>
  useSelector((state) => selectCmnCodeName(state, cmnCdId, code));

export default useCmnCodeName;
