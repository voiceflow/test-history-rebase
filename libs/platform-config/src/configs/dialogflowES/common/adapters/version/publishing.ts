import type { DFESConstants, DFESVersion } from '@voiceflow/google-dfes-types';
import { createSmartSimpleAdapter } from 'bidirectional-adapter';

import type * as Base from '@/configs/base';
import { Config } from '@/configs/utils';
import { Types } from '@/utils';

export type KeyRemap = [['agentName', 'invocationName'], ['triggerPhrase', 'invocationNameSamples']];

const PLATFORM_ONLY_FILES = Types.satisfies<keyof DFESVersion.BasePublishing>()(['locales']);

export const smart = createSmartSimpleAdapter<
  Pick<DFESVersion.BasePublishing, 'locales' | 'agentName' | 'triggerPhrase'>,
  Pick<Base.Models.Version.Publishing.Model, 'invocationName' | 'invocationNameSamples'> & {
    locales: DFESConstants.Locale[];
  },
  [],
  [],
  KeyRemap
>(
  (dbPublishing) => ({
    ...Config.pickNonEmptyFields(dbPublishing, PLATFORM_ONLY_FILES),
    ...(Config.hasValue(dbPublishing, 'agentName') && { invocationName: dbPublishing.agentName }),
    ...(Config.hasValue(dbPublishing, 'triggerPhrase') && { invocationNameSamples: dbPublishing.triggerPhrase }),
  }),
  (publishing) => ({
    ...Config.pickNonEmptyFields(publishing, PLATFORM_ONLY_FILES),
    ...(Config.hasValue(publishing, 'invocationName') && { agentName: publishing.invocationName }),
    ...(Config.hasValue(publishing, 'invocationNameSamples') && { triggerPhrase: publishing.invocationNameSamples }),
  })
);
