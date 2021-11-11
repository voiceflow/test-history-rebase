import { Node } from '@voiceflow/base-types';

import { NodeData } from '../../../../models';
import { createBlockAdapter } from '../utils';

const randomAdapter = createBlockAdapter<Node.Random.StepData, NodeData.Random>(
  ({ paths, noDuplicates }) => ({ paths, noDuplicates }),
  ({ paths, noDuplicates }) => ({ paths, noDuplicates })
);

export default randomAdapter;
