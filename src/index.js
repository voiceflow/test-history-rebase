import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import Root from './store/store';

// Render ReactDOM
ReactDOM.render(
  <Root>
    <App />
  </Root>,
  document.getElementById('root')
);
