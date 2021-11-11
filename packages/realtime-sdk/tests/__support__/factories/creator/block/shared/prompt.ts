import { Types as ChatTypes } from '@voiceflow/chat-types';
import { Constants as GeneralConstants } from '@voiceflow/general-types';
import { Types as VoiceTypes } from '@voiceflow/voice-types';
import { define } from 'cooky-cutter';
import { datatype, lorem } from 'faker';

import { VoicePromptType } from '@/constants';
import { NodeData } from '@/models';
import { getRandomEnumElement } from '@/tests/utils';

export const VoicePrompt = define<VoiceTypes.Prompt<any>>({
  desc: () => lorem.words(),
  voice: () => getRandomEnumElement(GeneralConstants.Voice),
  content: () => lorem.words(),
});

export const ChatPrompt = define<ChatTypes.Prompt>({
  id: () => datatype.uuid(),
  content: () => [{ children: [{ text: lorem.word() }] }],
});

export const VoiceNodeDataPrompt = define<NodeData.VoicePrompt>({
  id: () => datatype.uuid(),
  desc: () => lorem.words(),
  type: () => getRandomEnumElement(VoicePromptType),
  audio: () => lorem.words(),
  voice: () => getRandomEnumElement(GeneralConstants.Voice),
  content: () => lorem.words(),
});
