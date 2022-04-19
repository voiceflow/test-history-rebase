import { BaseNode } from '@voiceflow/base-types';

import { NodeData } from '../../../../models';
import { createBlockAdapter, createOutPortsAdapter, noMatchNoReplyAndDynamicOutPortsAdapter } from '../utils';

const cardV2Adapter = createBlockAdapter<Omit<BaseNode.CardV2.StepData, 'noMatch' | 'noReply'>, Omit<NodeData.CardV2, 'noMatch' | 'noReply'>>(
  ({ cards, layout }) => ({
    cards,
    layout,
  }),
  ({ cards, layout }) => ({
    cards,
    layout,
  })
);

export const cardV2OutPortsAdapter = createOutPortsAdapter<NodeData.CardV2BuiltInPorts, NodeData.CardV2>(
  (dbPorts, options) => noMatchNoReplyAndDynamicOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => noMatchNoReplyAndDynamicOutPortsAdapter.toDB(dbPorts, options)
);

export default cardV2Adapter;
