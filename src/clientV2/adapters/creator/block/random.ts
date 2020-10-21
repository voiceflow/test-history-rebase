import type { StepData } from '@voiceflow/google-types/build/nodes/random';

import { NodeData } from '@/models';

import { createBlockAdapter } from './utils';

const randomAdapter = createBlockAdapter<StepData, NodeData.Random>(
  ({ paths, noDuplicates }) => ({ paths, noDuplicates }),
  ({ paths, noDuplicates }) => ({ paths, noDuplicates })
);

export default randomAdapter;
