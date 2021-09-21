import { Node } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';

import { NodeData } from '../../../../models';
import { distinctPlatformsData } from '../../../../utils/platform';
import { createBlockAdapter } from '../utils';

const commandAdapter = createBlockAdapter<Node.Command.StepData, NodeData.Command>(
  ({ intent, diagramID, name, mappings }) => ({
    ...distinctPlatformsData({ intent: null, diagramID: null, mappings: [] }),
    [Constants.PlatformType.ALEXA]: { intent, diagramID: diagramID ?? null, mappings: mappings ?? [] },
    name,
  }),
  ({ name, [Constants.PlatformType.ALEXA]: { intent, diagramID, mappings } }) => ({
    name,
    intent: intent ?? '',
    diagramID: diagramID ?? '',
    mappings: mappings.map((mapping) => ({ variable: mapping.variable ?? '', slot: mapping.slot ?? '' })),
    next: null,
    ports: [],
  })
);

export default commandAdapter;
