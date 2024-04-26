import * as Common from '@platform-config/configs/common';
import { Config } from '@platform-config/configs/utils';
import { GoogleConstants, GoogleVersion } from '@voiceflow/google-types';
import { createSimpleAdapter, createSmartSimpleAdapter } from 'bidirectional-adapter';

import * as GoogleCommon from '../../../common';
import type * as Models from '../../models';

type KeyRemap = [['pronunciation', 'invocationName'], ['sampleInvocations', 'invocationNameSamples']];

// really old google projects have languages instead of locales, so converting languages to locales
const languageToLocales = (locales: GoogleConstants.Language[] | GoogleConstants.Locale[]): GoogleConstants.Locale[] =>
  GoogleConstants.LanguageToLocale[locales[0] as GoogleConstants.Language] || locales;

export const smart = createSmartSimpleAdapter<
  GoogleVersion.VoicePublishing,
  Models.Version.Publishing.Model,
  Common.Voice.Adapters.Version.Publishing.FromAndToDBOptions,
  Common.Voice.Adapters.Version.Publishing.FromAndToDBOptions,
  KeyRemap
>(
  (dbPublishing, options) => ({
    ...Common.Voice.Adapters.Version.Publishing.smart.fromDB(dbPublishing, options),
    ...GoogleCommon.Adapters.Version.Publishing.smart.fromDB(dbPublishing),
    ...(Config.hasValue(dbPublishing, 'locales') && { locales: languageToLocales(dbPublishing.locales) }),
    ...(Config.hasValue(dbPublishing, 'pronunciation') && { invocationName: dbPublishing.pronunciation }),
    ...(Config.hasValue(dbPublishing, 'sampleInvocations') && {
      invocationNameSamples: dbPublishing.sampleInvocations,
    }),
  }),
  (publishing, options) => ({
    ...Common.Voice.Adapters.Version.Publishing.smart.toDB(publishing, options),
    ...GoogleCommon.Adapters.Version.Publishing.smart.toDB(publishing),
    ...(Config.hasValue(publishing, 'locales') && { locales: publishing.locales }),
    ...(Config.hasValue(publishing, 'invocationName') && { pronunciation: publishing.invocationName }),
    ...(Config.hasValue(publishing, 'invocationNameSamples') && {
      sampleInvocations: publishing.invocationNameSamples,
    }),
  })
);

export const simple = createSimpleAdapter<
  GoogleVersion.VoicePublishing,
  Models.Version.Publishing.Model,
  Common.Voice.Adapters.Version.Publishing.FromAndToDBOptions,
  Common.Voice.Adapters.Version.Publishing.FromAndToDBOptions
>(
  (dbPublishing, options) => smart.fromDB(GoogleVersion.defaultVoicePublishing(dbPublishing), options),
  (publishing, options) => smart.toDB(publishing, options)
);

export const CONFIG = Common.Voice.Adapters.Version.Publishing.extend({
  smart,
  simple,
})(Common.Voice.Adapters.Version.Publishing.validate);

export type Config = typeof CONFIG;
