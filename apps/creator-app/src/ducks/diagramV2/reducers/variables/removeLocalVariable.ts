import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const removeLocalVariableReducer = createReducer(Realtime.diagram.removeLocalVariable, (state, { diagramID, variable }) => {
  const diagram = Normal.getOne(state, diagramID);

  if (diagram) {
    diagram.variables = Utils.array.withoutValue(diagram.variables, variable);
  }
});

export default removeLocalVariableReducer;
