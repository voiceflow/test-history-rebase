import * as Common from '@platform-config/configs/common';
import { DFESVersion } from '@voiceflow/google-dfes-types';
import type { GoogleConstants } from '@voiceflow/google-types';
import { createSimpleAdapter, createSmartSimpleAdapter } from 'bidirectional-adapter';

import type * as Models from '../../models';

export const smart = createSmartSimpleAdapter<
  DFESVersion.VoiceSettings,
  Models.Version.Settings.Model,
  Common.Voice.Adapters.Version.Settings.FromAndToDBOptions,
  Common.Voice.Adapters.Version.Settings.FromAndToDBOptions
>(
  Common.Voice.Adapters.Version.Settings.smartFactory<GoogleConstants.Voice>().fromDB,
  Common.Voice.Adapters.Version.Settings.smartFactory<GoogleConstants.Voice>().toDB
);

export const simple = createSimpleAdapter<
  DFESVersion.VoiceSettings,
  Models.Version.Settings.Model,
  Common.Voice.Adapters.Version.Settings.FromAndToDBOptions,
  Common.Voice.Adapters.Version.Settings.FromAndToDBOptions
>(
  (dbSettings, options) => smart.fromDB(DFESVersion.defaultVoiceSettings(dbSettings), options),
  (settings, options) => smart.toDB(settings, options)
);

export const CONFIG = Common.Voice.Adapters.Version.Settings.extend({
  smart,
  simple,
})(Common.Voice.Adapters.Version.Settings.validate);

export type Config = typeof CONFIG;
