import { Node } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createPlatformSelector } from './platform';
import { chatPromptFactory, PromptFactoryOptions, voicePromptFactory } from './prompt';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface NoMatchesFactoryOptions extends PromptFactoryOptions {}

const BASE_NO_MATCH: Realtime.NodeData.BaseNoMatches = {
  type: Node.Utils.NoMatchType.REPROMPT,
  pathName: 'No Match',
};

export const chatNoMatchesFactory = (): Realtime.NodeData.ChatNoMatches => ({ ...BASE_NO_MATCH, randomize: false, reprompts: [chatPromptFactory()] });
export const voiceNoMatchesFactory = (options: NoMatchesFactoryOptions = {}): Realtime.NodeData.VoiceNoMatches => ({
  ...BASE_NO_MATCH,
  randomize: false,
  reprompts: [voicePromptFactory(options)],
});

export const getPlatformNoMatchesFactory = createPlatformSelector<(options?: PromptFactoryOptions) => Realtime.NodeData.NoMatches>(
  {
    [Constants.PlatformType.CHATBOT]: chatNoMatchesFactory,
  },
  voiceNoMatchesFactory
);
