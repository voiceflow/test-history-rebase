import { NodeData } from '@realtime-sdk/models';
import { GoogleNode } from '@voiceflow/google-types';

import { chipsToIntentButtons, createBlockAdapter } from '../utils';
import { voiceInteractionAdapter } from '../voice';

const interactionAdapter = createBlockAdapter<GoogleNode.Interaction.VoiceStepData, NodeData.Interaction>(
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
