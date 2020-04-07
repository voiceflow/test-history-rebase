import createCRUDReducer from '@/ducks/utils/crud';
import { Intent } from '@/models';

import { STATE_KEY } from './constants';

export * from './constants';
export * from './actions';
export * from './selectors';
export * from './sideEffects';

const intentReducer = createCRUDReducer<Intent>(STATE_KEY);

export default intentReducer;
