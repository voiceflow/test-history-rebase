import { Diagram } from '@/models';

import createCRUDReducer from '../utils/crud';
import { STATE_KEY } from './constants';

export * from './sideEffects';
export * from './selectors';
export * from './constants';
export * from './actions';
export * from './types';

const diagramReducer = createCRUDReducer<Diagram>(STATE_KEY);

export default diagramReducer;
