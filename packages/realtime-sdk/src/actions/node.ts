import { NODE_KEY } from '../constants';
import { BaseBlockPayload, BaseDiagramPayload, BaseNodePayload } from '../types';
import { createAction, typeFactory } from './utils';

const nodeType = typeFactory(NODE_KEY);

export interface UpdateDataPayload extends BaseNodePayload {
  data: unknown;
}

export interface RemoveManyNodesPayload extends BaseDiagramPayload {
  nodeIDs: string[];
}

export const updateData = createAction<UpdateDataPayload>(nodeType('UPDATE_DATA'));
export const removeMany = createAction<RemoveManyNodesPayload>(nodeType('REMOVE_MANY'));

// ports

export interface PortPayload extends BaseNodePayload {
  portID: string;
}

export const appendPort = createAction<PortPayload>(nodeType('APPEND_PORT'));
export const removePort = createAction<PortPayload>(nodeType('REMOVE_PORT'));

// steps

export interface AppendStepPayload extends BaseBlockPayload {
  step: unknown;
}

export interface InsertStepPayload extends AppendStepPayload {
  index: number;
}

export const appendStep = createAction<AppendStepPayload>(nodeType('APPEND_STEP'));
export const insertStep = createAction<InsertStepPayload>(nodeType('INSERT_STEP'));
