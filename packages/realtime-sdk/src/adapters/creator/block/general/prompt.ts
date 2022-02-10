import { NodeData } from '@realtime-sdk/models';
import { VoiceflowNode } from '@voiceflow/voiceflow-types';

import { chipsToIntentButtons, createBlockAdapter } from '../utils';
import { voicePromptAdapter } from '../voice';

// TODO: refactor to use StepData (chat/voice union)
const promptAdapter = createBlockAdapter<VoiceflowNode.Prompt.VoiceStepData, NodeData.Prompt>(
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
