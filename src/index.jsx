import './index.css';
import './polyfills';

import { createBrowserHistory } from 'history';
import React from 'react';
import ReactDOM from 'react-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { setConfig } from 'react-hot-loader';

import App from './App';
import createStore from './store';

setConfig({ reloadHooks: false });

const history = createBrowserHistory();
const { store, persistor } = createStore(history);

// Render ReactDOM
ReactDOM.render(<App history={history} store={store} persistor={persistor} />, document.getElementById('root'));
