import React from 'react';
import {createStore, applyMiddleware, compose} from 'redux';
import {routerMiddleware} from 'connected-react-router';
import thunk from 'redux-thunk';
import {createBrowserHistory} from 'history';
import rootReducer from 'ducks/_root';
import {Provider} from "react-redux";

export const history = createBrowserHistory();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default ({children, initialState = {}}) => {
  const store = createStore(
    rootReducer(history),
    initialState,
    composeEnhancers(
      applyMiddleware(
        routerMiddleware(history),
        thunk
      ),
    ),
  );
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}
