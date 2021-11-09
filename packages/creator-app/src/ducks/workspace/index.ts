import * as Realtime from '@voiceflow/realtime-sdk';

import createCRUDReducer from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

export * from './actions';
export * from './constants';
export * from './rpcs';
export * from './selectors';
export * from './sideEffects';
export * from './types';

// reducers

const workspaceReducer = createCRUDReducer<Realtime.Workspace>(STATE_KEY);

export default workspaceReducer;
