import { NodeData } from '@realtime-sdk/models';
import { VoiceflowNode } from '@voiceflow/voiceflow-types';

import { chipsToIntentButtons, createBlockAdapter } from '../utils';
import { voiceInteractionAdapter } from '../voice';

// TODO: refactor to use StepData (chat/voice union)
const interactionAdapter = createBlockAdapter<VoiceflowNode.Interaction.VoiceStepData, NodeData.Interaction>(
  ({ chips, buttons, ...voiceData }) => ({
    ...voiceInteractionAdapter.fromDB(voiceData),

    buttons: buttons ?? chipsToIntentButtons(chips),
  }),
  ({ buttons, ...voiceData }) => ({
    ...voiceInteractionAdapter.toDB(voiceData),

    chips: null,
    buttons,
  })
);

export default interactionAdapter;
