import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension'
import { routerMiddleware } from 'connected-react-router'
import thunk from "redux-thunk";
import { createBrowserHistory } from 'history';
import rootReducer from 'ducks/_root'

export const history = createBrowserHistory()

export const store = createStore(
  rootReducer(history),
  composeWithDevTools(
    applyMiddleware(
      routerMiddleware(history),
        thunk
      ),
    ),
);