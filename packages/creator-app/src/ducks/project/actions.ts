import { createCRUDActionCreators } from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

// action creators

/**
 * @deprecated
 */
export const crud = createCRUDActionCreators(STATE_KEY);
