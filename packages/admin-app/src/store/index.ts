import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import rootReducer, { State } from '@/ducks';

import { createReduxHistory, routerMiddleware } from './reduxHistory';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = (initialState: Partial<State> = {}) => {
  const middlewares = [routerMiddleware, thunk];

  const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...middlewares)));

  const history = createReduxHistory(store);

  return {
    store,
    history,
  };
};

export const { store, history } = configureStore();
