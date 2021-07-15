import { Voice } from '@voiceflow/general-types';
import { StepData } from '@voiceflow/general-types/build/nodes/prompt';
import cuid from 'cuid';

import { NodeData } from '@/models';

import { chipsToIntentButtons, createBlockAdapter, defaultPortAdapter, noMatchAdapter, PortsAdapter, repromptAdapter } from '../utils';

const promptAdapter = createBlockAdapter<StepData<Voice>, NodeData.Prompt>(
  ({ reprompt, noMatches, chips, buttons }) => ({
    reprompt: reprompt && repromptAdapter.fromDB(reprompt),
    noMatchReprompt: noMatchAdapter.fromDB(noMatches),
    buttons: buttons ?? chipsToIntentButtons(chips),
  }),
  ({ reprompt, noMatchReprompt, buttons }) => ({
    ports: [],
    reprompt: reprompt && repromptAdapter.toDB(reprompt),
    noMatches: noMatchAdapter.toDB(noMatchReprompt),
    chips: null,
    buttons,
  })
);

export const promptPortsAdapter: PortsAdapter<NodeData.Prompt> = {
  ...defaultPortAdapter,
  fromDB: (ports, node) => {
    if (!ports.length) {
      return defaultPortAdapter.fromDB([{ id: cuid(), data: {}, type: 'else', target: null }], node);
    }

    return defaultPortAdapter.fromDB(ports, node);
  },
};

export default promptAdapter;
