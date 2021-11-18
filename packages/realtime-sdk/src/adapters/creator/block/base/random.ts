import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/base-types';

import { createBlockAdapter } from '../utils';

const randomAdapter = createBlockAdapter<Node.Random.StepData, NodeData.Random>(
  ({ paths, noDuplicates }) => ({ paths, noDuplicates }),
  ({ paths, noDuplicates }) => ({ paths, noDuplicates })
);

export default randomAdapter;
