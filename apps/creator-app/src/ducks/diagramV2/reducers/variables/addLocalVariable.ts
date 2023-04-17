import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const addLocalVariableReducer = createReducer(Realtime.diagram.addLocalVariable, (state, { diagramID, variable }) => {
  const diagram = Normal.getOne(state, diagramID);

  if (diagram) {
    diagram.variables = Utils.array.append(diagram.variables, variable);
  }
});

export default addLocalVariableReducer;
