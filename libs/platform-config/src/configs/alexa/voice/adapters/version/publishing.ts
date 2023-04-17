import * as Common from '@platform-config/configs/common';
import { Config } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';
import { AlexaVersion } from '@voiceflow/alexa-types';
import { createSimpleAdapter, createSmartSimpleAdapter } from 'bidirectional-adapter';

import * as Models from '../../models';

const SHARED_FIELDS = Types.satisfies<keyof AlexaVersion.Publishing>()([
  'hasAds',
  'summary',
  'category',
  'personal',
  'keywords',
  'forExport',
  'smallIcon',
  'largeIcon',
  'description',
  'hasPurchase',
  'forChildren',
  'instructions',
  'privacyPolicy',
  'invocationName',
  'termsAndConditions',
  'updatesDescription',
]);

type KeyRemap = [['invocations', 'invocationNameSamples']];

export const smart = createSmartSimpleAdapter<
  AlexaVersion.Publishing,
  Models.Version.Publishing.Model,
  Common.Voice.Adapters.Version.Publishing.FromAndToDBOptions,
  Common.Voice.Adapters.Version.Publishing.FromAndToDBOptions,
  KeyRemap
>(
  (dbPublishing, options) => ({
    ...Common.Voice.Adapters.Version.Publishing.smart.fromDB(dbPublishing, options),
    ...Config.pickNonEmptyFields(dbPublishing, SHARED_FIELDS),
    ...(Config.hasValue(dbPublishing, 'locales') && { locales: dbPublishing.locales }),
    ...(Config.hasValue(dbPublishing, 'invocations') && { invocationNameSamples: dbPublishing.invocations }),
    ...(Config.hasValue(dbPublishing, 'invocationName') && { invocationName: dbPublishing.invocationName }),
  }),
  (publishing, options) => ({
    ...Common.Voice.Adapters.Version.Publishing.smart.toDB(publishing, options),
    ...Config.pickNonEmptyFields(publishing, SHARED_FIELDS),
    ...(Config.hasValue(publishing, 'locales') && { locales: publishing.locales as AlexaVersion.Publishing['locales'] }),
    ...(Config.hasValue(publishing, 'invocationName') && { invocationName: publishing.invocationName }),
    ...(Config.hasValue(publishing, 'invocationNameSamples') && { invocations: publishing.invocationNameSamples }),
  })
);

export const simple = createSimpleAdapter<
  AlexaVersion.Publishing,
  Models.Version.Publishing.Model,
  Common.Voice.Adapters.Version.Publishing.FromAndToDBOptions,
  Common.Voice.Adapters.Version.Publishing.FromAndToDBOptions
>(
  (dbPublishing, options) => smart.fromDB(AlexaVersion.defaultPublishing(dbPublishing), options),
  (publishing, options) => smart.toDB(publishing, options)
);

export const CONFIG = Common.Voice.Adapters.Version.Publishing.extend({
  smart,
  simple,
})(Common.Voice.Adapters.Version.Publishing.validate);

export type Config = typeof CONFIG;
