import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import type { VariableValue } from '@/models';

export const updateVariables = Utils.protocol.createAction<Record<string, VariableValue>>(
  Realtime.variableState.variableStateType('UPDATE_VARIABLES')
);
export const updateSelectedVariableState = Utils.protocol.createAction<Realtime.VariableState | null>(
  Realtime.variableState.variableStateType('UPDATE_SELECTED_STATE')
);
