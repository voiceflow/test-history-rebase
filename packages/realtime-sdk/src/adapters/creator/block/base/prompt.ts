import { Models, Node } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';

import { NodeData } from '../../../../models';
import { createBlockAdapter, defaultPortAdapter, migratePortsWithNoMatch, PortsAdapter } from '../utils';

const promptAdapter = createBlockAdapter<
  Omit<Node.Prompt.StepData, 'reprompt' | 'noMatches'>,
  Omit<NodeData.Prompt, 'buttons' | 'reprompt' | 'noMatchReprompt'>
>(
  () => ({}),
  () => ({ ports: [] })
);

export const promptPortsAdapter: PortsAdapter<NodeData.Prompt> = {
  ...defaultPortAdapter,
  fromDB: (ports, node) => {
    if (!ports.length) {
      return defaultPortAdapter.fromDB([{ id: Utils.id.cuid(), data: {}, type: Models.PortType.NO_MATCH, target: null }], node);
    }

    return defaultPortAdapter.fromDB(migratePortsWithNoMatch(ports), node);
  },
};

export default promptAdapter;
