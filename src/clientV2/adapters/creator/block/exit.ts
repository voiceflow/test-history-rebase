import type { StepData } from '@voiceflow/alexa-types/build/nodes/exit';

import { NodeData } from '@/models';

import { createBlockAdapter } from './utils';

const ExitBlockAdapter = createBlockAdapter<StepData, NodeData.Exit>(
  () => ({}),
  () => ({})
);

export default ExitBlockAdapter;
