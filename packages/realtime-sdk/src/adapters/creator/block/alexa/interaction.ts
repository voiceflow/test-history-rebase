import { NodeData } from '@realtime-sdk/models';
import { AlexaNode } from '@voiceflow/alexa-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { createBlockAdapter } from '../utils';
import { voiceInteractionAdapter } from '../voice';

const interactionAdapter = createBlockAdapter<AlexaNode.Interaction.StepData, NodeData.Interaction>(
  (voiceData) => ({
    ...voiceInteractionAdapter.fromDB(voiceData, { platform: VoiceflowConstants.PlatformType.ALEXA }),

    buttons: null, // no buttons on alexa
  }),
  (voiceData) => ({
    ...voiceInteractionAdapter.toDB(voiceData, { platform: VoiceflowConstants.PlatformType.ALEXA }),

    chips: null,
    buttons: null,
  })
);

export default interactionAdapter;
