import { Node as BaseNode } from '@voiceflow/base-types';
import { Node } from '@voiceflow/general-types';
import { PlatformType } from '@voiceflow/internal';
import cuid from 'cuid';

import { NodeData } from '../../../../models';
import { distinctPlatformsData } from '../../../../utils/platform';
import { createAdapter } from '../../../utils';
import { chipsToIntentButtons, createBlockAdapter, noMatchAdapter, repromptAdapter } from '../utils';

const choiceAdapter = createAdapter<BaseNode.Interaction.Choice, NodeData.InteractionChoice>(
  ({ intent, mappings = [] }) => ({ id: cuid.slug(), intent, mappings }),
  ({ intent, mappings }) => ({ intent: intent ?? '', mappings })
);

const interactionAdapter = createBlockAdapter<Node.Interaction.StepData, NodeData.Interaction>(
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
