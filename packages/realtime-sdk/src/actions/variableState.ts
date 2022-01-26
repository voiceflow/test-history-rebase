import { createAsyncAction, createCRUDActions, createType } from '@realtime-sdk/actions/utils';
import { VARIABLE_STATE_KEY } from '@realtime-sdk/constants';
import { VariableState, VariableStateData } from '@realtime-sdk/models';
import { BaseVersionPayload } from '@realtime-sdk/types';

const variableStateType = createType(VARIABLE_STATE_KEY);

// Other

export interface CreateVariableStatePayload extends BaseVersionPayload {
  variableState: VariableStateData;
}

export interface PatchVariableStatesPayload extends BaseVersionPayload {
  variableStates: Partial<VariableState>[];
}

export const create = createAsyncAction<CreateVariableStatePayload, VariableState>(variableStateType('CREATE'));

export const patch = createAsyncAction<PatchVariableStatesPayload, VariableState[]>(variableStateType('PATCH'));

export const crud = createCRUDActions<BaseVersionPayload, VariableState>(variableStateType);
