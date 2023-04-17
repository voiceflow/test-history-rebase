import { BaseNode } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';

interface NoMatchFactoryOptions extends Omit<Platform.Base.Utils.Prompt.FactoryOptions, 'content'> {
  reprompts?: string[];
}

const BASE_NO_MATCH: Realtime.NodeData.BaseNoMatch = {
  types: [BaseNode.Utils.NoMatchType.REPROMPT],
  pathName: 'No match',
  randomize: false,
};

export const chatNoMatchFactory = ({ reprompts, ...options }: NoMatchFactoryOptions = {}): Realtime.NodeData.ChatNoMatch => ({
  ...BASE_NO_MATCH,
  reprompts: reprompts
    ? reprompts.map((prompt) => Platform.Common.Chat.CONFIG.utils.prompt.factory({ content: prompt, ...options }))
    : [Platform.Common.Chat.CONFIG.utils.prompt.factory(options)],
});

export const voiceNoMatchFactory = ({ reprompts, ...options }: NoMatchFactoryOptions = {}): Realtime.NodeData.VoiceNoMatch => ({
  ...BASE_NO_MATCH,
  reprompts: reprompts
    ? reprompts.map((prompt) => Platform.Common.Voice.CONFIG.utils.prompt.textFactory({ content: prompt, ...options }))
    : [Platform.Common.Voice.CONFIG.utils.prompt.textFactory(options)],
});

export const getPlatformNoMatchFactory = Realtime.Utils.platform.createProjectTypeSelector<
  (options?: NoMatchFactoryOptions) => Realtime.NodeData.NoMatch
>({
  [Platform.Constants.ProjectType.CHAT]: chatNoMatchFactory,
  [Platform.Constants.ProjectType.VOICE]: voiceNoMatchFactory,
});
