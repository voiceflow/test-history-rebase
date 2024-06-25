import type { NodeData } from '@realtime-sdk/models';
import type { VoiceNode } from '@voiceflow/voice-types';
import { extend } from 'cooky-cutter';

import * as Base from '../base';
import { VoiceNodeDataNoReply, VoicePrompt, VoiceStepNoReply } from '../shared';

export const CaptureStepData = extend<ReturnType<typeof Base.CaptureStepData>, VoiceNode.Capture.StepData<any>>(
  Base.CaptureStepData,
  {
    noReply: () => VoiceStepNoReply(),
    reprompt: () => VoicePrompt(),
  }
);

export const CaptureNodeData = extend<ReturnType<typeof Base.CaptureNodeData>, Omit<NodeData.Capture, 'buttons'>>(
  Base.CaptureNodeData,
  {
    noReply: () => VoiceNodeDataNoReply(),
  }
);
