import { createStore, applyMiddleware, compose } from "redux";
import { routerMiddleware } from 'connected-react-router'
import thunk from "redux-thunk";
import { createBrowserHistory } from 'history';
import rootReducer from './../reducers/rootReducer'

export const history = createBrowserHistory()

export const store = createStore(
  rootReducer(history),
  compose(
    applyMiddleware(
      routerMiddleware(history),
        thunk
      ),
    ),
);