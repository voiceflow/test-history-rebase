import type { StepData } from '@voiceflow/alexa-types/build/nodes/random';

import { NodeData } from '@/models';

import { createBlockAdapter } from './utils';

const codeDataAdapter = createBlockAdapter<StepData, NodeData.Random>(
  ({ paths, noDuplicates }) => ({ paths, noDuplicates }),
  ({ paths, noDuplicates }) => ({ paths, noDuplicates })
);

export default codeDataAdapter;
