import type { NodeData } from '@realtime-sdk/models';
import type { ChatNode } from '@voiceflow/chat-types';
import { extend } from 'cooky-cutter';

import * as Base from '../base';
import {
  BUTTON_STEP_DATA_FACTORY_CONFIG,
  ChatNodeDataNoMatch,
  ChatNodeDataNoReply,
  ChatPrompt,
  ChatStepNoMatch,
  ChatStepNoReply,
  IntentButton,
} from '../shared';

export const PromptStepData = extend<ReturnType<typeof Base.PromptStepData>, ChatNode.Prompt.StepData>(
  Base.PromptStepData,
  {
    ...BUTTON_STEP_DATA_FACTORY_CONFIG,
    noReply: () => ChatStepNoReply(),
    noMatch: () => ChatStepNoMatch(),
    reprompt: () => ChatPrompt(),
  }
);

export const PromptNodeData = extend<ReturnType<typeof Base.PromptNodeData>, NodeData.Prompt>(Base.PromptNodeData, {
  noReply: () => ChatNodeDataNoReply(),
  buttons: () => [IntentButton()],
  noMatch: () => ChatNodeDataNoMatch(),
});
