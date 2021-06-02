import { AnyProject } from '@/models';

import createCRUDReducer from '../utils/crud';
import { STATE_KEY } from './constants';

export * from './actions';
export * from './constants';
export * from './platform';
export * from './selectors';
export * from './sideEffects';

const projectReducer = createCRUDReducer<AnyProject>(STATE_KEY);

export default projectReducer;
