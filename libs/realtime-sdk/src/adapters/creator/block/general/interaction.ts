import type { VoiceflowNode } from '@voiceflow/voiceflow-types';

import type { NodeData } from '@/models';

import { chipsToIntentButtons, createBlockAdapter } from '../utils';
import { voiceInteractionAdapter } from '../voice';

// TODO: refactor to use StepData (chat/voice union)
const interactionAdapter = createBlockAdapter<VoiceflowNode.Interaction.VoiceStepData, NodeData.Interaction>(
  ({ chips, buttons, ...voiceData }, options) => ({
    ...voiceInteractionAdapter.fromDB(voiceData, options),

    buttons: buttons ?? chipsToIntentButtons(chips),
  }),
  ({ buttons, ...voiceData }, options) => ({
    ...voiceInteractionAdapter.toDB(voiceData, options),

    chips: null,
    buttons,
  })
);

export default interactionAdapter;
