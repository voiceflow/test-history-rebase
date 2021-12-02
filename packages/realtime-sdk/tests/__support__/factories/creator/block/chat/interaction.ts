import { Node } from '@voiceflow/chat-types';
import { Constants } from '@voiceflow/general-types';
import { extend } from 'cooky-cutter';

import { NodeData } from '@/models';

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

export const InteractionStepData = extend<ReturnType<typeof Base.InteractionStepData>, Node.Interaction.StepData>(Base.InteractionStepData, {
  ...BUTTON_STEP_DATA_FACTORY_CONFIG,
  else: () => ChatStepNoMatch(),
  noReply: () => ChatStepNoReply(),
  reprompt: () => ChatPrompt(),
});

export const InteractionNodeData = extend<ReturnType<typeof Base.InteractionNodeData>, NodeData.Interaction>(Base.InteractionNodeData, {
  else: () => ChatNodeDataNoMatch(),
  noReply: () => ChatNodeDataNoReply(),
  buttons: () => [IntentButton()],
  choices: () => [Base.ChoiceDistinctPlatformsData({ [Constants.PlatformType.GENERAL]: Base.ChoicePlatformNodeData() })],
});
