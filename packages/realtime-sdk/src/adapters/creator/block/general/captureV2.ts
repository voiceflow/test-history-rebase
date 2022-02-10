import { NodeData } from '@realtime-sdk/models';
import { VoiceflowNode } from '@voiceflow/voiceflow-types';

import { createBlockAdapter } from '../utils';
import { voiceCaptureV2Adapter } from '../voice';

const captureV2Adapter = createBlockAdapter<VoiceflowNode.CaptureV2.VoiceStepData, NodeData.CaptureV2>(
  (voiceData) => voiceCaptureV2Adapter.fromDB(voiceData),
  (voiceData) => ({
    ...voiceCaptureV2Adapter.toDB(voiceData),
    chips: null,
  })
);

export default captureV2Adapter;
