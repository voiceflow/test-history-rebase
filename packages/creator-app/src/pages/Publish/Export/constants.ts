import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import UploadButton from '@/components/PlatformUploadButton';
import * as Account from '@/ducks/account';
import { createPlatformSelector } from '@/utils/platform';

import { AlexaUploadButton, AlexaUploadLink } from './Alexa';
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
    [VoiceflowConstants.PlatformType.ALEXA]: AlexaUploadButton,
    [VoiceflowConstants.PlatformType.GOOGLE]: GoogleUploadButton,
  },
  UploadButton as any
);

export const getPlatformSyncAction = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: Account.amazon.syncSelectedVendor,
  },
  () => null as any
);
