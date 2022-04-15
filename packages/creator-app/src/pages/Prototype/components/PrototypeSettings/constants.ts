import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

export const getPlatformHasVisualsSetting = Utils.platform.createPlatformAndProjectTypeSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: true,
    [`${VoiceflowConstants.PlatformType.VOICEFLOW}:${VoiceflowConstants.ProjectType.CHAT}`]: true,
    [`${VoiceflowConstants.PlatformType.VOICEFLOW}:${VoiceflowConstants.ProjectType.VOICE}`]: true,
  },
  false
);
