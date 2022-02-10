import { ChatModels } from '@voiceflow/chat-types';
import { Nullish, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { EditorAPI } from '@/components/SlateEditable/editor';
import { VoicePromptType } from '@/constants';

import { createPlatformSelector } from './platform';

export interface PromptFactoryOptions {
  defaultVoice?: Nullish<string>;
}

export const chatPromptFactory = (): ChatModels.Prompt => ({ id: Utils.id.cuid(), content: EditorAPI.getEmptyState() });
export const voicePromptFactory = ({ defaultVoice }: PromptFactoryOptions = {}): Realtime.NodeData.VoicePrompt => ({
  id: Utils.id.cuid.slug(),
  type: VoicePromptType.TEXT,
  voice: defaultVoice ?? '',
  content: '',
});

export const getPlatformPromptFactory = createPlatformSelector<(options?: PromptFactoryOptions) => ChatModels.Prompt | Realtime.NodeData.VoicePrompt>(
  {
    [VoiceflowConstants.PlatformType.CHATBOT]: chatPromptFactory,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT]: chatPromptFactory,
  },
  voicePromptFactory
);
