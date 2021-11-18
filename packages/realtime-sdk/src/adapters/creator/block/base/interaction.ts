import { Node } from '@voiceflow/base-types';

import { DistinctPlatform } from '../../../../constants';
import { NodeData } from '../../../../models';
import { distinctPlatformsData } from '../../../../utils/platform';
import { choiceAdapter, createBlockAdapter, createOutPortsAdapter, noMatchNoReplyAndDynamicOutPortsAdapter } from '../utils';

const interactionAdapter = createBlockAdapter<
  Omit<Node.Interaction.StepData, 'else' | 'reprompt'>,
  Omit<NodeData.Interaction, 'else' | 'reprompt' | 'buttons'>,
  [{ platform: DistinctPlatform }],
  [{ platform: DistinctPlatform }]
>(
  ({ name, choices }, { platform }) => ({
    name,
    choices: choices.map((choice) => ({
      ...distinctPlatformsData(choiceAdapter.fromDB({ intent: '', mappings: [] })),
      [platform]: choiceAdapter.fromDB(choice),
    })),
  }),
  ({ name, choices }, { platform }) => ({
    name,
    choices: choices.map(({ [platform]: data }) => choiceAdapter.toDB(data)),
  })
);

export const interactionOutPortsAdapter = createOutPortsAdapter<NodeData.InteractionBuiltInPorts, NodeData.Interaction>(
  (dbPorts, options) => noMatchNoReplyAndDynamicOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => noMatchNoReplyAndDynamicOutPortsAdapter.toDB(dbPorts, options)
);

export default interactionAdapter;
