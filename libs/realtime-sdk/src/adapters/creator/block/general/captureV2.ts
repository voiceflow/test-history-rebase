import type { VoiceflowNode } from '@voiceflow/voiceflow-types';

import type { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';
import { voiceCaptureV2Adapter } from '../voice';

const captureV2Adapter = createBlockAdapter<VoiceflowNode.CaptureV2.VoiceStepData, NodeData.CaptureV2>(
  (voiceData, options) => voiceCaptureV2Adapter.fromDB(voiceData, options),
  (voiceData, options) => ({
    ...voiceCaptureV2Adapter.toDB(voiceData, options),
    chips: null,
  })
);

export default captureV2Adapter;
