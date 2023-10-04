import React from 'react';
import Container from '@mui/material/Container';
import SettingTheme from './SettingTheme';
import SettingPush from './SettingPush';
import SettingAppInfo from './SettingAppInfo';

export default function AppSettingContent() {
  return (
    <Container>
      <SettingTheme />
      <SettingPush />
      <SettingAppInfo />
    </Container>
  );
}
