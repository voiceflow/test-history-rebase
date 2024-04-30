import { Utils } from '@voiceflow/common';

import { createCRUDActions } from '@/actions/utils';
import { VARIABLE_STATE_KEY } from '@/constants';
import type { VariableState, VariableStateData } from '@/models';
import type { BaseVersionPayload } from '@/types';

export const variableStateType = Utils.protocol.typeFactory(VARIABLE_STATE_KEY);

// Other

export interface CreateVariableStatePayload extends BaseVersionPayload {
  variableState: VariableStateData;
}

export interface PatchVariableStatesPayload extends BaseVersionPayload {
  variableStates: Partial<VariableState>[];
}

export const create = Utils.protocol.createAsyncAction<CreateVariableStatePayload, VariableState>(
  variableStateType('CREATE')
);

export const patch = Utils.protocol.createAsyncAction<PatchVariableStatesPayload, VariableState[]>(
  variableStateType('PATCH')
);

export const crud = createCRUDActions<VariableState, BaseVersionPayload>(variableStateType);
