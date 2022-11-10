import { BaseNode } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';

import { chatPromptFactory, PromptFactoryOptions, voicePromptFactory } from './prompt';

interface NoMatchFactoryOptions extends PromptFactoryOptions {}

const BASE_NO_MATCH: Realtime.NodeData.BaseNoMatch = {
  types: [BaseNode.Utils.NoMatchType.REPROMPT],
  pathName: 'No match',
  randomize: false,
};

export const chatNoMatchFactory = (): Realtime.NodeData.ChatNoMatch => ({ ...BASE_NO_MATCH, reprompts: [chatPromptFactory()] });
export const voiceNoMatchFactory = (options: NoMatchFactoryOptions): Realtime.NodeData.VoiceNoMatch => ({
  ...BASE_NO_MATCH,
  reprompts: [voicePromptFactory(options)],
});

export const getPlatformNoMatchFactory = Realtime.Utils.platform.createProjectTypeSelector<
  (options: PromptFactoryOptions) => Realtime.NodeData.NoMatch
>({
  [Platform.Constants.ProjectType.CHAT]: chatNoMatchFactory,
  [Platform.Constants.ProjectType.VOICE]: voiceNoMatchFactory,
});
