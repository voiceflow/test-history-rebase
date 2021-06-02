import type { StepData } from '@voiceflow/general-types/build/nodes/exit';

import { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';

const exitAdapter = createBlockAdapter<StepData, NodeData.Exit>(
  () => ({}),
  () => ({
    ports: [],
  })
);

export default exitAdapter;
