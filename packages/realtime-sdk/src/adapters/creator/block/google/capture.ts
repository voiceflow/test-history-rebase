import { NodeData } from '@realtime-sdk/models';
import { GoogleNode } from '@voiceflow/google-types';

import { chipsToIntentButtons, createBlockAdapter } from '../utils';
import { voiceCaptureAdapter } from '../voice';

const captureAdapter = createBlockAdapter<GoogleNode.Capture.VoiceStepData, NodeData.Capture>(
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
