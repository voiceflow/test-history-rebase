import type { StepData } from '@voiceflow/general-types/build/nodes/visual';

import { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';

const visualAdapter = createBlockAdapter<StepData, NodeData.Visual>(
  (data) => data,
  (data) => data
);

export default visualAdapter;
