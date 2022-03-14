import { NodeData } from '@realtime-sdk/models';
import { AlexaNode } from '@voiceflow/alexa-types';

import { createBlockAdapter } from '../utils';
import { voiceInteractionAdapter } from '../voice';

const interactionAdapter = createBlockAdapter<AlexaNode.Interaction.StepData, NodeData.Interaction>(
  (voiceData) => ({
    ...voiceInteractionAdapter.fromDB(voiceData),

    buttons: null, // no buttons on alexa
  }),
  (voiceData) => ({
    ...voiceInteractionAdapter.toDB(voiceData),

    chips: null,
    buttons: null,
  })
);

export default interactionAdapter;
