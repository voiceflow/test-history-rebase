import * as Realtime from '@voiceflow/realtime-sdk';

import createCRUDReducer from '../utils/crud';
import { STATE_KEY } from './constants';

export * from './actions';
export * from './constants';
export * from './platform';
export * from './selectors';
export * from './sideEffects';

const projectReducer = createCRUDReducer<Realtime.AnyProject>(STATE_KEY);

export default projectReducer;
