import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { chatPromptFactory, PromptFactoryOptions, voicePromptFactory } from './prompt';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface NoMatchFactoryOptions extends PromptFactoryOptions {}

const BASE_NO_MATCH: Realtime.NodeData.BaseNoMatch = {
  types: [BaseNode.Utils.NoMatchType.REPROMPT],
  pathName: 'No Match',
  randomize: false,
};

export const chatNoMatchFactory = (): Realtime.NodeData.ChatNoMatch => ({ ...BASE_NO_MATCH, reprompts: [chatPromptFactory()] });
export const voiceNoMatchFactory = (options: NoMatchFactoryOptions = {}): Realtime.NodeData.VoiceNoMatch => ({
  ...BASE_NO_MATCH,
  reprompts: [voicePromptFactory(options)],
});

export const getPlatformNoMatchFactory = Realtime.Utils.platform.createProjectTypeSelector<
  (options?: PromptFactoryOptions) => Realtime.NodeData.NoMatch
>({
  [VoiceflowConstants.ProjectType.CHAT]: chatNoMatchFactory,
  [VoiceflowConstants.ProjectType.VOICE]: voiceNoMatchFactory,
});
