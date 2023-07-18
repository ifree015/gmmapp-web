import React, { useContext } from 'react';
// import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import SettingsBrightnessOutlinedIcon from '@mui/icons-material/SettingsBrightnessOutlined';
import BedtimeOutlinedIcon from '@mui/icons-material/BedtimeOutlined';
import { ThemeModeContext } from '@app/ThemeMode';
import nativeApp from '@common/utils/nativeApp';

const SettingTheme = () => {
  // const theme = useTheme();
  const themeMode = useContext(ThemeModeContext);
  return (
    <React.Fragment>
      <Paper elevation={0} sx={{ mt: 3, p: 2, pt: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{
            color: 'text.secondary',
            fontWeight: (theme) => theme.typography.fontWeightBold,
            mb: 1,
          }}
        >
          Mode
        </Typography>
        <ToggleButtonGroup
          color="warning"
          value={themeMode.themeMode}
          onChange={(event, newValue) => {
            if (!newValue) return;
            themeMode.setThemeMode(newValue);
            nativeApp.setThemeMode(newValue);
          }}
          exclusive
          size="small"
          fullWidth={true}
        >
          <ToggleButton value="light">
            <LightModeOutlinedIcon />
            &nbsp;Light
          </ToggleButton>
          <ToggleButton value="system">
            <SettingsBrightnessOutlinedIcon />
            &nbsp;System
          </ToggleButton>
          <ToggleButton value="dark">
            <BedtimeOutlinedIcon />
            &nbsp;Dark
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>
    </React.Fragment>
  );
};

export default React.memo(SettingTheme);
