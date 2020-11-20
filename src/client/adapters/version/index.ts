import { Version, VersionPlatformData } from '@voiceflow/api-sdk';

import { AdapterNotImplementedError, BidirectionalAdapter, createAdapter } from '@/client/adapters/utils';
import { PlatformType } from '@/constants';
import { FullSkill } from '@/models';
import { getPlatformValue } from '@/utils/platform';

import alexaVersionAdapter from './alexa';
import generalVersionAdapter from './general';
import googleVersionAdapter from './google';

const versionAdapter = createAdapter<Version<VersionPlatformData>, FullSkill<string>, [{ platform: PlatformType }]>(
  (version, { platform = PlatformType.ALEXA }) => {
    const adapter = getPlatformValue<BidirectionalAdapter<Version<any>, FullSkill<any>, [], []>>(platform, {
      [PlatformType.ALEXA]: alexaVersionAdapter,
      [PlatformType.GOOGLE]: googleVersionAdapter,
      [PlatformType.GENERAL]: generalVersionAdapter,
    });

    return adapter.fromDB(version);
  },
  () => {
    throw new AdapterNotImplementedError();
  }
);
export default versionAdapter;
