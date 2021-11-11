import { Node } from '@voiceflow/base-types';

import { DistinctPlatform } from '../../../../constants';
import { NodeData } from '../../../../models';
import { distinctPlatformsData } from '../../../../utils/platform';
import { choiceAdapter, createBlockAdapter, defaultPortAdapter, migratePortsWithNoMatch, PortsAdapter } from '../utils';

const interactionAdapter = createBlockAdapter<
  Omit<Node.Interaction.StepData, 'else' | 'reprompt'>,
  Omit<NodeData.Interaction, 'else' | 'reprompt' | 'buttons'>,
  [{ platform: DistinctPlatform }],
  [{ platform: DistinctPlatform }]
>(
  ({ name, choices }, { platform }) => ({
    name,
    choices: choices.map((choice) => ({
      ...distinctPlatformsData(choiceAdapter.fromDB({ intent: '', mappings: [] })),
      [platform]: choiceAdapter.fromDB(choice),
    })),
  }),
  ({ name, choices }, { platform }) => ({
    name,
    choices: choices.map(({ [platform]: data }) => choiceAdapter.toDB(data)),
  })
);

export const interactionPortsAdapter: PortsAdapter<NodeData.Interaction> = {
  ...defaultPortAdapter,
  fromDB: (ports, node) => defaultPortAdapter.fromDB(migratePortsWithNoMatch(ports), node),
};

export default interactionAdapter;
