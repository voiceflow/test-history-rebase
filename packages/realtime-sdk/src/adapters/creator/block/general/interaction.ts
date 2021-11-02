import { Constants, Node } from '@voiceflow/general-types';

import { NodeData } from '../../../../models';
import { distinctPlatformsData } from '../../../../utils/platform';
import { chipsToIntentButtons, choiceAdapter, createBlockAdapter, voiceNoMatchAdapter, voiceRepromptAdapter } from '../utils';

const interactionAdapter = createBlockAdapter<Node.Interaction.StepData, NodeData.Interaction>(
  ({ name, else: elseData, choices, reprompt, chips, buttons }) => ({
    name,
    else: voiceNoMatchAdapter.fromDB(elseData),
    choices: choices.map((choice) => ({
      ...distinctPlatformsData(choiceAdapter.fromDB({ intent: '', mappings: [] })),
      [Constants.PlatformType.GENERAL]: choiceAdapter.fromDB(choice),
    })),
    reprompt: reprompt && voiceRepromptAdapter.fromDB(reprompt),
    buttons: buttons ?? chipsToIntentButtons(chips),
  }),
  ({ name, else: elseData, choices, reprompt, buttons }) => ({
    name,
    else: voiceNoMatchAdapter.toDB(elseData as NodeData.VoiceNoMatches),
    choices: choices.map(({ [Constants.PlatformType.GENERAL]: data }) => choiceAdapter.toDB(data)),
    reprompt: reprompt && voiceRepromptAdapter.toDB(reprompt as NodeData.VoicePrompt),
    chips: null,
    buttons,
  })
);

export default interactionAdapter;
