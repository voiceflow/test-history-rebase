import { Node as BaseNode } from '@voiceflow/base-types';
import { Node, Types } from '@voiceflow/chat-types';
import { Constants } from '@voiceflow/general-types';
import cuid from 'cuid';

import { NodeData } from '../../../../models';
import { distinctPlatformsData } from '../../../../utils/platform';
import { chatRepromptAdapter, createAdapter } from '../../../utils';
import { chipsToIntentButtons, createBlockAdapter } from '../utils';
import { chatNoMatchAdapter } from './utils';

const choiceAdapter = createAdapter<BaseNode.Interaction.Choice, NodeData.InteractionChoice>(
  ({ intent, mappings = [] }) => ({ id: cuid.slug(), intent, mappings }),
  ({ intent, mappings }) => ({ intent: intent ?? '', mappings })
);

const interactionAdapter = createBlockAdapter<Node.Interaction.StepData, NodeData.Interaction>(
  ({ name, else: elseData, choices, reprompt, chips, buttons }) => ({
    name,
    else: chatNoMatchAdapter.fromDB(elseData),
    choices: choices.map((choice) => ({
      ...distinctPlatformsData({ id: cuid.slug(), intent: null, mappings: [] }),
      [Constants.PlatformType.GENERAL]: choiceAdapter.fromDB(choice),
    })),
    reprompt: reprompt && chatRepromptAdapter.fromDB(reprompt),
    buttons: buttons ?? chipsToIntentButtons(chips),
  }),
  ({ name, else: elseData, choices, reprompt, buttons }) => ({
    name,
    else: chatNoMatchAdapter.toDB(elseData as NodeData.ChatNoMatches),
    chips: null,
    buttons,
    choices: choices.map(({ [Constants.PlatformType.GENERAL]: data }) => choiceAdapter.toDB(data)),
    reprompt: reprompt && chatRepromptAdapter.toDB(reprompt as Types.Prompt),
  })
);

export default interactionAdapter;
