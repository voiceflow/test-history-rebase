import { BaseNode } from '@voiceflow/base-types';
import { ChatNode } from '@voiceflow/chat-types';
import { Nullish } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { createPlatformSelector } from './platform';
import { chatPromptFactory, PromptFactoryOptions, voicePromptFactory } from './prompt';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface NoReplyFactoryOptions extends PromptFactoryOptions {}

const BASE_NO_REPLY: BaseNode.Utils.BaseStepNoReply = {
  types: [BaseNode.Utils.NoReplyType.REPROMPT],
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

export const getDefaultNoReplyTimeoutSeconds = Realtime.Utils.platform.createPlatformSelectorV2<number>(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: 8,
    [VoiceflowConstants.PlatformType.GOOGLE]: 8,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: 5,
  },
  10
);

export const getPlatformNoReplyFactory = (platform?: Nullish<VoiceflowConstants.PlatformType>) =>
  createPlatformSelector<(options?: PromptFactoryOptions) => Realtime.NodeData.NoReply>(
    {
      [VoiceflowConstants.PlatformType.CHATBOT]: () => ({ ...chatNoReplyFactory(), timeout: getDefaultNoReplyTimeoutSeconds(platform) }),
      [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT]: () => ({ ...chatNoReplyFactory(), timeout: getDefaultNoReplyTimeoutSeconds(platform) }),
    },
    () => ({ ...voiceNoReplyFactory(), timeout: getDefaultNoReplyTimeoutSeconds(platform) })
  )(platform);
