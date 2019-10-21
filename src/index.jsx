import './index.css';

import { createBrowserHistory } from 'history';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const history = createBrowserHistory();

// Render ReactDOM
ReactDOM.render(<App history={history} />, document.getElementById('root'));
