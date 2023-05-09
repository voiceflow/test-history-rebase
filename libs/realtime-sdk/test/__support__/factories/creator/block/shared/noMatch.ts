import { faker } from '@faker-js/faker';
import { NodeData } from '@realtime-sdk/models';
import { getRandomEnumElement } from '@test/utils';
import { BaseNode } from '@voiceflow/base-types';
import { ChatNode } from '@voiceflow/chat-types';
import { VoiceNode } from '@voiceflow/voice-types';
import { define, extend } from 'cooky-cutter';

import { ChatPrompt, VoiceNodeDataPrompt, VoicePrompt } from './prompt';

export const BaseStepNoMatch = define<BaseNode.Utils.BaseStepNoMatch>({
  type: () => getRandomEnumElement(BaseNode.Utils.NoMatchType),
  pathName: () => faker.lorem.words(),
  randomize: () => faker.datatype.boolean(),
});

export const ChatStepNoMatch = extend<ReturnType<typeof BaseStepNoMatch>, ChatNode.Utils.StepNoMatch>(BaseStepNoMatch, {
  reprompts: () => [ChatPrompt()],
});

export const VoiceStepNoMatch = extend<ReturnType<typeof BaseStepNoMatch>, VoiceNode.Utils.StepNoMatch<any>>(BaseStepNoMatch, {
  reprompts: () => [VoicePrompt()],
});

export const BaseNodeDataNomatch = define<NodeData.BaseNoMatch>({
  types: () => [getRandomEnumElement(BaseNode.Utils.NoMatchType)],
  pathName: () => faker.lorem.words(),
  randomize: () => faker.datatype.boolean(),
});

export const ChatNodeDataNoMatch = extend<ReturnType<typeof BaseNodeDataNomatch>, NodeData.ChatNoMatch>(BaseNodeDataNomatch, {
  reprompts: () => [ChatPrompt()],
});

export const VoiceNodeDataNoMatch = extend<ReturnType<typeof BaseNodeDataNomatch>, NodeData.VoiceNoMatch>(BaseNodeDataNomatch, {
  reprompts: () => [VoiceNodeDataPrompt()],
});
