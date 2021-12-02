import { Node } from '@voiceflow/base-types';
import { Node as ChatNode } from '@voiceflow/chat-types';
import { Nullish } from '@voiceflow/common';
import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createPlatformSelector } from './platform';
import { chatPromptFactory, PromptFactoryOptions, voicePromptFactory } from './prompt';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface NoReplyFactoryOptions extends PromptFactoryOptions {}

const BASE_NO_REPLY: Node.Utils.BaseStepNoReply = {
  types: [Node.Utils.NoReplyType.REPROMPT],
  pathName: 'No Reply',
  randomize: false,
};

export const chatNoReplyFactory = (): ChatNode.Utils.StepNoReply => ({
  ...BASE_NO_REPLY,
  reprompts: [chatPromptFactory()],
});

export const voiceNoReplyFactory = (options: NoReplyFactoryOptions = {}): Realtime.NodeData.VoiceNoReply => ({
  ...BASE_NO_REPLY,
  reprompts: [voicePromptFactory(options)],
});

export const getDefaultNoReplyTimeoutSeconds = createPlatformSelector<number>(
  {
    [Constants.PlatformType.ALEXA]: 8,
    [Constants.PlatformType.GOOGLE]: 8,
    [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: 5,
    [Constants.PlatformType.DIALOGFLOW_ES_VOICE]: 5,
  },
  10
);

export const getPlatformNoReplyFactory = (platform?: Nullish<Constants.PlatformType>) =>
  createPlatformSelector<(options?: PromptFactoryOptions) => Realtime.NodeData.NoReply>(
    {
      [Constants.PlatformType.CHATBOT]: () => ({ ...chatNoReplyFactory(), timeout: getDefaultNoReplyTimeoutSeconds(platform) }),
      [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: () => ({ ...chatNoReplyFactory(), timeout: getDefaultNoReplyTimeoutSeconds(platform) }),
    },
    () => ({ ...voiceNoReplyFactory(), timeout: getDefaultNoReplyTimeoutSeconds(platform) })
  )(platform);
