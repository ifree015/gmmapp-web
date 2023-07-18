import React from 'react';
import { createRoot } from 'react-dom/client';
import { store } from '@app/store';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from 'react-query/devtools';
import { queryClient } from '@common/queries/queryClient';
import ThemeMode from './app/ThemeMode';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeMode>
          <App />
        </ThemeMode>
      </Provider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
