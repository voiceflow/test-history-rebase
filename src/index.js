import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Root from "./store/store";

// import registerServiceWorker from './registerServiceWorker';

// Render ReactDOM
ReactDOM.render(
  <Root>
    <App/>
  </Root>, document.getElementById('root'));
// registerServiceWorker();
