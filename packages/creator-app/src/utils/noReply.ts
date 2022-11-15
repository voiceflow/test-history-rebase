import { BaseNode } from '@voiceflow/base-types';
import { ChatNode } from '@voiceflow/chat-types';
import { Nullish } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';

interface NoReplyFactoryOptions extends Platform.Common.Voice.Utils.Prompt.FactoryOptions {}

const BASE_NO_REPLY: BaseNode.Utils.BaseStepNoReply = {
  types: [BaseNode.Utils.NoReplyType.REPROMPT],
  pathName: 'No reply',
  randomize: false,
};

export const chatNoReplyFactory = (): ChatNode.Utils.StepNoReply => ({
  ...BASE_NO_REPLY,
  reprompts: [Platform.Common.Chat.CONFIG.utils.prompt.factory()],
});

export const voiceNoReplyFactory = (options: NoReplyFactoryOptions): Realtime.NodeData.VoiceNoReply => ({
  ...BASE_NO_REPLY,
  reprompts: [Platform.Common.Voice.CONFIG.utils.prompt.textFactory(options)],
});

export const getDefaultNoReplyTimeoutSeconds = Realtime.Utils.platform.createPlatformSelector<number>(
  {
    [Platform.Constants.PlatformType.ALEXA]: 8,
    [Platform.Constants.PlatformType.GOOGLE]: 8,
    [Platform.Constants.PlatformType.DIALOGFLOW_ES]: 5,
  },
  10
);

type PromptFactory = (options: NoReplyFactoryOptions) => Realtime.NodeData.NoReply;

export const getPlatformNoReplyFactory = (
  projectType?: Nullish<Platform.Constants.ProjectType>,
  platform?: Nullish<Platform.Constants.PlatformType>
): PromptFactory => {
  const timeout = getDefaultNoReplyTimeoutSeconds(platform);

  return Realtime.Utils.platform.createProjectTypeSelector<PromptFactory>({
    [Platform.Constants.ProjectType.CHAT]: () => ({ ...chatNoReplyFactory(), timeout }),
    [Platform.Constants.ProjectType.VOICE]: (options: NoReplyFactoryOptions) => ({ ...voiceNoReplyFactory(options), timeout }),
  })(projectType || undefined);
};
