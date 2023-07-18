import React, { useMemo } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useLocalStorage from '@common/hooks/useLocalStorage';

export const ThemeModeContext = React.createContext({ mode: '', setThemeMode: null });

export default function ThemeMode({ children }) {
  const [themeMode, setThemeMode] = useLocalStorage('themeMode', 'system');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const contextValue = useMemo(
    () => ({
      themeMode,
      setThemeMode,
    }),
    [themeMode, setThemeMode]
  );

  const mode = themeMode === 'system' ? (prefersDarkMode ? 'dark' : 'light') : themeMode;
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
          background: {
            paper: mode === 'light' ? '#fff' : '#2a2a2a', //gray[900]: #212121
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
