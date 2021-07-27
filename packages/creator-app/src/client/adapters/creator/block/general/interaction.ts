import { Voice } from '@voiceflow/general-types';
import { Choice, StepData } from '@voiceflow/general-types/build/nodes/interaction';
import { PlatformType } from '@voiceflow/internal';
import cuid from 'cuid';

import { createAdapter } from '@/client/adapters/utils';
import { NodeData } from '@/models';
import { distinctPlatformsData } from '@/utils/platform';

import { chipsToIntentButtons, createBlockAdapter, noMatchAdapter, repromptAdapter } from '../utils';

const choiceAdapter = createAdapter<Choice, NodeData.InteractionChoice>(
  ({ intent, mappings = [] }) => ({ id: cuid.slug(), intent, mappings }),
  ({ intent, mappings }) => ({ intent: intent ?? '', mappings })
);

const interactionAdapter = createBlockAdapter<StepData<Voice>, NodeData.Interaction>(
  ({ name, else: elseData, choices, reprompt, chips, buttons }) => ({
    name,
    else: noMatchAdapter.fromDB(elseData),
    choices: choices.map((choice) => ({
      ...distinctPlatformsData({ id: cuid.slug(), intent: null, mappings: [] }),
      [PlatformType.GENERAL]: choiceAdapter.fromDB(choice),
    })),
    reprompt: reprompt && repromptAdapter.fromDB(reprompt),
    buttons: buttons ?? chipsToIntentButtons(chips),
  }),
  ({ name, else: elseData, choices, reprompt, buttons }) => ({
    name,
    else: noMatchAdapter.toDB(elseData),
    choices: choices.map(({ [PlatformType.GENERAL]: data }) => choiceAdapter.toDB(data)),
    reprompt: reprompt && repromptAdapter.toDB(reprompt),
    chips: null,
    buttons,
  })
);

export default interactionAdapter;
