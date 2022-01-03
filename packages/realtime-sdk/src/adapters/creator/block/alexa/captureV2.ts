import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/alexa-types';

import { createBlockAdapter } from '../utils';
import { voiceCaptureV2Adapter } from '../voice';

const captureV2Adapter = createBlockAdapter<Node.CaptureV2.StepData, NodeData.CaptureV2>(
  (voiceData) => voiceCaptureV2Adapter.fromDB(voiceData),
  (voiceData) => voiceCaptureV2Adapter.toDB(voiceData)
);

export default captureV2Adapter;
