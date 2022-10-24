import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { getPlatformName } from '@/constants/platforms';

export const getPlatformTitle = (platform: VoiceflowConstants.PlatformType) => getPlatformName(platform) || platform.toLocaleUpperCase();

export const getPopperContent = (platformTitle: string) =>
  Utils.platform.createPlatformSelector<string>(
    {
      [VoiceflowConstants.PlatformType.VOICEFLOW]: 'Import your existing NLU model to start improving it',
    },
    `Import your existing ${platformTitle} model to start improving it`
  );
