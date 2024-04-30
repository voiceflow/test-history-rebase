import type { VoiceNode } from '@voiceflow/voice-types';
import { extend } from 'cooky-cutter';

import type { NodeData } from '@/models';

import * as Base from '../base';
import { VoiceNodeDataNoMatch, VoiceNodeDataNoReply, VoicePrompt, VoiceStepNoMatch, VoiceStepNoReply } from '../shared';

export const PromptStepData = extend<ReturnType<typeof Base.PromptStepData>, VoiceNode.Prompt.StepData<any>>(
  Base.PromptStepData,
  {
    noReply: () => VoiceStepNoReply(),
    noMatch: () => VoiceStepNoMatch(),
    reprompt: () => VoicePrompt(),
  }
);

export const PromptNodeData = extend<ReturnType<typeof Base.PromptNodeData>, Omit<NodeData.Prompt, 'buttons'>>(
  Base.PromptNodeData,
  {
    noReply: () => VoiceNodeDataNoReply(),
    noMatch: () => VoiceNodeDataNoMatch(),
  }
);
