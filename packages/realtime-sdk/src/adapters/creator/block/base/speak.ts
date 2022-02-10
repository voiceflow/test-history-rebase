import { BaseNode } from '@voiceflow/base-types';

import { NodeData } from '../../../../models';
import { createBlockAdapter, createOutPortsAdapter, nextOnlyOutPortsAdapter } from '../utils';

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

export default speakAdapter;
