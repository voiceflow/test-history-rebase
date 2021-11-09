import { Types as ChatTypes } from '@voiceflow/chat-types';
import { Nullish, Utils } from '@voiceflow/common';
import { Constants } from '@voiceflow/general-types';

import { EditorAPI } from '@/components/SlateEditable/editor';
import { RepromptType } from '@/constants';
import { NodeData } from '@/models';

import { createPlatformSelector } from './platform';

export interface PromptFactoryOptions {
  defaultVoice?: Nullish<string>;
}

export const chatPromptFactory = (): ChatTypes.Prompt => ({ id: Utils.id.cuid(), content: EditorAPI.getEmptyState() });
export const voicePromptFactory = ({ defaultVoice }: PromptFactoryOptions = {}): NodeData.VoicePrompt => ({
  id: Utils.id.cuid.slug(),
  type: RepromptType.TEXT,
  voice: defaultVoice ?? '',
  content: '',
});

export const getPlatformPromptFactory = createPlatformSelector<(options?: PromptFactoryOptions) => NodeData.Reprompt>(
  {
    [Constants.PlatformType.CHATBOT]: chatPromptFactory,
  },
  voicePromptFactory
);
