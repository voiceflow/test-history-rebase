import { NODE_KEY } from '../constants';
import { BaseBlockPayload, BaseNodePayload } from '../types';
import { createAction, typeFactory } from './utils';

const nodeType = typeFactory(NODE_KEY);

export interface UpdateDataPayload extends BaseNodePayload {
  data: unknown;
}

export interface AppendRemovePortPayload extends BaseNodePayload {
  portID: string;
}

export interface BaseStepPayload extends BaseBlockPayload {
  stepID: string;
}

export interface AppendStepPayload extends BaseBlockPayload {
  step: unknown;
}

export interface InsertStepPayload extends AppendStepPayload {
  index: number;
}

export const updateData = createAction<UpdateDataPayload>(nodeType('UPDATE_DATA'));
export const appendPort = createAction<AppendRemovePortPayload>(nodeType('APPEND_PORT'));
export const removePort = createAction<AppendRemovePortPayload>(nodeType('REMOVE_PORT'));

export const appendStep = createAction<AppendStepPayload>(nodeType('APPEND_STEP'));
export const insertStep = createAction<InsertStepPayload>(nodeType('INSERT_STEP'));
export const removeStep = createAction<BaseStepPayload>(nodeType('REMOVE_STEP'));
