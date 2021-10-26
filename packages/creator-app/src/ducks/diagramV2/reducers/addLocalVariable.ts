import * as Realtime from '@voiceflow/realtime-sdk';

import { append } from '@/utils/array';
import { safeGetNormalizedByKey } from '@/utils/normalized';

import { createReducer } from './utils';

const addLocalVariableReducer = createReducer(Realtime.diagram.addLocalVariable, (state, { diagramID, variable }) => {
  const diagram = safeGetNormalizedByKey(state, diagramID);

  if (diagram) {
    diagram.variables = append(diagram.variables, variable);
  }
});

export default addLocalVariableReducer;
