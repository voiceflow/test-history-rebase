import { BaseNode } from '@voiceflow/base-types';

import { NodeData } from '../../../../models';
import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  noMatchNoReplyAndDynamicOutPortsAdapter,
  noMatchNoReplyAndDynamicOutPortsAdapterV2,
} from '../utils';

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

export const cardV2OutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.CardV2BuiltInPorts, NodeData.CardV2>(
  (dbPorts, options) => noMatchNoReplyAndDynamicOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => noMatchNoReplyAndDynamicOutPortsAdapterV2.toDB(dbPorts, options)
);

export default cardV2Adapter;
