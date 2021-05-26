import createCRUDReducer from '@/ducks/utils/crud';
import { Workspace } from '@/models';

import { STATE_KEY } from './constants';

export * from './actions';
export * from './constants';
export * from './selectors';
export * from './sideEffects';
export * from './types';

// reducers

const workspaceReducer = createCRUDReducer<Workspace>(STATE_KEY);

export default workspaceReducer;
