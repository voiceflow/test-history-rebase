import { faker } from '@faker-js/faker';
import type { NodeData } from '@realtime-sdk/models';
import { getRandomEnumElements } from '@test/utils';
import { BaseNode } from '@voiceflow/base-types';
import type { ChatNode } from '@voiceflow/chat-types';
import type { VoiceNode } from '@voiceflow/voice-types';
import { define, extend } from 'cooky-cutter';

import { ChatPrompt, VoiceNodeDataPrompt, VoicePrompt } from './prompt';

export const BaseStepNoReply = define<BaseNode.Utils.BaseStepNoReply>({
  types: () => getRandomEnumElements(BaseNode.Utils.NoReplyType),
  timeout: () => faker.datatype.number(),
  pathName: () => faker.lorem.words(),
  randomize: () => faker.datatype.boolean(),
});

export const ChatStepNoReply = extend<ReturnType<typeof BaseStepNoReply>, ChatNode.Utils.StepNoReply>(BaseStepNoReply, {
  reprompts: () => [ChatPrompt()],
});

export const ChatNodeDataNoReply = extend<ReturnType<typeof BaseStepNoReply>, ChatNode.Utils.StepNoReply>(
  BaseStepNoReply,
  {
    reprompts: () => [ChatPrompt()],
  }
);

export const VoiceStepNoReply = extend<ReturnType<typeof BaseStepNoReply>, VoiceNode.Utils.StepNoReply<any>>(
  BaseStepNoReply,
  {
    reprompts: () => [VoicePrompt()],
  }
);

export const VoiceNodeDataNoReply = extend<ReturnType<typeof BaseStepNoReply>, NodeData.VoiceNoReply>(BaseStepNoReply, {
  reprompts: () => [VoiceNodeDataPrompt()],
});
