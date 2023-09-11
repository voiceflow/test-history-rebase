import { createBrowserHistory } from 'history';

import client from '@/client';

import createStore from './store';

export const logux = client.realtime();
export const history = createBrowserHistory();
export const { store, persistor } = createStore(logux, history);
