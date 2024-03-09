import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';

const ShadowCard = styled((props) => {
  return <Card {...props} elevation={0} />;
})(({ theme }) => ({
  boxShadow:
    theme.palette.mode === 'light'
      ? 'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px'
      : 'rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 12px 24px -4px',
}));

export default ShadowCard;
