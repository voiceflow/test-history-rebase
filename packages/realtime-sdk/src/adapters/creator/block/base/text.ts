import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/base-types';

import { createBlockAdapter } from '../utils';

const textAdapter = createBlockAdapter<Node.Text.StepData, NodeData.Text>(
  (data) => data,
  (data) => data
);

export default textAdapter;
