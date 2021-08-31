import { createCRUDActionCreators } from '@/ducks/utils/crud';

import { STATE_KEY } from './constants';

export const crudActions = createCRUDActionCreators(STATE_KEY);

export const { remove: removeIntent } = crudActions;
