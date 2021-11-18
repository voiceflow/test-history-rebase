import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/alexa-types';
import { Constants } from '@voiceflow/general-types';

import { createBlockAdapter } from '../utils';
import { voiceInteractionAdapter } from '../voice';

const interactionAdapter = createBlockAdapter<Node.Interaction.StepData, NodeData.Interaction>(
  (voiceData) => ({
    ...voiceInteractionAdapter.fromDB(voiceData, { platform: Constants.PlatformType.ALEXA }),

    buttons: null, // no buttons on alexa
  }),
  (voiceData) => ({
    ...voiceInteractionAdapter.toDB(voiceData, { platform: Constants.PlatformType.ALEXA }),

    chips: null,
    buttons: null,
  })
);

export default interactionAdapter;
