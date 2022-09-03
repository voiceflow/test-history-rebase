import { createCRUDActions } from '@realtime-sdk/actions/utils';
import { VARIABLE_STATE_KEY } from '@realtime-sdk/constants';
import { VariableState, VariableStateData } from '@realtime-sdk/models';
import { BaseVersionPayload } from '@realtime-sdk/types';
import { Utils } from '@voiceflow/common';

const variableStateType = Utils.protocol.typeFactory(VARIABLE_STATE_KEY);

// Other

export interface CreateVariableStatePayload extends BaseVersionPayload {
  variableState: VariableStateData;
}

export interface PatchVariableStatesPayload extends BaseVersionPayload {
  variableStates: Partial<VariableState>[];
}

export const create = Utils.protocol.createAsyncAction<CreateVariableStatePayload, VariableState>(variableStateType('CREATE'));

export const patch = Utils.protocol.createAsyncAction<PatchVariableStatesPayload, VariableState[]>(variableStateType('PATCH'));

export const crud = createCRUDActions<VariableState, BaseVersionPayload>(variableStateType);
