import { Utils } from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

export const getDropzoneCaption = (platformName: string, fileExtensions: string) =>
  Utils.platform.createPlatformSelector<string>(
    {
      [VoiceflowConstants.PlatformType.VOICEFLOW]: 'Imports must be in CSV format. ',
    },
    `${platformName} imports must be ${fileExtensions}. `
  );
