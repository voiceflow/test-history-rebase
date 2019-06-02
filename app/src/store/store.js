import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import rootReducer from 'ducks/_root';
import { composeWithDevTools } from 'redux-devtools-extension';

export const history = createBrowserHistory();

export const store = createStore(
	rootReducer(history),
	composeWithDevTools(
		applyMiddleware(
			routerMiddleware(history),
			thunk
		),
	),
);
