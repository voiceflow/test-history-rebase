import { createCRUDActionCreators } from '@/ducks/utils/crud';
import { Intent } from '@/models';

import { STATE_KEY } from './constants';
import { intentProcessor } from './utils';

const { add, addMany, remove: removeIntent, replace, reorder: reorderIntents } = createCRUDActionCreators(STATE_KEY);

export { removeIntent, reorderIntents };

export const addIntent = (id: string, data: Intent) => add(id, intentProcessor(data));

export const addIntents = (values: Intent[]) => addMany(values.map(intentProcessor));

export const replaceIntents = (values: Intent[], meta?: any) => replace(values.map(intentProcessor), meta);
