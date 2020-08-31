import type { StepData } from '@voiceflow/alexa-types/build/nodes/intent';

import { PlatformType } from '@/constants';
import { NodeData } from '@/models';

import { createBlockAdapter } from './utils';

const intentAdapter = createBlockAdapter<StepData, NodeData.Intent>(
  ({ intent, mappings }) => ({
    [PlatformType.ALEXA]: { intent, mappings: mappings ?? [] },
    [PlatformType.GOOGLE]: { intent: null, mappings: [] },
    [PlatformType.GENERAL]: { intent: null, mappings: [] },
  }),
  ({ alexa }) => ({
    intent: alexa.intent,
    mappings: alexa.mappings,
  })
);

export default intentAdapter;
