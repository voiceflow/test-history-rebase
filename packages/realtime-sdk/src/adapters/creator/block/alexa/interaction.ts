import { Node } from '@voiceflow/alexa-types';
import { Constants } from '@voiceflow/general-types';

import { NodeData } from '../../../../models';
import { distinctPlatformsData } from '../../../../utils/platform';
import { choiceAdapter, createBlockAdapter, voiceNoMatchAdapter, voiceRepromptAdapter } from '../utils';

const interactionAdapter = createBlockAdapter<Node.Interaction.StepData, NodeData.Interaction>(
  ({ name, else: elseData, choices, reprompt }) => ({
    name,
    else: voiceNoMatchAdapter.fromDB(elseData),
    choices: choices.map((choice) => ({
      ...distinctPlatformsData(choiceAdapter.fromDB({ intent: '', mappings: [] })),
      [Constants.PlatformType.ALEXA]: choiceAdapter.fromDB(choice),
    })),
    reprompt: reprompt && voiceRepromptAdapter.fromDB(reprompt),
    buttons: null, // no buttons on alexa
  }),
  ({ name, else: elseData, choices, reprompt }) => ({
    name,
    else: voiceNoMatchAdapter.toDB(elseData as NodeData.VoiceNoMatches),
    choices: choices.map(({ [Constants.PlatformType.ALEXA]: data }) => choiceAdapter.toDB(data)),
    reprompt: reprompt && voiceRepromptAdapter.toDB(reprompt as NodeData.VoicePrompt),
    chips: null,
    buttons: null,
  })
);

export default interactionAdapter;
