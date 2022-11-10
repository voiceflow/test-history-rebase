import { ChatModels } from '@voiceflow/chat-types';
import { VoiceModels } from '@voiceflow/voice-types';
import { VoiceflowConstants, VoiceflowUtils } from '@voiceflow/voiceflow-types';

import SlateEditable from '@/components/SlateEditable';
import { getPlatformDefaultVoice } from '@/utils/platform';

export const getDefaultPrompt = (
  projectType: VoiceflowConstants.ProjectType,
  platform: VoiceflowConstants.PlatformType
): VoiceflowUtils.prompt.AnyPrompt => {
  const platformDefaultVoice = getPlatformDefaultVoice(platform);

  if (projectType === VoiceflowConstants.ProjectType.VOICE) {
    return { content: '', voice: platformDefaultVoice } as VoiceModels.Prompt<string>;
  }

  return { content: SlateEditable.EditorAPI.getEmptyState() } as ChatModels.Prompt;
};
