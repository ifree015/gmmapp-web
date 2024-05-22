import Chip from '@mui/material/Chip';

export default function ColorChip({ color = 'secondary', label, ...others }) {
  return (
    <Chip
      label={label}
      color={color}
      sx={{
        'height': 20,
        'fontSize': 'caption.fontSize',
        '& .MuiChip-label': { px: 1 },
        ...others.sx,
      }}
    ></Chip>
  );
}
