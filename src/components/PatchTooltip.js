import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

const Span = styled('span')(({ theme }) => {
  return {
    display: 'inline-flex',
  };
});

export default function PatchTooltip({ children, ...others }) {
  return (
    <Tooltip {...others}>
      <Span>{children}</Span>
    </Tooltip>
  );
}
