import { ChatModels } from '@voiceflow/chat-types';
import * as Platform from '@voiceflow/platform-config';
import { VoiceModels } from '@voiceflow/voice-types';
import { VoiceflowConstants, VoiceflowUtils } from '@voiceflow/voiceflow-types';

import SlateEditable from '@/components/SlateEditable';

export const getDefaultPrompt = (
  projectType: VoiceflowConstants.ProjectType,
  platform: VoiceflowConstants.PlatformType
): VoiceflowUtils.prompt.AnyPrompt => {
  const defaultVoice = Platform.Config.getTypeConfig(platform, projectType).project.voice.default;

  if (projectType === VoiceflowConstants.ProjectType.VOICE) {
    return { content: '', voice: defaultVoice } as VoiceModels.Prompt<string>;
  }

  return { content: SlateEditable.EditorAPI.getEmptyState() } as ChatModels.Prompt;
};
