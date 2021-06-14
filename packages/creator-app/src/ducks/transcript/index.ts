import { Transcript } from '@/models';

import createCRUDReducer from '../utils/crud';
import { STATE_KEY } from './constants';

export * from './actions';
export * from './constants';
export * from './selectors';
export * from './sideEffects';

const transcriptReducer = createCRUDReducer<Transcript>(STATE_KEY);

export default transcriptReducer;
