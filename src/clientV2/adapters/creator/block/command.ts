import type { StepData } from '@voiceflow/alexa-types/build/nodes/command';

import { NodeData } from '@/models';

import { createBlockAdapter, defaultPlatformsData } from './utils';

const commandAdapter = createBlockAdapter<StepData, NodeData.Command>(
  ({ intent, diagramID, name, mappings }, { platform }) => ({
    ...defaultPlatformsData({ intent: null, diagramID: null, mappings: [] }),
    [platform]: { intent, diagramID: diagramID ?? null, mappings: mappings ?? [] },
    name,
  }),
  (data, { platform }) => ({
    name: data.name,
    intent: data[platform].intent || '',
    diagramID: data[platform].diagramID ?? '',
    mappings: data[platform].mappings.map((mapping) => ({ variable: mapping.variable ?? '', slot: mapping.slot ?? '' })),
    next: null,
    ports: [],
  })
);

export default commandAdapter;
