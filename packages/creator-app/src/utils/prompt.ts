import { Types as ChatTypes } from '@voiceflow/chat-types';
import { Nullish, Utils } from '@voiceflow/common';
import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { EditorAPI } from '@/components/SlateEditable/editor';
import { VoicePromptType } from '@/constants';

import { createPlatformSelector } from './platform';

export interface PromptFactoryOptions {
  defaultVoice?: Nullish<string>;
}

export const chatPromptFactory = (): ChatTypes.Prompt => ({ id: Utils.id.cuid(), content: EditorAPI.getEmptyState() });
export const voicePromptFactory = ({ defaultVoice }: PromptFactoryOptions = {}): Realtime.NodeData.VoicePrompt => ({
  id: Utils.id.cuid.slug(),
  type: VoicePromptType.TEXT,
  voice: defaultVoice ?? '',
  content: '',
});

export const getPlatformPromptFactory = createPlatformSelector<(options?: PromptFactoryOptions) => ChatTypes.Prompt | Realtime.NodeData.VoicePrompt>(
  {
    [Constants.PlatformType.CHATBOT]: chatPromptFactory,
  },
  voicePromptFactory
);
