import { NodeData } from '@realtime-sdk/models';
import { getRandomEnumElements } from '@test/utils';
import { BaseNode } from '@voiceflow/base-types';
import { ChatNode } from '@voiceflow/chat-types';
import { VoiceNode } from '@voiceflow/voice-types';
import { define, extend } from 'cooky-cutter';
import { datatype, lorem } from 'faker';

import { ChatPrompt, VoiceNodeDataPrompt, VoicePrompt } from './prompt';

export const BaseStepNoReply = define<BaseNode.Utils.BaseStepNoReply>({
  types: () => getRandomEnumElements(BaseNode.Utils.NoReplyType),
  timeout: () => datatype.number(),
  pathName: () => lorem.words(),
  randomize: () => datatype.boolean(),
});

export const ChatStepNoReply = extend<ReturnType<typeof BaseStepNoReply>, ChatNode.Utils.StepNoReply>(BaseStepNoReply, {
  reprompts: () => [ChatPrompt()],
});

export const ChatNodeDataNoReply = extend<ReturnType<typeof BaseStepNoReply>, ChatNode.Utils.StepNoReply>(BaseStepNoReply, {
  reprompts: () => [ChatPrompt()],
});

export const VoiceStepNoReply = extend<ReturnType<typeof BaseStepNoReply>, VoiceNode.Utils.StepNoReply<any>>(BaseStepNoReply, {
  reprompts: () => [VoicePrompt()],
});

export const VoiceNodeDataNoReply = extend<ReturnType<typeof BaseStepNoReply>, NodeData.VoiceNoReply>(BaseStepNoReply, {
  reprompts: () => [VoiceNodeDataPrompt()],
});
