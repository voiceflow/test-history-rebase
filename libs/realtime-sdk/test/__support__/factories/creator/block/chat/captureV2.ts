import type { NodeData } from '@realtime-sdk/models';
import type { ChatNode } from '@voiceflow/chat-types';
import { define } from 'cooky-cutter';

import { ChatNodeDataNoMatch, ChatNodeDataNoReply, ChatStepNoMatch, ChatStepNoReply } from '../shared';

export const CaptureV2StepData = define<Omit<ChatNode.CaptureV2.StepData, 'capture'>>({
  noReply: () => ChatStepNoReply(),
  noMatch: () => ChatStepNoMatch(),
});

export const CaptureV2NodeData = define<Omit<NodeData.CaptureV2, 'captureType'>>({
  variable: null,
  noReply: () => ChatNodeDataNoReply(),
  noMatch: () => ChatNodeDataNoMatch(),
});
