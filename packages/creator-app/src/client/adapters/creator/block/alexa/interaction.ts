import { Node } from '@voiceflow/alexa-types';
import { Node as BaseNode } from '@voiceflow/base-types';
import { PlatformType } from '@voiceflow/internal';
import cuid from 'cuid';

import { createAdapter } from '@/client/adapters/utils';
import { NodeData } from '@/models';
import { distinctPlatformsData } from '@/utils/platform';

import { createBlockAdapter, noMatchAdapter, repromptAdapter } from '../utils';

const choiceAdapter = createAdapter<BaseNode.Interaction.Choice, NodeData.InteractionChoice>(
  ({ intent, mappings = [] }) => ({ id: cuid.slug(), intent, mappings }),
  ({ intent, mappings }) => ({ intent: intent ?? '', mappings })
);

const interactionAdapter = createBlockAdapter<Node.Interaction.StepData, NodeData.Interaction>(
  ({ name, else: elseData, choices, reprompt }) => ({
    name,
    else: noMatchAdapter.fromDB(elseData),
    choices: choices.map((choice) => ({
      ...distinctPlatformsData({ id: cuid.slug(), intent: null, mappings: [] }),
      [PlatformType.ALEXA]: choiceAdapter.fromDB(choice),
    })),
    reprompt: reprompt && repromptAdapter.fromDB(reprompt),
    buttons: null, // no buttons on alexa
  }),
  ({ name, else: elseData, choices, reprompt }) => ({
    name,
    else: noMatchAdapter.toDB(elseData),
    choices: choices.map(({ [PlatformType.ALEXA]: data }) => choiceAdapter.toDB(data)),
    reprompt: reprompt && repromptAdapter.toDB(reprompt),
    chips: null,
    buttons: null,
  })
);

export default interactionAdapter;
