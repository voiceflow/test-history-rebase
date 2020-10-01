import type { StepData } from '@voiceflow/alexa-types/build/nodes/intent';

import { NodeData } from '@/models';

import { createBlockAdapter, defaultPlatformsData } from './utils';

const intentAdapter = createBlockAdapter<StepData, NodeData.Intent>(
  ({ intent, mappings }, { platform }) => ({
    ...defaultPlatformsData({ intent: null, mappings: [] }),
    [platform]: { intent, mappings: mappings ?? [] },
  }),
  (data, { platform }) => ({
    intent: data[platform].intent,
    mappings: data[platform].mappings,
  })
);

export default intentAdapter;
