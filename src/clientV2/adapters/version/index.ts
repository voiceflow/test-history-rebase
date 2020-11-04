import { AlexaProjectMemberData, AlexaVersion } from '@voiceflow/alexa-types';
import { Member, Version, VersionPlatformData } from '@voiceflow/api-sdk';
import { GoogleVersion } from '@voiceflow/google-types';

import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { PlatformType } from '@/constants';
import { FullSkill } from '@/models';

import alexaVersionAdapter from './alexa';
import googleVersionAdapter from './google';

const versionAdapter = createAdapter<Version<VersionPlatformData>, FullSkill, [{ platform: PlatformType; member?: Member }]>(
  (dbVersion, { platform = PlatformType.ALEXA, member }) => {
    if (platform === PlatformType.ALEXA) {
      const version = alexaVersionAdapter.fromDB(dbVersion as AlexaVersion);

      if (member) {
        const {
          platformData: { selectedVendor, vendors },
        } = member as Member<AlexaProjectMemberData>;
        version.publishInfo.alexa.amznID = vendors?.find(({ vendorID }) => vendorID === selectedVendor)?.skillID ?? null;
        version.publishInfo.alexa.vendorId = selectedVendor;
      }
      return version;
    }

    if (platform === PlatformType.GOOGLE) {
      return googleVersionAdapter.fromDB(dbVersion as GoogleVersion);
    }
    throw new Error('Invalid Platform');
  },
  () => {
    throw new AdapterNotImplementedError();
  }
);
export default versionAdapter;
