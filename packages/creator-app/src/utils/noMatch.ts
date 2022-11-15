import { BaseNode } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';

interface NoMatchFactoryOptions extends Platform.Common.Voice.Utils.Prompt.FactoryOptions {}

const BASE_NO_MATCH: Realtime.NodeData.BaseNoMatch = {
  types: [BaseNode.Utils.NoMatchType.REPROMPT],
  pathName: 'No match',
  randomize: false,
};

export const chatNoMatchFactory = (): Realtime.NodeData.ChatNoMatch => ({
  ...BASE_NO_MATCH,
  reprompts: [Platform.Common.Chat.CONFIG.utils.prompt.factory()],
});
export const voiceNoMatchFactory = (options: NoMatchFactoryOptions): Realtime.NodeData.VoiceNoMatch => ({
  ...BASE_NO_MATCH,
  reprompts: [Platform.Common.Voice.CONFIG.utils.prompt.textFactory(options)],
});

export const getPlatformNoMatchFactory = Realtime.Utils.platform.createProjectTypeSelector<
  (options: NoMatchFactoryOptions) => Realtime.NodeData.NoMatch
>({
  [Platform.Constants.ProjectType.CHAT]: chatNoMatchFactory,
  [Platform.Constants.ProjectType.VOICE]: voiceNoMatchFactory,
});
