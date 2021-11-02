import { Node, Types } from '@voiceflow/chat-types';
import { Constants } from '@voiceflow/general-types';

import { NodeData } from '../../../../models';
import { distinctPlatformsData } from '../../../../utils/platform';
import { chatRepromptAdapter } from '../../../utils';
import { chipsToIntentButtons, choiceAdapter, createBlockAdapter } from '../utils';
import { chatNoMatchAdapter } from './utils';

const interactionAdapter = createBlockAdapter<Node.Interaction.StepData, NodeData.Interaction>(
  ({ name, else: elseData, choices, reprompt, chips, buttons }) => ({
    name,
    else: chatNoMatchAdapter.fromDB(elseData),
    choices: choices.map((choice) => ({
      ...distinctPlatformsData(choiceAdapter.fromDB({ intent: '', mappings: [] })),
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
