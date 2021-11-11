import { Node } from '@voiceflow/voice-types';
import { extend } from 'cooky-cutter';

import { NodeData } from '@/models';

import * as Base from '../base';
import { VoiceNodeDataNoMatch, VoiceNodeDataPrompt, VoicePrompt, VoiceStepNoMatch } from '../shared';

export const InteractionStepData = extend<ReturnType<typeof Base.InteractionStepData>, Node.Interaction.StepData<any>>(Base.InteractionStepData, {
  else: () => VoiceStepNoMatch(),
  reprompt: () => VoicePrompt(),
});

export const InteractionNodeData = extend<ReturnType<typeof Base.InteractionNodeData>, Omit<NodeData.Interaction, 'buttons'>>(
  Base.InteractionNodeData,
  {
    else: () => VoiceNodeDataNoMatch(),
    reprompt: () => VoiceNodeDataPrompt(),
  }
);
