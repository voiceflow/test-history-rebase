import * as Common from '@platform-config/configs/common';
import { Config } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';
import { GoogleVersion } from '@voiceflow/google-types';
import { createSmartSimpleAdapter } from 'bidirectional-adapter';

const SHARED_FIELDS = Types.satisfies<keyof GoogleVersion.SharedVoicePublishing>()([
  'voice',
  'category',
  'displayName',
  'keepsMicOpen',
  'developerName',
  'developerEmail',
  'enabledRegions',
  'smallLogoImage',
  'accountLinking',
  'disabledRegions',
  'usesHomeStorage',
  'fullDescription',
  'privacyPolicyUrl',
  'shortDescription',
  'largeBannerImage',
  'termsOfServiceUrl',
  'designedForFamily',
  'usesTransactionsApi',
  'surfaceRequirements',
  'testingInstructions',
  'usesInteractiveCanvas',
  'usesDigitalPurchaseApi',
  'containsAlcoholOrTobaccoContent',
]);

type SharedVoicePublishing = Pick<Common.Voice.Models.Version.Publishing.Extends<GoogleVersion.SharedVoicePublishing>, typeof SHARED_FIELDS[0]>;

/**
 * used in the dialogflowES chat/voice adapters
 */
export const smart = createSmartSimpleAdapter<GoogleVersion.SharedVoicePublishing, SharedVoicePublishing>(
  (dbPublishing) => Config.pickNonEmptyFields(dbPublishing, SHARED_FIELDS),
  (publishing) => Config.pickNonEmptyFields(publishing, SHARED_FIELDS)
);
