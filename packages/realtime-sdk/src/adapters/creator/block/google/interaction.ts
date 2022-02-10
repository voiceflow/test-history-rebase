import { NodeData } from '@realtime-sdk/models';
import { GoogleNode } from '@voiceflow/google-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { chipsToIntentButtons, createBlockAdapter } from '../utils';
import { voiceInteractionAdapter } from '../voice';

const interactionAdapter = createBlockAdapter<GoogleNode.Interaction.VoiceStepData, NodeData.Interaction>(
  ({ chips, buttons, ...voiceData }) => ({
    ...voiceInteractionAdapter.fromDB(voiceData, { platform: VoiceflowConstants.PlatformType.GOOGLE }),

    buttons: buttons ?? chipsToIntentButtons(chips),
  }),
  ({ buttons, ...voiceData }) => ({
    ...voiceInteractionAdapter.toDB(voiceData, { platform: VoiceflowConstants.PlatformType.GOOGLE }),

    chips: null,
    buttons,
  })
);

export default interactionAdapter;
