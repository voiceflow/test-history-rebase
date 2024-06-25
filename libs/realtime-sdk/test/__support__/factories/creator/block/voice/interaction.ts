import type { NodeData } from '@realtime-sdk/models';
import type { VoiceNode } from '@voiceflow/voice-types';
import { extend } from 'cooky-cutter';

import * as Base from '../base';
import { VoiceNodeDataNoMatch, VoiceNodeDataNoReply, VoicePrompt, VoiceStepNoMatch, VoiceStepNoReply } from '../shared';

export const InteractionStepData = extend<
  ReturnType<typeof Base.InteractionStepData>,
  VoiceNode.Interaction.StepData<any>
>(Base.InteractionStepData, {
  noMatch: () => VoiceStepNoMatch(),
  noReply: () => VoiceStepNoReply(),
  reprompt: () => VoicePrompt(),
});

export const InteractionNodeData = extend<
  ReturnType<typeof Base.InteractionNodeData>,
  Omit<NodeData.Interaction, 'buttons'>
>(Base.InteractionNodeData, {
  noMatch: () => VoiceNodeDataNoMatch(),
  noReply: () => VoiceNodeDataNoReply(),
});
