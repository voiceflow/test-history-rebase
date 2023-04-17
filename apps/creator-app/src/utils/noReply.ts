import { BaseNode } from '@voiceflow/base-types';
import { ChatNode } from '@voiceflow/chat-types';
import { Nullish } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';

interface NoReplyFactoryOptions extends Omit<Platform.Base.Utils.Prompt.FactoryOptions, 'content'> {
  reprompts?: string[];
}

const BASE_NO_REPLY: BaseNode.Utils.BaseStepNoReply = {
  types: [BaseNode.Utils.NoReplyType.REPROMPT],
  pathName: 'No reply',
  randomize: false,
};

export const chatNoReplyFactory = ({ reprompts, ...options }: NoReplyFactoryOptions = {}): ChatNode.Utils.StepNoReply => ({
  ...BASE_NO_REPLY,
  reprompts: reprompts
    ? reprompts.map((prompt) => Platform.Common.Chat.CONFIG.utils.prompt.factory({ content: prompt, ...options }))
    : [Platform.Common.Chat.CONFIG.utils.prompt.factory(options)],
});

export const voiceNoReplyFactory = ({ reprompts, ...options }: NoReplyFactoryOptions = {}): Realtime.NodeData.VoiceNoReply => ({
  ...BASE_NO_REPLY,
  reprompts: reprompts
    ? reprompts.map((prompt) => Platform.Common.Voice.CONFIG.utils.prompt.textFactory({ content: prompt, ...options }))
    : [Platform.Common.Voice.CONFIG.utils.prompt.textFactory(options)],
});

export const getDefaultNoReplyTimeoutSeconds = Realtime.Utils.platform.createPlatformSelector<number>(
  {
    [Platform.Constants.PlatformType.ALEXA]: 8,
    [Platform.Constants.PlatformType.GOOGLE]: 8,
    [Platform.Constants.PlatformType.DIALOGFLOW_ES]: 5,
  },
  10
);

type PromptFactory = (options?: NoReplyFactoryOptions) => Realtime.NodeData.NoReply;

export const getPlatformNoReplyFactory = (
  projectType?: Nullish<Platform.Constants.ProjectType>,
  platform?: Nullish<Platform.Constants.PlatformType>
): PromptFactory => {
  const timeout = getDefaultNoReplyTimeoutSeconds(platform);

  return Realtime.Utils.platform.createProjectTypeSelector<PromptFactory>({
    [Platform.Constants.ProjectType.CHAT]: (options?: NoReplyFactoryOptions) => ({ ...chatNoReplyFactory(options), timeout }),
    [Platform.Constants.ProjectType.VOICE]: (options?: NoReplyFactoryOptions) => ({ ...voiceNoReplyFactory(options), timeout }),
  })(projectType || undefined);
};
