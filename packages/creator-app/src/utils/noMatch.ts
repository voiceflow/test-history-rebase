import { Node } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { createPlatformSelector } from './platform';
import { chatPromptFactory, PromptFactoryOptions, voicePromptFactory } from './prompt';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface NoMatchFactoryOptions extends PromptFactoryOptions {}

const BASE_NO_MATCH: Realtime.NodeData.BaseNoMatch = {
  types: [Node.Utils.NoMatchType.REPROMPT],
  pathName: 'No Match',
  randomize: false,
};

export const chatNoMatchFactory = (): Realtime.NodeData.ChatNoMatch => ({ ...BASE_NO_MATCH, reprompts: [chatPromptFactory()] });
export const voiceNoMatchFactory = (options: NoMatchFactoryOptions = {}): Realtime.NodeData.VoiceNoMatch => ({
  ...BASE_NO_MATCH,
  reprompts: [voicePromptFactory(options)],
});

export const getPlatformNoMatchFactory = createPlatformSelector<(options?: PromptFactoryOptions) => Realtime.NodeData.NoMatch>(
  {
    [Constants.PlatformType.CHATBOT]: chatNoMatchFactory,
  },
  voiceNoMatchFactory
);
