import { BaseNode } from '@voiceflow/base-types';

import { NodeData } from '../../../../models';
import {
  choiceAdapter,
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  noMatchNoReplyAndDynamicOutPortsAdapter,
  noMatchNoReplyAndDynamicOutPortsAdapterV2,
  syncDynamicPortsLength,
} from '../utils';

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
  (dbPorts, options) =>
    syncDynamicPortsLength({
      nodeID: options.node.nodeID,
      ports: noMatchNoReplyAndDynamicOutPortsAdapter.fromDB(dbPorts, options),
      length: options.node.data.choices?.length,
    }),
  (dbPorts, options) => noMatchNoReplyAndDynamicOutPortsAdapter.toDB(dbPorts, options)
);

export const interactionOutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.InteractionBuiltInPorts, NodeData.Interaction>(
  (dbPorts, options) =>
    syncDynamicPortsLength({
      nodeID: options.node.nodeID,
      ports: noMatchNoReplyAndDynamicOutPortsAdapterV2.fromDB(dbPorts, options),
      length: options.node.data.choices?.length,
    }),
  (dbPorts, options) => noMatchNoReplyAndDynamicOutPortsAdapterV2.toDB(dbPorts, options)
);

export default interactionAdapter;
