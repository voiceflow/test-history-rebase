import { Node } from '@voiceflow/base-types';

import { NodeData } from '../../../../models';
import { createBlockAdapter, defaultPortAdapter, migratePortsWithNoMatch, PortsAdapter } from '../utils';

const buttonsAdapter = createBlockAdapter<Omit<Node.Buttons.StepData, 'else' | 'reprompt'>, Omit<Node.Buttons.StepData, 'else' | 'reprompt'>>(
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

export const buttonsPortsAdapter: PortsAdapter<NodeData.Buttons> = {
  ...defaultPortAdapter,
  fromDB: (ports, node) => defaultPortAdapter.fromDB(migratePortsWithNoMatch(ports), node),
};

export default buttonsAdapter;
