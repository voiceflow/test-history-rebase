import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/base-types';

import { createBlockAdapter } from '../utils';

const exitAdapter = createBlockAdapter<Node.Exit.StepData, NodeData.Exit>(
  () => ({}),
  () => ({
    ports: [],
  })
);

export default exitAdapter;
