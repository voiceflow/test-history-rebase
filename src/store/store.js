import {createStore, applyMiddleware, compose} from 'redux';
import {routerMiddleware} from 'connected-react-router';
import thunk from 'redux-thunk';
import {createBrowserHistory} from 'history';
import rootReducer from 'ducks/_root';

export const history = createBrowserHistory();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  rootReducer(history),
  composeEnhancers(
    applyMiddleware(
      routerMiddleware(history),
      thunk
    ),
  ),
);
