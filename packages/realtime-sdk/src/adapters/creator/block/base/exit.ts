import { Node } from '@voiceflow/base-types';

import { NodeData } from '../../../../models';
import { createBlockAdapter } from '../utils';

const exitAdapter = createBlockAdapter<Node.Exit.StepData, NodeData.Exit>(
  () => ({}),
  () => ({
    ports: [],
  })
);

export default exitAdapter;
