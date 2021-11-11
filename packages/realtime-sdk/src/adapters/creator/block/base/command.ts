import { Node } from '@voiceflow/base-types';

import { DistinctPlatform } from '../../../../constants';
import { NodeData } from '../../../../models';
import { distinctPlatformsData } from '../../../../utils/platform';
import { createBlockAdapter } from '../utils';

const commandAdapter = createBlockAdapter<
  Node.Command.StepData,
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

export default commandAdapter;
