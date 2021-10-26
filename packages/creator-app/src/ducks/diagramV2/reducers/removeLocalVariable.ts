import * as Realtime from '@voiceflow/realtime-sdk';

import { withoutValue } from '@/utils/array';
import { safeGetNormalizedByKey } from '@/utils/normalized';

import { createReducer } from './utils';

const removeLocalVariableReducer = createReducer(Realtime.diagram.removeLocalVariable, (state, { diagramID, variable }) => {
  const diagram = safeGetNormalizedByKey(state, diagramID);

  if (diagram) {
    diagram.variables = withoutValue(diagram.variables, variable);
  }
});

export default removeLocalVariableReducer;
