import type { BaseNode } from '@voiceflow/base-types';

import type { NodeData } from '../../../../models';
import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  noMatchNoReplyAndDynamicOutPortsAdapter,
  noMatchNoReplyAndDynamicOutPortsAdapterV2,
} from '../utils';

const promptAdapter = createBlockAdapter<
  Omit<BaseNode.Prompt.StepData, 'reprompt' | 'noMatch' | 'noMatches' | 'noReply'>,
  Omit<NodeData.Prompt, 'buttons' | 'noMatch' | 'noReply' | 'noMatchReprompt'>
>(
  () => ({}),
  () => ({})
);

export const promptOutPortsAdapter = createOutPortsAdapter<NodeData.PromptBuiltInPorts, NodeData.Prompt>(
  (dbPorts, options) => noMatchNoReplyAndDynamicOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => noMatchNoReplyAndDynamicOutPortsAdapter.toDB(dbPorts, options)
);

export const promptOutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.PromptBuiltInPorts, NodeData.Prompt>(
  (dbPorts, options) => noMatchNoReplyAndDynamicOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => noMatchNoReplyAndDynamicOutPortsAdapterV2.toDB(dbPorts, options)
);

export default promptAdapter;
