import { BaseNode } from '@voiceflow/base-types';

import { NodeData } from '../../../../models';
import { createBlockAdapter, createOutPortsAdapter, noMatchNoReplyAndDynamicOutPortsAdapter } from '../utils';

const buttonsAdapter = createBlockAdapter<
  Omit<BaseNode.Buttons.StepData, 'else' | 'noMatch' | 'reprompt' | 'noReply'>,
  Omit<NodeData.Buttons, 'else' | 'noMatch' | 'noReply'>
>(
  ({ buttons, intentScope, buttonsLayout }) => ({
    buttons,
    intentScope,
    buttonsLayout,
  }),
  ({ buttons, intentScope, buttonsLayout }) => ({
    else: { randomize: false },
    buttons,
    intentScope,
    buttonsLayout,
  })
);

export const buttonsOutPortsAdapter = createOutPortsAdapter<NodeData.ButtonsBuiltInPorts, NodeData.Buttons>(
  (dbPorts, options) => noMatchNoReplyAndDynamicOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => noMatchNoReplyAndDynamicOutPortsAdapter.toDB(dbPorts, options)
);

export default buttonsAdapter;
