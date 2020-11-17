import type { StepData } from '@voiceflow/general-types/build/nodes/command';

import { PlatformType } from '@/constants';
import { NodeData } from '@/models';
import { defaultPlatformsData } from '@/utils/platform';

import { createBlockAdapter } from '../utils';

const commandAdapter = createBlockAdapter<StepData, NodeData.Command>(
  ({ intent, diagramID, name, mappings }) => ({
    ...defaultPlatformsData({ intent: null, diagramID: null, mappings: [] }),
    [PlatformType.GOOGLE]: { intent, diagramID: diagramID ?? null, mappings: mappings ?? [] },
    name,
  }),
  ({ name, [PlatformType.GOOGLE]: { intent, diagramID, mappings } }) => ({
    name,
    intent: intent ?? '',
    diagramID: diagramID ?? '',
    mappings: mappings.map((mapping) => ({ variable: mapping.variable ?? '', slot: mapping.slot ?? '' })),
    next: null,
    ports: [],
  })
);

export default commandAdapter;
