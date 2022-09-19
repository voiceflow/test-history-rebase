import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import * as Account from '@/ducks/account';
import AlexaExport, { AlexaUploadLink } from '@/platforms/alexa/jobs/export';
import GeneralExport, { GeneralUploadLink } from '@/platforms/general/jobs/export';
import GoogleExport, { GoogleUploadLink } from '@/platforms/google/jobs/export';
import { createPlatformSelector } from '@/utils/platform';

export const getUploadLink = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: AlexaUploadLink,
    [VoiceflowConstants.PlatformType.GOOGLE]: GoogleUploadLink,
  },
  GeneralUploadLink
);

export const getUploadButton = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: AlexaExport,
    [VoiceflowConstants.PlatformType.GOOGLE]: GoogleExport,
  },
  GeneralExport
);

export const getPlatformSyncAction = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: Account.amazon.syncSelectedVendor,
  },
  () => null as any
);
