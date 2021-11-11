import { Node as BaseNode } from '@voiceflow/base-types';
import { Node as ChatNode } from '@voiceflow/chat-types';
import { Node as VoiceNode } from '@voiceflow/voice-types';
import { define, extend } from 'cooky-cutter';
import { datatype, lorem } from 'faker';

import { NodeData } from '@/models';
import { getRandomEnumElement } from '@/tests/utils';

import { ChatPrompt, VoiceNodeDataPrompt, VoicePrompt } from './prompt';

export const BaseStepNoMatch = define<BaseNode.Utils.BaseStepNoMatch>({
  type: () => getRandomEnumElement(BaseNode.Utils.NoMatchType),
  pathName: () => lorem.words(),
  randomize: () => datatype.boolean(),
});

export const ChatStepNoMatch = extend<ReturnType<typeof BaseStepNoMatch>, ChatNode.Utils.StepNoMatch>(BaseStepNoMatch, {
  reprompts: () => [ChatPrompt()],
});

export const VoiceStepNoMatch = extend<ReturnType<typeof BaseStepNoMatch>, VoiceNode.Utils.StepNoMatch<any>>(BaseStepNoMatch, {
  reprompts: () => [VoicePrompt()],
});

export const BaseNodeDataNomatch = define<NodeData.BaseNoMatch>({
  type: () => getRandomEnumElement(BaseNode.Utils.NoMatchType),
  pathName: () => lorem.words(),
  randomize: () => datatype.boolean(),
});

export const ChatNodeDataNoMatch = extend<ReturnType<typeof BaseNodeDataNomatch>, NodeData.ChatNoMatch>(BaseNodeDataNomatch, {
  reprompts: () => [ChatPrompt()],
});

export const VoiceNodeDataNoMatch = extend<ReturnType<typeof BaseNodeDataNomatch>, NodeData.VoiceNoMatch>(BaseNodeDataNomatch, {
  reprompts: () => [VoiceNodeDataPrompt()],
});
