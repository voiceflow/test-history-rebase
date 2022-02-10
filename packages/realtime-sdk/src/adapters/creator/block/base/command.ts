import { BaseNode } from '@voiceflow/base-types';

import { DistinctPlatform } from '../../../../constants';
import { NodeData } from '../../../../models';
import { distinctPlatformsData } from '../../../../utils/platform';
import { createBlockAdapter, emptyOutPortsAdapter } from '../utils';

const commandAdapter = createBlockAdapter<
  BaseNode.Command.StepData,
  NodeData.Command,
  [{ platform: DistinctPlatform }],
  [{ platform: DistinctPlatform }]
>(
  ({ intent, diagramID, name, mappings }, { platform }) => ({
    ...distinctPlatformsData({ intent: null, diagramID: null, mappings: [] }),
    [platform]: { intent, diagramID: diagramID ?? null, mappings: mappings ?? [] },
    name,
  }),
  ({ name, ...data }, { platform }) => {
    const { intent, diagramID, mappings } = data[platform];

    return {
      name,
      next: null,
      ports: [],
      intent: intent ?? '',
      mappings: mappings.map((mapping) => ({ variable: mapping.variable ?? '', slot: mapping.slot ?? '' })),
      diagramID: diagramID ?? '',
    };
  }
);

export const commandOutPortsAdapter = emptyOutPortsAdapter;

export default commandAdapter;
