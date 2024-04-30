import type { GoogleVersion } from '@voiceflow/google-types';
import type { ArrayItem } from '@voiceflow/ui';
import { createSmartSimpleAdapter } from 'bidirectional-adapter';

import type * as Common from '@/configs/common';
import { Config } from '@/configs/utils';
import { Types } from '@/utils';

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

type SharedVoicePublishing = Pick<
  Common.Voice.Models.Version.Publishing.Extends<GoogleVersion.SharedVoicePublishing>,
  ArrayItem<typeof SHARED_FIELDS>
>;

/**
 * used in the dialogflowES chat/voice adapters
 */
export const smart = createSmartSimpleAdapter<GoogleVersion.SharedVoicePublishing, SharedVoicePublishing>(
  (dbPublishing) => Config.pickNonEmptyFields(dbPublishing, SHARED_FIELDS),
  (publishing) => Config.pickNonEmptyFields(publishing, SHARED_FIELDS)
);
