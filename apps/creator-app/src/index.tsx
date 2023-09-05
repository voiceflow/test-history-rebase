import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './polyfills';

import React from 'react';
import { createRoot } from 'react-dom/client';

import client from '@/client';

import App from './App';
import { history, logux, persistor, store } from './setupStore';

const root = createRoot(document.getElementById('root')!);

root.render(<App history={history} store={store} persistor={persistor} logux={logux} />);

window.addEventListener('beforeunload', () => {
  client.analytics.setBatching(false);
  client.analytics.flush();
});
