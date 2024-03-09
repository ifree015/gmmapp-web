import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function Copyright(props) {
  const { sx, ...otherProps } = props;
  const sxProp = { pt: 5, pb: 'calc(env(safe-area-inset-bottom) + 8px)', ...sx };

  return (
    <Typography variant="body2" color="text.secondary" align="center" sx={sxProp} {...otherProps}>
      {'Copyright © '}
      <Link color="inherit" href="https://tmoney.co.kr">
        Tmoney Co., Ltd.
      </Link>
      {` ${new Date().getFullYear()}.`}
    </Typography>
  );
}
