import * as CRUD from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

/**
 * @deprecated
 */
export const crud = CRUD.createCRUDActionCreators(STATE_KEY);
