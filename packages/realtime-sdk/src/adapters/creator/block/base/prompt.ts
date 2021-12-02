import { Node } from '@voiceflow/base-types';

import { NodeData } from '../../../../models';
import { createBlockAdapter, createOutPortsAdapter, noMatchNoReplyAndDynamicOutPortsAdapter } from '../utils';

const promptAdapter = createBlockAdapter<
  Omit<Node.Prompt.StepData, 'reprompt' | 'noMatches' | 'noReply'>,
  Omit<NodeData.Prompt, 'buttons' | 'noReply' | 'noMatchReprompt'>
>(
  () => ({}),
  () => ({ ports: [] })
);

export const promptOutPortsAdapter = createOutPortsAdapter<NodeData.PromptBuiltInPorts, NodeData.Prompt>(
  (dbPorts, options) => noMatchNoReplyAndDynamicOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => noMatchNoReplyAndDynamicOutPortsAdapter.toDB(dbPorts, options)
);

export default promptAdapter;
