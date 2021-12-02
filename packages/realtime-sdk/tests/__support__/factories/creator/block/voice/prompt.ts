import { Node } from '@voiceflow/voice-types';
import { extend } from 'cooky-cutter';

import { NodeData } from '@/models';

import * as Base from '../base';
import { VoiceNodeDataNoMatch, VoiceNodeDataNoReply, VoicePrompt, VoiceStepNoMatch, VoiceStepNoReply } from '../shared';

export const PromptStepData = extend<ReturnType<typeof Base.PromptStepData>, Node.Prompt.StepData<any>>(Base.PromptStepData, {
  noReply: () => VoiceStepNoReply(),
  reprompt: () => VoicePrompt(),
  noMatches: () => VoiceStepNoMatch(),
});

export const PromptNodeData = extend<ReturnType<typeof Base.PromptNodeData>, Omit<NodeData.Prompt, 'buttons'>>(Base.PromptNodeData, {
  noReply: () => VoiceNodeDataNoReply(),
  noMatchReprompt: () => VoiceNodeDataNoMatch(),
});
