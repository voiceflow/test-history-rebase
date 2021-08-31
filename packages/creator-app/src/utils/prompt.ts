import { Types as ChatTypes } from '@voiceflow/chat-types';
import { PlatformType } from '@voiceflow/internal';
import cuid from 'cuid';

import { EditorAPI } from '@/components/SlateEditable/editor';
import { RepromptType } from '@/constants';
import { NodeData } from '@/models';
import { Nullish } from '@/types';

import { createPlatformSelector } from './platform';

export interface PromptFactoryOptions {
  defaultVoice?: Nullish<string>;
}

export const chatPromptFactory = (): ChatTypes.Prompt => ({ id: cuid(), content: EditorAPI.getEmptyState() });
export const voicePromptFactory = ({ defaultVoice }: PromptFactoryOptions = {}): NodeData.VoicePrompt => ({
  id: cuid.slug(),
  type: RepromptType.TEXT,
  voice: defaultVoice ?? '',
  content: '',
});

export const getPlatformPromptFactory = createPlatformSelector<(options?: PromptFactoryOptions) => NodeData.Reprompt>(
  {
    [PlatformType.CHATBOT]: chatPromptFactory,
  },
  voicePromptFactory
);
