import { createCRUDActionCreators } from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

/**
 * @deprecated
 */
export const crud = createCRUDActionCreators(STATE_KEY);
