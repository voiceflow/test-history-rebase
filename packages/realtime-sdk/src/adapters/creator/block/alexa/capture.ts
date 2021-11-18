import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/alexa-types';

import { createBlockAdapter } from '../utils';
import { voiceCaptureAdapter } from '../voice';

const captureAdapter = createBlockAdapter<Node.Capture.StepData, NodeData.Capture>(
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
