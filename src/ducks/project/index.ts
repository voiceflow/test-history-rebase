import { Project } from '@/models';

import createCRUDReducer from '../utils/crud';
import { STATE_KEY } from './constants';

export * from './sideEffects';
export * from './selectors';
export * from './actions';
export * from './constants';

const projectReducer = createCRUDReducer<Project>(STATE_KEY);

export default projectReducer;
