import { Constants, Node } from '@voiceflow/general-types';

import { NodeData } from '../../../../models';
import { chipsToIntentButtons, createBlockAdapter } from '../utils';
import { voiceInteractionAdapter } from '../voice';

const interactionAdapter = createBlockAdapter<Node.Interaction.StepData, NodeData.Interaction>(
  ({ chips, buttons, ...voiceData }) => ({
    ...voiceInteractionAdapter.fromDB(voiceData, { platform: Constants.PlatformType.GENERAL }),

    buttons: buttons ?? chipsToIntentButtons(chips),
  }),
  ({ buttons, ...voiceData }) => ({
    ...voiceInteractionAdapter.toDB(voiceData, { platform: Constants.PlatformType.GENERAL }),

    chips: null,
    buttons,
  })
);

export default interactionAdapter;
