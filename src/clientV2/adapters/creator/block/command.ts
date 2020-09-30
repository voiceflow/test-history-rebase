import type { StepData } from '@voiceflow/alexa-types/build/nodes/command';

import { PlatformType } from '@/constants';
import { NodeData } from '@/models';

import { createBlockAdapter } from './utils';

const commandAdapter = createBlockAdapter<StepData, NodeData.Command>(
  ({ intent, diagramID, name, mappings }) => ({
    [PlatformType.ALEXA]: { intent, diagramID: diagramID ?? null, mappings: mappings ?? [] },
    [PlatformType.GOOGLE]: { intent: null, diagramID: null, mappings: [] },
    [PlatformType.GENERAL]: { intent: null, diagramID: null, mappings: [] },
    name,
  }),
  ({ alexa, name }) => ({
    name,
    intent: alexa.intent || '',
    diagramID: alexa.diagramID ?? '',
    mappings: alexa.mappings.map((mapping) => ({ variable: mapping.variable ?? '', slot: mapping.slot ?? '' })),
    next: null,
    ports: [],
  })
);

export default commandAdapter;
