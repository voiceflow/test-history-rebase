import './index.css';
import './polyfills';

import { createBrowserHistory } from 'history';
import React from 'react';
import ReactDOM from 'react-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { setConfig } from 'react-hot-loader';

import client from '@/client';
import * as Sentry from '@/vendors/sentry';

import App from './App';
import createStore from './store';

setConfig({ reloadHooks: false });

Sentry.init();

const history = createBrowserHistory();
const logux = client.realtime();
const { store, persistor } = createStore(logux, history);

// Render ReactDOM
ReactDOM.render(<App history={history} store={store} persistor={persistor} logux={logux} />, document.getElementById('root'));
