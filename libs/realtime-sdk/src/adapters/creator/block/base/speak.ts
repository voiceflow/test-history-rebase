import type { BaseNode } from '@voiceflow/base-types';

import type { NodeData } from '../../../../models';
import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  nextOnlyOutPortsAdapter,
  nextOnlyOutPortsAdapterV2,
} from '../utils';

const speakAdapter = createBlockAdapter<BaseNode.Speak.StepData, Omit<NodeData.Speak, 'dialogs'>>(
  ({ randomize, canvasVisibility }) => ({
    randomize,
    canvasVisibility,
  }),
  ({ randomize, canvasVisibility }) => ({
    randomize,
    canvasVisibility,
  })
);

export const speakOutPortsAdapter = createOutPortsAdapter<NodeData.SpeakBuiltInPorts, NodeData.Speak>(
  (dbPorts, options) => nextOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export const speakOutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.SpeakBuiltInPorts, NodeData.Speak>(
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => nextOnlyOutPortsAdapterV2.toDB(dbPorts, options)
);

export default speakAdapter;
