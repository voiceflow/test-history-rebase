import { BaseNode } from '@voiceflow/base-types';

import { NodeData } from '../../../../models';
import { choiceAdapter, createBlockAdapter, createOutPortsAdapter, noMatchNoReplyAndDynamicOutPortsAdapter } from '../utils';

const interactionAdapter = createBlockAdapter<
  Omit<BaseNode.Interaction.StepData, 'else' | 'noMatch' | 'reprompt' | 'noReply'>,
  Omit<NodeData.Interaction, 'else' | 'noReply' | 'noMatch' | 'buttons'>
>(
  ({ name, choices, intentScope }) => ({
    name,
    choices: choices.map((choice) => choiceAdapter.fromDB(choice)),
    intentScope,
  }),
  ({ name, choices, intentScope }) => ({
    name,
    choices: choices.map((choice) => choiceAdapter.toDB(choice)),
    intentScope,
  })
);

export const interactionOutPortsAdapter = createOutPortsAdapter<NodeData.InteractionBuiltInPorts, NodeData.Interaction>(
  (dbPorts, options) => noMatchNoReplyAndDynamicOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => noMatchNoReplyAndDynamicOutPortsAdapter.toDB(dbPorts, options)
);

export default interactionAdapter;
