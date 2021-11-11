import { Node } from '@voiceflow/chat-types';
import { extend } from 'cooky-cutter';

import { NodeData } from '@/models';

import * as Base from '../base';
import { BUTTON_STEP_DATA_FACTORY_CONFIG, ChatNodeDataNoMatch, ChatPrompt, ChatStepNoMatch, IntentButton } from '../shared';

export const PromptStepData = extend<ReturnType<typeof Base.PromptStepData>, Node.Prompt.StepData>(Base.PromptStepData, {
  ...BUTTON_STEP_DATA_FACTORY_CONFIG,
  reprompt: () => ChatPrompt(),
  noMatches: () => ChatStepNoMatch(),
});

export const PromptNodeData = extend<ReturnType<typeof Base.PromptNodeData>, NodeData.Prompt>(Base.PromptNodeData, {
  reprompt: () => ChatPrompt(),
  buttons: () => [IntentButton()],
  noMatchReprompt: () => ChatNodeDataNoMatch(),
});
