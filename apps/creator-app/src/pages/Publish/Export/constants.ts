import * as Platform from '@voiceflow/platform-config';

import * as Account from '@/ducks/account';
import AlexaExport, { AlexaUploadLink } from '@/platforms/alexa/jobs/export';
import GeneralExport, { GeneralUploadLink } from '@/platforms/general/jobs/export';
import { createPlatformSelector } from '@/utils/platform';

export const getUploadLink = createPlatformSelector(
  {
    [Platform.Constants.PlatformType.ALEXA]: AlexaUploadLink,
  },
  GeneralUploadLink
);

export const getUploadButton = createPlatformSelector(
  {
    [Platform.Constants.PlatformType.ALEXA]: AlexaExport,
  },
  GeneralExport
);

export const getPlatformSyncAction = createPlatformSelector(
  {
    [Platform.Constants.PlatformType.ALEXA]: Account.amazon.syncSelectedVendor,
  },
  () => null as any
);
