import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

// eslint-disable-next-line import/prefer-default-export
export const getPlatformHasVisualsSetting = Utils.platform.createPlatformAndProjectTypeSelectorV2(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: true,
    [`${VoiceflowConstants.PlatformType.VOICEFLOW}:${VoiceflowConstants.ProjectType.CHAT}`]: true,
    [`${VoiceflowConstants.PlatformType.VOICEFLOW}:${VoiceflowConstants.ProjectType.VOICE}`]: true,
  },
  false
);
