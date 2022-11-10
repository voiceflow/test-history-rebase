import * as Platform from '@voiceflow/platform-config';
import { Utils } from '@voiceflow/realtime-sdk';

export const getPlatformHasVisualsSetting = Utils.platform.createPlatformAndProjectTypeSelector(
  {
    [Platform.Constants.PlatformType.ALEXA]: true,
    [`${Platform.Constants.PlatformType.VOICEFLOW}:${Platform.Constants.ProjectType.CHAT}`]: true,
    [`${Platform.Constants.PlatformType.VOICEFLOW}:${Platform.Constants.ProjectType.VOICE}`]: true,
  },
  false
);
