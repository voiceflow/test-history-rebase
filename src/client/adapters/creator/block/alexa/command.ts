import type { StepData } from '@voiceflow/general-types/build/nodes/push';

import { PlatformType } from '@/constants';
import { NodeData } from '@/models';
import { defaultPlatformsData } from '@/utils/platform';

import { createBlockAdapter } from '../utils';

const commandAdapter = createBlockAdapter<StepData, NodeData.Command>(
  ({ intent, diagramID, name, mappings }) => ({
    ...defaultPlatformsData({ intent: null, diagramID: null, mappings: [] }),
    [PlatformType.ALEXA]: { intent, diagramID: diagramID ?? null, mappings: mappings ?? [] },
    name,
  }),
  ({ name, [PlatformType.ALEXA]: { intent, diagramID, mappings } }) => ({
    name,
    intent: intent ?? '',
    diagramID: diagramID ?? '',
    mappings: mappings.map((mapping) => ({ variable: mapping.variable ?? '', slot: mapping.slot ?? '' })),
    next: null,
    ports: [],
  })
);

export default commandAdapter;
