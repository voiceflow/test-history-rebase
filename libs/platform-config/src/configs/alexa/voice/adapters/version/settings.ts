import * as Common from '@platform-config/configs/common';
import { Config } from '@platform-config/configs/utils';
import { Types } from '@platform-config/utils';
import type { AlexaConstants } from '@voiceflow/alexa-types';
import { AlexaVersion } from '@voiceflow/alexa-types';
import { createSimpleAdapter, createSmartSimpleAdapter } from 'bidirectional-adapter';

import type * as Models from '../../models';

const PLATFORM_ONLY_FIELDS = Types.satisfies<keyof AlexaVersion.Settings>()([
  'events',
  'permissions',
  'accountLinking',
  'customInterface',
  'modelSensitivity',
]);

export const smart = createSmartSimpleAdapter<
  AlexaVersion.Settings,
  Models.Version.Settings.Model,
  Common.Voice.Adapters.Version.Settings.FromAndToDBOptions,
  Common.Voice.Adapters.Version.Settings.FromAndToDBOptions
>(
  (dbSettings, options) => ({
    ...Common.Voice.Adapters.Version.Settings.smartFactory<AlexaConstants.Voice>().fromDB(dbSettings, options),
    ...Config.pickNonEmptyFields(dbSettings, PLATFORM_ONLY_FIELDS),
  }),
  (settings, options) => ({
    ...Common.Voice.Adapters.Version.Settings.smartFactory<AlexaConstants.Voice>().toDB(settings, options),
    ...Config.pickNonEmptyFields(settings, PLATFORM_ONLY_FIELDS),
  })
);

export const simple = createSimpleAdapter<
  AlexaVersion.Settings,
  Models.Version.Settings.Model,
  Common.Voice.Adapters.Version.Settings.FromAndToDBOptions,
  Common.Voice.Adapters.Version.Settings.FromAndToDBOptions
>(
  (dbSettings, options) => smart.fromDB(AlexaVersion.defaultSettings(dbSettings), options),
  (settings, options) => smart.toDB(settings, options)
);

export const CONFIG = Common.Voice.Adapters.Version.Settings.extend({
  smart,
  simple,
})(Common.Voice.Adapters.Version.Settings.validate);

export type Config = typeof CONFIG;
