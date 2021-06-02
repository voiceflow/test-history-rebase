import { Diagram } from '@/models';

import createCRUDReducer from '../utils/crud';
import { STATE_KEY } from './constants';

export * from './actions';
export * from './constants';
export * from './selectors';
export * from './sideEffects';
export * from './types';

const diagramReducer = createCRUDReducer<Diagram>(STATE_KEY);

export default diagramReducer;
