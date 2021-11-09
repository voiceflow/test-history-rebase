import * as Realtime from '@voiceflow/realtime-sdk';

import createCRUDReducer from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

export * from './actions';
export * from './constants';
export * from './selectors';
export * from './sideEffects';

const productReducer = createCRUDReducer<Realtime.Product>(STATE_KEY);

export default productReducer;
