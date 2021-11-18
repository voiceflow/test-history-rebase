import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/google-types';

import { chipsToIntentButtons, createBlockAdapter } from '../utils';
import { voiceCaptureAdapter } from '../voice';

const captureAdapter = createBlockAdapter<Node.Capture.StepData, NodeData.Capture>(
  ({ chips, buttons, ...voiceData }) => ({
    ...voiceCaptureAdapter.fromDB(voiceData),

    buttons: buttons ?? chipsToIntentButtons(chips),
  }),
  ({ buttons, ...voiceData }) => ({
    ...voiceCaptureAdapter.toDB(voiceData),

    chips: null,
    buttons,
  })
);

export default captureAdapter;
