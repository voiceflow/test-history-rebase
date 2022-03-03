import { BaseNode } from '@voiceflow/base-types';

import { DistinctPlatform } from '../../../../constants';
import { NodeData } from '../../../../models';
import { distinctPlatformsData } from '../../../../utils/platform';
import { choiceAdapter, createBlockAdapter, createOutPortsAdapter, noMatchNoReplyAndDynamicOutPortsAdapter } from '../utils';

const interactionAdapter = createBlockAdapter<
  Omit<BaseNode.Interaction.StepData, 'else' | 'noMatch' | 'reprompt' | 'noReply'>,
  Omit<NodeData.Interaction, 'else' | 'noReply' | 'noMatch' | 'buttons'>,
  [{ platform: DistinctPlatform }],
  [{ platform: DistinctPlatform }]
>(
  ({ name, choices, intentScope }, { platform }) => ({
    name,
    choices: choices.map((choice) => ({
      ...distinctPlatformsData(choiceAdapter.fromDB({ intent: '', mappings: [] })),
      [platform]: choiceAdapter.fromDB(choice),
    })),
    intentScope,
  }),
  ({ name, choices, intentScope }, { platform }) => ({
    name,
    choices: choices.map(({ [platform]: data }) => choiceAdapter.toDB(data)),
    intentScope,
  })
);

export const interactionOutPortsAdapter = createOutPortsAdapter<NodeData.InteractionBuiltInPorts, NodeData.Interaction>(
  (dbPorts, options) => noMatchNoReplyAndDynamicOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => noMatchNoReplyAndDynamicOutPortsAdapter.toDB(dbPorts, options)
);

export default interactionAdapter;
