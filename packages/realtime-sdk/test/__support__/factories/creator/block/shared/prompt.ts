import { getRandomEnumElement } from '@test/utils';
import { ChatModels } from '@voiceflow/chat-types';
import * as Platform from '@voiceflow/platform-config';
import { VoiceModels } from '@voiceflow/voice-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { define } from 'cooky-cutter';
import { datatype, lorem } from 'faker';

export const VoicePrompt = define<VoiceModels.Prompt<any>>({
  desc: () => lorem.words(),
  voice: () => getRandomEnumElement(VoiceflowConstants.Voice),
  content: () => lorem.words(),
});

export const ChatPrompt = define<ChatModels.Prompt>({
  id: () => datatype.uuid(),
  content: () => [{ children: [{ text: lorem.word() }] }],
});

export const VoiceNodeDataPrompt = define<Platform.Common.Voice.Models.Prompt.Model>({
  id: () => datatype.uuid(),
  desc: () => lorem.words(),
  type: () => getRandomEnumElement(Platform.Common.Voice.Models.Prompt.PromptType),
  audio: () => lorem.words(),
  voice: () => getRandomEnumElement(VoiceflowConstants.Voice),
  content: () => lorem.words(),
});
