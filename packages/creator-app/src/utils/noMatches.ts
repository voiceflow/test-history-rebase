import { Node } from '@voiceflow/base-types';
import { PlatformType } from '@voiceflow/internal';

import { NodeData } from '@/models';

import { createPlatformSelector } from './platform';
import { chatPromptFactory, PromptFactoryOptions, voicePromptFactory } from './prompt';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface NoMatchesFactoryOptions extends PromptFactoryOptions {}

const BASE_NO_MATCH: NodeData.BaseNoMatches = {
  type: Node.Utils.NoMatchType.REPROMPT,
  pathName: 'No Match',
};

export const chatNoMatchesFactory = (): NodeData.ChatNoMatches => ({ ...BASE_NO_MATCH, randomize: false, reprompts: [chatPromptFactory()] });
export const voiceNoMatchesFactory = (options: NoMatchesFactoryOptions = {}): NodeData.VoiceNoMatches => ({
  ...BASE_NO_MATCH,
  randomize: false,
  reprompts: [voicePromptFactory(options)],
});

export const getPlatformNoMatchesFactory = createPlatformSelector<(options?: PromptFactoryOptions) => NodeData.NoMatches>(
  {
    [PlatformType.CHATBOT]: chatNoMatchesFactory,
  },
  voiceNoMatchesFactory
);
