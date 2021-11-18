import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/base-types';

import { createBlockAdapter } from '../utils';

const visualAdapter = createBlockAdapter<Node.Visual.StepData, NodeData.Visual>(
  (data) => data,
  (data) => data
);

export default visualAdapter;
