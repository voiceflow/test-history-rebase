import { StepData } from '@voiceflow/general-types/build/nodes/text';

import { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';

const textAdapter = createBlockAdapter<StepData, NodeData.Text>(
  (data) => data,
  (data) => data
);

export default textAdapter;
