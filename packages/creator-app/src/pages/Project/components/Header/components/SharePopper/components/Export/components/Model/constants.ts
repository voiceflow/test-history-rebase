import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

export const getNLPSelectLabel = (platformName: string) =>
  Utils.platform.createPlatformSelector<string>(
    {
      [VoiceflowConstants.PlatformType.VOICEFLOW]: 'Export as .CSV, or as consumable file for any NLU vendor. ',
    },
    `Export as .CSV, or as consumable file for ${platformName}. `
  );
