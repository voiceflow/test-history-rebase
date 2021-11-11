import { Node } from '@voiceflow/voice-types';

import { NodeData } from '../../../../models';
import { baseButtonsAdapter } from '../base';
import { createBlockAdapter, voiceNoMatchAdapter, voicePromptAdapter } from '../utils';

const buttonsAdapter = createBlockAdapter<Node.Buttons.StepData<any>, NodeData.Buttons>(
  ({ else: noMatch, reprompt, ...baseData }) => ({
    ...baseButtonsAdapter.fromDB(baseData),

    else: voiceNoMatchAdapter.fromDB(noMatch),
    reprompt: reprompt && voicePromptAdapter.fromDB(reprompt),
  }),
  ({ else: noMatch, reprompt, ...baseData }) => ({
    ...baseButtonsAdapter.toDB(baseData),

    else: voiceNoMatchAdapter.toDB(noMatch as NodeData.VoiceNoMatch),
    reprompt: reprompt && voicePromptAdapter.toDB(reprompt as NodeData.VoicePrompt),
  })
);

export default buttonsAdapter;
