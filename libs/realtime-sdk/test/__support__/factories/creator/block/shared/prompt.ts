import { faker } from '@faker-js/faker';
import { getRandomEnumElement } from '@test/utils';
import { ChatModels } from '@voiceflow/chat-types';
import * as Platform from '@voiceflow/platform-config/backend';
import { VoiceModels } from '@voiceflow/voice-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { define } from 'cooky-cutter';

export const VoicePrompt = define<VoiceModels.Prompt<any>>({
  desc: () => faker.lorem.words(),
  voice: () => getRandomEnumElement(VoiceflowConstants.Voice),
  content: () => faker.lorem.words(),
});

export const ChatPrompt = define<ChatModels.Prompt>({
  id: () => faker.datatype.uuid(),
  content: () => [{ children: [{ text: faker.lorem.word() }] }],
});

export const VoiceNodeDataPrompt = define<Platform.Common.Voice.Models.Prompt.Model>({
  id: () => faker.datatype.uuid(),
  desc: () => faker.lorem.words(),
  type: () => getRandomEnumElement(Platform.Common.Voice.Models.Prompt.PromptType),
  audio: () => faker.lorem.words(),
  voice: () => getRandomEnumElement(VoiceflowConstants.Voice),
  content: () => faker.lorem.words(),
});
