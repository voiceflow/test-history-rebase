import { NODE_KEY } from '../constants';
import { createAction, typeFactory } from './utils';

const nodeType = typeFactory(NODE_KEY);

export const updateData = createAction<{ nodeID: string; data: unknown }>(nodeType('UPDATE_DATA'));
export const appendPort = createAction<{ nodeID: string; portID: string }>(nodeType('APPEND_PORT'));
export const removePort = createAction<{ nodeID: string; portID: string }>(nodeType('REMOVE_PORT'));

export const appendStep = createAction<{ blockID: string; stepID: string; step: unknown }>(nodeType('APPEND_STEP'));
export const insertStep = createAction<{ blockID: string; stepID: string; index: number; step: unknown }>(nodeType('INSERT_STEP'));
export const removeStep = createAction<{ blockID: string; stepID: string }>(nodeType('REMOVE_STEP'));
