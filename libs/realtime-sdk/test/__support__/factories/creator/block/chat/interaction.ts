import type { ChatNode } from '@voiceflow/chat-types';
import { extend } from 'cooky-cutter';

import type { NodeData } from '@/models';

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

export const InteractionStepData = extend<ReturnType<typeof Base.InteractionStepData>, ChatNode.Interaction.StepData>(
  Base.InteractionStepData,
  {
    ...BUTTON_STEP_DATA_FACTORY_CONFIG,
    noMatch: () => ChatStepNoMatch(),
    noReply: () => ChatStepNoReply(),
    reprompt: () => ChatPrompt(),
  }
);

export const InteractionNodeData = extend<ReturnType<typeof Base.InteractionNodeData>, NodeData.Interaction>(
  Base.InteractionNodeData,
  {
    noMatch: () => ChatNodeDataNoMatch(),
    noReply: () => ChatNodeDataNoReply(),
    buttons: () => [IntentButton()],
    choices: () => [Base.ChoiceData(Base.ChoicePlatformNodeData())],
  }
);
