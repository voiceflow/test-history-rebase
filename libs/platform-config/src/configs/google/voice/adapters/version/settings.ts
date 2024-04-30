import type { GoogleConstants } from '@voiceflow/google-types';
import { GoogleVersion } from '@voiceflow/google-types';
import { createSimpleAdapter, createSmartSimpleAdapter } from 'bidirectional-adapter';

import * as Common from '@/configs/common';

import type * as Models from '../../models';

export const smart = createSmartSimpleAdapter<
  GoogleVersion.VoiceSettings,
  Models.Version.Settings.Model,
  Common.Voice.Adapters.Version.Settings.FromAndToDBOptions,
  Common.Voice.Adapters.Version.Settings.FromAndToDBOptions
>(
  Common.Voice.Adapters.Version.Settings.smartFactory<GoogleConstants.Voice>().fromDB,
  Common.Voice.Adapters.Version.Settings.smartFactory<GoogleConstants.Voice>().toDB
);

export const simple = createSimpleAdapter<
  GoogleVersion.VoiceSettings,
  Models.Version.Settings.Model,
  Common.Voice.Adapters.Version.Settings.FromAndToDBOptions,
  Common.Voice.Adapters.Version.Settings.FromAndToDBOptions
>(
  (dbSettings, options) => smart.fromDB(GoogleVersion.defaultVoiceSettings(dbSettings), options),
  (settings, options) => smart.toDB(settings, options)
);

export const CONFIG = Common.Voice.Adapters.Version.Settings.extend({
  smart,
  simple,
})(Common.Voice.Adapters.Version.Settings.validate);

export type Config = typeof CONFIG;
