import { Constants } from '@voiceflow/general-types';

import UploadButton from '@/components/PlatformUploadButton';
import * as Account from '@/ducks/account';
import { createPlatformSelector } from '@/utils/platform';

import { AlexaUploadButton, AlexaUploadLink } from './Alexa';
import { GeneralUploadLink } from './General';
import { GoogleUploadButton, GoogleUploadLink } from './Google';

export const getUploadLink = createPlatformSelector(
  {
    [Constants.PlatformType.ALEXA]: AlexaUploadLink,
    [Constants.PlatformType.GOOGLE]: GoogleUploadLink,
  },
  GeneralUploadLink
);

export const getUploadButton = createPlatformSelector(
  {
    [Constants.PlatformType.ALEXA]: AlexaUploadButton,
    [Constants.PlatformType.GOOGLE]: GoogleUploadButton,
  },
  UploadButton as any
);

export const getPlatformSyncAction = createPlatformSelector(
  {
    [Constants.PlatformType.ALEXA]: Account.amazon.syncSelectedVendor,
  },
  () => null as any
);
