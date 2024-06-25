import type { NodeData } from '@realtime-sdk/models';
import type { VoiceflowNode } from '@voiceflow/voiceflow-types';

import { chipsToIntentButtons, createBlockAdapter } from '../utils';
import { voicePromptAdapter } from '../voice';

// TODO: refactor to use StepData (chat/voice union)
const promptAdapter = createBlockAdapter<VoiceflowNode.Prompt.VoiceStepData, NodeData.Prompt>(
  ({ chips, buttons, ...voiceData }, options) => ({
    ...voicePromptAdapter.fromDB(voiceData, options),

    buttons: buttons ?? chipsToIntentButtons(chips),
  }),
  ({ buttons, ...voiceData }, options) => ({
    ...voicePromptAdapter.toDB(voiceData, options),

    chips: null,
    buttons,
  })
);

export default promptAdapter;
