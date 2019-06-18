import { routerMiddleware } from 'connected-react-router';
import rootReducer from 'ducks/_root';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createBrowserHistory } from 'history';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

export const history = createBrowserHistory();

export const store = createStore(rootReducer(history), composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk)));
