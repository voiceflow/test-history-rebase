import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Draft } from 'immer';

import { CreatorState } from '../types';
import { addStep } from '../utils';
import { createActiveDiagramReducer } from './utils';

export const appendStep = (
  state: Draft<CreatorState>,
  { blockID, stepID, data, ports }: { blockID: string; stepID: string; data: Realtime.NodeDataDescriptor<unknown>; ports: Realtime.PortsDescriptor }
): void => {
  addStep(state, (stepIDs) => Utils.array.append(stepIDs, stepID), {
    blockID,
    stepID,
    data,
    ports,
  });
};

const appendStepReducer = createActiveDiagramReducer(Realtime.node.appendStep, (state, { blockID, stepID, data, ports }) => {
  appendStep(state, { blockID, stepID, data, ports });
});

export default appendStepReducer;
