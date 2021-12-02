import { Node } from '@voiceflow/base-types';

import { NodeData } from '../../../../models';
import { createBlockAdapter, createOutPortsAdapter, noMatchNoReplyAndDynamicOutPortsAdapter } from '../utils';

const buttonsAdapter = createBlockAdapter<Omit<Node.Buttons.StepData, 'else' | 'reprompt' | 'noReply'>, Omit<NodeData.Buttons, 'else' | 'noReply'>>(
  ({ buttons, buttonsLayout }) => ({
    buttons,
    buttonsLayout,
  }),
  ({ buttons, buttonsLayout }) => ({
    else: { randomize: false },
    buttons,
    buttonsLayout,
  })
);

export const buttonsOutPortsAdapter = createOutPortsAdapter<NodeData.ButtonsBuiltInPorts, NodeData.Buttons>(
  (dbPorts, options) => noMatchNoReplyAndDynamicOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => noMatchNoReplyAndDynamicOutPortsAdapter.toDB(dbPorts, options)
);

export default buttonsAdapter;
