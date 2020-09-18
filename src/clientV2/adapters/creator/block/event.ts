import type { StepData } from '@voiceflow/alexa-types/build/nodes/event';

import { NodeData } from '@/models';

import { createBlockAdapter } from './utils';

const eventAdapter = createBlockAdapter<StepData, NodeData.Event>(
  ({ mappings, requestName }) => ({ mappings, requestName }),
  ({ mappings, requestName }) => ({ mappings, requestName })
);

export default eventAdapter;
