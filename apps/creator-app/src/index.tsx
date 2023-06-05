// uncomment anytime we wanna debug why component is rerendering
// should be used with `wdyr` hock
// import './src/wdyr';
import './polyfills';
import './index.css';

import { createBrowserHistory } from 'history';
import React from 'react';
import { createRoot } from 'react-dom/client';

import client from '@/client';

import App from './App';
import createStore from './store';

const history = createBrowserHistory();

window.addEventListener('beforeunload', () => {
  client.analytics.setBatching(false);
  client.analytics.flush();
});

const logux = client.realtime();
const { store, persistor } = createStore(logux, history);

const root = createRoot(document.getElementById('root')!);

root.render(<App history={history} store={store} persistor={persistor} logux={logux} />);
