import { NodeData } from '@realtime-sdk/models';
import { VoiceNode } from '@voiceflow/voice-types';
import { define } from 'cooky-cutter';

import { VoiceNodeDataNoMatch, VoiceNodeDataNoReply, VoiceStepNoMatch, VoiceStepNoReply } from '../shared';

export const CaptureV2StepData = define<Omit<VoiceNode.CaptureV2.StepData<any>, 'capture'>>({
  noReply: () => VoiceStepNoReply(),
  noMatch: () => VoiceStepNoMatch(),
});

export const CaptureV2NodeData = define<Omit<NodeData.CaptureV2, 'captureType'>>({
  variable: null,
  noReply: () => VoiceNodeDataNoReply(),
  noMatch: () => VoiceNodeDataNoMatch(),
});
