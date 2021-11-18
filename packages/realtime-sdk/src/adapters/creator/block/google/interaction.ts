import { NodeData } from '@realtime-sdk/models';
import { Constants } from '@voiceflow/general-types';
import { Node } from '@voiceflow/google-types';

import { chipsToIntentButtons, createBlockAdapter } from '../utils';
import { voiceInteractionAdapter } from '../voice';

const interactionAdapter = createBlockAdapter<Node.Interaction.StepData, NodeData.Interaction>(
  ({ chips, buttons, ...voiceData }) => ({
    ...voiceInteractionAdapter.fromDB(voiceData, { platform: Constants.PlatformType.GOOGLE }),

    buttons: buttons ?? chipsToIntentButtons(chips),
  }),
  ({ buttons, ...voiceData }) => ({
    ...voiceInteractionAdapter.toDB(voiceData, { platform: Constants.PlatformType.GOOGLE }),

    chips: null,
    buttons,
  })
);

export default interactionAdapter;
