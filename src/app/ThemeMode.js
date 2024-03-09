import React, { useState, useMemo } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useLocalStorage from '@common/hooks/useLocalStorage';

export const ThemeModeContext = React.createContext({
  themeMode: '',
  setThemeMode: null,
  preferThemeMode: '',
  setPreferThemeMode: null,
});

export default function ThemeMode({ children }) {
  const [themeMode, setThemeMode] = useLocalStorage('themeMode', 'system');
  const [preferThemeMode, setPreferThemeMode] = useState(undefined);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const contextValue = useMemo(
    () => ({
      themeMode,
      setThemeMode,
      preferThemeMode,
      setPreferThemeMode,
    }),
    [themeMode, setThemeMode, preferThemeMode, setPreferThemeMode]
  );

  const mode =
    themeMode === 'system'
      ? preferThemeMode
        ? preferThemeMode
        : prefersDarkMode
        ? 'dark'
        : 'light'
      : themeMode;
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
          background: {
            color: mode === 'light' ? '#f5f5f5' : '#212121', // gray[100]: #f5f5f5 , gray[900]: #212121
            paper: mode === 'light' ? '#fff' : '#2a2a2a',
            paper2: mode === 'light' ? '#fff' : '#121212',
          },
          text: {
            secondary2: mode === 'light' ? '#fff' : 'rgba(255, 255, 255, 0.7)',
          },
          white: {
            main: 'white',
          },
          black: {
            main: 'black',
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
