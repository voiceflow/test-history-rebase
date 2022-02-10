import { NodeData } from '@realtime-sdk/models';
import { GoogleNode } from '@voiceflow/google-types';

import { chipsToIntentButtons, createBlockAdapter } from '../utils';
import { voicePromptAdapter } from '../voice';

const promptAdapter = createBlockAdapter<GoogleNode.Prompt.VoiceStepData, NodeData.Prompt>(
  ({ chips, buttons, ...voiceData }) => ({
    ...voicePromptAdapter.fromDB(voiceData),

    buttons: buttons ?? chipsToIntentButtons(chips),
  }),
  ({ buttons, ...voiceData }) => ({
    ...voicePromptAdapter.toDB(voiceData),

    chips: null,
    buttons,
  })
);

export default promptAdapter;
