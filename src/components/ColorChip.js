import Chip from '@mui/material/Chip';

export default function ColorChip({ color = 'secondary', label, ...props }) {
  return (
    <Chip
      label={label}
      color={color}
      sx={{
        'height': 20,
        'fontSize': 'caption.fontSize',
        '& .MuiChip-label': { px: 1 },
        ...props.sx,
      }}
    ></Chip>
  );
}
