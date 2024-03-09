import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';

const StickyStack = styled(Stack)(({ theme }) => ({
  margin: theme.spacing(0, -2, 0, -2),
  padding: theme.spacing(1, 2),
  position: 'sticky',
  top: 48,
  [theme.breakpoints.up('sm')]: {
    margin: theme.spacing(0, -3, 0, -3),
    padding: theme.spacing(1, 3),
    top: 48,
  },
  zIndex: theme.zIndex.appBar + 1,
}));

export default StickyStack;
