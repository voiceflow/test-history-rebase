import { persistReducer } from 'redux-persist';
import storageLocal from 'redux-persist/lib/storage';

import { STATE_KEY } from './constants';
import viewportReducer from './reducers';

export * from './constants';
export * from './selectors';
export * from './types';

const PERSIST_CONFIG = {
  key: STATE_KEY,
  storage: storageLocal,
};

export default persistReducer(PERSIST_CONFIG, viewportReducer);
