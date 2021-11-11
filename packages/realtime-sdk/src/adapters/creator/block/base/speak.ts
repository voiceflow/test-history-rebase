import { Node } from '@voiceflow/base-types';

import { NodeData } from '../../../../models';
import { createBlockAdapter } from '../utils';

const speakAdapter = createBlockAdapter<Node.Speak.StepData, Omit<NodeData.Speak, 'dialogs'>>(
  ({ randomize, canvasVisibility }) => ({
    randomize,
    canvasVisibility,
  }),
  ({ randomize, canvasVisibility }) => ({
    randomize,
    canvasVisibility,
  })
);

export default speakAdapter;
