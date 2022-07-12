import { BaseNode } from '@voiceflow/base-types';
import { ChatNode } from '@voiceflow/chat-types';
import { Nullish } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { chatPromptFactory, PromptFactoryOptions, voicePromptFactory } from './prompt';

interface NoReplyFactoryOptions extends PromptFactoryOptions {}

const BASE_NO_REPLY: BaseNode.Utils.BaseStepNoReply = {
  types: [BaseNode.Utils.NoReplyType.REPROMPT],
  pathName: 'No reply',
  randomize: false,
};

export const chatNoReplyFactory = (): ChatNode.Utils.StepNoReply => ({
  ...BASE_NO_REPLY,
  reprompts: [chatPromptFactory()],
});

export const voiceNoReplyFactory = (options: NoReplyFactoryOptions): Realtime.NodeData.VoiceNoReply => ({
  ...BASE_NO_REPLY,
  reprompts: [voicePromptFactory(options)],
});

export const getDefaultNoReplyTimeoutSeconds = Realtime.Utils.platform.createPlatformSelector<number>(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: 8,
    [VoiceflowConstants.PlatformType.GOOGLE]: 8,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: 5,
  },
  10
);

type PromptFactory = (options: PromptFactoryOptions) => Realtime.NodeData.NoReply;

export const getPlatformNoReplyFactory = (
  projectType?: Nullish<VoiceflowConstants.ProjectType>,
  platform?: Nullish<VoiceflowConstants.PlatformType>
): PromptFactory => {
  const timeout = getDefaultNoReplyTimeoutSeconds(platform);

  return Realtime.Utils.platform.createProjectTypeSelector<PromptFactory>({
    [VoiceflowConstants.ProjectType.CHAT]: () => ({ ...chatNoReplyFactory(), timeout }),
    [VoiceflowConstants.ProjectType.VOICE]: (options: PromptFactoryOptions) => ({ ...voiceNoReplyFactory(options), timeout }),
  })(projectType || undefined);
};
