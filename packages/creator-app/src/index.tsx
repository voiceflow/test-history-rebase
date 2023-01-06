// uncomment anytime we wanna debug why component is rerendering
// should be used with `wdyr` hock
// import './src/wdyr';
import './index.css';
import './polyfills';

import { createBrowserHistory } from 'history';
import React from 'react';
import { createRoot } from 'react-dom/client';

import client from '@/client';
import * as Sentry from '@/vendors/sentry';

import App from './App';
import createStore from './store';

Sentry.init();

const history = createBrowserHistory();

client.api.analytics.setBatching(true);

window.addEventListener('beforeunload', () => {
  client.api.analytics.setBatching(false);
  client.api.analytics.flush();
});

const logux = client.realtime();
const { store, persistor } = createStore(logux, history);

const root = createRoot(document.getElementById('root')!);

root.render(<App history={history} store={store} persistor={persistor} logux={logux} />);
