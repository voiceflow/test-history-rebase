import { NODE_KEY } from '@realtime-sdk/constants';
import { BaseBlockPayload, BaseDiagramPayload, BaseNodePayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

const nodeType = Utils.protocol.typeFactory(NODE_KEY);

export interface UpdateDataPayload extends BaseNodePayload {
  data: unknown;
}

export interface RemoveManyNodesPayload extends BaseDiagramPayload {
  nodeIDs: string[];
}

export const updateData = Utils.protocol.createAction<UpdateDataPayload>(nodeType('UPDATE_DATA'));
export const removeMany = Utils.protocol.createAction<RemoveManyNodesPayload>(nodeType('REMOVE_MANY'));

// ports

export interface PortPayload extends BaseNodePayload {
  portID: string;
}

export const appendPort = Utils.protocol.createAction<PortPayload>(nodeType('APPEND_PORT'));
export const removePort = Utils.protocol.createAction<PortPayload>(nodeType('REMOVE_PORT'));

// steps

export interface AppendStepPayload extends BaseBlockPayload {
  step: unknown;
}

export interface InsertStepPayload extends AppendStepPayload {
  index: number;
}

export const appendStep = Utils.protocol.createAction<AppendStepPayload>(nodeType('APPEND_STEP'));
export const insertStep = Utils.protocol.createAction<InsertStepPayload>(nodeType('INSERT_STEP'));
