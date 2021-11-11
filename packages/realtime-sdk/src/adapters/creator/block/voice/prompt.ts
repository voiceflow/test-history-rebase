import { Node } from '@voiceflow/voice-types';

import { NodeData } from '../../../../models';
import { basePromptAdapter } from '../base';
import { createBlockAdapter, voiceNoMatchAdapter, voicePromptAdapter } from '../utils';

const promptAdapter = createBlockAdapter<Node.Prompt.StepData<any>, Omit<NodeData.Prompt, 'buttons'>>(
  ({ reprompt, noMatches, ...baseData }) => ({
    ...basePromptAdapter.fromDB(baseData),

    reprompt: reprompt && voicePromptAdapter.fromDB(reprompt),
    noMatchReprompt: voiceNoMatchAdapter.fromDB(noMatches),
  }),
  ({ reprompt, noMatchReprompt, ...baseData }) => ({
    ...basePromptAdapter.toDB(baseData),

    reprompt: reprompt && voicePromptAdapter.toDB(reprompt as NodeData.VoicePrompt),
    noMatches: voiceNoMatchAdapter.toDB(noMatchReprompt as NodeData.VoiceNoMatch),
  })
);

export default promptAdapter;
