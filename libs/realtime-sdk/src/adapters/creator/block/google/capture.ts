import { NodeData } from '@realtime-sdk/models';
import { GoogleNode } from '@voiceflow/google-types';

import { chipsToIntentButtons, createBlockAdapter } from '../utils';
import { voiceCaptureAdapter } from '../voice';

const captureAdapter = createBlockAdapter<GoogleNode.Capture.VoiceStepData, NodeData.Capture>(
  ({ chips, buttons, ...voiceData }, options) => ({
    ...voiceCaptureAdapter.fromDB(voiceData, options),

    buttons: buttons ?? chipsToIntentButtons(chips),
  }),
  ({ buttons, ...voiceData }, options) => ({
    ...voiceCaptureAdapter.toDB(voiceData, options),

    chips: null,
    buttons,
  })
);

export default captureAdapter;
