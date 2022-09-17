import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import UploadButton from '@/components/PlatformUploadButton';
import * as Account from '@/ducks/account';
import AlexaExport, { AlexaUploadLink } from '@/platforms/alexa/jobs/export';
import { createPlatformSelector } from '@/utils/platform';

import { GeneralUploadLink } from './General';
import { GoogleUploadButton, GoogleUploadLink } from './Google';

export const getUploadLink = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: AlexaUploadLink,
    [VoiceflowConstants.PlatformType.GOOGLE]: GoogleUploadLink,
  },
  GeneralUploadLink
);

export const getUploadButton = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.GOOGLE]: GoogleUploadButton,
  },
  UploadButton as any
);

export const getUploadButtonV2 = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: AlexaExport,
  },
  null
);

export const getPlatformSyncAction = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: Account.amazon.syncSelectedVendor,
  },
  () => null as any
);
