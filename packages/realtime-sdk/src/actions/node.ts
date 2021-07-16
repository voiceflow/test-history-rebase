import { NODE_KEY } from '../constants';
import { BlockPayload, NodePayload } from '../types';
import { createAction, typeFactory } from './utils';

const nodeType = typeFactory(NODE_KEY);

export const updateData = createAction<NodePayload<{ data: unknown }>>(nodeType('UPDATE_DATA'));
export const appendPort = createAction<NodePayload<{ portID: string }>>(nodeType('APPEND_PORT'));
export const removePort = createAction<NodePayload<{ portID: string }>>(nodeType('REMOVE_PORT'));

export const appendStep = createAction<BlockPayload<{ stepID: string; step: unknown }>>(nodeType('APPEND_STEP'));
export const insertStep = createAction<BlockPayload<{ stepID: string; index: number; step: unknown }>>(nodeType('INSERT_STEP'));
export const removeStep = createAction<BlockPayload<{ stepID: string }>>(nodeType('REMOVE_STEP'));
