import { NodeData } from '@realtime-sdk/models';
import { AlexaNode } from '@voiceflow/alexa-types';

import { createBlockAdapter } from '../utils';
import { voiceInteractionAdapter } from '../voice';

const interactionAdapter = createBlockAdapter<AlexaNode.Interaction.StepData, NodeData.Interaction>(
  (voiceData, options) => ({
    ...voiceInteractionAdapter.fromDB(voiceData, options),

    buttons: null, // no buttons on alexa
  }),
  (voiceData, options) => ({
    ...voiceInteractionAdapter.toDB(voiceData, options),

    chips: null,
    buttons: null,
  })
);

export default interactionAdapter;
