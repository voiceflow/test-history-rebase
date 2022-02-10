import { getRandomEnumElement } from '@test/utils';
import { ChatModels } from '@voiceflow/chat-types';
import { VoiceModels } from '@voiceflow/voice-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { define } from 'cooky-cutter';
import { datatype, lorem } from 'faker';

import { VoicePromptType } from '@/constants';
import { NodeData } from '@/models';

export const VoicePrompt = define<VoiceModels.Prompt<any>>({
  desc: () => lorem.words(),
  voice: () => getRandomEnumElement(VoiceflowConstants.Voice),
  content: () => lorem.words(),
});

export const ChatPrompt = define<ChatModels.Prompt>({
  id: () => datatype.uuid(),
  content: () => [{ children: [{ text: lorem.word() }] }],
});

export const VoiceNodeDataPrompt = define<NodeData.VoicePrompt>({
  id: () => datatype.uuid(),
  desc: () => lorem.words(),
  type: () => getRandomEnumElement(VoicePromptType),
  audio: () => lorem.words(),
  voice: () => getRandomEnumElement(VoiceflowConstants.Voice),
  content: () => lorem.words(),
});
