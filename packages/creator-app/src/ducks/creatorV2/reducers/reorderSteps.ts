import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { removeNodePortRemapLinks } from '../utils';
import { createActiveDiagramReducer } from './utils';

const reorderStepsReducer = createActiveDiagramReducer(Realtime.node.reorderSteps, (state, { blockID, stepID, index: toIndex, nodePortRemaps }) => {
  if (!Normal.hasMany(state.nodes, [blockID, stepID])) return;

  const stepIDs = state.stepIDsByBlockID[blockID] ?? [];
  const fromIndex = stepIDs.indexOf(stepID);
  if (fromIndex === -1) return;

  state.stepIDsByBlockID[blockID] = Utils.array.reorder(stepIDs, fromIndex, toIndex);

  removeNodePortRemapLinks(state, nodePortRemaps);
});

export default reorderStepsReducer;
