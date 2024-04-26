import type { BaseNode } from '@voiceflow/base-types';

import type { NodeData } from '../../../../models';
import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  noMatchNoReplyAndDynamicOutPortsAdapter,
  noMatchNoReplyAndDynamicOutPortsAdapterV2,
  syncDynamicPortsLength,
} from '../utils';

const buttonsAdapter = createBlockAdapter<
  Omit<BaseNode.Buttons.StepData, 'else' | 'noMatch' | 'reprompt' | 'noReply'>,
  Omit<NodeData.Buttons, 'else' | 'noMatch' | 'noReply'>
>(
  ({ buttons, intentScope, buttonsLayout }) => ({ buttons, intentScope, buttonsLayout }),
  ({ buttons, intentScope, buttonsLayout }) => ({ buttons, intentScope, buttonsLayout })
);

export const buttonsOutPortsAdapter = createOutPortsAdapter<NodeData.ButtonsBuiltInPorts, NodeData.Buttons>(
  (dbPorts, options) =>
    syncDynamicPortsLength({
      nodeID: options.node.nodeID,
      ports: noMatchNoReplyAndDynamicOutPortsAdapter.fromDB(dbPorts, options),
      length: options.node.data.buttons?.length,
    }),
  (dbPorts, options) => noMatchNoReplyAndDynamicOutPortsAdapter.toDB(dbPorts, options)
);

export const buttonsOutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.ButtonsBuiltInPorts, NodeData.Buttons>(
  (dbPorts, options) =>
    syncDynamicPortsLength({
      nodeID: options.node.nodeID,
      ports: noMatchNoReplyAndDynamicOutPortsAdapterV2.fromDB(dbPorts, options),
      length: options.node.data.buttons?.length,
    }),

  (dbPorts, options) => noMatchNoReplyAndDynamicOutPortsAdapterV2.toDB(dbPorts, options)
);

export default buttonsAdapter;
