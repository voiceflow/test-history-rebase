import { NodeData } from '@realtime-sdk/models';
import { AlexaNode } from '@voiceflow/alexa-types';

import { createBlockAdapter } from '../utils';
import { voiceCaptureAdapter } from '../voice';

const captureAdapter = createBlockAdapter<AlexaNode.Capture.StepData, NodeData.Capture>(
  (voiceData) => ({
    ...voiceCaptureAdapter.fromDB(voiceData),

    buttons: null, // no buttons on alexa
  }),
  (voiceData) => ({
    ...voiceCaptureAdapter.toDB(voiceData),

    chips: null,
    buttons: null,
  })
);

export default captureAdapter;
